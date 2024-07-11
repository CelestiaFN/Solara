import { Schema, Document, model } from "mongoose";

interface Matchmaking extends Document {
  accountId: string;
  sessionId: string;
  data: any;
}

const MatchmakingSchema = new Schema<Matchmaking>({
  accountId: { type: String, required: true},
  sessionId: { type: String, required: false }, 
  data: { type: Object, required: true }
});

const Matchmaking = model<Matchmaking>("Matchmaking", MatchmakingSchema);

export default Matchmaking;