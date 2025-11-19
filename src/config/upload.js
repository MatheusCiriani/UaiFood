// src/config/upload.js
const multer = require('multer');
const path = require('path');

// Configuração de onde salvar e qual nome dar ao arquivo
const storage = multer.diskStorage({
  destination: path.resolve(__dirname, '..', '..', 'uploads'), // Salva na pasta 'uploads' na raiz
  filename: (req, file, cb) => {
    // Cria um nome único: timestamp + extensão original (ex: 123123123-pizza.png)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;