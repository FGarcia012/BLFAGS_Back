import fs from "fs/promises";
import { join } from "path";

export const deleteFileOnError = async (err, req, res, next) => {
    if (err && req.file && req.filePath) {
        const filePath = join(req.filePath, req.file.filename);
        console.log(`Intentando eliminar archivo debido a error: ${filePath}`);
        try {
            await fs.unlink(filePath);
            console.log(`Archivo eliminado exitosamente: ${filePath}`);
        } catch (unlinkErr) {
            console.log(`Error al eliminar archivo: ${unlinkErr.message}`);
        }
    }
    next(err);
}