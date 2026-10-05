export function validateEnv(env = process.env) {
 for (const key of ['URI_MONGO','SECRETORPRIVATEKEY','EMAIL_USER','EMAIL_PASSWORD','CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET','CORS_ORIGINS']) if (!env[key]) throw new Error(`Falta la variable ${key}`);
 if (env.SECRETORPRIVATEKEY.length < 32) throw new Error('SECRETORPRIVATEKEY requiere al menos 32 caracteres');
 for (const key of ['MAX_IMAGE_MB','MAX_VIDEO_MB','GLOBAL_RATE_LIMIT','LOGIN_RATE_LIMIT','REGISTER_RATE_LIMIT','WRITE_RATE_LIMIT','UPLOAD_RATE_LIMIT']) if (env[key] && (!Number.isFinite(Number(env[key])) || Number(env[key]) <= 0)) throw new Error(`Variable inválida: ${key}`);
}
