# Environment Variables untuk Donation dengan Midtrans

Tambahkan variabel berikut ke file `.env` Anda:

```env
# ========================================
# Midtrans Configuration
# ========================================
# Server Key dari Midtrans Dashboard
MIDTRANS_SERVER_KEY=your-server-key-here

# Client Key dari Midtrans Dashboard (optional, untuk frontend)
MIDTRANS_CLIENT_KEY=your-client-key-here

# Production mode (true/false)
# Set false untuk sandbox/testing
MIDTRANS_IS_PRODUCTION=false

# ========================================
# Donation Configuration
# ========================================
# Prefix untuk invoice number donasi
DONATION_CODE_PREFIX=DON

# Base URL aplikasi untuk callback
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Cara Mendapatkan Midtrans Keys:

1. **Login ke Midtrans Dashboard**

   - Sandbox: https://dashboard.sandbox.midtrans.com/
   - Production: https://dashboard.midtrans.com/

2. **Pilih Environment (Sandbox/Production)**

3. **Copy Keys dari Settings > Access Keys:**
   - **Server Key** - untuk backend API
   - **Client Key** - untuk frontend (optional)

## Webhook Configuration di Midtrans:

Setelah deploy, daftarkan webhook URL di Midtrans Dashboard:

**Settings > Configuration > Payment Notification URL:**

```
https://your-domain.com/api/donations/webhook
```

## Testing di Local:

Untuk testing webhook di local development, gunakan tools seperti:

- **ngrok**: `ngrok http 3000`
- **localtunnel**: `lt --port 3000`

Kemudian daftarkan URL tunnel ke Midtrans webhook.

## Contoh .env Lengkap:

```env
DATABASE_URL="mysql://user:password@localhost:3306/database_name"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Midtrans
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Donation
DONATION_CODE_PREFIX=DON
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Security Notes:

⚠️ **PENTING:**

- Jangan pernah commit file `.env` ke repository
- Server Key harus dijaga kerahasiaannya
- Gunakan environment variables di production (Vercel, Railway, dll)
- Validasi signature di webhook untuk keamanan
