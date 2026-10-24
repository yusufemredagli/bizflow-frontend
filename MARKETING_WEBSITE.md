# BizFlow — Soft Industrial × Fluid Operations

## 1. Creative direction

Industrial karakter korunarak ince çizgili teknik poster görünümü, katmanlı ve dokunsal ürün sahnesine dönüştürüldü. Ortak metafor **Operations in Motion**: talep gelir, ekip bağlanır, zaman işler, iş tamamlanır ve veri ölçüme dönüşür. Büyük editorial type ve küçük sistem metadatası karşıtlığı sürüyor; ana servis metinleri ve kontroller büyütüldü.

Graphite yapı, porcelain alan, blue aksiyon/atama, lime sağlıklı akış ve orange SLA riski anlamında kullanılıyor. Yeni framework, animation dependency, harita API'si, sahte referans veya gerçek müşteri sonucu iddiası eklenmedi.

## 2. Hero

Açılış artık ortak yuvarlatılmış sahnenin içinde. “Her talep / bir sinyal.” headline'ı mask reveal ile açılıyor. Müşteri, servis, teknisyen ve SLA nesneleri farklı katmanlarda; küçük açılar, boyut farkları ve sabit yumuşak gölgeler derinlik sağlıyor. Simülasyon veya scroll odağı başladığında headline geri çekiliyor ve aynı operasyon yüzeyi öne çıkıyor.

Hero ayrı bir screenshot/laptop mockup değildir. Her önemli nesne servis lifecycle'ından türetilmiştir. Hareketler bir yükleme ekranı arkasında bilgi saklamaz.

## 3. Rounded surface system

- Küçük kontroller/form alanları: yaklaşık 12–15px.
- Servis/teknisyen/kayıt nesneleri: 18–28px.
- Büyük product/system yüzeyleri: 28–38px.
- Navigasyon, CTA ve status kontrolleri: capsule/pill.

Floating header, sayfa kenarlarından ayrılır; hafif blur, ince border ve sabit gölge kullanır. Mobil menü koyu, kompakt ve yuvarlatılmış bir paneldir. Header ve sayfa route mantığı korunur.

## 4. Motion language

CONNECT / TRANSITION / FLOW / COUNT / FOCUS / RESOLVE sözlüğü korunur. Ana hareket nesnenin servis akışı içindeki dönüşümüdür; mask reveal, bağlantı çizimi, hafif node odağı ve veri ayrışması bunu destekler. Infinite data pulse yalnızca kullanıcı simülasyonu oynatırken çalışır; tamamlanmada sakinleşir.

TactileSurface.jsx, yalnızca hover + pointer:fine ve reduced-motion kapalı cihazlarda çalışır. Magnetic hedeflerin toplam hareketi en fazla **4px**, servis iç yüzeyinin tilt'i en fazla yaklaşık **1.5°** olur. Seçilmiş nesnelerde VIEW FLOW / EXPLORE SLA cursor label'ı gösterilir; native cursor saklanmaz. Pointer işlemleri requestAnimationFrame ile birleştirilir; DOM ölçümü frame başına tek hedef içindir. Leave, scroll, blur ve unmount'ta konumlar/etiket temizlenir.

## 5. Live service simulation

Normal, görünür ve kesintisiz oynatım zaman çizelgesi:

| Zaman | Demo olayı |
| --- | --- |
| 0.0s | Yeni talep |
| 0.8s | Öncelik HIGH |
| 1.4s | SLA başladı |
| 2.2s | Teknisyen seçenekleri inceleniyor |
| 3.0s | Ahmet seçildi |
| 3.8s | ASSIGNED, bağlantı aktif |
| 4.8s | ON_THE_WAY |
| 6.0s | IN_PROGRESS |
| 7.5s | COMPLETED |
| 8.0s | Temsili KPI 12 → 13 |

Zaman çizelgesi `operationsData.js` içindedir. SystemExperience, performance.now üzerinden geçen aktif zamanı ölçerek yalnızca bir sonraki geçiş için timeout planlar. Timer birikimi yoktur. Duraklatma/görünmezlik sırasında süre saklanır; yeniden başlatma önceki çalışmanın süresini taşımadan sıfırlar. Çalışma tamamlanınca bekleyen timer kalmaz. Sekme gizlenmesi, görünüm dışına çıkma, reduced-motion ve unmount temizliği korunur.

