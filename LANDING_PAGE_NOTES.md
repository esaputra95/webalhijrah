# 🕌 Landing Page References

## 🎨 Design Sources

Referensi desain diambil dari: **https://markazalhijrah.or.id/**

### Key Elements Implemented:

1. **Hero Section**

   - **Headline:** "Investasi Akhirat Jangan Pernah Abaikan"
   - **Sub Headline:** "Siapkan Donasi Terbaik Markaz Al Hijrah Nusantara..."
   - **Style:** Full screen background dengan overlay gelap untuk keterbacaan text.

2. **Tentang Kami Section**

   - Mengambil narasi tentang "Pusat Halaqoh Ilmiah Islam Terbesar".
   - Slogan: "Dari Kaum Muslimin, Untuk Kaum Muslimin, dan Milik Kaum Muslimin".

3. **Program Section**

   - Menampilkan program utama: Pembangunan Masjid, Pendidikan, dan Infaq.
   - Design cards dengan icon modern.

4. **Images**
   - **Hero:** Generated image "Majestic modern mosque at sunset".
   - **About:** Generated image "Interior of modern mosque".
   - Lokasi file: `public/images/`

## 🛠️ Components

- **Navbar:** Custom transparent-to-white navbar for landing page interaction.
- **Scroll Effects:** Navbar changes style on scroll.
- **Animations:** Fade in up animations for hero elements.

## 📝 How to Edit

Edit file `src/app/page.tsx` untuk mengubah konten text dan gambar.

```tsx
// Ganti gambar hero
<Image src="/images/hero-mosque.png" ... />

// Ganti text headline
<h1>Investasi Akhirat...</h1>
```

## 🚀 Status

✅ **Live at Root URL:** http://localhost:3000/
✅ **Mobile Responsive:** Yes
✅ **Integrated with Donation:** Yes (Link to /donasi)
