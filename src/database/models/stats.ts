import { Document, Schema, model} from 'mongoose';

interface IStats extends Document {
    created: Date;
    accountId: string;
    MatchesPlayed: number;
    solos: {
        kills: number;
        matchplayed: number;
        wins: number;
    };
    duos: {
        kills: number;
        matchplayed: number;
        wins: number;
    };
    squads: {
        kills: number;
        matchplayed: number;
        wins: number;
    };
    ltm: {
        kills: number;
        matchplayed: number;
        wins: number;
    };
    arena: {
        hype: number;
        kills: number;
        matchplayed: number;
        wins: number;
    };
}

const statsSchema: Schema = new Schema({
    created: { type: Date, required: true },
    accountId: { type: String, required: true, unique: true },
    MatchesPlayed: { type: Number, required: true, default: 0 },
    solos: {
        kills: { type: Number, required: true, default: 0 },
        matchplayed: { type: Number, required: true, default: 0 },
        wins: { type: Number, required: true, default: 0 }
    },
    duos: {
        kills: { type: Number, required: true, default: 0 },
        matchplayed: { type: Number, required: true, default: 0 },
        wins: { type: Number, required: true, default: 0 }
    },
    squads: {
        kills: { type: Number, required: true, default: 0 },
        matchplayed: { type: Number, required: true, default: 0 },
        wins: { type: Number, required: true, default: 0 }
    },
    ltm: {
        kills: { type: Number, required: true, default: 0 },
        matchplayed: { type: Number, required: true, default: 0 },
        wins: { type: Number, required: true, default: 0 }
    },
    arena: {
        hype: { type: Number, required: true, default: 0 },
        kills: { type: Number, required: true, default: 0 },
        matchplayed: { type: Number, required: true, default: 0 },
        wins: { type: Number, required: true, default: 0 }
    }
}, {
    collection: 'stats'
});

const Stats = model<IStats>('Stats', statsSchema);

export default Stats;
