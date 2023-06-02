import { diskStorage } from 'multer';

const generateId = () => {
  return Array(18)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
};

const normalizeFileName = (req, file, cb) => {
  console.log(file);
  const fileExt = file.originalname.split('.').pop();

  cb(null, `${generateId()}.${fileExt}`);
};

export const fileStorage = diskStorage({
  destination: './uploads',
  filename: normalizeFileName,
});
