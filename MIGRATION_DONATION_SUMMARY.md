# 📋 Migrasi Donation dari Laravel ke Next.js - Summary

## ✅ Complete Migration Checklist

### 1. **Dependencies Installed** ✅

- ✅ `midtrans-client` - SDK untuk integrasi Midtrans

### 2. **Database Schema** ✅

- ✅ Model `neo_donation_public` sudah ada di Prisma schema
- ✅ Enum `neo_donation_public_status` (pending, settled, expired, failed)

### 3. **Backend Layer (API)** ✅

#### **lib/midtrans.ts** - Midtrans Configuration

- ✅ `getMidtransConfig()` - Load config dari environment
- ✅ `createSnapClient()` - Instance Midtrans Snap
- ✅ `createCoreApiClient()` - Instance Core API

#### **lib/donationService.ts** - Business Logic

- ✅ `generateInvoiceNumber()` - Generate invoice unik
- ✅ `prepareMidtransTransaction()` - Format data untuk Midtrans
- ✅ `createInvoiceDonation()` - Create invoice + Midtrans payment
- ✅ `checkDonationByOrderId()` - Check donation exists
- ✅ `updateStatusByWebhook()` - Update status dari webhook
- ✅ `mapMidtransStatus()` - Convert Midtrans status ke DB status

#### **API Routes**

- ✅ `POST /api/donations` - Create donation with Midtrans payment
- ✅ `GET /api/donations` - List donations (existing)
- ✅ `POST /api/donations/webhook` - Midtrans webhook handler
- ✅ `GET /api/donations/webhook` - Webhook status check

### 4. **Frontend Layer** ✅

#### **Hooks**

- ✅ `useDonations()` - Fetch donations list
- ✅ `useCreateDonation()` - Create donation + auto redirect to payment
- ✅ `useUpdateDonation()` - Update donation
- ✅ `useDeleteDonation()` - Delete donation
- ✅ `useCheckDonationStatus()` - Check status by invoice

#### **Components**

- ✅ `DonationForm.tsx` - Admin form (existing)
- ✅ `PublicDonationForm.tsx` - Public form untuk donatur

### 5. **Types & Validation** ✅

- ✅ `types/midtrans-client.d.ts` - TypeScript types untuk Midtrans
- ✅ `types/donationSchema.ts` - Zod schemas (existing)

---

## 🔧 Setup Instructions

### **1. Environment Variables**

Tambahkan ke `.env`:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# Donation Configuration
DONATION_CODE_PREFIX=DON
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Cara dapat Midtrans Keys:** Lihat `MIDTRANS_ENV_SETUP.md`

### **2. Webhook Configuration**

Setelah deploy, daftarkan webhook URL di Midtrans Dashboard:

**Settings > Configuration > Payment Notification URL:**

```
https://your-domain.com/api/donations/webhook
```

**Untuk Local Testing:** Gunakan ngrok atau localtunnel

---

## 🧪 Testing Guide

### **Test 1: Create Donation (Manual)**

```bash
curl -X POST http://localhost:3000/api/donations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Donatur",
    "amount": 50000,
    "phone_number": "081234567890",
    "note": "Donasi untuk masjid"
  }'
```

**Expected Response:**

```json
{
  "status": true,
  "message": "Transaction created successfully",
  "data": {
    "donation": { ... },
    "redirect_url": "https://app.sandbox.midtrans.com/snap/v3/...",
    "token": "..."
  }
}
```

### **Test 2: Webhook Simulation**

```bash
curl -X POST http://localhost:3000/api/donations/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "DON-1702188000000-ABC123",
    "status_code": "200",
    "gross_amount": "50000.00",
    "transaction_status": "settlement",
    "signature_key": "...",
    "fraud_status": "accept"
  }'
```

### **Test 3: Frontend Form**

1. Import component:

```tsx
import PublicDonationForm from "@/features/donations/PublicDonationForm";
```

2. Gunakan di halaman:

