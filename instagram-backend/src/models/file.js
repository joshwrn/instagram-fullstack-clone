// src/fileModel.js
import { Schema, model } from 'mongoose';
const fileSchema = new Schema({
  url: String,
});
export default model('File', fileSchema);
