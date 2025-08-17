# BLFAGS Backend

Backend API para la aplicación BLFAGS - Una plataforma de red social con funcionalidades de publicaciones, comentarios, reacciones y hashtags.

## 📋 Descripción

BLFAGS es una API REST desarrollada con Node.js, Express y MongoDB que proporciona un backend completo para una aplicación de red social. Incluye funcionalidades como:

- 🔐 **Autenticación y autorización** con JWT
- 👥 **Gestión de usuarios** con perfiles y roles
- 📝 **Sistema de publicaciones** con soporte multimedia
- 💬 **Comentarios** en publicaciones
- 👍 **Sistema de reacciones** (likes, dislikes, etc.)
- 🏷️ **Hashtags** para categorización
- 📤 **Subida de archivos** (imágenes y videos)
- 📧 **Envío de emails** con Nodemailer
- 📚 **Documentación API** con Swagger
- 🛡️ **Seguridad** con Helmet, CORS y rate limiting

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Argon2** - Encriptación de contraseñas
- **Multer** - Manejo de archivos
- **Nodemailer** - Envío de emails
- **Swagger** - Documentación de API
- **Helmet** - Seguridad HTTP
- **Morgan** - Logging de requests

## 📁 Estructura del Proyecto

```
BLFAGS_Back/
├── configs/                    # Configuraciones
│   ├── mongo.js               # Configuración de MongoDB
│   ├── server.js              # Configuración del servidor
│   ├── swagger.js             # Configuración de Swagger
│   └── data/                  # Datos de prueba
├── public/                    # Archivos estáticos
│   └── uploads/               # Archivos subidos
│       ├── comments/          # Videos de comentarios
│       ├── profile-picture/   # Fotos de perfil
│       └── publications/      # Contenido de publicaciones
├── src/                       # Código fuente
│   ├── auth/                  # Autenticación
│   ├── user/                  # Gestión de usuarios
│   ├── publication/           # Publicaciones
│   ├── comment/               # Comentarios
│   ├── reaction/              # Reacciones
│   ├── hashtag/               # Hashtags
│   ├── helpers/               # Funciones auxiliares
│   └── middlewares/           # Middlewares personalizados
├── index.js                   # Punto de entrada
└── package.json              # Dependencias y scripts
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** (v16 o superior)
- **MongoDB** (v4.4 o superior)
- **npm** o **yarn**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/FGarcia012/BLFAGS_Back.git
cd BLFAGS_Back
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Puerto del servidor
PORT=3020

# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/blfags_db

# JWT Secret Key
JWT_SECRET=tu_clave_secreta_super_segura

# Configuración de Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_de_aplicacion

# Entorno
NODE_ENV=development
```

### 4. Configurar MongoDB

Asegúrate de que MongoDB esté ejecutándose en tu sistema local:

```bash
# En Windows (si MongoDB está instalado como servicio)
net start MongoDB

# En macOS/Linux
sudo systemctl start mongod
```

### 5. Ejecutar la Aplicación

#### Modo Desarrollo (con auto-reload)
```bash
npm run dev
```

#### Modo Producción
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3020`

## 📖 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en:

```
http://localhost:3020/api-docs
```

## 🛣️ Endpoints Principales

### Autenticación
- `POST /BLFAGS/v1/auth/login` - Iniciar sesión
- `POST /BLFAGS/v1/auth/register` - Registrar usuario

### Usuarios
- `GET /BLFAGS/v1/user` - Obtener todos los usuarios
- `GET /BLFAGS/v1/user/:id` - Obtener usuario por ID
- `PUT /BLFAGS/v1/user/:id` - Actualizar usuario
- `DELETE /BLFAGS/v1/user/:id` - Eliminar usuario

### Publicaciones
- `GET /BLFAGS/v1/publication` - Obtener publicaciones
- `POST /BLFAGS/v1/publication` - Crear publicación
- `PUT /BLFAGS/v1/publication/:id` - Actualizar publicación
- `DELETE /BLFAGS/v1/publication/:id` - Eliminar publicación

### Comentarios
- `GET /BLFAGS/v1/comment` - Obtener comentarios
- `POST /BLFAGS/v1/comment` - Crear comentario
- `DELETE /BLFAGS/v1/comment/:id` - Eliminar comentario

### Reacciones
- `POST /BLFAGS/v1/reactions` - Crear/actualizar reacción
- `DELETE /BLFAGS/v1/reactions/:id` - Eliminar reacción

### Hashtags
- `GET /BLFAGS/v1/hashtag` - Obtener hashtags
- `POST /BLFAGS/v1/hashtag` - Crear hashtag

## 🔒 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos, incluye el token en el header:

```
Authorization: Bearer <tu_jwt_token>
```

## 📁 Subida de Archivos

El sistema soporta la subida de archivos en las siguientes rutas:
- `/public/uploads/profile-picture/` - Fotos de perfil
- `/public/uploads/publications/` - Contenido de publicaciones
- `/public/uploads/comments/` - Videos de comentarios

## 🛡️ Seguridad

El proyecto implementa múltiples capas de seguridad:
- **Helmet**: Headers de seguridad HTTP
- **CORS**: Control de acceso entre dominios
- **Rate Limiting**: Limitación de peticiones por IP
- **Argon2**: Encriptación segura de contraseñas
- **JWT**: Tokens de autenticación
- **Validación de datos**: Express Validator

## 🧪 Scripts Disponibles

```bash
npm start       # Ejecutar en modo producción
npm run dev     # Ejecutar en modo desarrollo con auto-reload
npm test        # Ejecutar tests (pendiente implementación)
```

## 👨‍💻 Autor

**Fredy Alexander García Sicajau**

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes problemas o preguntas, puedes:
- Abrir un issue en GitHub
- Revisar la documentación en `/api-docs`
- Verificar los logs del servidor

## 🔧 Solución de Problemas Comunes

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
mongo --eval "db.adminCommand('ismaster')"
```

### Error de permisos en archivos
```bash
# En sistemas Unix/Linux/macOS
chmod -R 755 public/uploads/
```

### Puerto en uso
```bash
# Verificar qué proceso está usando el puerto
netstat -tulpn | grep :3020
```