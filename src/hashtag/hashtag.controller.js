import Hashtag from './hashtag.model.js';

export const getHashtags = async (req, res) => {
    try {
        const hashtags = await Hashtag.find({ status: true })
            .populate('publications', 'title createdAt')
            .sort({ createdAt: -1 });

        if(!hashtags || hashtags.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No se encontraron hashtags'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Hashtags obtenidos exitosamente',
            hashtags
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener los hashtags',
            error: err.message
        });
    }
};

export const getHashtag = async (req, res) => {
    try {
        const { hid } = req.params;

        const hashtag = await Hashtag.findById(hid)
            .populate({
                path: 'publications',
                populate: [
                    { path: 'user', select: 'username profilePicture' },
                    { path: 'hashtags', select: 'name' }
                ],
                options: { sort: { createdAt: -1 } }
            });

        if(!hashtag) {
            return res.status(404).json({
                success: false,
                message: 'Hashtag no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Hashtag obtenido exitosamente',
            hashtag
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener el hashtag',
            error: err.message
        });
    }
};

export const addHashtag = async (req, res) => {
    try {
        const data = req.body;

        const hashtag = await Hashtag.create(data);

        return res.status(201).json({
            success: true,
            message: 'Hashtag agregado exitosamente',
            hashtag
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar agregar el hashtag',
            error: err.message
        });
    }
};


export const deleteHashtag = async (req, res) => {
    try {
        const { hid } = req.params;

        const hashtag = await Hashtag.findByIdAndUpdate(hid, { status: false }, { new: true });

        if(!hashtag) {
            return res.status(404).json({
                success: false,
                message: 'Hashtag no encontrado'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Hashtag eliminado exitosamente',
            hashtag
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al intentar eliminar el hashtag',
            error: err.message
        });
    }
};

export const getPublicationsByHashtag = async (req, res) => {
    try {
        const { name } = req.params;

        const hashtag = await Hashtag.findOne({ name: name.toLowerCase(), status: true })
            .populate({
                path: 'publications',
                populate: [
                    { path: 'user', select: 'username profilePicture' },
                    { path: 'hashtags', select: 'name' },
                    { 
                        path: 'comments', 
                        match: { status: true },
                        populate: { path: 'user', select: 'username profilePicture' }
                    }
                ],
                options: { sort: { createdAt: -1 } }
            });

        if(!hashtag || !hashtag.publications.length) {
            return res.status(404).json({
                success: false,
                message: `No se encontraron publicaciones para el hashtag #${name}`
            });
        }

        return res.status(200).json({
            success: true,
            message: `Publicaciones para el hashtag #${name} obtenidas exitosamente`,
            hashtag: hashtag.name,
            publications: hashtag.publications
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al obtener las publicaciones del hashtag',
            error: err.message
        });
    }
};

export const searchHashtags = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un término de búsqueda'
            });
        }

        const hashtags = await Hashtag.find({
            name: { $regex: query.toLowerCase(), $options: 'i' },
            status: true
        })
        .populate('publications', 'title createdAt')
        .sort({ createdAt: -1 })
        .limit(20);

        return res.status(200).json({
            success: true,
            message: `Hashtags encontrados para "${query}"`,
            hashtags
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: 'Error al buscar hashtags',
            error: err.message
        });
    }
};