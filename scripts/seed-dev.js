import {hash} from 'argon2';
import User from '../src/user/user.model.js';
import Publication from '../src/publication/publication.model.js';
import Comment from '../src/comment/comment.model.js';
import Reaction from '../src/reaction/reaction.model.js';
import {processPublicationHashtags} from '../src/helpers/hashtag-helpers.js';
export async function seedDev(count = 50) {
 const password = await hash('Ficticia!123');
 const users = await User.create(['alpha','beta','moderador'].map((username,i) => ({username,email:username+'@example.invalid',password,role:i === 2 ? 'ADMIN':'USER'})));
 for (let i = 0; i < count; i++) {
  const publication = await Publication.create({user:users[i%2]._id,title:'Historia '+(i+1),description:'Una historia ficticia para compartir. #comunidad',visibility:'public'});
  publication.hashtags = await processPublicationHashtags(publication.description,publication._id);
  const comments = await Comment.create(users.slice(0,2).map(user => ({text:'Gracias por compartir esta historia.',user:user._id,publication:publication._id})));
  const reactions = await Reaction.create(users.map((user,j) => ({user:user._id,publication:publication._id,type:j === 0 ? 'like':'love'})));
  publication.comments = comments.map(c => c._id); publication.reactions = reactions.map(r => r._id); await publication.save();
 }
 await Publication.create({user:users[0]._id,title:'Diario privado',description:'Solo visible para su autor',visibility:'private'});
 return users;
}