Bu, yerel bir ürün açıklama demosudur. Gerçek teknisyen uygunluğu, otomatik eşleştirme veya backend işlemi yapılmaz. BUSY / EN ROUTE / AVAILABLE ifadeleri açıkça temsili ekip durumlarıdır. SLA zamanı da sıkıştırılmış demo zamanıdır.

## 6. Scroll scrub

Desktop sahnesi sticky kalır. Görünürlük IntersectionObserver ile izlenir. Sahne görünürken passive scroll listener yalnızca bir requestAnimationFrame planlar; callback tek journey bounding rect okur. Sürekli ilerleme CSS değişkenine yazılır; arka plan ve SLA halkası bu değeri kullanır. React state yalnızca lifecycle/chapter sınırlarında değiştirilir.

Scroll ileri/geri hareketi OPEN → ASSIGNED → ON_THE_WAY → IN_PROGRESS → COMPLETED → ölçüm görünümünü ilerletir/geri sarar. Yeni scroll hareketi simülasyon kontrolünü devralır. Manuel status seçimi ayrı mod kullanır; bu modda SLA kendi seçili durumunun değerini gösterir. Resize, scroll listener ve bekleyen frame unmount'ta temizlenir.

## 7. Morph transitions

Servis nesnesi aynı DOM/bileşen içinde kalır. Önce talep, sonra field operation, completion summary ve son olarak büyük “13 / +1” ölçüm nesnesi olur. Başka bir kartı yanına açıp eski kartı kaldırma modeli kullanılmaz. CSS transform, içerik değişimi ve opacity ile kontrollü dönüşüm yapılır; kırılgan DOM taşıma veya FLIP kütüphanesi eklenmedi.

## 8. Dispatch visualization

Üç teknisyen seçeneği floating nesnelerle temsil edilir. Ahmet seçildiğinde node vurgulanır; ASSIGNED anında ghost bağlantı aktif yola dönüşür. Available → Assigned etiketi güncellenir. Bu temsili senaryo, mevcut yönetici atama akışını anlatır; canlı konum veya uygunluk verisi iddiası değildir.

## 9. SLA visualization

SLA halkası büyütüldü; kalın temporal arc, dış tikler ve başlangıç/ara zaman işaretleri var. İşaretler sektörün SLA başlangıç değerine göre hesaplanır. Scroll, kalan yayı sürekli azaltır; risk state'i lime'dan kontrollü orange'a geçer. Saat metni lifecycle durumunu, yay ise scroll/simülasyon ilerlemesini temsil eder; gerçek canlı SLA ölçümü değildir.

## 10. Analytics transformation

Aynı completion nesnesi küçülür ve ana sayaca dönüşür. Servis ücreti, tamamlanma süresi ve SLA sonucu içindeki alanlardan ayrışan üç ölçüm nesnesi olarak yer değiştirir. Tüm değerler demo olarak işaretlidir. Sonraki analitik sahnede dönem seçimi, sonuç sinyali ve örnek teknisyen iş dağılımı korunur. İş dağılımı sayıları temsili tamamlanan toplamıyla tutarlıdır.

## 11. Diğer public sayfalar

Features'taki ProductAnatomy bir BIZFLOW CORE etrafına bağlanan modül haritasıdır. SERVICE/CUSTOMER/TEAM/SLA/FILES/AUDIT/ANALYTICS hover, focus veya click ile aynı product scene'i değiştirir.

Solutions, solda sektör navigasyonu ve sağda ortak rounded scene kullanır. Teknik servis/elektrik/HVAC/bakım seçimi talebi, müşteriyi, önceliği, teknisyeni, SLA'yı, tamamlanma notunu ve dosya tipini değiştirir. Sekmeler Left/Right/Up/Down, Home/End ve standart klavye aktivasyonunu destekler.

About'ta telefon/WhatsApp/Excel/not defteri sözcükleri, ayrı bilgi parçalarından ortak BizFlow kaydına bağlanan manifesto motifi olarak kullanılır. Bunlar entegrasyon veya otomatik veri aktarımı iddiası değildir; uydurma şirket hikâyesi yoktur.

Contact'ta mevcut canlı talep özeti rounded ticket oldu. Gerekli bilgiler dolunca REQUEST READY görünür; bu bir gönderim başarısı değildir. Mailto handler'ı değişmedi: ysufemre66@gmail.com adresine ziyaretçinin e-posta uygulamasında taslak açılır. Son gönderimi ziyaretçi yapar. Form verileri kalıcı kaydedilmez.

## 12. Mobile redesign

