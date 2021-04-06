const httpStatus = require('http-status');
const cachegoose = require('cachegoose');
const Messages = require('../models/message.model');
const APIError = require('../helpers/APIError');

/**
 *
 * @param {[*, *]} packet
 * @param {import('socket.io').Socket} socket
 * @param {import('socket.io').Server} io
 */
async function sendMessage(packet, socket, io) {
  console.log('sendMessage receive packet: '.concat(packet));
  const [data, meta] = packet;
  // find which classroom the message is from ?
  const classroom = null;
  const message = await Messages.Message.create({
    sender: meta.invoker.id,
    type: 'text',
    content: data.message,
    classroom: classroom.id
  });
  classroom.messages.push(message);
  await classroom.save();
  socket.emit('new incoming message', message.filterSafe());
}

module.exports = {
  sendMessage
};
