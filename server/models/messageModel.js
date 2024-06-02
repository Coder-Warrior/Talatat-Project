import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    messageFrom: { type: String, required: true },
    messageTo: { type: String, required: true },
    message: { type:  String, required: false },
    token: { type: String, required: false },
    urls: [
      {
        url: { type: String, required: true },
        type: { type: String, required: true }
      }
    ]
  });

const Message = mongoose.model("message", messageSchema);

export default Message;