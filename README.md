# BLFAGS Backend

API de un blog con alias. Las personas comparten publicaciones, comentarios y reacciones sin exponer su nombre real ni su correo a la comunidad.

## Privacidad y límites

- No se solicita ni almacena un nombre real en cuentas nuevas.
- El correo se guarda para iniciar sesión y para una única bienvenida. Solo el propietario lo ve en su perfil autenticado.
- Las contraseñas se guardan con Argon2; nunca se envían por correo. El administrador recibe aliases y metadatos de moderación.
- Las publicaciones privadas y su contenido asociado son visibles solo para su autor. Los demás reciben 404.
- Los archivos se alojan en Cloudinary. Los proveedores pueden manejar datos técnicos; los enlaces de archivos públicos pueden compartirse. Un alias no garantiza anonimato absoluto.
- Los secretos anteriormente versionados **deben rotarse**. Quitar un archivo no elimina sus versiones antiguas.

Frontend: [BLFAGS_Front](https://github.com/FGarcia012/BLFAGS_Front).

## Stack y requisitos

Node.js 22.13+ o 24, ES Modules, Express 5, Mongoose 8, MongoDB, Argon2, JWT HS256, Helmet, express-validator, express-rate-limit, Multer en memoria, Cloudinary SDK, Nodemailer y Swagger UI.
Usa MongoDB local o mongodb-memory-server para desarrollo. No reutilices credenciales ni datos de producción.

```sh
npm ci
cp .env.example .env
# Completa .env con credenciales propias del entorno local.
npm run dev
```

En PowerShell, reemplaza `cp` por `Copy-Item`. El archivo de ejemplo no contiene valores. La API está bajo `/BLFAGS/v1`; el puerto local predeterminado es 3020.

## Variables de entorno

| Variable | Propósito |
|---|---|
| PORT | Puerto local, predeterminado 3020 |
| URI_MONGO | URI de la base del entorno correspondiente |
| SECRETORPRIVATEKEY | Clave JWT: mínimo 32 caracteres; recomendamos 64 aleatorios |
| EMAIL_USER | Cuenta emisora de bienvenida |
| EMAIL_PASSWORD | Contraseña de aplicación de correo |
| CLOUDINARY_CLOUD_NAME | Cuenta de archivos |
| CLOUDINARY_API_KEY | Identificador de API de archivos |
| CLOUDINARY_API_SECRET | Secreto de API de archivos |
| NODE_ENV | production, development o test |
| CORS_ORIGINS | Orígenes permitidos separados por comas; requerido al iniciar |
| MAX_IMAGE_MB | Límite de imagen, predeterminado y máximo conservador: 4 MB decimales |
| MAX_VIDEO_MB | Límite de video, predeterminado y máximo conservador: 4 MB decimales |
| GLOBAL_RATE_LIMIT | 600/min inicialmente; bajar a 120 después del nuevo frontend |
| LOGIN_RATE_LIMIT | 5 fallos/15 minutos por IP |
| REGISTER_RATE_LIMIT | 3/hora por IP |
| WRITE_RATE_LIMIT | 20/min por usuario |
| UPLOAD_RATE_LIMIT | 10/hora por usuario |

El arranque valida variables obligatorias y longitud de la clave. Nunca registra sus valores. No se permite un límite de archivo superior a 4 MB, aunque una variable sea mayor.

## Scripts y estructura

```sh
npm run lint
npm run build
npm test
npm audit --omit=dev
npm run contract
node scripts/migrate-remove-name.js --dry-run
node scripts/sync-indexes.js --dry-run
```

`build` comprueba la sintaxis de todos los ES Modules: no hace falta transpilar este backend.
`configs/server.js` expone `createApp()` sin abrir conexiones para las pruebas. `configs/env.js` valida configuración; `configs/mongo.js` conecta la base.
`src/{auth,user,publication,comment,reaction,hashtag}` conserva los módulos existentes. `src/helpers/privacy.js` contiene DTOs, visibilidad y cursores; `publication-page.js` agrega por lote; `src/middlewares/security.js` centraliza validación y errores.
`scripts/` contiene generación de contrato, migraciones manuales y semillas ficticias. `tests/` usa Supertest, Vitest y MongoDB efímero.

## Endpoints y contratos

La [tabla de 29 endpoints](docs/endpoints.md), [OpenAPI](configs/openapi.json) y [colección Postman](configs/BLFAGS.postman_collection.json) se generan desde las rutas con `npm run contract`.
Swagger está en `/api-docs` exclusivamente fuera de producción. Usa `{{baseUrl}}` y `{{token}}` en Postman; la colección no incluye tokens reales.

Autenticación: `Authorization: Bearer <token>`. No se aceptan tokens en el cuerpo ni en la URL. Expiran a las 5 horas; los tokens inválidos o de cuentas eliminadas devuelven 401. Todas las escrituras requieren sesión; un identificador `user` del cliente nunca determina la autoría.

`GET /publication/getPublications?limit=20&cursor=...&search=...&filter=public` responde:
```json
{"success":true,"publications":[],"nextCursor":null,"hasMore":false}
```
El límite predeterminado es 20 y el máximo 30. Los cursores codifican fecha e identificador y se validan; las búsquedas son literales, de 2 a 100 caracteres. Cada publicación tiene `commentCount`, `reactionCount`, `userReaction` e `isMine`. No incluye arreglos completos de comentarios o reacciones. Las listas vacías responden 200.
Los comentarios por publicación también se paginan. Reaccionar devuelve el tipo y los conteos; añadir/borrar comentarios devuelve el conteo actualizado. Las consultas del feed son tres comandos agregados, más la validación JWT cuando corresponde.

## Archivos y abuso

El orden es límite de tasa, autenticación, rol y permisos, Multer en memoria, validación de campos y firma real del archivo, y finalmente Cloudinary. Solo se aceptan JPEG, PNG, WebP, GIF, MP4, QuickTime y WebM; las fotos de perfil solo admiten imágenes.
Se usa un identificador aleatorio y una transformación entrante `strip_metadata`. Se solicita destrucción de archivos al reemplazar, eliminar o fallar después de una subida. Hay que confirmar EXIF/GPS en una cuenta Cloudinary de pruebas; no se ha subido contenido a producción.

El límite documentado de Vercel es 4.5 MB por solicitud; se reservó margen con 4 MB por archivo. Esta configuración todavía requiere comprobación en preview. Videos grandes requieren subidas directas firmadas, fuera del alcance de esta entrega.

Los límites responden 429 en español, con cabeceras estándar draft-7. El almacén es **por instancia**; para Vercel añade WAF/firewall o un contador Redis compartido. El control de aplicación no sustituye esa protección distribuida.

## Despliegue y mantenimiento manual

Configura las variables en Vercel, fuera del repositorio. El manejador serverless reutiliza la conexión; el desarrollo local espera la conexión antes de escuchar.
Antes de desplegar: rota todas las credenciales expuestas, respalda MongoDB, revisa duplicados de alias, ejecuta migraciones primero en modo dry-run y confirma CORS con los dominios de Firebase y del portafolio.
Despliega primero el backend en preview con límite global 600, después el frontend compatible, y solo entonces cambia GLOBAL_RATE_LIMIT a 120. Ambos cambios de contrato deben llegar el mismo día.
No se han ejecutado despliegues, purgas de historial ni migraciones reales.

Si falla el arranque, verifica los nombres de variables y la clave mínima sin imprimir valores. Un 401 requiere iniciar sesión de nuevo; 404 puede significar contenido privado o eliminado; 409 indica un alias/correo ya ocupado; 429 requiere esperar.
Antes de sincronizar índices, resuelve los duplicados mediante un proceso privado: el script solo informa conteos.

Autor: FGarcia012. Licencia declarada en package.json: ISC.
