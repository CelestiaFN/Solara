import { Schema, Document, model } from "mongoose";

interface Token extends Document {
    accountId: string;
    type: string;
    token: string;
    permissions: any;
}

const TokensSchema: Schema = new Schema(
    {
        accountId: { type: String, required: true },
        type: { type: String, required: true },
        token: { type: String, required: true },
        permissions: { type: Array, required: true },
    },
    {
        collection: "tokens",
    }
);

const Tokens = model<Token>("Tokens", TokensSchema);

export default Tokens;
