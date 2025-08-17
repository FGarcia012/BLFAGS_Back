import User from '../user/user.model.js';
import Hashtag from '../hashtag/hashtag.model.js';
import Comment from '../comment/comment.model.js';
import Publication from '../publication/publication.model.js';

export const emailExists = async (email = '') => {
    const exists = await User.findOne({ email });
    if (exists) {
        throw new Error(`El correo ${email} ya está registrado`);
    }
};

export const usernameExists = async (username = '') => {
    const exists = await User.findOne({ username });
    if (exists) {
        throw new Error(`El nombre de usuario ${username} ya está registrado`);
    }
};

export const userExists = async (uid = ' ') => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
};

export const hashtagExists = async (hid = ' ') => {
    const existe = await Hashtag.findById(hid)
    if(!existe){
        throw new Error("No existe el hashtag con el ID proporcionado")
    }
};

export const commentExists = async (cid = ' ') => {
    const existe = await Comment.findById(cid)
    if(!existe){
        throw new Error("No existe el comentario con el ID proporcionado")
    }
};

export const publicationExists = async (pid = ' ') => {
    const existe = await Publication.findById(pid)
    if(!existe){
        throw new Error("No existe la publicación con el ID proporcionado")
    }
};