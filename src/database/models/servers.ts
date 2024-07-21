import { Schema, Document, model } from "mongoose";

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

export default Servers;