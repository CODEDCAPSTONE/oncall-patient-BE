import { Schema, model, Types, Document } from "mongoose";

export interface IChatroom extends Document {
  sender: Types.ObjectId;          
  receiver: Types.ObjectId;          
  session: Types.ObjectId;         
  messages: Types.ObjectId[];        
}

const chatroomSchema = new Schema<IChatroom>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "HealthCareProvider",
      required: true
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true
    },
    session: {
      type: Schema.Types.ObjectId,
      ref: "Session",
      required: true,
      unique: true
    },
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },
  { timestamps: true }
);

export default model<IChatroom>("Chatroom", chatroomSchema);
