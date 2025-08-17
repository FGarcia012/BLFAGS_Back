import Comment from './comment.model.js';
import Publication from '../publication/publication.model.js';

export const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ status: true })
            .populate('user', 'username')
            .populate('publication', 'title');

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
            .populate('publication', 'title');

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

export const getCommentsByPublication = async (req, res) => {
    try {
        const { pid } = req.params;

        const comments = await Comment.find({ publication: pid })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        if(!comments || comments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron comentarios para esta publicación'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Comentarios de la publicación obtenidos exitosamente',
            comments
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios de la publicación',
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

        await Publication.findByIdAndUpdate(
            data.publication,
            { $push: { comments: comment._id } },
            { new: true }
        );

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

        const commentToDelete = await Comment.findById(cid);
        
        if(!commentToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        const comment = await Comment.findByIdAndUpdate(cid, { status: false }, { new: true });

        await Publication.findByIdAndUpdate(
            commentToDelete.publication,
            { $pull: { comments: cid } },
            { new: true }
        );

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
