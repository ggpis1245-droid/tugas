/**
 * Seblak Warmen - Menu Data Configuration
 * Data menu interaktif dengan rincian harga, gambar, badge, dan opsi kustomisasi
 */

const MENU_DATA = {
  store: {
    name: "Seblak Warmen",
    tagline: "Pedas Gurih Bikin Nagih • Favorit Anak Sekolah",
    whatsappNumber: "6281313818610", // Ganti dengan nomor WhatsApp admin / bot
    currency: "Rp",
    openHours: "10.00 - 21.00 WIB"
  },

  toppings: [
    { id: "sosis", name: "Sosis Sapi", price: 3000, icon: "🌭", detail: "Potongan sosis sapi gurih" },
    { id: "dumpling", name: "Dumpling Keju", price: 4000, icon: "🥟", detail: "Dumpling lumer kenyal" },
    { id: "telur_puyuh", name: "Telur Puyuh", price: 3000, icon: "🥚", detail: "3 butir telur puyuh gurih" }
  ],

  spicyLevels: [
    { level: 1, label: "Santai", emoji: "🌶️", desc: "Pedas manis ramah pemula" },
    { level: 2, label: "Sedang", emoji: "🌶️🌶️", desc: "Mulai kerasa hangat" },
    { level: 3, label: "Nendang", emoji: "🌶️🌶️🌶️", desc: "Pedas nikmat khas Warmen (Favorit!)", popular: true },
    { level: 4, label: "Huwah!", emoji: "🌶️🌶️🌶️🌶️", desc: "Keringat mulai mengucur" },
    { level: 5, label: "Meledak", emoji: "🌶️🌶️🌶️🌶️🌶️", desc: "Tantangan anak tongkrongan!", extreme: true }
  ],

  categories: [
    { id: "seblak", name: "Seblak", icon: "🍲", desc: "Bisa atur level pedas 1-5 & pilih topping tambahan favoritmu!" },
    { id: "jajanan", name: "Jajanan", icon: "🥟", desc: "Cemilan gurih renyah pas buat nemenin seblak atau santai bareng teman." },
    { id: "minuman", name: "Minuman", icon: "🧃", desc: "Pelepas dahaga dingin segar untuk menetralisir rasa pedas." }
  ],

  items: [
    // Kategori: Seblak
    {
      id: "seblak-komplit",
      category: "seblak",
      name: "Seblak Komplit Warmen",
      price: 18000,
      description: "Paling komplit! Kerupuk aci kenyal, makaroni, sosis, bakso sapi, cuanki lidah, batagor kering, & telur orak-arik kuah gurih pedas khas Warmen.",
      image: "assets/images/seblak.jpg",
      badge: "🔥 Best Seller",
      badgeType: "fire",
      isCustomizable: true
    },
    {
      id: "seblak-original",
      category: "seblak",
      name: "Seblak Original Warmen",
      price: 13000,
      description: "Klasik juara! Kerupuk aci kenyal, makaroni, sawi hijau segar, & telur orak-arik dengan kuah seblak merah gurih meresap ramah kantong pelajar.",
      image: "assets/images/seblak.jpg",
      badge: "💰 Paling Hemat",
      badgeType: "saving",
      isCustomizable: true
    },
    {
      id: "seblak-dumpling",
      category: "seblak",
      name: "Seblak Dumpling Keju",
      price: 20000,
      description: "Spesial dumpling keju lumer, bakso ikan, kerupuk oranye, makaroni, dan bumbu kencur pedas beraroma sedap menggugah selera.",
      image: "assets/images/seblak.jpg",
      badge: "🧀 Favorit Sekolah",
      badgeType: "popular",
      isCustomizable: true
    },

    // Kategori: Jajanan
    {
      id: "risol-mayo",
      category: "jajanan",
      name: "Risol Mayo Meler (Isi 2)",
      price: 8000,
      description: "Kulit risol golden brown super renyah dengan isian smoked beef melimpah, telur rebus, dan saus mayo creamy gurih yang meleleh di mulut.",
      image: "assets/images/risol_mayo.jpg",
      badge: "✨ Gurih & Creamy",
      badgeType: "gold",
      isCustomizable: false
    },
    {
      id: "sosis-goreng",
      category: "jajanan",
      name: "Sosis Goreng Ulir Krispi",
      price: 6000,
      description: "Sosis sapi pilihan digoreng mekar ulir renyah, dibalut saus sambal racikan pedas manis dan mayones gurih. Pas buat ngemil!",
      image: "assets/images/sosis_goreng.jpg",
      badge: "🌭 Cemilan Asik",
      badgeType: "warm",
      isCustomizable: false
    },

    // Kategori: Minuman
    {
      id: "es-teh-manis",
      category: "minuman",
      name: "Es Teh Manis Segar Jumbo",
      price: 4000,
      description: "Teh melati wangi khas nusantara disajikan dingin dengan es batu kristal melimpah. Senjata utama pereda pedas kuah seblak!",
      image: "assets/images/es_teh.jpg",
      badge: "🧊 Pereda Pedas",
      badgeType: "cool",
      isCustomizable: false
    },
    {
      id: "es-jeruk",
      category: "minuman",
      name: "Es Jeruk Peras Segar Asli",
      price: 6000,
      description: "Perasan sari jeruk asli pilihan dengan rasa manis asam segar alami dan es batu dingin, bikin mata melek dan badan segar kembali!",
      image: "assets/images/es_jeruk.jpg",
      badge: "🍊 100% Jeruk Asli",
      badgeType: "citrus",
      isCustomizable: false
    }
  ]
};
