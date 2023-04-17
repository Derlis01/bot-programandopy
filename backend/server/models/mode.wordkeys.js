import { Schema, model } from 'mongoose'

const WordKeySchema = new Schema(
  {
    wordKeys: Array,
  },
  {
    timestamps: true,
  }
)

export const WordKey = model('WordKey', WordKeySchema)
