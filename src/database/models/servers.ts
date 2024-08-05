import { Schema, Document, model } from "mongoose";
import mongoose from "mongoose";

interface Servers extends Document {
  sessionId: string;
  data: any;
  region: string;
  playlist: string;
  state: string;
  players: number;
  playercap: number;
  startedAt: string;
}

const ServerSchema = new Schema<Servers>({
  sessionId: { type: String, required: false },
  region: { type: String, required: true },
  playlist: { type: String, required: true },
  state: { type: String, required: true },
  players: { type: Number, required: true },
  playercap: { type: Number, required: true },
  startedAt: { type: String, required: true }
});

const Servers = model<Servers>("Servers", ServerSchema);

const deleteAll = async () => {
  try {
    await Servers.deleteMany({});
  } catch (error) {
    console.error("Error deleting servers:", error);
  }
};

setInterval(deleteAll, 300000);

export default Servers;