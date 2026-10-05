export const hasRoles = (...roles) => (req,res,next) => {
 if (!req.user) return res.status(401).json({success:false,message:'Necesitas iniciar sesión'});
 if (!roles.includes(req.user.role)) return res.status(403).json({success:false,message:'No tienes permisos'}); next();
};
