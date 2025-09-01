document.getElementById('createBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput');
    const originalUrl = urlInput.value;
    const resultDiv = document.getElementById('result');
    const trackingLink = document.getElementById('trackingLink');
    const message = document.getElementById('message');

    if (!originalUrl) {
        alert('URL tidak boleh kosong!');
        return;
    }

    try {
        const response = await fetch('/buat-tautan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: originalUrl }),
        });

        const data = await response.json();

        if (data.trackingUrl) {
            trackingLink.href = data.trackingUrl;
            trackingLink.textContent = data.trackingUrl;
            message.textContent = 'Bagikan tautan ini ke orang-orang yang ingin Anda lacak kliknya!';
            resultDiv.style.display = 'block';
        } else {
            alert('Gagal membuat tautan: ' + data.error);
        }
    } catch (error) {
        console.error('Ada masalah dengan fetch:', error);
        alert('Terjadi kesalahan. Coba lagi nanti.');
    }
});
