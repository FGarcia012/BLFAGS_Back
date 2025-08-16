import Hashtag from './hashtag.model.js';

export const getHashtags = async (req, res) => {
    try {
        const hashtags = await Hashtag.find();

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

        const hashtag = await Hashtag.findById(hid);

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