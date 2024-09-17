import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'trello/attachment',
            allowed_formats: ['jpg', 'png', 'jpeg']
        }
    }
});

export const destroyImage = (public_id: string) => {
    cloudinary.uploader.destroy(public_id, (err, result) => {
        if (err) {
            console.error('Error deleting image from Cloudinary:', err);
        }
    })
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;
