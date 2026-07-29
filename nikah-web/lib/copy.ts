/**
 * Locked copy — verbatim from `relevant/10-docs/03-copywriting.md`.
 * Do not edit wording here without updating the source doc first.
 * `{namaTamu}` and date placeholders are resolved at render time.
 */

export const copy = {
  loading: {
    hashtag: "#BASHicallyHANI's",
  },

  gate: {
    kicker: "The Wedding of",
    dear: "Kepada yang terkasih,",
    invitation:
      "Dengan penuh syukur, kami mengundangmu untuk menjadi bagian dari hari bahagia kami.",
    cta: "Buka Undangan",
  },

  hero: {
    kicker: "We are getting married",
    dateDisplay: "22 · 08 · 2026",
  },

  welcome: {
    bismillah: "Bismillahirrahmanirrahim.",
    lines: [
      "Dengan memohon rahmat dan ridha Allah SWT,",
      "kami bermaksud menyelenggarakan pernikahan kami.",
      "Sebuah awal baru yang kami mulai dengan doa,",
      "dan kami harap turut kamu rayakan bersama.",
    ],
    verse: [
      "“Maha Suci (Allah) yang telah menciptakan semuanya berpasang-pasangan,",
      "baik dari apa yang ditumbuhkan oleh bumi",
      "dan dari diri mereka sendiri,",
      "maupun dari apa yang tidak mereka ketahui.”",
    ],
    verseSource: "— QS. Yasin: 36",
  },

  countdown: {
    heading: "Menghitung hari menuju",
    date: "22 Agustus 2026",
    units: { days: "Hari", hours: "Jam", minutes: "Menit" },
  },

  story: {
    heading: "Kisah Kami",
    chapters: [
      {
        title: "Awal yang Sederhana",
        body: "Berawal dari satu pertemuan daring, di sebuah program organisasi kampus. Layar yang sederhana, namun cukup untuk membuat hati berlabuh.",
        image: "/assets/illustrations/story/story-ch01-meeting.webp",
      },
      {
        title: "Antar Pulang, Hati Semakin Dekat",
        body: "Lalu interaksi tumbuh di kampus — sapa yang makin sering, tawa yang makin akrab. Makin dekat karena sering diantar pulang dengan motor ke kosan, membagi angin sore dan cerita yang tidak terasa habis.",
        image: "/assets/illustrations/story/story-ch02-rides.webp",
      },
      {
        title: "Bersama di Jakarta",
        body: "Cerita berlanjut ke Jakarta — bekerja bersama, menimba ilmu di bangku yang sama, dan menemukan bahwa kami adalah partner yang searah.",
        image: "/assets/illustrations/story/story-ch03-jakarta.webp",
      },
      {
        title: "LDR, Sampai Tokyo",
        body: "Tak lama kemudian, langkah kami harus berbeda kota. Bashara harus sekolah lebih dulu di SIT, Tokyo — sebuah LDR yang tidak mudah, namun kami jaga dengan doa dan janji untuk segera bertemu kembali.",
        image: "/assets/illustrations/story/story-ch04-ldr-tokyo.webp",
      },
      {
        title: "Setahun Kemudian, Hanifah Diterima di Keio",
        body: "Setahun berselang, kabar baik itu datang — Hanifah diterima di Keio University, Hiyoshi (Yokohama). Hiyoshi dan Tokyo bersebelahan — bukan lagi dua kota yang jauh, tapi satu area yang sama, dan jarak yang bisa kami jembatani setiap hari.",
        image: "/assets/illustrations/story/story-ch05-keio.webp",
      },
      {
        title: "Memutuskan Menikah, Studi Bersama",
        body: "Di titik ini, kami memilih melangkah lebih pasti: menikah, dan menempuh studi bersama setelahnya di Jepang. Perjalanan ini, baru saja dimulai — dan kami ingin kamu menjadi bagian dari awal yang baru.",
        image: "/assets/illustrations/story/story-ch06-married.webp",
      },
    ],
  },

  event: {
    heading: "Akad & Resepsi",
    dateLine: "Sabtu, 22 Agustus 2026",
    akadLine: "Akad pukul 10.00 WIB",
    untilLine: "Acara berlangsung hingga 13.00 WIB",
    venueName: "Widuri Restaurant",
    venueFloor: "Lantai 2",
    addressLines: [
      "Jl. Ciliwung No.19, Cihapit,",
      "Kec. Bandung Wetan, Kota Bandung,",
      "Jawa Barat 40114 (dekat Gedung Sate)",
    ],
    ctaMap: "Lihat Peta",
    ctaCalendar: "Simpan ke Kalender",
    dressCodeHeading: "Dress Code",
    dressCodeLine: "Mari hadir dengan nuansa warna pastel yang lembut. 🤍",
    notesHeading: "Catatan untuk Tamu",
    notes: [
      "Akad dimulai pukul 10.00 — mohon hadir tepat waktu.",
      "Mohon tidak membawa anak-anak ke lantai 2.",
      "Ruang salat tersedia di lantai 1.",
      "Mohon untuk tidak menggunakan flash kamera.",
      "Mohon untuk tetap duduk selama prosesi akad berlangsung.",
    ],
    livestreamHeading: "Livestream",
    livestreamLine: "Bagi yang berhalangan hadir, ikuti momen kami secara langsung:",
    livestreamLabels: {
      youtube: "YouTube",
      zoom: "Zoom (interaktif)",
      instagram: "Instagram",
      facebook: "Facebook",
    },
  },

  rsvp: {
    heading: "Konfirmasi Kehadiran",
    lead: "Doa dan kehadiranmu adalah hadiah terindah bagi kami.",
    deadlineTemplate: "Mohon konfirmasi sebelum",
    deadlineDate: "15 Agustus 2026",
    fields: {
      name: "Nama",
      attendance: "Kehadiran",
      attendanceOptions: ["Hadir", "Tidak Hadir", "Masih Diusahakan"] as const,
      partySize: "Jumlah hadir",
      partySizeNote:
        "1 undangan berlaku untuk 2 orang; bila membawa anak, maksimal 4 orang",
      message: "Ucapan singkat",
    },
    cta: "Kirim Konfirmasi",
  },

  wishes: {
    heading: "Ucapan & Doa",
    lead: "Tinggalkan secarik doa dan harapan untuk kami — setiap kata akan kami simpan dengan hati.",
    fields: { name: "Nama", message: "Ucapan" },
    cta: "Kirim Ucapan",
    openNote: "(ucapan tampil terbuka untuk semua tamu)",
  },

  faq: {
    heading: "Pertanyaan yang Sering Diajukan",
    items: [
      {
        q: "Apakah saya boleh membawa pasangan/anak?",
        a: "Satu undangan berlaku untuk dua orang. Bila membawa anak, jumlah maksimal adalah empat orang. Mohon dicatat, anak-anak tidak diperkenankan berada di lantai 2.",
      },
      {
        q: "Apakah tersedia tempat parkir?",
        a: "Tersedia parkir untuk ± 40 mobil di lokasi.",
      },
      {
        q: "Apa dress code-nya?",
        a: "Nuansa warna pastel yang lembut.",
      },
      {
        q: "Saya tidak bisa hadir, bagaimana mengikuti acaranya?",
        a: "Acara disiarkan langsung melalui YouTube, dan Zoom untuk interaksi.",
      },
    ],
  },

  closing: {
    lines: ["Dengan penuh kebahagiaan,", "kami menanti kehadiranmu."],
    emphasis: ["Tak sabar bertemu denganmu", "di hari bahagia kami. 🤍"],
    names: "Hanifah & Bashara",
    hashtag: "#BASHicallyHANI's",
  },
} as const;

export type Copy = typeof copy;