780px altında sticky ve spatial SVG yollar kaldırılır. Hero başlığı, kontroller, stacked müşteri/servis/SLA/teknisyen nesneleri ve normal chapter akışı şeklinde yeniden dizilir. Kontroller ürün sahnesinden önce gelir; simülasyonu başlatmak için uzun içeriğin sonuna inmek gerekmez.

Status kapsülleri iki sütuna, modül haritası tactile modül seçimine, sektör navigasyonu iki sütuna ve senaryo tek kolona dönüşür. Completion/insight alanları mobilde çevreye uçmaz; aynı kartın içinde okunabilir şekilde alt alta kalır. Cursor companion ve magnetic hareket coarse pointer cihazlarda kapalıdır. 320px için ek type/padding kuralları vardır.

## 13. Accessibility ve reduced motion

Semantic main/section, tek h1, skip link, focus-visible, form label/validation, status metinleri, aria-pressed düğmeler ve tab/tabpanel ilişkileri korunur. Pointer efektleri işlevin koşulu değildir. Uzun canlı ticket mesajı klavyeyle odaklanıp kaydırılabilir.

Reduced-motion açıkken CSS animation/transition kapanır; magnetic/tilt/cursor companion çalışmaz. “Akışı başlat” doğrudan son demo durumunu gösterir. Scroll scrub kapanır; normal içerik ve manuel status/chapter/modül/sektör seçimleri çalışır. Hareket açıkken değişen tercih timer'ı durdurur. Route değişiminde 360ms editorial mask-in vardır; full-screen spinner eklenmedi. BrowserRouter back/forward ve scroll-to-top akışı değiştirilmedi.

## 14. Dosyalar

Değişenler: SystemExperience.jsx, OperationsCanvas.jsx, operationsData.js, ProductAnatomy.jsx, SectorExplorer.jsx, PublicLayout.jsx, PublicSections.jsx, pages/public/About.jsx, pages/public/Contact.jsx ve public.css.

Yeni: TactileSurface.jsx.

Home/Features/Solutions kompozisyonları ortak component ve stiller üzerinden yeni görsel dili alır. Public dışı kaynak dosyaları değiştirilmedi. Login visual bridge bu revizyona eklenmedi; login dosyası tamamen korunuyor.

## 15. Kontroller

- npm run build: başarılı; 61 modül.
- npm run lint: exit 0. Yeni public warning/error yok; mevcut application hook/effect ve ToastContext uyarıları sürüyor.
- Beş public route React server renderer ile render edildi. Tek h1, geçerli public linkler, header/main/footer ve login bağlantısı kontrol edildi.
- On simülasyon karesi ve dört sektörün servis/müşteri/teknisyen/rapor/dosya verileri render edilerek doğrulandı. Completion-to-insight içerikleri kontrol edildi.
- İzole fake-clock kontrolünde gerçek timer effect kodu çalıştırıldı: tam zaman çizelgesi, terminalde timer kalmaması, pause/resume, restart sırasında eski sürenin taşınmaması ve unmount sonrası güncelleme olmaması geçti. Reduced-motion ve observer bulunmaması için statik alternatif de geçti. Bu test bir tarayıcı etkileşim testi değildir.
- CSS cascade kontrolleri 1440, 1280, 1024, 768, 390 ve 320px için geçti: desktop sticky / mobile relative, 38px / 28px sahne radius'u, desktop nesne yerleşimi / mobile flex akışı, navigasyon disclosure breakpoint'i ve scenario kolonları doğrulandı. Bu kontrol gerçek DOM geometrisi veya overflow ölçmez.
- Bu oturumda kullanılabilir tarayıcı bağlantısı yok. Gerçek görsel kompozisyon, altı genişlikte overflow, cursor/scroll etkileşimi ve frame rate browser üzerinden ölçülmedi. Görsel QA ve 60fps sonucu doğrulanmış değildir.

## 16. Application koruması

Public dışındaki tüm src dosyaları işlem öncesi kopyalarıyla byte düzeyinde karşılaştırıldı: aynı. App.jsx, dokuz protected route ve OWNER/MANAGER/TECHNICIAN rol listeleri, JWT/auth, login business logic, Dashboard, servis/müşteri/çalışan ekranları, My Jobs, Settings, API ve index.css değişmedi. Secure attachment erişim mantığına veya backend'e dokunulmadı. Yeni paket eklenmedi.

Deployment yapılmadı. Yerel inceleme: frontend klasöründe npm run dev. Mevcut production API environment ve BrowserRouter fallback gereksinimleri geçerlidir.