```tsx
export default function DonasiPage() {
  return (
    <div className="container mx-auto py-8">
      <PublicDonationForm />
    </div>
  );
}
```

3. Test flow:
   - Isi form donasi
   - Klik "Lanjutkan ke Pembayaran"
   - Redirect ke Midtrans Snap
   - Lakukan pembayaran (gunakan test card)
   - Webhook otomatis update status

---

## 🧪 Midtrans Test Cards (Sandbox)

| Card Number         | Type       | Status           |
| ------------------- | ---------- | ---------------- |
| 4811 1111 1111 1114 | Visa       | Success          |
| 5211 1111 1111 1117 | Mastercard | Success          |
| 4911 1111 1111 1113 | Visa       | Challenge by FDS |
| 4411 1111 1111 1118 | Visa       | Deny             |

**CVV:** 123  
**Expiry:** Any future date  
**OTP/3DS:** 112233

---

## 📊 Comparison: Laravel vs Next.js

| Feature        | Laravel (Old)                  | Next.js (New)                 |
| -------------- | ------------------------------ | ----------------------------- |
| **Route**      | `Route::post('donations')`     | `POST /api/donations`         |
| **Service**    | `DonationPublicService.php`    | `lib/donationService.ts`      |
| **Repository** | `DonationPublicRepository.php` | Prisma Client                 |
| **Config**     | `config/midtrans.php`          | `lib/midtrans.ts`             |
| **Validation** | Laravel Request                | Zod Schema                    |
| **Webhook**    | `Route::post('webhook')`       | `POST /api/donations/webhook` |

---

## 🎯 Key Differences from Laravel

### **Invoice Generation**

- **Laravel:** `config('constant.code_donation') . uniqid()`
- **Next.js:** `DON-{timestamp}-{random}` (lebih unique)

### **Transaction Preparation**

- **Laravel:** Array associative PHP
- **Next.js:** TypeScript interfaces dengan type safety

### **Error Handling**

- **Laravel:** Try-catch dengan return array
- **Next.js:** Try-catch dengan typed responses

### **Payment Flow**

- **Sama:** Create invoice → Snap transaction → Redirect → Webhook

---

## 🔐 Security Features

✅ **Signature Verification** - Webhook signature validation  
✅ **Environment Variables** - Sensitive keys di .env  
✅ **Input Validation** - Zod schema validation  
✅ **SQL Injection Protection** - Prisma ORM  
✅ **HTTPS Only** - Production webhook requires HTTPS

---

## 📝 Next Steps

1. **Configure Environment Variables**

   - Add Midtrans keys to `.env`
   - Set production mode when ready

2. **Test Payment Flow**

   - Use PublicDonationForm
   - Test with sandbox cards
   - Verify webhook updates

3. **Deploy & Configure Webhook**

   - Deploy to production
   - Register webhook URL in Midtrans
   - Test with real transactions

4. **Optional Enhancements**
   - Email notification setelah donasi
   - Download invoice PDF
   - Donation history untuk donatur
   - Admin dashboard untuk monitor donations

---

## 🐛 Troubleshooting

### "MIDTRANS_SERVER_KEY is not configured"

→ Pastikan `.env` berisi `MIDTRANS_SERVER_KEY`

### "Invalid signature from Midtrans webhook"

→ Check `MIDTRANS_SERVER_KEY` sama dengan di dashboard

### "Donation not found"

→ Pastikan `order_id` di webhook sesuai dengan `invoice_number` di DB

### Payment redirect tidak jalan

→ Check console untuk error, pastikan `redirect_url` ada di response

---

## 📚 References

- [Midtrans Snap Documentation](https://docs.midtrans.com/en/snap/overview)
- [Midtrans Webhook](https://docs.midtrans.com/en/after-payment/http-notification)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**Migration Status:** ✅ **COMPLETE**

Semua fitur dari Laravel `DonationPublicService` telah berhasil dimigrasikan ke Next.js!
