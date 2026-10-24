// Public, illustrative data only. No application imports or API requests.
export const lifecycle = ["OPEN", "ASSIGNED", "ON_THE_WAY", "IN_PROGRESS", "COMPLETED"]
export const lifecycleLabels = ["Talep açık", "Teknisyen atandı", "Ekip yolda", "Servis başladı", "İş tamamlandı"]
export const simulationFrames = [
  { at: 0, stage: 0, phase: "ready", priority: "NORMAL", event: "Sistem hazır · Servis sinyali bekleniyor", clock: "02:00", progress: 1 },
  { at: 500, stage: 0, phase: "request", priority: "NORMAL", event: "Yeni müşteri talebi", clock: "02:00", progress: 1 },
  { at: 1200, stage: 0, phase: "priority", priority: "HIGH", event: "Öncelik HIGH", clock: "02:00", progress: 1 },
  { at: 1800, stage: 0, phase: "tracking", event: "SLA takibi başladı", clock: "01:54", progress: .95 },
  { at: 2500, stage: 0, phase: "matched", event: "Teknisyen seçimi · Ahmet K.", clock: "01:42", progress: .85 },
  { at: 3200, stage: 0, phase: "connected", event: "Servis ve teknisyen bağlantısı kuruldu", clock: "01:35", progress: .8 },
  { at: 3800, stage: 1, phase: "assigned", event: "Servis teknisyene atandı", clock: "01:24", progress: .7 },
  { at: 4800, stage: 2, phase: "travelling", event: "Teknisyen yola çıktı", clock: "01:11", progress: .62 },
  { at: 5800, stage: 3, phase: "working", event: "Saha çalışması başladı", clock: "00:48", progress: .4 },
  { at: 7000, stage: 4, phase: "completed", event: "Servis SLA içinde tamamlandı", clock: "00:24", progress: .2 },
  { at: 7800, stage: 5, phase: "measured", event: "Tamamlanan servis · 12 → 13", clock: "00:24", progress: .2 }
]
export const storyChapters = [
  { stage: 0, code: "01 / TALEP", title: "Her talep\nbir sinyal.", text: "Müşteriden gelen ihtiyaç; bir servis kaydına, bir önceliğe ve takip edilebilir bir işe dönüşür.", note: "MÜŞTERİ → SERVİS TALEBİ" },
  { stage: 1, code: "02 / ATAMA", title: "Ekip\nhareket eder.", text: "Yönetici servisi teknisyene atar. Müşteri bilgisi, talep ve işin bağlamı aynı kayıt üzerinden sahaya taşınır.", note: "SERVİS → TEKNİSYEN" },
  { stage: 3, code: "03 / SAHA", title: "Zaman\nişler.", text: "Yolda ve işlemde durumları servis akışını görünür kılar. SLA, randevu ve müşteri geçmişi işin bağlamında kalır.", note: "ON THE WAY → IN PROGRESS" },
  { stage: 4, code: "04 / TAMAMLAMA", title: "İş\ntamamlanır.", text: "İşlem notu, malzemeler ve servis dosyaları bir tamamlanma raporunda buluşur. Bir sonraki ziyaret geçmişsiz başlamaz.", note: "İŞLEM → RAPOR → MÜŞTERİ GEÇMİŞİ" },
  { stage: 5, code: "05 / ÖLÇÜM", title: "Veri\nkalır.", text: "Tamamlanan servisler, SLA ve servis geliri operasyon özetinde karşılık bulur. Aynı kayda bu kez bütünden bakarsınız.", note: "SERVİS KAYDI → OPERASYON ÖZETİ" }
]
export const scenarios = [
  { label: "Teknik servis", code: "TECHNICAL", request: "Cihaz arıza kontrolü", customer: "Atlas Üretim", priority: "Yüksek", technician: "Ahmet K.", initials: "AK", sla: "02:00", note: "Arıza giderildi, çalışma testi yapıldı.", attachment: "İşlem fotoğrafı / JPG", text: "Arıza talebini önceki servis geçmişiyle değerlendirin. Önceliği belirleyin, teknisyeni atayın ve müdahaleyi kayıtla kapatın." },
  { label: "Elektrik", code: "ELECTRICAL", request: "Elektrik panosu kontrolü", customer: "Kuzey İş Merkezi", priority: "Acil", technician: "Selin A.", initials: "SA", sla: "01:00", note: "Pano bağlantıları kontrol edildi, parça değiştirildi.", attachment: "Pano fotoğrafı / JPG", text: "Saha kontrolünü, kullanılan parçaları ve işlem fotoğraflarını aynı servis kaydına bağlayın. Müdahalenin izi kaybolmasın." },
  { label: "HVAC", code: "HVAC", request: "Klima periyodik bakımı", customer: "Merkez Plaza", priority: "Normal", technician: "Mert T.", initials: "MT", sla: "04:00", note: "Filtre temizliği ve performans kontrolü yapıldı.", attachment: "Bakım raporu / PDF", text: "Müşteri ve randevu bilgisiyle ziyareti planlayın. Yapılan bakım, bir sonraki servis için referans olsun." },
  { label: "Bakım", code: "MAINTENANCE", request: "Mekanik sistem bakımı", customer: "Doğu Tesis", priority: "Normal", technician: "Ece Y.", initials: "EY", sla: "08:00", note: "Mekanik kontroller tamamlandı, işlem kaydedildi.", attachment: "Kontrol raporu / PDF", text: "Planlı işi SLA ve randevuyla takip edin. Sorumlu, durum ve tamamlanma bilgisi aynı operasyon akışında kalsın." }
]
