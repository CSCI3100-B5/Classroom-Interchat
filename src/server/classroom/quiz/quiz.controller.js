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
      if (data.choices.some((x, idx) => data.choices.findIndex(y => x === y) !== idx)) {
        return callback({ error: 'Duplicate choices are not allowed' });
      }
      if (!data.correct && !(data.multiSelect === true || data.multiSelect === false)) {
        return callback({ error: 'Either provide correct answers or a boolean indicating wheter multiple choices are allowed' });
      }
      if (data.correct && (data.multiSelect === true || data.multiSelect === false)) {
        if ((data.correct.length > 1 && !data.multiSelect)
        || (data.correct.length === 1 && data.multiSelect)) {
          return callback({ error: 'Conflict between the number of choices and the multiSelect option' });
        }
      }
      if (data.correct) {
        if (data.correct.some(x => x < 0 || x >= data.choices.length)) {
          return callback({ error: 'Correct answer index out of bounds' });
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
            multiSelect: data.correct.length > 1
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
  socket.emit('new quiz', message.filterSafe());
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
    message = await Messages.Message.get(data);
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
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  socket.to(classroom.id).emit('end quiz', message.filterWithoutAnswer());
  socket.emit('end quiz', message.filterSafe());
  return callback({});
}

// not yet implement MCQ
async function ansMCQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  const quizanswer = await QuizAnswer.SAQAnswer.create({
    quiz: data.messageId,
    user: meta.invoker.id,
    content: data.content
  });

  classroom.messages.push(quizanswer);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new mcq answer', quizanswer.filterSafe());
  return callback({});
}

async function ansSAQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  const quizanswer = await QuizAnswer.SAQAnswer.create({
    quiz: data.messageId,
    user: meta.invoker.id,
    content: data.content,
  });


  classroom.messages.push(quizanswer);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new saq answer', quizanswer.filterSafe());
  return callback({});
}
module.exports = {
  sendQuiz,
  endQuiz,
  ansMCQuiz,
  ansSAQuiz,
};