# Motion / interaction revizyonu — 22 Ekim 2026

Mevcut public renkler, tipografi, kompozisyon, metinler ve route yapısı korunarak hareket katmanı geliştirildi. Yeni dependency eklenmedi.

| Alan | Uygulama ve kontrol |
| --- | --- |
| 1. Hero motion | Başlık maskesi, servis kartı yerleşmesi, teknisyen gecikmesi, SLA/bağlantı çizimi ve hazır göstergesi. Yeni intro zaman çizelgesi 1,2 saniyede tamamlanır; izole animasyon testi geçti. |
| 2. Service simulation | Mevcut 0–8 saniyelik servis yaşam döngüsü korundu. Tekrar başlatma, pause/resume, terminal timer temizliği ve unmount kontrolleri geçti. Yeni modal yok. |
| 3. Status rail | Aktif kapsül büyümesi, ilerleyen bağlantı ve hareketli nokta; mevcut status seçimleri korunur. |
| 4. SLA | Simülasyonda tik hareketi, ring/değer/risk geçişleri ve tamamlanmada sakinleşme. |
| 5. Pointer/parallax | Yalnız desktop fine pointer: grid en fazla 2px, teknisyen 3px, servis 5px. Başlık sabit; cursor companion yalnız servis/SLA alanlarında. |
| 6. Magnetic CTA | En fazla 4px hareket, bağımsız ok tepkisi ve 0,97 press. Aktif navigasyon işareti linkler arasında kayar; header route değişiminde korunur. |
| 7. About merge | Telefon, WhatsApp, Excel ve Not defteri parçaları merkeze yaklaşır; bağlantılar tek BizFlow kaydında birleşmeyi anlatır. |
| 8. Contact live ticket | Mevcut canlı önizlemeye focus highlight ve boş alan görünümü eklendi. Submit handler işlem öncesiyle aynı; mailto alıcısı ysufemre66@gmail.com. |
| 9. Final CTA | Başlık maskesi, çizilen rota ve sonlanan sinyal geçişi. Sürekli pulse yerine footer öncesinde sakinleşen hareket. |
| 10. Reduced motion | Intro/count-up anlık; drift, parallax ve geçişler kapalı. İçerik görünür, manuel seçim ve canlı ticket işlevsel. About doğrudan birleşmiş görünür. |
| 11. Mobile | Parallax/magnetic/idle kapalı; reveal süreleri kısa, mevcut dikey akış korunur. 320/390/768/1440px CSS cascade kontrolleri geçti; gerçek tarayıcı overflow testi yapılmadı. |
| 12. Performans | Pointer rAF ile sınırlı; sayaçlar sonlu ve frame başına React render oluşturmaz. IntersectionObserver, visibility guard, timer/rAF/WAAPI/listener cleanup mevcut. Ortak 160/360/800ms timing sistemi. Gerçek frame rate ölçülmedi. |
| 13. Build/lint | npm run build başarılı: 62 modül. npm run lint exit 0; public kaynaklarda yeni uyarı/hata yok. Application tarafındaki mevcut hook ve Toast Fast Refresh uyarıları sürüyor. Beş public route SSR kontrolünde tek h1, main, footer ve login bağlantısı doğrulandı. |
| 14. Application koruması | Public dışındaki 33 src dosyası işlem öncesi snapshot ile byte düzeyinde aynı. App.jsx, 9 protected route/roller, auth, API, application ekranları ve index.css bu revizyonda değiştirilmedi. Backend'e dokunulmadı. |

## Dosya bazında

- `SystemExperience.jsx`: intro/replay animasyonları ve sınırlı scroll metadata hareketi.
- `OperationsCanvas.jsx`: status bağlantısı, hareket işaretleri ve KPI sayaçları.
- `CountUp.jsx` (yeni): viewport kontrollü, reduced-motion uyumlu sonlu sayaç.
- `OperationsAnalytics.jsx`: count-up ve grafik çizimi.
- `TactileSurface.jsx`: farklı reveal türleri, görünürlük takibi, pointer parallax ve cleanup.
- `usePublicMotion.js`: ortak timing değerleri.
- `PublicHeader.jsx`: devamlı header, kayan aktif işaret ve mobile back/forward kapanışı.
- `PublicLayout.jsx`: route geçişinde header'ın yeniden mount edilmesini önleme.
- `PublicSections.jsx`: final CTA rota çizgileri.
- `Home.jsx`: mevcut bölümlere reveal türleri.
- `About.jsx`: birleşme çizgileri ve reveal bağlantısı.
- `Contact.jsx`: ticket focus/placeholder durumları.
- `public.css`: public kapsamlı motion stilleri, mobile ve reduced-motion alternatifleri.

