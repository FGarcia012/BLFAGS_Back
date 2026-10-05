import {model,Schema} from 'mongoose';
import {publicUser} from '../helpers/privacy.js';
const userSchema = new Schema({
 username:{type:String,required:true,trim:true,minlength:3,maxlength:20,match:/^[a-zA-Z0-9_]+$/},
 email:{type:String,required:true,unique:true,trim:true,lowercase:true},
 password:{type:String,required:true},profilePicture:{type:String,default:null},
 role:{type:String,enum:['ADMIN','USER'],default:'USER'},status:{type:Boolean,default:true}
},{versionKey:false,timestamps:true});
userSchema.index({username:1},{unique:true,collation:{locale:'en',strength:2}});
userSchema.methods.toJSON = function() {return publicUser(this);};
export default model('User',userSchema);
