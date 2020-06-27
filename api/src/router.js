const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const imageProcessor = require('./imageProcessor');

const router = Router();

const photoPath = path.resolve(__dirname, '../../client/photo-viewer.html');

const filename = (req, file, callback) => {
  callback(null, file.originalname);
}

const storage = multer.diskStorage({
  destination: 'api/uploads/',
   filename, });

const fileFilter = (req, file, callback) => {
  if(file.mimetype !== 'image/png') {
    req.fileValidationError = 'Wrong file type';
    callback(null, false, new Error('Wrong file type'));
  }
  else {
    callback(null, true);
  }
}

const upload = multer({
   fileFilter,
   storage, });

router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    await imageProcessor(req.file.filename);
  } catch (err) {

  }
  if(req.fileValidationError) {
    return res.status(400).json({error: req.fileValidationError});
  }
    return res.status(201).json({success: true});
});

router.get('/photo-viewer', (req, res) => {
  res.sendFile(photoPath);
})


// router.post('/upload', upload.single('photo'), async (request, response) => {
//   if (request.fileValidationError) return response.status(400).json({error: request.fileValidationError});
//
//   try {
//     await imageProcessor(request.file.filename);
//   } catch (error) {
//
//   }
//
//   return response.status(201).json({success: true});
// });
//
// router.get('/photo-viewer', (request, response) => {
//   response.sendFile(photoPath);
// });

   module.exports = router;
