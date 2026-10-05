import 'dotenv/config';
import {initServer} from './configs/server.js';
initServer().catch(() => {console.error('No se pudo iniciar el servidor. Revisa la configuración y la conexión'); process.exitCode = 1;});
