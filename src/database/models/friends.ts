import { Schema, model, Document } from 'mongoose';

interface FriendList {
    accepted: string[];
    incoming: string[];
    outgoing: string[];
    blocked: string[];
}

interface FriendsType extends Document {
    created: Date;
    accountId: string;
    list: FriendList;
}

const FriendsSchema = new Schema<FriendsType>(
    {
        created: { type: Date, required: true },
        accountId: { type: String, required: true, unique: true },
        list: { 
            type: Object, 
            default: { 
                accepted: [], 
                incoming: [], 
                outgoing: [], 
                blocked: [] 
            } 
        }
    },
    {
        collection: "friends"
    }
);

const Friends = model<FriendsType>('Friends', FriendsSchema);

export default Friends;
