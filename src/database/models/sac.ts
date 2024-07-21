import { Schema, model, Document } from 'mongoose';

interface ICode extends Document {
    created: Date;
    owner: string;
    code: string;
    code_l: string;
}

const CodeSchema = new Schema<ICode>(
    {
        created: { type: Date, required: false },
        owner: { type: String, required: true },
        code: { type: String, required: true },
        code_l: { type: String, required: true },
    },
    {
        collection: 'sac'
    }
);

const Sac = model<ICode>('sac', CodeSchema);

export default Sac;
