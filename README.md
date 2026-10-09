# 🌶️ Seblak Warmen - Interactive E-Menu

Aplikasi Web E-Menu interaktif dan modern untuk UMKM **Seblak Warmen**, dirancang dengan konsep *mobile-first*, kekinian, dan ramah untuk anak sekolah/pelajar dengan dominasi warna merah-oranye yang menggugah selera.

---

## ✨ Fitur Unggulan

1. **Navigasi Kategori (Sticky Tabs)**
   - Pilihan kategori: **Seblak**, **Jajanan**, dan **Minuman**.
   - Indikator jumlah menu dan transisi filter yang halus.
   - Kolom pencarian menu instan.

2. **Daftar Menu & Kustomisasi Interaktif**
   - **Seblak**:
     - Pilihan **Level Pedas (1 - 5)** dengan kartu visual interaktif:
       - Level 1: Santai (🌶️)
       - Level 2: Sedang (🌶️🌶️)
       - Level 3: Nendang (🌶️🌶️🌶️) *[Favorit Pelajar]*
       - Level 4: Huwah! (🌶️🌶️🌶️🌶️)
       - Level 5: Meledak (🌶️🌶️🌶️🌶️🌶️) *[Tantangan Ekstrem]*
     - Checkbox **Topping Tambahan**:
       - 🌭 Sosis Sapi (+Rp 3.000)
       - 🥟 Dumpling Keju (+Rp 4.000)
       - 🥚 Telur Puyuh (+Rp 3.000)
     - Catatan khusus per porsi & perhitungan harga otomatis secara real-time.
   - **Jajanan**: Risol Mayo Meler, Sosis Goreng Ulir Krispi.
   - **Minuman**: Es Teh Manis Segar Jumbo, Es Jeruk Peras Asli.

3. **Keranjang Belanja Melayang (Floating Cart)**
   - Ikon melayang di bagian bawah dengan counter item dan total harga.
   - Animasi mikro saat menu dimasukkan ke keranjang.
   - Saat diklik, membuka *Bottom Sheet Drawer* yang menampilkan rincian menu, pengaturan jumlah (+ / -), dan tombol hapus.

4. **Form Checkout Terintegrasi**
   - **Nomor Meja** (*Wajib Diisi*) dilengkapi tombol *Quick Select* (Meja 1 - 5 & Lesehan) serta validasi visual.
   - **Nama Pemesan** (*Opsional*).
   - **Tipe Pesanan**: *Makan Sini (Dine In)* atau *Bungkus (Take Away)*.
   - **Metode Pembayaran**: *Cash* atau *QRIS*.
     - Jika Cash: Tampil instruksi `"Siapkan uang pas ya kak 😊"`.
     - Jika QRIS: Tampil instruksi `"Tolong kirimkan bukti QRIS ya kak 📲"` dan tombol popup QRIS Mockup.

5. **Integrasi WhatsApp Otomatis**
   - Menghasilkan format pesan pesanan rapi dengan rincian per item, level pedas, topping, nomor meja, dan instruksi pembayaran.
   - Tombol **"Pesan Sekarang via WhatsApp"** otomatis membuka `wa.me` ke nomor bot/admin.
   - Tersedia tombol alternatif **"Salin Format Pesanan"** untuk menyalin ke clipboard.

---

## 📁 Struktur Direktori

```text
web seblak/
├── index.html            # Halaman utama aplikasi e-menu
├── server.js             # Local web server ringan (Node.js)
├── README.md             # Dokumentasi & panduan
├── css/
│   └── style.css         # Styling mobile-first, palet merah & oranye, animasi
├── js/
│   ├── menu-data.js      # Data menu, level pedas, topping, dan konfigurasi toko
│   └── app.js            # State keranjang, customizer, validasi form, dan logic WA
└── assets/
    └── images/           # Gambar menu autentik berkualitas tinggi
        ├── seblak.jpg
        ├── risol_mayo.jpg
        ├── sosis_goreng.jpg
        ├── es_teh.jpg
        └── es_jeruk.jpg
```

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Node.js (Rekomendasi)
Buka terminal di folder project lalu jalankan:
```bash
node server.js
```
Buka browser di: `http://localhost:3000`

### Cara 2: Buka Langsung di Browser
Cukup klik dua kali file [index.html](file:///c:/Users/nafis/Documents/web%20seblak/index.html) atau drag ke browser Chrome / Edge di HP maupun laptop Anda.

---

## ⚙️ Mengganti Nomor WhatsApp Tujuan

Untuk mengubah nomor WhatsApp toko/admin:
1. Buka file [js/menu-data.js](file:///c:/Users/nafis/Documents/web%20seblak/js/menu-data.js).
2. Ubah nilai `whatsappNumber` pada baris ke-9:
   ```javascript
   whatsappNumber: "6281234567890", // Ganti dengan nomor WhatsApp Anda (format kode negara tanpa tanda '+')
   ```
