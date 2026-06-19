/**
 * All narrative copy in Bahasa Indonesia.
 * Mirrors docs/03-copywriting.md.
 * Components import from here — never hardcode strings.
 *
 * ⚠️ Story chapters 2–6 reference illustration files that have not been
 * generated yet (story-motor, story-jakarta, story-ldr, story-keio,
 * story-married). See docs/TODO_ASSETS.md. Site still renders (alt text
 * shown), but the Story section will be visually empty until those PNGs
 * exist in public/assets/illustrations/.
 */

import { config } from "./config";

export const copy = {
  loading: {
    hashtag: config.couple.hashtag,
  },

  gate: {
    title: "The Wedding of",
    couple: `${config.couple.groom} & ${config.couple.bride}`,
    lead: "Kepada yang terkasih,",
    body:
      "Dengan penuh syukur, kami mengundangmu untuk menjadi bagian dari hari bahagia kami.",
    cta: "Buka Undangan",
  },

  hero: {
    eyebrow: "We are getting married",
    groom: config.couple.groom,
    bride: config.couple.bride,
    ampersand: "&",
    dateLine: "22 · 08 · 2026",
    hashtag: config.couple.hashtag,
  },

  welcome: {
    greeting: "Bismillahirrahmanirrahim.",
    body: [
      "Dengan memohon rahmat dan ridha Allah SWT,",
      "kami bermaksud menyelenggarakan pernikahan kami.",
      "Sebuah awal baru yang kami mulai dengan doa,",
      "dan kami harap turut kamu rayakan bersama.",
    ],
    quran: {
      text:
        "“Maha Suci (Allah) yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka sendiri, maupun dari apa yang tidak mereka ketahui.”",
      cite: "— QS. Yasin: 36",
    },
  },

  countdown: {
    eyebrow: "Menghitung hari menuju",
    date: "22 Agustus 2026",
    units: { hari: "Hari", jam: "Jam", menit: "Menit", detik: "Detik" },
  },

  story: {
    title: "Kisah Kami",
    chapters: [
      {
        key: "pertemuan",
        title: "Awal yang Sederhana",
        body: [
          "Berawal dari satu pertemuan daring, di sebuah program organisasi kampus.",
          "Layar yang sederhana, namun cukup untuk membuat hati berlabuh.",
        ],
        illustration: "/assets/illustrations/story-meeting.png",
        illustrationAlt: "Ilustrasi pertemuan daring di organisasi kampus",
      },
      {
        key: "kedekatan",
        title: "Antar Pulang, Hati Semakin Dekat",
        body: [
          "Lalu interaksi tumbuh di kampus — sapa yang makin sering, tawa yang makin akrab.",
          "Makin dekat karena sering diantar pulang dengan motor ke kosan,",
          "membagi angin sore dan cerita yang tidak terasa habis.",
        ],
        illustration: "/assets/illustrations/story-motor.png",
        illustrationAlt: "Ilustrasi antar pulang ke kosan dengan motor",
      },
      {
        key: "jakarta",
        title: "Bersama di Jakarta",
        body: [
          "Cerita berlanjut ke Jakarta — bekerja bersama, menimba ilmu di bangku yang sama,",
          "dan menemukan bahwa kami adalah partner yang searah.",
        ],
        illustration: "/assets/illustrations/story-jakarta.png",
        illustrationAlt: "Ilustrasi bekerja bersama di Jakarta",
      },
      {
        key: "ldr",
        title: "LDR, Sampai Tokyo",
        body: [
          "Tak lama kemudian, langkah kami harus berbeda kota.",
          "Bashara harus sekolah lebih dulu di SIT, Tokyo — sebuah LDR yang tidak mudah,",
          "namun kami jaga dengan doa dan janji untuk segera bertemu lagi.",
        ],
        illustration: "/assets/illustrations/story-ldr.png",
        illustrationAlt: "Ilustrasi long distance — Bashara di Tokyo",
      },
      {
        key: "keio",
        title: "Setahun Kemudian, Hanifah Diterima di Keio",
        body: [
          "Setahun berselang, kabar baik itu datang — Hanifah diterima di Keio University, Hiyoshi (Yokohama).",
          "Hiyoshi dan Tokyo bersebelahan — bukan lagi dua kota yang jauh,",
          "tapi satu area yang sama, dan jarak yang bisa kami jembatani setiap hari.",
        ],
        illustration: "/assets/illustrations/story-keio.png",
        illustrationAlt: "Ilustrasi Hanifah diterima di Keio, Hiyoshi",
      },
      {
        key: "menikah",
        title: "Memutuskan Menikah, Studi Bersama",
        body: [
          "Di titik ini, kami memilih melangkah lebih pasti: menikah,",
          "dan menempuh studi bersama setelahnya di Jepang.",
          "Perjalanan ini, baru saja dimulai — dan kami ingin kamu menjadi bagian dari awal yang baru.",
        ],
        illustration: "/assets/illustrations/story-married.png",
        illustrationAlt: "Ilustrasi cincin dan dua tangan — keputusan untuk menikah",
      },
    ],
  },

  japan: {
    title: "Mimpi Kami",
    body: [
      "Langkah kecil yang kami rintis sejak lama kini tiba di satu titik yang sama:",
      "Hanifah akan melanjutkan studi di Keio University, Hiyoshi — Yokohama.",
      "Bashara akan melanjutkan studi di SIT, Tokyo.",
      "Tokyo dan Yokohama bersebelahan — kami akan tinggal bersama, belajar, dan membangun rumah, di satu area metropolitan yang sama.",
    ],
  },

  event: {
    title: "Akad & Resepsi",
    date: "Sabtu, 22 Agustus 2026",
    akadStart: "Akad pukul 10.00 WIB",
    duration: "Acara berlangsung hingga 13.00 WIB",
    venueLabel: "Widuri Restaurant",
    venueFloor: "Lantai 2",
    address: config.venue.address,
    landmark: `(${config.venue.landmark})`,
    ctaMap: "Lihat Peta",
    ctaCalendar: "Simpan ke Kalender",
    dressCodeTitle: "Dress Code",
    dressCodeBody:
      "Mari hadir dengan nuansa warna pastel yang lembut. 🤍",
    etiquetteTitle: "Catatan untuk Tamu",
    livestreamTitle: "Livestream",
    livestreamIntro:
      "Bagi yang berhalangan hadir, ikuti momen kami secara langsung:",
    livestreamLabels: {
      youtube: "YouTube",
      zoom: "Zoom (interaktif)",
      instagram: "Instagram",
      facebook: "Facebook",
    } as const,
  },

  rsvp: {
    title: "Konfirmasi Kehadiran",
    body:
      "Doa dan kehadiranmu adalah hadiah terindah bagi kami.",
    deadline: (date: string): string =>
      `Mohon konfirmasi sebelum ${date}.`,
    fields: {
      nama: "Nama",
      kehadiran: "Kehadiran",
      jumlah: "Jumlah hadir",
      pesan: "Ucapan singkat",
      submit: "Kirim Konfirmasi",
      hadir: "Hadir",
      tidak: "Tidak Hadir",
      diusahakan: "Masih Diusahakan",
      hintJumlah: "1 undangan berlaku untuk 2 orang; bila membawa anak, maksimal 4 orang",
    },
  },

  gallery: {
    title: "Kenangan Kami",
    body:
      "Sebagian kecil dari cerita yang sudah kami lalui — disatukan seperti lembar-lembar scrapbook, untuk kamu yang ingin mengintip.",
    empty: "Galeri akan segera hadir.",
  },

  wishes: {
    title: "Ucapan & Doa",
    body:
      "Tinggalkan secarik doa dan harapan untuk kami — setiap kata akan kami simpan dengan hati.",
    fields: { nama: "Nama", pesan: "Ucapan", submit: "Kirim Ucapan" },
    publicNote: "(ucapan tampil terbuka untuk semua tamu)",
    empty: "Jadilah yang pertama memberi ucapan 💌",
  },

  gift: {
    title: "Tanda Kasih",
    body:
      "Kehadiran dan doamu sudah lebih dari cukup membahagiakan kami. Namun bila ada yang ingin menyampaikan tanda kasih, kami menerimanya dengan penuh syukur dan terima kasih.",
    copyBank: "Salin",
    copyDone: "Tersalin ✓",
    revealHint: "Ketuk untuk melihat",
    hideHint: "Ketuk untuk menyembunyikan",
    section: {
      bankId: "Transfer (Indonesia)",
      bankJp: "Transfer (Jepang / Japan)",
      address: "Kirim Hadiah (alamat)",
      addressId: "Alamat di Indonesia",
      addressJp: "Alamat di Jepang (Japan)",
      faq: "Pertanyaan yang Sering Diajukan",
    },
    faq: [
      {
        q: "Apakah saya boleh membawa pasangan/anak?",
        a:
          "Satu undangan berlaku untuk dua orang. Bila membawa anak, jumlah maksimal adalah empat orang. Mohon dicatat, anak-anak tidak diperkenankan berada di lantai 2.",
      },
      {
        q: "Apakah tersedia tempat parkir?",
        a: "Tersedia parkir untuk ± 40 mobil di lokasi.",
      },
      { q: "Apa dress code-nya?", a: "Nuansa warna pastel yang lembut." },
      {
        q: "Saya tidak bisa hadir, bagaimana mengikuti acaranya?",
        a: "Acara disiarkan langsung melalui YouTube, dan Zoom untuk interaksi.",
      },
      {
        q: "Bagaimana cara mengirim tanda kasih?",
        a: 'Tersedia transfer bank (Indonesia & Jepang) maupun pengiriman hadiah ke alamat yang tertera pada bagian "Tanda Kasih".',
      },
    ],
  },

  closing: {
    title: "Dengan penuh kebahagiaan,",
    body: "kami menanti kehadiranmu.",
    bold: "Tak sabar bertemu denganmu di hari bahagia kami.",
    couple: `${config.couple.groom} & ${config.couple.bride}`,
    hashtag: config.couple.hashtag,
  },
} as const;

export type Copy = typeof copy;