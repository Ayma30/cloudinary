const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dzmcmthm2',
  api_key: '775246617794836',
  api_secret: 'TyVVk8BQb0fqQNj9LV8KQqh3CLw'
});
app.use(fileUpload());

app.get('/upload', (req, res) => {
  res.render('upload');
});

const currentDir = __dirname;

app.post('/upload-cloudinary', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
  
    const uploadedFile = req.files.uploadedFile;
 // Crear una ruta para el archivo temporal
    const tempFilePath = path.join(currentDir, 'temp', uploadedFile.name);
  
    // Crear un archivo temporal usando fs.writeFile
    fs.writeFile(tempFilePath, uploadedFile.data, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
  
      // Subir el archivo temporal a Cloudinary
      cloudinary.uploader.upload(tempFilePath, (cloudinaryErr, result) => {
        if (cloudinaryErr) {
          return res.status(500).send(cloudinaryErr);
        }
  
        // Borrar el archivo temporal después de subirlo a Cloudinary
        fs.unlink(tempFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error al borrar el archivo temporal:', unlinkErr);
          }
        });
  
        res.send(`File uploaded to Cloudinary. Public URL: ${result.secure_url}`);
      });
    });
  });


app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const uploadedFile = req.files.uploadedFile;
  const uploadPath = __dirname + '/uploads/' + uploadedFile.name;

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
