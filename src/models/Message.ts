// import { Schema, model, Document } from "mongoose";

// export interface IMessage extends Document {
//   sender: string;
//   receiver: string;
//   content: string;
// }

// const messageSchema = new Schema<IMessage>(
//   {
//     sender: { type: String, required: true },
//     receiver: { type: String, required: true },
//     content: { type: String, required: true }
//   },
//   { timestamps: true }
// );

// export default model<IMessage>("Message", messageSchema);
import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
  sender: string;
  receiver: string;
  content: string;
  chatroom: Types.ObjectId; // ref to Chatroom
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    content: { type: String, required: true },
    chatroom: {
      type: Schema.Types.ObjectId,
      ref: "Chatroom",
      required: true
    }
  },
  { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
