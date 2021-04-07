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
  const messageType = data.type;

  const message = await Messages.Message.create({
    sender: meta.invoker.id,
    type: messageType,
    content: data.message,
    classroom: classroom.id
  });

  classroom.messages.push(message);
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new message', message.filterSafe());
  return callback({});
}

async function sendReplyMessage(packet, socket, io) {
  const [data, callback, meta] = packet;

  if (!meta.invokerClassroom) return callback({ error: 'You are not in a classroom' });
  const classroom = meta.invokerClassroom;

  const message = await Messages.ReplyMessage.create({
    sender: meta.invoker.id,
    type: 'reply',
    content: {
      replyTo: data.qMessageID,
      content: data.message
    },
    classroom: classroom.id
  });

  classroom.messages.push(message);
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new message', message.filterSafe());
  return callback({});
}

module.exports = {
  sendMessage,
  sendReplyMessage
};
