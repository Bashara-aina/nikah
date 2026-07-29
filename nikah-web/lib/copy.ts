/**
 * Every guest-facing string on the site. Mirrored in
 * `relevant/10-docs/03-copywriting.md` — change the doc and this file together.
 * `{namaTamu}` and date placeholders are resolved at render time.
 *
 * Voice rules (why the copy reads the way it does):
 *   - Plain sentences. Short ones are allowed to be very short.
 *   - Concrete over lyrical: a place, an object, a time of day. No abstract
 *     nouns doing the emotional work.
 *   - The em dash is rationed to roughly one per page. Indonesian prose runs on
 *     commas and full stops; a page of dashes is the surest tell that nobody
 *     actually wrote it.
 *   - No "bukan X, tapi Y" antithesis, and no three-item lists used for rhythm.
 *   - Formal registers stay formulaic on purpose: the bismillah and the
 *     announcement line are etiquette, not an invitation to be creative.
 *   - First person plural ("kami") throughout, naming Bashara or Hanifah when
 *     only one of them is doing something. Consistent, not third-person drift.
 */

export const copy = {
  loading: {
    hashtag: "#BASHicallyHANI's",
  },

  gate: {
    kicker: "The Wedding of",
    dear: "Kepada yang terkasih,",
    invitation:
      "Ada satu hari yang sudah lama kami tunggu. Kami ingin kamu ada di sana.",
    cta: "Buka Undangan",
    /** Fallback when the link carries no `?to=` name. */
    guestFallback: "Bapak/Ibu/Saudara/i",
  },

  hero: {
    kicker: "We are getting married",
    dateDisplay: "22 · 08 · 2026",
  },

  welcome: {
    bismillah: "Bismillahirrahmanirrahim.",
    lines: [
      "Dengan memohon rahmat dan ridha Allah SWT,",
      "kami bermaksud melangsungkan pernikahan kami.",
    ],
    /** QS. Yasin: 36 — Kemenag translation, verbatim. Do not paraphrase. */
    verse: [
      "“Mahasuci (Allah) yang telah menciptakan semuanya berpasang-pasangan,",
      "baik dari apa yang ditumbuhkan oleh bumi",
      "dan dari diri mereka sendiri,",
      "maupun dari apa yang tidak mereka ketahui.”",
    ],
    verseSource: "QS. Yasin: 36",
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
        title: "Awal Mula",
        body: "Kami pertama kali bertemu di rapat daring, di salah satu program organisasi kampus. Pertemuannya biasa saja. Tapi sejak hari itu, Bashara tidak pernah benar-benar berhenti memikirkan Hanifah.",
        image: "/assets/illustrations/story/story-ch01-meeting.webp",
      },
      {
        title: "Diantar Pulang",
        body: "Setelah itu kami mulai sering bertemu di kampus. Hampir setiap sore Bashara mengantar Hanifah pulang ke kos, naik motor. Jalannya selalu sama, obrolannya tidak pernah habis.",
        image: "/assets/illustrations/story/story-ch02-rides.webp",
      },
      {
        title: "Pindah ke Jakarta",
        body: "Lalu kami sama-sama pindah ke Jakarta. Bekerja di tempat yang sama, kuliah di kelas yang sama. Semakin lama semakin jelas bahwa kami memang searah.",
        image: "/assets/illustrations/story/story-ch03-jakarta.webp",
      },
      {
        title: "Berbeda Kota",
        body: "Tidak lama kemudian Bashara berangkat lebih dulu ke Tokyo, kuliah di SIT. Setahun itu kami menjalani LDR, terpaut dua jam. Tidak mudah. Yang kami punya cuma doa dan janji untuk segera bertemu lagi.",
        image: "/assets/illustrations/story/story-ch04-ldr-tokyo.webp",
      },
      {
        title: "Kabar dari Keio",
        body: "Setahun kemudian kabar itu datang: Hanifah diterima di Keio University, kampus Hiyoshi, Yokohama. Dari Tokyo, Hiyoshi bisa ditempuh sekali naik kereta. Setelah setahun Jakarta–Tokyo, jarak sedekat itu rasanya seperti hadiah.",
        image: "/assets/illustrations/story/story-ch05-keio.webp",
      },
      {
        title: "Memutuskan Menikah",
        body: "Sampai di titik ini, kami memutuskan untuk melangkah lebih pasti. Menikah, lalu melanjutkan studi bersama di Jepang. Perjalanannya baru mau dimulai, dan kami ingin kamu ikut dari awalnya.",
        image: "/assets/illustrations/story/story-ch06-married.webp",
      },
    ],
  },

  event: {
    heading: "Akad & Resepsi",
    dateLine: "Sabtu, 22 Agustus 2026",
    akadLine: "Akad pukul 10.00 WIB",
    untilLine: "Resepsi sampai pukul 13.00 WIB",
    venueName: "Widuri Restaurant",
    venueFloor: "Lantai 2",
    addressLines: [
      "Jl. Ciliwung No. 19, Cihapit,",
      "Kec. Bandung Wetan, Kota Bandung,",
      "Jawa Barat 40114 (dekat Gedung Sate)",
    ],
    ctaMap: "Lihat Peta",
    ctaCalendar: "Simpan ke Kalender",
    dressCodeHeading: "Dress Code",
    dressCodeLine: "Nuansa pastel yang lembut. Pilih yang paling nyaman kamu pakai.",
    notesHeading: "Beberapa Catatan Kecil",
    notes: [
      "Akad mulai pukul 10.00. Mohon hadir sedikit lebih awal.",
      "Mohon maaf, anak-anak belum bisa kami terima di lantai 2.",
      "Ruang salat ada di lantai 1.",
      "Mohon tidak menggunakan flash saat memotret.",
      "Selama prosesi akad, mohon tetap duduk di tempat.",
    ],
    livestreamHeading: "Livestream",
    livestreamLine: "Kalau tidak bisa datang, acaranya kami siarkan langsung.",
    livestreamPending: "Tautannya menyusul, ya.",
    livestreamLabels: {
      youtube: "YouTube",
      zoom: "Zoom (interaktif)",
      instagram: "Instagram",
      facebook: "Facebook",
    },
  },

  rsvp: {
    heading: "Konfirmasi Kehadiran",
    /** Short form for the sticky pill — the full heading overflows it. */
    pill: "Konfirmasi",
    lead: "Beri tahu kami kalau kamu bisa datang, supaya kami bisa menyiapkan tempat untukmu.",
    deadlineTemplate: "Kami tunggu kabarnya sampai",
    deadlineDate: "15 Agustus 2026",
    fields: {
      name: "Nama",
      attendance: "Kehadiran",
      attendanceOptions: ["Hadir", "Tidak Hadir", "Masih Diusahakan"] as const,
      partySize: "Jumlah yang datang",
      partySizeNote:
        "Satu undangan berlaku untuk dua orang. Kalau membawa anak, maksimal empat orang.",
      message: "Titip pesan",
    },
    cta: "Kirim Konfirmasi",
    ctaSent: "Terkirim",
    success: "Terima kasih, kabarmu sudah kami terima.",
    errors: {
      incomplete: "Nama dan pilihan kehadiran belum diisi.",
      unavailable: "Mohon maaf, konfirmasi belum bisa terkirim sekarang. Coba lagi nanti, ya.",
      generic: "Ada kendala saat mengirim. Coba sekali lagi, ya.",
      network: "Jaringannya sedang tersendat. Coba sekali lagi, ya.",
    },
  },

  wishes: {
    heading: "Ucapan & Doa",
    lead: "Tulis doa atau pesan apa pun untuk kami. Semuanya kami baca.",
    fields: { name: "Nama", message: "Ucapan" },
    cta: "Kirim Ucapan",
    ctaSent: "Terkirim",
    openNote: "Ucapan yang masuk bisa dibaca semua tamu.",
    success: "Terima kasih, doamu sudah kami terima.",
    error: "Ucapannya belum terkirim. Coba lagi nanti, ya.",
    empty: "Belum ada ucapan. Kamu bisa jadi yang pertama.",
  },

  faq: {
    heading: "Yang Sering Ditanyakan",
    items: [
      {
        q: "Boleh membawa pasangan atau anak?",
        a: "Satu undangan berlaku untuk dua orang. Kalau membawa anak, maksimal empat orang. Tapi mohon maaf, anak-anak belum bisa kami terima di lantai 2.",
      },
      {
        q: "Ada tempat parkir?",
        a: "Ada, muat sekitar 40 mobil di lokasi.",
      },
      {
        q: "Dress code-nya apa?",
        a: "Nuansa pastel yang lembut.",
      },
      {
        q: "Kalau tidak bisa datang, bagaimana?",
        a: "Acaranya kami siarkan langsung lewat YouTube. Untuk yang ingin ikut lebih dekat, ada Zoom.",
      },
    ],
  },

  closing: {
    lines: ["Terima kasih sudah membaca sampai akhir."],
    emphasis: ["Sampai bertemu di Bandung,", "22 Agustus 2026. 🤍"],
    /** Online variant — nobody is asked to travel, so nothing points to Bandung. */
    emphasisOnline: ["Sampai bertemu di siaran langsung,", "22 Agustus 2026. 🤍"],
    names: "Hanifah & Bashara",
    hashtag: "#BASHicallyHANI's",
  },

  /**
   * Online-invitation copy. NOT yet in `relevant/10-docs/03-copywriting.md` —
   * pending the couple's sign-off, then mirror it there.
   *
   * Rule for this block: it never mentions the venue, the guest list, or a
   * reason. The online invitation is a complete invitation to witness the akad
   * live, so no line in it can be read as a downgrade.
   */
  watch: {
    heading: "Cara Menyaksikan",
    lead: "Akad kami siarkan langsung. Pilih kanal yang paling nyaman buat kamu.",
    /** Split in two so the date stacks deliberately inside the floral arch. */
    dayLine: "Sabtu",
    dateLine: "22 Agustus 2026",
    timeLine: "Akad mulai pukul 10.00 WIB",
    timezoneNote: "Waktunya WIB (GMT+7).",
    pending: "Tautannya menyusul, ya. Kami kirimkan lewat WhatsApp begitu siap.",
    ctaCalendar: "Simpan ke Kalender",
  },

  rsvpOnline: {
    heading: "Konfirmasi Menyaksikan",
    pill: "Konfirmasi",
    lead: "Beri tahu kami kalau kamu berencana menonton, supaya kami tahu siapa saja yang ikut dari jauh.",
    attendance: "Rencana kamu",
    attendanceOptions: ["Menyaksikan Daring", "Masih Diusahakan", "Tidak Hadir"] as const,
    success: "Terima kasih, kabarmu sudah kami terima.",
  },

  faqOnline: {
    heading: "Yang Sering Ditanyakan",
    items: [
      {
        q: "Siarannya bisa ditonton di mana?",
        a: "Di YouTube, Zoom, Instagram, dan Facebook. Tautannya kami pasang di halaman ini begitu siap.",
      },
      {
        q: "Jam berapa mulainya?",
        a: "Akad mulai pukul 10.00 WIB. Sebaiknya bergabung sedikit lebih awal.",
      },
      {
        q: "Kalau tautannya belum muncul?",
        a: "Berarti masih kami siapkan. Halaman ini terisi sendiri begitu tautannya jadi, jadi simpan saja tautan undangan ini.",
      },
      {
        q: "Boleh titip doa?",
        a: "Boleh sekali. Ada kolom ucapan di halaman ini, dan semuanya kami baca.",
      },
    ],
  },

  /** Non-visual strings: section landmarks, icon buttons, dialogs. */
  a11y: {
    loading: "Memuat undangan",
    gate: "Buka undangan",
    hero: "Hanifah dan Bashara",
    welcome: "Sambutan",
    countdown: "Hitung mundur",
    story: "Kisah kami",
    japan: "Rencana kami di Jepang",
    event: "Detail acara",
    watch: "Cara menyaksikan siaran langsung",
    rsvp: "Konfirmasi kehadiran",
    wishes: "Ucapan dan doa",
    faq: "Yang sering ditanyakan",
    closing: "Penutup",
    musicOn: "Nyalakan musik",
    musicOff: "Matikan musik",
    photoZoom: "Perbesar foto",
    photoDialog: "Foto diperbesar",
    photoClose: "Tutup foto",
    photoAlt: "Foto Hanifah dan Bashara",
  },
} as const;

export type Copy = typeof copy;
