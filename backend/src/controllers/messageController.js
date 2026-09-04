const messageService = require("../services/messageService");

async function getAllMessages(req, res, next) {
  try {
    const messages = await messageService.getAllMessages();
    return res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllMessages
};
