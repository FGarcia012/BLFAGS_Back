import User from '../user/user.model.js';

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

export const userExists = async (uid = " ") => {
    const existe = await User.findById(uid)
    if(!existe){
        throw new Error("No existe el usuario con el ID proporcionado")
    }
}