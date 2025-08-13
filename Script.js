const BOT_TOKEN = '7378236809:AAGPAtCKvOK3k2_6VxxAjP7eSY4E98F814g';
const CHAT_ID = '6998695047';

const photoInput = document.getElementById('photo');
const preview = document.getElementById('preview');
const form = document.getElementById('form');
const status = document.getElementById('status');

photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      preview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = 'Sending...';

  const name = document.getElementById('name').value.trim();
  const message = document.getElementById('message').value.trim();
  const file = photoInput.files[0];

  if (!name || !message) {
    status.textContent = 'Please fill in all fields.';
    return;
  }

  try {
    if (file) {
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('caption', `🎂 Birthday Wish from ${name}\n\n${message}`);
      formData.append('photo', file);

      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.ok) {
        status.textContent = 'Wish sent with photo ✅';
        form.reset();
        preview.innerHTML = '';
      } else {
        status.textContent = 'Error: ' + (data.description || 'unknown');
      }
    } else {
      const text = `🎂 Birthday Wish for ${name}\n\n${message}`;
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
      });
      const data = await res.json();
      if (data.ok) {
        status.textContent = 'Wish sent ✅';
        form.reset();
        preview.innerHTML = '';
      } else {
        status.textContent = 'Error: ' + (data.description || 'unknown');
      }
    }
  } catch (err) {
    status.textContent = 'Network error — check console.';
    console.error(err);
  }
});