Bu oturumda kullanılabilir tarayıcı bağlantısı bulunmadığından görsel kompozisyon, gerçek DOM taşması, pointer/scroll hissi ve cihaz performansı doğrulanamadı. SSR, izole effect/timer testleri ve statik CSS kontrolleri bu görsel QA'nın yerini tutmaz. Deployment yapılmadı.

## Hero otomatik servis senaryosu

Hero görünür olduğunda 8 saniyelik senaryo otomatik başlar; tekrar başlatma aynı akışı sıfırlar. Scroll simülasyonu kesmez. Görünürlük kaybında zamanlayıcı durur; görünür olduğunda kaldığı süreden devam eder. Reduced-motion tercihinde başlangıç doğrudan tamamlanmış demodur.

Zaman çizelgesi: 0ms request → 800ms HIGH → 1400ms SLA → 2200ms teknisyen inceleme → 3000ms eşleşme → 3800ms atama/bağlantı → 4800ms yolda → 6000ms sahada → 7500ms tamamlandı → 8000ms KPI 12→13. İnceleme/eşleşme sırasında rail OPEN kalır; ASSIGNED ancak atamada gösterilir.

Müşteri kaydı, adaylar, teknisyen, bağlantılar, SLA, rail ve servis kartı aynı senaryo durumundan güncellenir. Kart yüzeyi süreçle değişir; mevcut completion/insight morph yerleşimi korunur. Hero dışındaki önizlemelere yeni autoplay eklenmedi.

Dosyalar: `SystemExperience.jsx` (otomatik başlangıç, chapter senkronizasyonu, scroll koruması, replay remount), `operationsData.js` (atama öncesi doğru OPEN durumu), `OperationsCanvas.jsx` (operasyon fazları ve nesne durumları), `CountUp.jsx` (12 başlangıç değeri), `public.css` (hero kapsamlı faz geçişleri).

Doğrulama: build başarılı; lint exit 0 ve yeni public uyarısı yok. On senaryo karesi SSR ile doğrulandı. Gerçek timer effect için 0–8s, pause/resume, restart, terminal cleanup ve unmount kontrolleri geçti. Tarayıcı üzerinden görsel etkileşim kontrolü yapılamadı. Bu değişiklik yalnız public dosyalardadır; application/auth/API/backend değişmedi.

## Overflow ve görünür lifecycle — son revizyon

### Overflow bulguları ve düzeltmeler

Kod incelemesinde rail connector içindeki `i` taşıyıcısının `%100` genişlikteyken `%100` sağa taşındığı görüldü. Bu, tamamlanan state'te connector sınırının dışında ikinci bir genişlik üretir. Connector artık kendi dekoratif alanında clip edilir; nokta 6px payla son konumuna ulaşır. Hero zaten sınırlandırılmıştı; açık anatomy/scenario önizlemeleri de artık kendi sahnelerinde clip edilir. Global body/html overflow gizlemesi eklenmedi.

Cursor companion `clientX + 16` ile sınırsız konumlanıyordu. Etiket kendi ölçüsü ve viewport sınırıyla clamp edilir; resize/scroll/leave sırasında eski transform temizlenir. Grid/form/ticket/footer çocuklarında `min-width:0`, select için `max-width:100%`, uzun içeriklerde wrap; About kartlarının transform alanı için iç boşluk eklendi.

Bunlar kaynak kodda tespit edilen taşma mekanizmalarıdır. Bu oturumda tarayıcı bağlantısı yok (`apps:[], browsers:[]`); canlı sayfadaki taşmanın bütün nedenlerinin bunlar olduğu veya tamamen giderildiği DOM ölçümüyle doğrulanmış değildir.

### Motion

