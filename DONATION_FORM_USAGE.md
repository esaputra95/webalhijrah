# 🎨 Cara Menggunakan Public Donation Form

## Opsi 1: Buat Halaman Donasi Publik (Recommended)

### **1. Buat folder dan file baru:**

```bash
mkdir -p src/app/donasi
touch src/app/donasi/page.tsx
```

### **2. Isi file `src/app/donasi/page.tsx`:**

```tsx
// src/app/donasi/page.tsx
import PublicDonationForm from "@/features/donations/PublicDonationForm";

export const metadata = {
  title: "Donasi - Masjid Al-Hijrah",
  description:
    "Salurkan donasi Anda untuk pembangunan masjid dan kegiatan dakwah",
};

export default function DonasiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Donasi untuk Masjid Al-Hijrah
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Berdonasi untuk membantu pembangunan masjid dan kegiatan dakwah.
            Setiap rupiah yang Anda sumbangkan adalah investasi akhirat.
          </p>
        </div>

        {/* Form */}
        <PublicDonationForm />

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Manfaat Donasi Anda
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-3xl mb-2">🕌</div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Pembangunan Masjid
                </h4>
                <p className="text-sm text-gray-600">
                  Membantu renovasi dan pengembangan fasilitas masjid
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">📚</div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Pendidikan Islam
                </h4>
                <p className="text-sm text-gray-600">
                  Mendukung program TPA, kajian, dan pendidikan Islam
                </p>
              </div>
              <div>
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  Kegiatan Sosial
                </h4>
                <p className="text-sm text-gray-600">
                  Membantu program santunan dan kegiatan sosial lainnya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### **3. Akses halaman:**

```
http://localhost:3000/donasi
```

---

## Opsi 2: Embed di Halaman yang Sudah Ada

### **Contoh: Tambahkan ke Homepage**

```tsx
// src/app/page.tsx
import PublicDonationForm from "@/features/donations/PublicDonationForm";

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1>Homepage</h1>

      {/* Section Donasi */}
      <section className="my-12">
        <PublicDonationForm />
      </section>
    </div>
  );
}
```

---

## Opsi 3: Modal/Popup Donasi

### **1. Buat component modal:**

```tsx
// src/components/modals/DonationModal.tsx
"use client";

import { useState } from "react";
import PublicDonationForm from "@/features/donations/PublicDonationForm";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <PublicDonationForm />
      </div>
    </div>
  );
}
```

### **2. Gunakan modal:**

```tsx
"use client";

import { useState } from "react";
import DonationModal from "@/components/modals/DonationModal";

export default function SomePageWithButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Donasi Sekarang
      </button>

      <DonationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
```

---

## Opsi 4: Widget Floating Button

### **1. Buat widget:**

```tsx
// src/components/widgets/FloatingDonationButton.tsx
"use client";

import { useState } from "react";
import DonationModal from "@/components/modals/DonationModal";

export default function FloatingDonationButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
      >
        <span className="text-2xl">💝</span>
        <span className="font-semibold">Donasi</span>
      </button>

      <DonationModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
```

### **2. Tambahkan ke root layout:**

```tsx
// src/app/layout.tsx
import FloatingDonationButton from "@/components/widgets/FloatingDonationButton";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <FloatingDonationButton />
      </body>
    </html>
  );
}
```

---

## 🎨 Customization Options

### **Custom Colors:**

```tsx
<PublicDonationForm />
```

Lalu edit di file `PublicDonationForm.tsx`:

- Ganti `from-blue-600 to-purple-600` dengan warna brand Anda
- Sesuaikan `focus:ring-blue-500` dengan warna yang Anda inginkan

### **Custom Minimum Amount:**

Edit schema di `PublicDonationForm.tsx`:

```tsx
amount: z.coerce.number().min(5000, "Minimal donasi Rp 5.000"); // Ubah di sini
```

### **Custom Success Redirect:**

Edit di `lib/donationService.ts`:

```tsx
finishUrl: finishUrl || `${process.env.NEXT_PUBLIC_APP_URL}/donasi/terima-kasih`,
errorUrl: errorUrl || `${process.env.NEXT_PUBLIC_APP_URL}/donasi/gagal`,
```

---

## 🧪 Testing Flow

1. **Start Development Server:**

   ```bash
   npm run dev
   ```

2. **Open Page:**

   ```
   http://localhost:3000/donasi
   ```

3. **Fill Form:**

   - Nama: Test User
   - Telepon: 081234567890
   - Jumlah: 50000
   - Catatan: Test donasi

4. **Submit:**

   - Klik "Lanjutkan ke Pembayaran"
   - Redirect ke Midtrans Snap
   - Gunakan test card (lihat MIGRATION_DONATION_SUMMARY.md)

5. **Verify:**
   - Check database untuk donation record
   - Check webhook log untuk status update

---

## 📱 Responsive Design

Form sudah responsive by default:

- Mobile: Full width dengan padding
- Tablet: Max width 2xl (768px)
- Desktop: Centered dengan shadow

---

## 🔔 Notifications

Form menggunakan `react-toastify` untuk notifikasi:

- ✅ Success: "Mengarahkan ke halaman pembayaran..."
- ❌ Error: "Gagal memproses donasi. Silakan coba lagi."

Pastikan `ToastContainer` sudah ada di layout:

```tsx
// src/app/layout.tsx
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
```

---

## 🚀 Production Checklist

Before going live:

- [ ] Set `MIDTRANS_IS_PRODUCTION=true`
- [ ] Use production Midtrans keys
- [ ] Configure webhook URL in Midtrans dashboard
- [ ] Test with real transactions (small amount first)
- [ ] Setup error monitoring (Sentry, etc)
- [ ] Setup email notifications for donations
- [ ] Create thank you page
- [ ] Create donation receipt/invoice

---

**Need help?** Check `MIGRATION_DONATION_SUMMARY.md` for complete documentation.
