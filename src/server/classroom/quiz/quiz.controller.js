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
            correct: data.correct
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
            multiSelect: data.message
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
      message = null;
  }

  classroom.messages.push(message);// message or quiz?
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterSafe());
  return callback({});
}
async function AnsMCQuiz(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;
  const messageType = data.information.type;
  let message;

  switch (messageType) {
    case 'text':
      message = await Messages.TextMessage.create({
        sender: meta.invoker.id,
        type: messageType,
        content: data.message,
        classroom: classroom.id
      }); break;
    case 'question':
      message = await Messages.QuestionMessage.create({
        sender: meta.invoker.id,
        type: messageType,
        content: {
          isResolved: false,
          content: data.message
        },
        classroom: classroom.id
      }); break;
    case 'reply':
      message = await Messages.ReplyMessage.create({
        sender: meta.invoker.id,
        type: 'reply',
        content: {
          replyTo: data.information.qMessageID,
          content: data.message
        },
        classroom: classroom.id
      }); break;
    default:
      message = null;
  }
  classroom.messages.push(message);// message or quiz?
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterSafe());
  return callback({});
}
module.exports = {
  sendQuiz,
  AnsMCQuiz,
};
