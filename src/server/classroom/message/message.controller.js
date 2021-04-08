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
async function sendMessage(packet, socket, io) {
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
      if (!classroom.messages.find(x => x._id === data.information.qMessageId)) {
        return callback({ error: 'The message to reply to doesn\'t exist' });
      }
      message = await Messages.ReplyMessage.create({
        sender: meta.invoker.id,
        type: 'reply',
        content: {
          replyTo: data.information.qMessageId,
          content: data.message
        },
        classroom: classroom.id
      }); break;
    default:
      return callback({ error: 'Unknown message type' });
  }

  classroom.messages.push(message);
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new message', message.filterSafe());
  return callback({});
}

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function resolveQuestion(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  let classroom = meta.invokerClassroom;
  classroom = await classroom.populate('messages').execPopulate();
  const message = classroom.messages.find({ id: data.messageId });
  if (!message) return callback({ error: 'The message does not exist' });
  message.content.isResolved = true;
  await message.save();
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('question resolved', message.filterSafe());
  return callback({});
}


module.exports = {
  sendMessage,
  resolveQuestion,
};
