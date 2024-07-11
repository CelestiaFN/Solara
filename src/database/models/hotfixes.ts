import { Schema, Document, model } from 'mongoose';

interface Row {
  name: string;
  data: string;
}

export interface ICloudStorage extends Document {
  method: string;
  rows: Row[];
}

const cloudstorageSchema = new Schema<ICloudStorage>(
  {
    method: {
      type: String,
      required: true,
      unique: true
    },
    rows: [
      {
        name: {
          type: String,
          required: true
        },
        data: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    collection: "hotfixes"
  }
);

const hotfixes = model<ICloudStorage>("hotfixes", cloudstorageSchema);

export default hotfixes;
