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
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = sendMessage;
