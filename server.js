const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Gunakan Express untuk melayani file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Izinkan server memproses JSON

// Sebuah 'database' sederhana dalam memori untuk contoh ini
const links = {};

// Endpoint untuk membuat tautan pelacakan
app.post('/buat-tautan', (req, res) => {
    const originalUrl = req.body.url;
    if (!originalUrl) {
        return res.status(400).json({ error: 'URL tidak boleh kosong.' });
    }

    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Simpan data tautan
    links[shortCode] = {
        originalUrl: originalUrl,
        hits: [] // Array untuk menyimpan data pelacakan
    };

    const trackingUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
    res.json({ trackingUrl });
});

// Endpoint untuk melacak dan mengalihkan pengguna
app.get('/:shortCode', async (req, res) => {
    const shortCode = req.params.shortCode;
    const linkData = links[shortCode];

    if (!linkData) {
        return res.status(404).send('Tautan tidak ditemukan.');
    }

    // Mendapatkan alamat IP pengguna dari header permintaan
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
        // Menggunakan API geolokasi untuk mendapatkan lokasi
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        const location = response.data;

        // Simpan data pelacakan
        linkData.hits.push({
            ip: ip,
            location: `${location.city}, ${location.country}`,
            timestamp: new Date().toISOString()
        });
        
        console.log(`Pengguna dari ${location.city}, ${location.country} mengklik tautan ${shortCode}`);

    } catch (error) {
        console.error('Gagal mendapatkan lokasi dari IP:', error.message);
    }
    
    // Alihkan pengguna ke URL asli
    res.redirect(linkData.originalUrl);
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
