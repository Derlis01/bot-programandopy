import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    tokens: {
      type: Number,
    },
    accumulated_tokens: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
)

export const User = model('User', UserSchema)
