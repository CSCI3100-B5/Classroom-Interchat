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
  const quizType = data.type;
  let message;

  switch (quizType) {
    //
    case 'MCQ':
      // diff choice correct exist
      //
      if (data.correct) {
        message = await Messages.MCQMessage.create({
          sender: meta.invoker.id,
          type: quizType.toLowerCase(),
          content: {
            prompt: data.prompt,
            choices: data.choices, // which one is choice
            correct: data.correct,
            multiSelect: data.correct > 1
          },
          // multiSelect: data.message
          classroom: classroom.id
        });
      } else {
        message = await Messages.MCQMessage.create({
          sender: meta.invoker.id,
          type: quizType.toLowerCase(),
          content: {
            prompt: data.prompt,
            choices: data.choices, // which one is choice
            multiSelect: data.multiSelect
          },

          classroom: classroom.id
        });
      }
      break;
    case 'SAQ':
      message = await Messages.SAQMessage.create({
        sender: meta.invoker.id,
        type: quizType.toLowerCase(),
        content: {
          prompt: data.prompt
        },
        classroom: classroom.id
      }); break;
    default:
      return callback({ error: 'You are not in a classroom' });
  }

  classroom.messages.push(message);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterWithoutAnswer());
  return callback({});
}

// not yet implement MCQ
async function ansMCQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  const MCQanswer = data.values;
  const quizanswer = await QuizAnswer.SAQAnswer.create({
    user: meta.invoker.id,
    content: {
      values: MCQanswer
    },
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
  const SAQanswer = data.answer;
  const quizanswer = await QuizAnswer.SAQAnswer.create({
    user: meta.invoker.id,
    content: {
      answer: SAQanswer
    },
  });


  classroom.messages.push(quizanswer);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new saq answer', quizanswer.filterSafe());
  return callback({});
}
module.exports = {
  sendQuiz,
  ansMCQuiz,
  ansSAQuiz,
};
