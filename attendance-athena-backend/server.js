const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware untuk mengurai body JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route untuk video upload dan absensi
app.use('/api/upload', require('./routes/upload'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
