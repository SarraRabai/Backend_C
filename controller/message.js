const Message = require("../models/message");
const Conversation = require("../models/conversation");

const sendMessage = async (req, res) => {
  try {
    const { message } = req.body; //gettin the message from user as input
    const { id: receiverId } = req.params; //get user id from params
    const senderId = req.user._id; //seender from req.user

    if (!message || !receiverId) {
      return res
        .status(400)
        .send({ error: "Message and receiver ID are required" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, //find conversation btw all sender and receiver
    });

    if (!conversation) {
      //check to find the converstion btw 2 users
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      //we create a
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      // put the message into messages array
      conversation.messages.push(newMessage._id);
    }

    // await conversation.save();
    // await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
};
const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; //the user we chattin with
    const senderId = req.user._id; //id from auth middleware

    const conversation = await Conversation.findOne({
      //find a conversation
      participants: { $all: [senderId, userToChatId] }, //btw senderId userToChatId
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  sendMessage,
  getMessages,
};
