const messageRepository = require("../repositories/messageRepository");

async function getAllMessages() {
  return await messageRepository.getAllMessages();
}

module.exports = {
  getAllMessages,
};
