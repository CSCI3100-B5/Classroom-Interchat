const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Classroom = require('../../models/classroom.model');

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
  const messageType = data.information.type;
  let message;

  classroom.messages.push(message);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterSafe());
  return callback({});
}

async function ansSAQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  const SAQanswer = data.answer;
  let message;

  message = await Messages.SAQPrompt.create({
    sender: meta.invoker.id,
    content: {
      prompt: data.prompt
    },
    classroom: classroom.id
  });

  classroom.messages.push(message);// message
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterWithoutAnswer());
  return callback({});
}
module.exports = {
  sendQuiz,
  ansMCQuiz,
  ansSAQuiz,
};
