// Import modul fs untuk membaca file
const fs = require('fs');

// Fungsi untuk mengonversi gambar ke Base64
function imageToBase64(filePath) {
  try {
    // Baca file gambar
    const image = fs.readFileSync(filePath);
    // Konversi ke string Base64
    const base64Image = image.toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error:', error);
  }
}

// Tentukan path file gambar
const filePath = 'C:/Users/user/Documents/BANGKIT CC/repository-cc55-athena/keren.jpg'; // Ganti dengan path file gambar yang ingin kamu konversi

// Panggil fungsi dan cetak hasilnya
const base64String = imageToBase64(filePath);
console.log(base64String);
