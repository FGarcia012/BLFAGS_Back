import { model, Schema } from 'mongoose';

const reactionSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: 'Publication',
        required: [true, 'La publicación es obligatoria']
    },
    type: {
        type: String,
        enum: ['like', 'love', 'laugh', 'sad', 'angry'],
        required: [true, 'El tipo de reacción es obligatorio']
    },
    status: {
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timestamps: true
});

reactionSchema.index({ user: 1, publication: 1 }, { unique: true });

reactionSchema.index({ publication: 1, status: 1 });

reactionSchema.methods.toJSON = function(){
    const { __v, _id, ...reaction } = this.toObject();
    reaction.rid = _id;
    return reaction;
};

export default model('Reaction', reactionSchema);
