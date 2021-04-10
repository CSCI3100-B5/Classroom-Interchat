const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');
const QuizAnswer = require('../../models/quizanswer.model');
const Messages = require('../../models/message.model');
const APIError = require('../../helpers/APIError');

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function sendQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  let message;

  switch (data.type) {
    case 'MCQ':
      // additional validations
      if (!data.choices) return callback({ error: 'Choices are required' });
      if (!(data.multiSelect === true || data.multiSelect === false)) return callback({ error: 'You need to indicate whether multiple choices are allowed' });
      if (data.choices.some((x, idx) => data.choices.findIndex(y => x === y) !== idx)) {
        return callback({ error: 'Duplicate choices are not allowed' });
      }
      if (data.correct) {
        if (data.correct.length > 1 && !data.multiSelect) {
          return callback({ error: 'You cannot mark more than one choice as correct when multiple choice is disallowed' });
        }
        if (data.correct.some(x => x < 0 || x >= data.choices.length)) {
          return callback({ error: 'A correct answer index is out of bounds' });
        }
      }
      if (data.correct) {
        message = await Messages.MCQMessage.create({
          classroom: classroom.id,
          sender: meta.invoker.id,
          type: data.type.toLowerCase(),
          content: {
            prompt: data.prompt,
            choices: data.choices,
            correct: data.correct,
            multiSelect: data.multiSelect
          },
        });
      } else {
        message = await Messages.MCQMessage.create({
          classroom: classroom.id,
          sender: meta.invoker.id,
          type: data.type.toLowerCase(),
          content: {
            prompt: data.prompt,
            choices: data.choices,
            multiSelect: data.multiSelect
          },
        });
      }
      break;
    case 'SAQ':
      message = await Messages.SAQMessage.create({
        classroom: classroom.id,
        sender: meta.invoker.id,
        type: data.type.toLowerCase(),
        content: {
          prompt: data.prompt
        },
      }); break;
    default:
      return callback({ error: 'Invalid quiz type' });
  }

  classroom.messages.push(message);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  // TODO: emit different quiz to different participants
  socket.to(classroom.id).emit('new quiz', message.filterWithoutAnswer());
  io.to(meta.invoker.id).emit('new quiz', message.filterSafe());
  return callback({});
}

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function endQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  let message;
  try {
    message = await Messages.Message.get(data.messageId);
  } catch (ex) {
    return callback({ error: 'The message doesn\'t exist' });
  }
  if (!message.classroom._id.equals(classroom._id)) {
    return callback({ error: 'This message does not belong to the classroom you are currently in' });
  }
  if (!message.sender._id.equals(meta.invoker._id)) {
    return callback({ error: 'Only the quiz sender can end the quiz' });
  }
  if (message.type !== 'mcq' && message.type !== 'saq') {
    return callback({ error: 'The message is not a quiz' });
  }
  if (message.content.closedAt) {
    return callback({ error: 'The quiz has already ended' });
  }
  message.content.closedAt = Date.now();
  await message.save();
  message = await message.populate('content.results').execPopulate();
  socket.to(classroom.id).emit('end quiz', message.filterWithoutAnswer());
  io.to(meta.invoker.id).emit('end quiz', message.filterSafe());
  return callback({});
}

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function releaseResults(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  let message;
  try {
    message = await Messages.Message.get(data.messageId);
  } catch (ex) {
    return callback({ error: 'The message doesn\'t exist' });
  }
  if (!message.classroom._id.equals(classroom._id)) {
    return callback({ error: 'This message does not belong to the classroom you are currently in' });
  }
  if (!message.sender._id.equals(meta.invoker._id)) {
    return callback({ error: 'Only the quiz sender can release quiz results' });
  }
  if (message.type !== 'mcq' && message.type !== 'saq') {
    return callback({ error: 'The message is not a quiz' });
  }
  if (message.content.resultsReleased) {
    return callback({ error: 'The quiz results are already released' });
  }
  message.content.resultsReleased = true;
  await message.save();
  message = await message.populate('content.results').execPopulate();
  socket.to(classroom.id).emit('quiz digest', message.filterSafe());
  io.to(meta.invoker.id).emit('update quiz', message.filterSafe());
  return callback({});
}

async function ansSAQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  let message;
  try {
    message = await Messages.Message.get(data.messageId);
  } catch (ex) {
    return callback({ error: 'The message doesn\'t exist' });
  }
  if (!message.classroom._id.equals(classroom._id)) {
    return callback({ error: 'This message does not belong to the classroom you are currently in' });
  }
  if (message.type !== 'mcq' && message.type !== 'saq') {
    return callback({ error: 'The message is not a quiz' });
  }
  if (message.content.closedAt) {
    return callback({ error: 'The quiz has already ended' });
  }
  message = await message.populate('content.results').execPopulate();
  const oldAnswer = message.content.results.find(x => x.user._id.equals(meta.invoker._id));
  if (oldAnswer) {
    message.content.results.pull(oldAnswer);
  }
  const quizanswer = await QuizAnswer.SAQAnswer.create({
    quiz: data.messageId,
    user: meta.invoker.id,
    content: data.content,
  });

  message.content.results.push(quizanswer);
  await message.save();
  io.to(classroom.host._id.toString()).emit('new quiz result', {
    messageId: data.messageId,
    result: quizanswer.filterSafe()
  });
  if (message.content.resultsReleased) {
    // TODO: compute digest
    io.to(classroom.id).emit('quiz digest', message.filterSafe());
  }
  return callback({});
}

async function ansMCQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  let message;
  try {
    message = await Messages.Message.get(data.messageId);
  } catch (ex) {
    return callback({ error: 'The message doesn\'t exist' });
  }
  if (!message.classroom._id.equals(classroom._id)) {
    return callback({ error: 'This message does not belong to the classroom you are currently in' });
  }
  if (message.type !== 'mcq' && message.type !== 'saq') {
    return callback({ error: 'The message is not a quiz' });
  }
  if (message.content.closedAt) {
    return callback({ error: 'The quiz has already ended' });
  }
  if (data.content.some(x => x < 0 || x >= message.content.choices.length)) {
    return callback({ error: 'Choice index out of bounds' });
  }
  if (data.content.length > 1 && !message.content.multiSelect) {
    return callback({ error: 'You cannot choose more than one answer' });
  }
  message = await message.populate('content.results').execPopulate();
  const oldAnswer = message.content.results.find(x => x.user._id.equals(meta.invoker._id));
  if (oldAnswer) {
    message.content.results.pull(oldAnswer);
  }
  const quizanswer = await QuizAnswer.MCQAnswer.create({
    quiz: data.messageId,
    user: meta.invoker.id,
    content: data.content,
  });

  message.content.results.push(quizanswer);
  await message.save();
  io.to(classroom.host._id.toString()).emit('new quiz result', {
    messageId: data.messageId,
    result: quizanswer.filterSafe()
  });
  if (message.content.resultsReleased) {
    // TODO: compute digest
    io.to(classroom.id).emit('quiz digest', message.filterSafe());
  }
  return callback({});
}

module.exports = {
  sendQuiz,
  endQuiz,
  releaseResults,
  ansSAQuiz,
  ansMCQuiz,
};
