import { Request, Response } from "express";
import Message from "../models/Message";
import Chatroom from "../models/Chatroom";

export const sendMessage = async (req: Request, res: Response) => {
  const { chatroomId, sender, receiver, content } = req.body;

  const message = await Message.create({ sender, receiver, content });

  const chatroom = await Chatroom.findByIdAndUpdate(
    chatroomId,
    { $push: { messages: message._id } },
    { new: true }
  );

  res.status(201).json({ message: "Message sent", chatroom });
};
