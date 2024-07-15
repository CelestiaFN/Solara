import { Document, Schema, model } from "mongoose";

export interface IUser extends Document {
    created: Date;
    banned: boolean;
    banhistory: any;
    discordId: string;
    accountId: string;
    username: string;
    email: string;
    role: string;
    password: string;
    isServer: boolean;
    hasFL: boolean;
    Reports: string;
    canCreateCodes: boolean;
    hwid?: string;
    ip?: string;
}

const UserSchema: Schema<IUser> = new Schema({
    created: { type: Date, required: true },
    banned: { type: Boolean, default: false },
    banhistory: { type: Object, required: false, default: [] },
    discordId: { type: String, required: true, unique: true },
    accountId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "0" },
    password: { type: String, required: true },
    isServer: { type: Boolean, default: false },
    hasFL: { type: Boolean, default: false },
    Reports: { type: String, default: "0" },
    canCreateCodes: { type: Boolean, default: false },
    hwid: { type: String },
    ip: { type: String },
}, {
    collection: "users"
});

const User = model<IUser>("Users", UserSchema);

export default User;
