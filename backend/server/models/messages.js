import { Schema, model } from 'mongoose'

const MessageSchema = new Schema(
  {
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

export const Message = model('Message', MessageSchema)
