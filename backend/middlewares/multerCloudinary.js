import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import cloudinary from '../config/cloudinary.js';


/* 2nd hit. CloudinaryStorage serves as a storage engine for Multer, meaning it handles the specifics of where and how to store files uploaded through HTTP requests.*/
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    // save in this folder in cloudinary. although also saved in Assets in cloudinary but uses only one space per image.
    folder: 'epic-escapes',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    filename: (req, file) => {
      console.log('multer name', `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
      // Giving name to uploaded file using Date.now for uniqueness
      return `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`;
      
    },
  },
});

// 1st hit. multer middleware.
export const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});

/* third hit. This is a controller but kept here for simplicity. uploaded to cloudinary. receives file from const storage. no need to delete file after upload.multer-storage-cloudinary does automatically */
export const uploadImage = async (req, res) => {
  console.log('uploadImage hit', req.file);
  
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  };
  
  try {
// using multer-storage-cloudinary doesn't return public_id to delete in req.file. to delete use ecommerce approach
  return res.status(200).json({ success: true, message: 'File uploaded to Cloudinary successfully', data: req.file.path});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
};