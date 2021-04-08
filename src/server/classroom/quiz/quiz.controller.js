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
  const quizType = data.cleanedValues.type;
  let message;

  switch (quizType) {
    case 'MCQ':
      message = await Messages.MCQMessage.create({
        sender: meta.invoker.id,
        type: quizType,
        content: {
        prompt: data.cleanedValues.prompt,    
        choices: data.cleanedValues.choices,//which one is choice
        correct: data.cleanedValues.correct},
        //multiSelect: data.message
        classroom: classroom.id
      }); break;
    case 'SAQ':
      message = await Messages.QuestionMessage.create({
        sender: meta.invoker.id,
        type: quizType,
        content: {
            prompt: data.cleanedValues.prompt
        },
        classroom: classroom.id
      }); break;
    default:
      message = null;
  }

  classroom.quizs.push(quiz);//message or quiz?
  await classroom.save();
  cachegoose.clearCache(`ClassroomById-${classroom.id}`);
  io.to(classroom.id).emit('new quiz', message.filterSafe());
  return callback({});
}

module.exports = {
    sendQuiz,
};
