const axios = require('axios');

// Fungsi untuk mengonversi gambar dari URL ke Base64
async function imageToBase64FromURL(url) {
  try {
    // Unduh gambar
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    // Konversi ke string Base64
    const base64Image = Buffer.from(response.data).toString('base64');
    return base64Image;
  } catch (error) {
    console.error('Error:', error);
  }
}

// URL gambar yang ingin kamu konversi
const imageURL = 'https://media.cakeresume.com/image/upload/s--kIuSbFAI--/c_fill,g_face,h_600,w_600/v1675439899/r5kgac4te3sldeeckoo8.jpg'; // Ganti dengan URL gambar yang ingin kamu konversi

// Panggil fungsi dan cetak hasilnya
imageToBase64FromURL(imageURL).then(base64String => {
  console.log(base64String);
});
