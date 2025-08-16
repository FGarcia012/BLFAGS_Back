import { model, Schema } from 'mongoose';

const hashtagSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
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

hashtagSchema.methods.toJSON = function(){
    const { __v, _id, ...hashtag} = this.toObject();
    hashtag.hid = _id;
    return hashtag;
};

export default model('Hashtag', hashtagSchema);