- Hero: 0 ready, 0,5s request, 1,2s HIGH, 1,8s SLA, 2,5s teknisyen seçimi, 3,2s bağlantı, 3,8s ASSIGNED, 4,8s ON THE WAY, 5,8s IN PROGRESS, 7s COMPLETED, 7,8s KPI. Otomatik başlangıç/replay ve sakin final korunur.
- Görsel state: OPEN mavi yüzey; seçimde teknisyen aktive olur; yolda düğüm 22×14px ilerler ve yön sinyali görünür; çalışma sırasında servis kartı öne çıkar; tamamlanmada başarı/ring/rapor ve metrikler görünür.
- Connection: bağlantı atamadan önce çizilir, akış sırasında küçük data pulse taşır; terminalde durur.
- Background: yalnız çalışan senaryoda tek, yavaş scanning geçişi; replay'de yeniden başlar.
- Navbar: scroll sonrası küçük ölçek daralması ve daha belirgin sabit shadow; layout yüksekliği korunur. Hareketli aktif işaret ve devamlı header korunur. Route geçişi 320ms.
- About: mevcut merkeze birleşme/çizgi animasyonuna BizFlow kaydının belirgin settle tepkisi eklendi.
- Contact: mevcut anlık live preview ve focus highlight korunur; submit/mailto değişmedi.
- Final CTA: mevcut sonlu rota sinyali, mask reveal, magnetic CTA ve ok tepkisi korunur.
- Reduced motion: auto sequence tamamlanmış state'te; scan/parallax/idle kapalı, bilgiler ve manuel kontroller görünür.
- Mobile: parallax/magnetic kapalı; dikey sahne, taşmayan aday/rail alanları korunur; kontroller ve metadata gerektiğinde satır kırar.

### Kontroller ve sınırlar

`npm run build`: başarılı (62 modül). `npm run lint`: exit 0; yeni public uyarısı yok, önceki application uyarıları sürüyor. On bir lifecycle karesi SSR ile doğrulandı; bağlantının ASSIGNED'dan önce kurulması kontrol edildi. Timer testleri zaman çizelgesi, pause/resume, restart, terminal cleanup ve unmount için geçti. Public dışındaki 33 kaynak dosyası bu işlem öncesi snapshot ile byte düzeyinde aynı.

1440, 1280, 1024, 768, 390, 320px için statik CSS cascade kontrolleri geçti. **Bu altı viewport için `document.documentElement.scrollWidth <= document.documentElement.clientWidth` ölçülemedi.** Browser ile görsel QA, gerçek overflow ve frame-rate doğrulaması hâlâ gereklidir; tamamlandı iddiası yoktur.

Değişen dosyalar: `operationsData.js` (zaman/faz verisi), `OperationsCanvas.jsx` (seçim/bağlantı/SLA eşikleri), `SystemExperience.jsx` (talep giriş zamanlaması ve replay scan), `TactileSurface.jsx` (etiket sınırlandırma/resize cleanup), `public.css` (kaynak bazlı overflow ve motion). Application, auth, ProtectedRoute, API ve backend değiştirilmedi.

## Ek motion density revizyonu

Mevcut layout/metin/renk ve hero lifecycle korundu. Motion yalnız hero'da kalmayacak şekilde public sayfalara yayıldı:

1. Route entrance: mevcut 320ms mask geçişi.
2. Navbar: mevcut compact scroll davranışı ve kayan aktif işaret.
3. Sayfa başlığı: mask, italic accent slide ve gecikmeli subtitle.
4. CTA/link: mevcut magnetic/arrow; ek underline slide, press feedback.
5. İçerik: feature register, manifesto ve rol kayıtlarında clip reveal; section başlıklarında mask.
6. Kartlar: desktop memory/role/ticket hover depth; en fazla 4px.
7. Features: system map bağlantıları çizilir, modüller 50ms stagger ile görünür. Seçim core ve status noktasını aktive eder; açıklama yeniden çözülür.
8. Solutions: seçilen senaryo canvas'ı mask/scale morph, açıklaması kısa yatay reveal alır. Klavye tab davranışı korunur.
9. About: mevcut kaynak-kayıt birleşmesi ve completion settle korunur.
10. Contact: her değişen değer bounded typing response alır; focus/placeholder ve mailto akışı korunur. Sadece değer içindeki span yenilenir; odaklanabilir dd korunur.
11. Analytics: mevcut viewport count-up ve grafik trace korunur.
12. Footer/final: footer sütunları controlled stagger ile gelir; linkler yönlü tepki verir. Mevcut final route pulse/mask/magnetic korunur.

Stagger en fazla 250ms; mobile'da gecikme kaldırılır ve süreler kısalır. Yeni sürekli dönen animasyon eklenmedi. Reveal'lar mevcut tek IntersectionObserver üzerinden çalışır; atanan attribute/stagger stilleri ve observer route/unmount cleanup'ında temizlenir. Motion kurulmadan önce içerik görünürdür. Reduced-motion CSS'i gizli reveal durumlarını açar, transform/scale hareketlerini ve animasyonları kapatır; bilgi ve gezinme animasyona bağlı değildir.

