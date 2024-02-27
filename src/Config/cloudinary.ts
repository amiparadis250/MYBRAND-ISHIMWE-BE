import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage} from 'multer-storage-cloudinary';


// Interface for the folder parameter
interface Folders {
    folder: string;
}

// Extending UploadApiResponse to include 'folder'
interface CustomParams extends Folders {}

// Configuring Cloudinary
cloudinary.config({
    cloud_name: 'dv9cz01fi',
    api_key: '216623824221183',
    api_secret: '7EiU36FV2u2mCaTIvFut-v2Bh0U',
});


const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'MYBRAND',
        transformation: [{ width: 500, height: 500, crop: 'limit' }],
    } as CustomParams, // Using the custom type here
});

export default storage;
