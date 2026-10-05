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
    reactions: [{
        type: Schema.Types.ObjectId,
        ref: 'Reaction'
    }],
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
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

publicationSchema.virtual('stats').get(function() {
    return {
        reactions: this.reactions ? this.reactions.length : 0,
        comments: this.comments ? this.comments.length : 0,
        hashtags: this.hashtags ? this.hashtags.length : 0
    };
});

publicationSchema.methods.canBeViewedBy = function(userId) { return this.status && (this.visibility === 'public' || Boolean(userId && String(this.user._id || this.user) === String(userId))); };
publicationSchema.methods.canBeEditedBy = function(userId,role) { return role === 'ADMIN' || Boolean(userId && String(this.user._id || this.user) === String(userId)); };
publicationSchema.methods.canReactBy = function(userId) { return this.canBeViewedBy(userId); };
publicationSchema.index({status:1,visibility:1,createdAt:-1,_id:-1});
publicationSchema.index({user:1,status:1,createdAt:-1,_id:-1});
publicationSchema.methods.toJSON = function(){
    const { __v, _id, ...publication } = this.toObject();
    publication.pid = _id;
    return publication;
};

export default model ('Publication', publicationSchema);