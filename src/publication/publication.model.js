import { model, Schema } from 'mongoose';

const publicationSchema = Schema({
    media: {
        type: String
    },
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        trim: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    hashtags: [{
        type: Schema.Types.ObjectId,
        ref: 'Hashtag'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    status: {
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timestamps: true
});

publicationSchema.methods.toJSON = function(){
    const { __v, _id, ...publication } = this.toObject();
    publication.pid = _id;
    return publication;
};

export default model ('Publication', publicationSchema);