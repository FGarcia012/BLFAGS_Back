import Comment from './comment.model.js';

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ status: true })
            .populate('user', 'username')
            .populate('post', 'title');

        if(!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron comentarios'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comentarios obtenidos exitosamente',
            comments
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios',
            error: err.message
        });
    }
};

export const getComment = async (req, res) => {
    try {
        const { cid } = req.params;

        const comment = await Comment.findById(cid)
            .populate('user', 'username')
            .populate('post', 'title');

        if(!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comentario obtenido exitosamente',
            comment
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el comentario',
            error: err.message
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.find({ post: postId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        if(!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron comentarios para este post'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comentarios del post obtenidos exitosamente',
            comments
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios del post',
            error: err.message
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const data = req.body;
        let media = req.file ? req.file.filename : null;
        data.media = media;

        const comment = await Comment.create(data);

        return res.status(201).json({
            success: true,
            message: 'Comentario agregado exitosamente',
            comment
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar agregar el comentario',
            error: err.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { cid } = req.params;

        const comment = await Comment.findByIdAndUpdate(cid, { status: false }, { new: true });

        if(!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente',
            comment
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar eliminar el comentario',
            error: err.message
        });
    }
};
