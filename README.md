# 🔧 BengkelStock — Sistem Stok & Gudang Spare Part Bengkel

Aplikasi web dashboard admin modern untuk manajemen inventaris suku cadang, pergerakan barang gudang, dan logistik bengkel otomotif profesional.

Dibangun untuk memenuhi seluruh spesifikasi dan standar penilaian **Ujian Tengah Semester (UTS) Pemrograman Sisi Klien** Fakultas Teknologi Cerdas Universitas Dian Nuswantoro.

> 📄 **Dokumentasi Lengkap Jawaban Teori & Teknis UTS**: Silakan lihat berkas [DOKUMENTASI_UTS.md](file:///c:/Users/SHAFRA/.gemini/antigravity-ide/scratch/bengkel-stock/DOKUMENTASI_UTS.md) untuk uraian komprehensif jawaban Soal 01 sampai Soal 05.

---

## 🎯 Pemetaan Kesesuaian Soal UTS (100% Terpenuhi)

| No. Soal | Topik Pembelajaran | Bobot | Status | Bukti Implementasi di Kode |
|:---:|---|:---:|:---:|---|
| **SOAL 01** | Analisis dan Perencanaan | 10% | ✅ **Lengkap** | Tersedia di [DOKUMENTASI_UTS.md](file:///c:/Users/SHAFRA/.gemini/antigravity-ide/scratch/bengkel-stock/DOKUMENTASI_UTS.md): analisis kasus bengkel, peran React-Tailwind-API, konsep SPA, frontend vs backend, sketsa antarmuka, daftar rute, & matriks hak akses. |
| **SOAL 02** | Antarmuka Modular & Responsif (Atomic Design) | 25% | ✅ **Lengkap** | Struktur direktori `src/components/` terbagi rapi: `atoms/` (Button, Input, Badge, Card), `molecules/` (FormField, StatCard, TableActions), `organisms/` (DataTable, Sidebar, Topbar), dan `templates/` (DashboardLayout, PageHeader). Responsif di seluruh layar. |
| **SOAL 03** | Routing dan Navigasi (React Router DOM) | 25% | ✅ **Lengkap** | Rute lengkap: `/login`, `/`, `/inventory/parts`, `/inventory/parts/add`, `/inventory/parts/:id`, `/inventory/parts/:id/edit`. Parameter dinamis `:id` menggunakan `useParams()`, penanganan ID tidak ditemukan, serta penanganan rute tidak terdaftar (Halaman 404 Not Found). Termasuk direct-link alert stok di sidebar. |
| **SOAL 04** | State dan Pengelolaan Data (CRUD) | 20% | ✅ **Lengkap** | CRUD penuh suku cadang, controlled forms (`useState`), validasi data sebelum simpan, reaktivitas instan tanpa reload, dan persistensi cadangan `localStorage`. |
| **SOAL 05** | Autentikasi dan Hak Akses (Role-Based Access) | 20% | ✅ **Lengkap** | Otentikasi terpusat via `useContext` (`StockContext.jsx`), pemisahan peran Admin (CRUD) vs Viewer (Read-Only), proteksi rute `<ProtectedRoute adminOnly>`, dan tombol demo login 1-klik. |

---

## 🏛️ Arsitektur Atomic Design Component

Seluruh antarmuka dipecah secara sistematis dari elemen terkecil (*Atoms*) hingga struktur halaman (*Pages*):

```
src/components/
├── atoms/                     # Level 1: Komponen Dasar (Murni Presentasional)
│   ├── Button.jsx             # Tombol dengan varian (primary, secondary, outline, danger, ghost) & sizes
│   ├── Input.jsx              # Input field dengan dukungan ikon, error state, dan dark mode
│   ├── Select.jsx             # Custom select dropdown
│   ├── Badge.jsx              # Status badge (Aman, Menipis, Habis) & Transaction badge (Masuk, Keluar)
│   ├── CircularProgress.jsx   # Circular indicator gauge untuk KPI cards (terinspirasi screenshot)
│   ├── ProgressBar.jsx        # Linear progress bar dengan varian gradien
│   ├── Card.jsx               # Soft card container dengan rounded corners dan subtle shadow
│   ├── Skeleton.jsx           # Placeholder loading pulse
│   ├── Avatar.jsx             # User initial / image avatar
│   ├── IconButton.jsx         # Tombol aksi berbasis ikon (edit, delete, eye, adjust)
│   └── index.js               # Barrel export
│
├── molecules/                 # Level 2: Gabungan Atoms yang Berfungsi Bersama
│   ├── StatCard.jsx           # Card + CircularProgress + Metric + Trend Badge
│   ├── SearchBar.jsx          # Input + Search Icon + Dropdown Hasil Pencarian Cepat
│   ├── FormField.jsx          # Label + Required Mark + Input/Select + Helper/Error Message
│   ├── ActivityProgressItem.jsx # Label + Dot Color Indicator + Count Value + ProgressBar
│   ├── TableActions.jsx       # Kelompok IconButton (View, Edit, Quick Adjust, Delete)
│   ├── Breadcrumb.jsx         # Navigasi rekam jejak halaman aktif
│   ├── ConfirmDialog.jsx      # Dialog peringatan dengan Icon + Pesan + Tombol Aksi
│   ├── EmptyState.jsx         # Ilustrasi kosong + Pesan informatif + Tombol Call to Action
│   └── index.js               # Barrel export
│
├── organisms/                 # Level 3: Blok Fungsional Lengkap & Mandiri
│   ├── Sidebar.jsx            # Fixed & collapsible sidebar dengan menu bertingkat & warehouse status
│   ├── Topbar.jsx             # Sticky header dengan Breadcrumb, SearchBar, Notifikasi, & Profil Admin
│   ├── Modal.jsx              # Dialog modal dengan transisi animasi halus GSAP
│   ├── DataTable.jsx          # Tabel dinamis lengkap dengan header, baris, status, & empty state
│   ├── StockMovementChart.jsx # AreaChart Recharts arus Barang Masuk vs Keluar + Ekspor CSV
│   ├── StockStatusGauge.jsx   # Semi-donut gauge kesehatan stok (Aman, Menipis, Habis)
│   ├── WarehouseActivityCard.jsx # Kartu performa aktivitas gudang bulanan
│   ├── LowStockAlertCard.jsx  # Kartu pemantauan stok menipis dengan tombol pintas restock
│   └── index.js               # Barrel export
│
├── templates/                 # Level 4: Tata Letak Struktur Halaman
│   ├── DashboardLayout.jsx    # Layout induk (Sidebar + Topbar + Content Area Container + Footer)
│   ├── PageHeader.jsx         # Header halaman (Judul + Subtitle + Kelompok Tombol Aksi)
│   ├── FilterToolbar.jsx      # Bilah pencarian, filter kategori, status, dan sorting
│   └── index.js               # Barrel export
│
└── pages/                     # Level 5: Instance Nyata Halaman Aplikasi
    ├── Dashboard.jsx          # Panel utama monitoring & analitik visual
    ├── auth/
    │   └── Login.jsx          # Form login dengan 1-click Demo Admin & Demo Viewer
    ├── inventory/
    │   ├── SpareParts.jsx     # CRUD katalog suku cadang, filter status, & ekspor CSV
    │   ├── SparePartDetail.jsx # Halaman rincian detail dengan parameter dinamis (:id)
    │   ├── SparePartFormPage.jsx # Halaman formulir tambah (/add) & ubah (/edit)
    │   ├── Categories.jsx     # CRUD pengelompokan suku cadang & counter unit
    │   └── Locations.jsx      # CRUD pemetaan rak gudang & monitor kapasitas
    ├── transactions/
    │   ├── IncomingStock.jsx  # Pencatatan restock barang masuk (otomatis menambah stok)
    │   └── OutgoingStock.jsx  # Pencatatan pemakaian servis (otomatis mengurangi stok)
    ├── management/
    │   ├── Suppliers.jsx      # Buku kontak distributor resmi & tombol WhatsApp
    │   └── Reports.jsx        # Laporan keuangan stok, fast moving, & clean print view
    └── system/
        ├── Settings.jsx       # Profil bengkel, tema dark mode, backup/restore JSON, reset data
        └── NotFound.jsx       # Penanganan rute URL tidak ditemukan (Error 404)
```

---

## 🚀 Fitur Unggulan Sistem

1. **Dashboard Interaktif**:
   - 5 KPI Cards dengan *circular gauges* (*Total Spare Part*, *Total Stok*, *Stok Menipis*, *Stok Habis*, *Supplier*).
   - Area chart Recharts 12 bulan (Januari - Desember) membandingkan pergerakan *Barang Masuk* vs *Barang Keluar*.
   - Semi-donut chart rasio kesehatan ketersediaan suku cadang.
   - Tabel ringkasan suku cadang terbaru dengan aksi langsung.
2. **Katalog & Inventaris Lengkap**:
   - Filter instan berdasarkan Kategori, Status Stok (*Aman / Menipis / Habis*), dan Lokasi Rak.
   - Penyesuaian stok cepat (*Quick Stock Adjustment*) untuk koreksi fisik opname.
   - Ekspor katalog lengkap ke format **CSV**.
3. **Logika Transaksi Otomatis**:
   - **Barang Masuk**: Memperbarui dan menambah stok fisik secara otomatis.
   - **Barang Keluar**: Memvalidasi ketersediaan stok fisik (mencegah minus), mengurangi stok, dan mencatat nomor polisi kendaraan pelanggan.
   - Fitur pembatalan (*rollback*) transaksi aman.
4. **Distributor & WhatsApp Direct Link**:
   - Kontak PIC supplier lengkap dengan tombol langsung membuka WhatsApp pesan order stok.
5. **Valuasi Keuangan & Print View**:
   - Menghitung modal pembelian (Aset Gudang), proyeksi omset jual, dan estimasi margin laba kotor.
   - Analisis *Fast-Moving Parts* (suku cadang terlaris).
   - Format cetak rapi (*Print View*) yang bersih untuk pelaporan fisik.
6. **Utilitas & Cadangan Data**:
   - Penyimpanan `localStorage` persisten tanpa backend.
   - Unduh dan impor cadangan database dalam format file JSON.
   - Reset instan ke data demo awal pabrik.

---

## 🛠️ Stack Teknologi

- **Runtime & Compiler**: [Bun](https://bun.sh/) (1.4.2)
- **Build Tool**: [Vite](https://vite.dev/) (8.3)
- **Frontend Framework**: [React](https://react.dev/) (19.3)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (3.4)
- **Animasi UI**: [GSAP](https://gsap.com/)
- **Navigasi Halaman**: [React Router DOM](https://reactrouter.com/) (7.18)
- **Visualisasi Grafik**: [Recharts](https://recharts.org/) (3.10)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Penyimpanan**: `localStorage` (Kunci: `bengkel_stock_app_v2`)

---

## 💻 Cara Menjalankan

Aplikasi berada di direktori:
```
C:\Users\SHAFRA\.gemini\antigravity-ide\scratch\bengkel-stock
```

### Menggunakan Bun (Sesuai Permintaan):
```bash
# Masuk ke folder proyek
cd C:\Users\SHAFRA\.gemini\antigravity-ide\scratch\bengkel-stock

# Jalankan server pengembangan
bun run dev

# Jalankan pengecekan build produksi
bun run build
```

Akses aplikasi melalui peramban: **`http://localhost:5173/`**