Dosyalar: PublicSections (intro), PublicFooter (stagger), ProductAnatomy (map/selection), SectorExplorer (stagger), Contact (typing), TactileSurface (reveal/stagger lifecycle), public.css (yeni motion kuralları).

Build başarılı; lint exit 0 (public için yeni uyarı yok). Beş public route SSR, mevcut timer lifecycle ve altı viewport statik CSS cascade kontrolleri geçti. Public dışındaki 33 kaynak dosyası bu revizyon öncesiyle byte düzeyinde aynı. Yeni paket yok.

30 saniyede 8–12 farklı tepki hedefini destekleyen en az 12 motion alanı mevcut; gerçek kullanıcı oturumu/tarayıcıyla algısal yoğunluk, FPS veya scrollWidth ölçülmedi. Bu sonuçlar görsel QA yerine geçmez.

## Dört marketing görselinin entegrasyonu

| Görsel | Yerleşim | Motion / mobil crop |
| --- | --- | --- |
| bizflow-hero-operations | Home, hero boot ile mevcut operational canvas arasında geniş görsel köprü | Desktop perspective, en fazla ±8px scroll parallax ve küçük hover scale; mobil 1,45 oran / %65 yatay odak, parallax yok. |
| bizflow-dispatch-field | Home, servis hafızası ile analytics arasında Talep → Atama → Saha bölümü | Yatay mask reveal, ±8px parallax, ASSIGNED/merkez-saha etiketleri. Mobil 1,05 oran / %58 yatay odak. |
| bizflow-analytics | Home analytics başlığı ile mevcut interaktif KPI alanı arasında framed yüzey | Scale/opacity reveal; mevcut KPI count-up korunur. Mobil tam genişlik, 1,15 oran / %60 yatay odak. |
| bizflow-chaos-to-flow | About, Telefon/WhatsApp/Excel/Not defteri birleşmesinin devamında | Birleşme çizgilerinden sonra 1000ms gecikmeli mask expansion. Mobil 1,2 oran / %55 yatay odak. |

Orijinal PNG dosyaları `src/assets/bizflow/` altında byte düzeyinde korundu. Aynı dizinde 1448px ve 720px JPEG türevleri hazırlandı; yeni pipeline veya paket eklenmedi. Desktop JPEG'ler 334–481 KB, küçük varyantlar 111–167 KB. Vite build'de PNG orijinalleri yüklenmez; responsive `srcSet`/`sizes` ile JPEG'ler sunulur. Hero eager/high priority; diğerleri lazy, tamamı async decode. Width/height ve breakpoint aspect-ratio alan rezervasyonu sağlar; img width/max-width ve yerel clip yeni görsel taşmasını sınırlar. Dekoratif annotation aria-hidden, her görsel anlamlı alt metne ve temsili ürün illüstrasyonu açıklamasına sahiptir. Görseldeki sayılar gerçek müşteri sonucu veya mevcut application ekranının birebir görüntüsü olarak sunulmaz.

Desktop radius 28–36px, tablet 28px, mobil 22px. Scroll parallax tek rAF ile toplu okuma/yazma yapar; mobil/reduced-motion'da sıfırlanır. Observer/reveal önceki ortak mekanizmayı kullanır. Route/unmount listener/rAF/style cleanup vardır. Reduced motion'da mask/scale/perspective/parallax kapalı, bütün görseller görünürdür.

Dosyalar: yeni `MarketingVisual.jsx`; Home, SystemExperience, OperationsAnalytics, About yerleşimleri; TactileSurface sınırlı image parallax; public.css scoped image sistemi; sekiz optimize JPEG türevi. Auth/application/API/backend değiştirilmedi. Public dışı 30 kod/config kaynak dosyası işlem öncesi snapshot ile aynı; orijinal asset'ler ayrı doğrulandı.

Kontroller: build başarılı (71 modül), lint exit 0, yeni public uyarısı yok. Beş public route SSR edildi; Home'da üç, About'ta bir img, anlamlı alt/srcSet/dimension/async decode ve eager/lazy koşulları doğrulandı. Asset'ler build çıktısında mevcut. 320/390/768/1024/1280/1440 statik CSS cascade kontrolü geçti. Tarayıcı bağlantısı olmadığından gerçek image loading/network, mobil crop görünümü, scrollWidth, route tıklama ve reduced-motion görsel sonucu ölçülmedi; görsel QA tamamlandı iddiası yoktur.

