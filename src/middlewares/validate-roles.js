export const hasRoles = (...roles) => {
    return (req,res,next) => {
        if(!req.user){
            return res.status(500).json({
                success: false,
                message: 'Se quiere verificar un role antes de validar el token'
            })
        }

        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                success: false,
                message: `El servicio requiere uno de estos roles ${roles}`
            })
        }
        next()
    }
}