import {readFileSync} from 'node:fs';
import swaggerUi from 'swagger-ui-express';
const swaggerDocs = JSON.parse(readFileSync(new URL('./openapi.json',import.meta.url),'utf8'));
export {swaggerDocs,swaggerUi};
