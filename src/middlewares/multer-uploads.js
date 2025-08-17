import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';
import { extname } from 'path';

export const configureCloudinary = () => {
  cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary configurado correctamente');
};

const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "BLFAGS/profile-pictures",
    public_id: (req, file) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      return `${fileName}-${Date.now()}`;
    },
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp"],
  },
});

const publicationsStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "BLFAGS/publications",
    public_id: (req, file) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      return `${fileName}-${Date.now()}`;
    },
    resource_type: "auto", 
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "mp4", "avi", "mov", "wmv"],
  },
});

const commentsStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "BLFAGS/comments",
    public_id: (req, file) => {
      const fileExtension = extname(file.originalname);
      const fileName = file.originalname.split(fileExtension)[0];
      return `${fileName}-${Date.now()}`;
    },
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "webp", "mp4", "avi", "mov", "wmv"],
  },
});

const profileImageFilter = (req, file, cb) => {
  const allowedTypes = ["image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solamente se aceptan archivos de imagen para el perfil"));
  }
};

const mediaFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/png", "image/jpg", "image/jpeg", "image/gif", "image/webp",
    "video/mp4", "video/avi", "video/mov", "video/wmv"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solamente se aceptan archivos de imagen y video"));
  }
};

export const uploadProfilePicture = multer({
  storage: profileImageStorage,
  fileFilter: profileImageFilter,
  limits: {
    fileSize: 10000000, 
  },
});

export const uploadPublications = multer({
  storage: publicationsStorage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100000000, 
  },
});

export const uploadComments = multer({
  storage: commentsStorage,
  fileFilter: mediaFilter,
  limits: {
    fileSize: 100000000, 
  },
});