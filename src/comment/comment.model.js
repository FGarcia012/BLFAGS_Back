import { model, Schema } from "mongoose";

const commentSchema = Schema({
    text: {
        type: String,
        trim: true,
        maxLength: [500, 'El comentario no puede exceder 500 caracteres']
    },
    media: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El usuario es obligatorio']
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'El post es obligatorio']
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

commentSchema.pre('validate', function() {
    if (!this.text && !this.media) {
        this.invalidate('content', 'El comentario debe tener texto o contenido multimedia');
    }
});

commentSchema.methods.toJSON = function(){
    const { __v, _id, ...comment} = this.toObject();
    comment.cid = _id;
    return comment;
};

export default model('Comment', commentSchema);