## Kadraj düzeltmesi

Hero kaynağı yaklaşık 16:9 iken desktop frame 2,7:1 ve cover idi: üst/alt içerik kesiliyordu. Mobil 1,45 frame ve %65 yatay odak ise yan içeriği kesiyordu. Ortak 1,035 zoom ve hover scale de kenar kaybını artırıyordu.

Hero artık desktop/laptop/mobile'da 1448/815 oranlı, `object-fit:contain; object-position:50% 50%`. Desktop perspective korunur; görsel içi parallax/zoom kaldırıldı. Koyu gradient yüzey ve desktop 12px / mobile 6px güvenlik boşluğu kenar metinlerini ve floating kartları korur. Görsel en-boy oranı bozulmaz. Mobilde bütün kompozisyon korunur; gömülü küçük UI yazılarının telefon genişliğinde küçük görünmesi doğal bir sınırdır.

Dispatch (önce 1,95 / mobil 1,05), analytics (1,8 / mobil 1,15) ve chaos (1,85 / mobil 1,2) frame oranları kaynak 4:3 ile eşleşmediğinden içerik kaybı oluşturuyordu. Her biri kendi class'ında `contain / 50% 50%`, frame 4:3 kullanır. Dispatch anotasyonları önemli görsel içeriğini kapatmaması için altına taşındı. Dispatch'in sınırlı desktop parallax'ı 12px iç pay içerisinde ±8px kalır. Hover büyütmek yerine %1 içeri çekilir. Reveal animasyonları korunur.

Sabit height eklenmedi; frame aspect-ratio, yüzde genişlik ve yerel overflow hidden kullanır. Image absolute/inset + width/height 100% ile ayrılan frame'e uyar. Global overflow gizlenmedi. Lazy/eager, srcSet, alt ve decode davranışı değişmedi. Application/auth/API/backend değişmedi.

1440/1280/1024/768/390/320 statik responsive cascade kontrolleri geçti. Tarayıcı bağlantısı olmadığı için gerçek görsel kadraj ve `scrollWidth <= clientWidth` ölçümü doğrulanamadı; overflow yok iddiası yapılmıyor. Build başarılı; lint exit 0, yeni public uyarısı yok. Değişen kaynaklar: public.css, TactileSurface.jsx.

## Hero floating stage polish

- Frame: koyu gradient yerine açık porcelain/yeşil yüzey, ince 1px border, 34px radius, hafif inner/outer shadow. Görselin contain/center ve 1448/815 oranı korunur.
- Floating feel: sabit -2px depth ve 1° perspective; desktop hover'da tüm yüzey 1,01 büyür. Görsel kendi içinde zoom yapmaz; crop çözümü korunur. Shadow state değişir, ağır shadow animasyonu yok.
- Reveal: mevcut observer üzerinden 750ms mask + 0,985→1 scale + opacity, ortak easing. Sadece viewport girişinde.
- Parallax: mevcut toplu rAF mekanizmasında hero yeniden etkin; yalnız image ±8px hareket eder, container scroll ile hareket etmez. 12px iç güvenlik payında kalır. Route/unmount cleanup korunur.
- Etiketler: üst sağ LIVE OPS / DEMO; alt sol SLA / 96% · TEMSİLİ; alt sağ CONNECTED OPERATIONS. Pill'ler resim içeriğini kapatmak yerine frame sınırına yarı taşar; 150/230/310ms stagger, hover'da 2px depth. Statik hafif blur; blur animasyonu yok.
- Mobile: 22px radius, tek üst kenar etiketi; alt etiketler gizli. Hover/parallax kapalı, tam genişlik ve orijinal crop korunur. Reduced-motion'da içerik/etiketler anlık ve hareketsiz.
- Spacing: boot sonrası 10px ve sonraki canvas öncesi 32px; mobile 6/24px. Etiketler için caption üst boşluğu ayrılır.
- Kaynaklar: MarketingVisual.jsx, TactileSurface.jsx, public.css. Application/auth/API/backend değişmedi.
- Build başarılı; lint exit 0. Gerçek tarayıcı bağlantısı bulunmadığından 1440/1280/1024/768/390/320 için DOM scrollWidth ve görsel örtüşme ölçülemedi. Yüzey büyümesi mevcut container dış boşluğu içinde, etiketler yatay inset'lerde tutuldu; global overflow gizlemesi eklenmedi.
