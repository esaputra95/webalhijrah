Manual Book - Sistem Informasi Kegiatan Kantor Gubernur Provinsi Riau
Daftar Isi
Pendahuluan
Memulai Aplikasi
Halaman Dashboard
Login ke Panel Admin
Menu Layanan
Menu Pengguna
Pengajuan Kegiatan
Update Status Pengajuan
Menu Jadwal Kegiatan

1. Pendahuluan
   Sistem Informasi Kegiatan adalah aplikasi berbasis web untuk mengelola pengajuan ruangan dan kegiatan di Kantor Gubernur Provinsi Riau. Aplikasi ini memiliki dua tampilan utama:

Dashboard Publik: Menampilkan jadwal ruangan dan agenda pimpinan
Panel Admin: Untuk mengelola layanan, pengguna, dan pengajuan kegiatan

2. Memulai Aplikasi
   Langkah-langkah:
   Buka browser (Chrome, Firefox, Safari, atau Edge)
   Akses URL aplikasi (misal: http://localhost:3000)
   Halaman dashboard publik akan muncul secara otomatis

3. Halaman Dashboard
   Halaman dashboard adalah halaman utama yang dapat dilihat oleh siapa saja tanpa perlu login.

Komponen Dashboard:
Header
Logo aplikasi
Judul: PUSAT INFORMASI KEGIATAN
Sub judul: Kantor Gubernur Provinsi Riau
Jam digital real-time
Jadwal Ruangan
Menampilkan informasi peminjaman ruangan yang sedang berlangsung:

Nama kegiatan
PIC (Person in Charge / Penanggung Jawab)
Divisi/Organisasi
Lokasi ruangan
Waktu mulai dan selesai
Agenda Pimpinan
Menampilkan jadwal kegiatan pimpinan:

Nama agenda/kegiatan
Nama pejabat
Jabatan
Waktu pelaksanaan
NOTE

Data pada dashboard diperbarui secara otomatis menggunakan sistem carousel yang berganti setiap beberapa detik.

4. Login ke Panel Admin
   Langkah-langkah:
   Pada halaman dashboard, klik icon home (🏠) yang terletak di pojok kanan atas bagian "Agenda Pimpinan"
   Anda akan diarahkan ke halaman login
   Masukkan kredensial:
   Email: Email yang terdaftar di sistem
   Password: Password akun Anda
   Klik tombol Login
   Jika berhasil, Anda akan masuk ke panel admin
   IMPORTANT

Pastikan Anda menggunakan akun yang sudah terdaftar. Hubungi administrator jika Anda belum memiliki akun.

5. Menu Layanan
   Menu layanan digunakan untuk mengelola ruangan dan layanan yang tersedia.

- Jenis Layanan:
  Ruangan: Ruang rapat, aula, gedung, dll
  Layanan: Konsumsi, sound system, proyektor, dll

- Menambahkan Layanan/Ruangan:
  Klik menu Master → Layanan
  Klik tombol + Layanan di pojok kanan atas
  Isi formulir:
  Nama: Nama layanan atau ruangan
  Tipe Layanan: Pilih "Layanan" atau "Ruangan"
  Deskripsi: Keterangan detail
  Klik tombol Simpan

- Mengedit Layanan/Ruangan:
  Pada tabel layanan, klik icon Edit (✏️) pada baris yang ingin diubah
  Ubah data yang diperlukan
  Klik Simpan

- Menghapus Layanan/Ruangan:
  Klik icon Hapus (🗑️) pada baris yang ingin dihapus
  Konfirmasi penghapusan
  Data akan terhapus permanen

6. Menu Pengguna
   Menu pengguna digunakan untuk mengelola user dan data pimpinan.

- Jenis Jabatan:
  Admin: Administrator sistem
  Approver (Kepala Biro Umum): Pemimpin yang memiliki izin untuk menyetujui pengajuan
  Staff (Admin Kepala Bagian Rumah Tangga): Karyawan yang dapat membuat pengajuan
  Kabag Umum : Input peminjaman ruangan

- Menambahkan Pengguna:
  Klik menu Master → Pengguna
  Klik tombol + Pengguna
  Isi formulir:
  Nama: Nama lengkap pengguna
  Email: Alamat email (akan digunakan untuk login)
  Password: Password untuk login (hanya saat membuat user baru)
  Jabatan: Pilih salah satu dari daftar jabatan
  Klik Simpan

- Mengedit Pengguna:
  Klik icon Edit pada baris pengguna
  Ubah data yang diperlukan
  Klik Simpan

- Menghapus Pengguna:
  Klik icon Hapus pada baris pengguna
  Konfirmasi penghapusan
  Data akan terhapus permanen

7. Pengajuan Kegiatan
   Pengajuan kegiatan adalah proses utama untuk mengajukan peminjaman ruangan dan layanan.

- Langkah-langkah Pengajuan:
  Step 1: Informasi Kegiatan
  Klik menu Pengajuan → Pengajuan Kegiatan
  Klik tombol + Pengajuan Kegiatan
  Isi formulir Step 1:
  Waktu Mulai: Pilih tanggal dan jam mulai kegiatan
  Waktu Selesai: Pilih tanggal dan jam selesai kegiatan
  Nama Kegiatan: Nama/judul kegiatan
  Ruangan/Gedung: Pilih ruangan yang dibutuhkan
  Status Pengajuan: Otomatis "PENDING"
  Klik tombol Lanjut
  CAUTION

Sistem akan mengecek ketersediaan ruangan. Jika ruangan sudah dipesan pada waktu yang sama, pengajuan tidak dapat dilanjutkan.

Step 2: Penanggung Jawab
Pilih atau tambahkan informasi penanggung jawab kegiatan:
Nama Penanggung Jawab
Jabatan
Kontak
Organisasi/Divisi
Klik Lanjut

Step 3: Layanan yang Dibutuhkan
Tambahkan layanan yang diperlukan:
Pilih jenis layanan dari dropdown
Masukkan jumlah yang dibutuhkan
Klik Tambah untuk menambahkan lebih banyak layanan
Klik Lanjut

Step 4: Upload Dokumen
Upload surat atau dokumen pengajuan:
Klik area upload atau drag & drop file
Format yang didukung: PDF, JPG, PNG
Ukuran maksimal: 5MB
Klik Simpan

- Melihat Daftar Pengajuan:
  Klik menu Pengajuan → Pengajuan Kegiatan
  Tabel akan menampilkan semua pengajuan dengan informasi:
  Nama kegiatan
  Ruangan
  Waktu
  Status (PENDING, APPROVED, FINISH, CANCELLED)
  Aksi yang tersedia

8. Update Status Pengajuan
   Proses update status dilakukan untuk menyetujui atau menyelesaikan pengajuan.

Status Pengajuan:
PENDING: Menunggu persetujuan
APPROVED: Disetujui
FINISH: Selesai
CANCELLED: Dibatalkan

- Langkah-langkah Update Status:

Approve Pengajuan
Pada tabel pengajuan, klik icon Ubah Status
Pilih status APPROVE
Input jumlah layanan yang di-ACC:
Tabel akan menampilkan semua layanan yang diminta
Kolom Permintaan: Jumlah yang diminta
Kolom Setujui: Input jumlah yang disetujui
Anda dapat menyetujui sebagian atau seluruh permintaan
Klik Simpan
TIP

Jumlah yang disetujui bisa berbeda dari yang diminta. Misalnya, diminta 100 kursi, bisa disetujui hanya 50 kursi.

Selesai (Finish)
Klik icon Ubah Status
Pilih status SELESAI
Upload bukti atau foto kegiatan:
Klik area upload
Pilih foto-foto dokumentasi kegiatan
Bisa upload multiple images
Klik Simpan
IMPORTANT

Upload foto kegiatan sangat penting sebagai dokumentasi dan bukti bahwa kegiatan telah dilaksanakan.

9. Menu Jadwal Kegiatan
   Menu jadwal kegiatan menampilkan informasi kegiatan pimpinan dalam bentuk kalender atau tabel.

- Mengakses Jadwal:
  Klik menu Pengajuan → Jadwal Kegiatan
  Halaman akan menampilkan daftar kegiatan pimpinan
  Informasi yang Ditampilkan:
  Nama kegiatan/agenda
  Nama pejabat
  Jabatan
  Waktu pelaksanaan
  Lokasi

- Menambahkan Jadwal:
  Klik tombol + Tambah Jadwal
  Isi informasi kegiatan pimpinan
  Klik Simpan

- Melihat Laporan Pengajuan:
  Klik menu Laporan → Laporan Pengajuan
  Halaman akan menampilkan daftar pengajuan dengan informasi:
  Nama PIC
  Organisasi
  Phone
  Status
  Waktu Mulai
  Waktu Selesai
  Service

- Melihat Laporan Jadwal Kegiatan:
  Klik menu Laporan → Laporan Jadwal Kegiatan
  Halaman akan menampilkan daftar jadwal kegiatan dengan informasi:
  Nama
  Waktu Mulai
  Waktu Selesai

Tips & Troubleshooting
Tips Penggunaan:
Selalu logout setelah selesai menggunakan aplikasi
Pastikan waktu mulai dan selesai kegiatan sudah benar sebelum submit
Upload dokumen dengan ukuran yang wajar untuk mempercepat proses
Gunakan browser versi terbaru untuk performa optimal
Troubleshooting:
Q: Ruangan tidak tersedia padahal kosong di jadwal?
A: Mungkin ada pengajuan yang sedang pending. Cek status pengajuan atau hubungi admin.

Q: Tidak bisa login?
A: Pastikan email dan password benar. Cek CAPS LOCK.

Q: Upload dokumen gagal?
A: Periksa ukuran file (max 5MB) dan format (PDF/JPG/PNG).

Q: Perubahan tidak tersimpan?
A: Pastikan internet stabil. Coba refresh halaman dan ulangi.

Kontak Support
Untuk bantuan lebih lanjut, hubungi:

Email: [email support]
Telepon: [nomor telepon]
Kantor: Bagian IT Kantor Gubernur Provinsi Riau
Manual Book versi 1.0 - © 2025 Kantor Gubernur Provinsi Riau
