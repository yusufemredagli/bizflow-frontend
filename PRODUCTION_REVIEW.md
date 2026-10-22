# BizFlow frontend production incelemesi

Tarih: 22 Ekim 2026. Kapsam: frontend kaynakları, route/rol kontrolleri, ortak API katmanı, sayfa veri yüklemeleri, formlar, dosya bağlantıları, CSS, build/lint ve bağımlılık taraması. Backend değiştirilmedi. Yeni dependency eklenmedi, sürüm yükseltilmedi. API endpointleri, yöntemleri ve payload alanları korunuyor.

## Mimari ve veri akışı

React + Vite; BrowserRouter üzerinden sayfa bazlı ProtectedRoute kontrolleri var. JWT ve kullanıcı localStorage'da tutuluyor. İlk membership rolü navigasyonu belirliyor. Sayfalar ortak services/api.js fonksiyonlarını çağırıyor; JSON ve FormData ortak request üzerinden gönderiliyor. Sayfa state'i ve effect'ler liste, filtre ve pagination yüklemelerini yönetiyor. ToastProvider ve ConfirmDialog ortak bildirim/onay bileşenleri. Yetkinin güvenlik sınırı yine backend olmalıdır; frontend rol kontrolü tek başına erişim güvenliği sağlamaz.

## Critical

- **Deployment önkoşulu, açık:** `.env` içindeki VITE_API_URL hâlen http://localhost:3000. Production build ortamında gerçek API adresi verilmelidir. Adres bilinmediği için tahmini URL yazılmadı. Yerel .env değişmedi. Vite değeri build sırasında bundle'a gömer; build sonrasında sunucu ortam değişkenini değiştirmek mevcut bundle'ı değiştirmez. VITE_ değişkenlerine secret konmamalıdır.
- İncelemede doğrudan hardcoded secret, dangerouslySetInnerHTML, eval veya debug log kullanımı tespit edilmedi. Bu, penetrasyon testi sonucu değildir.

## Important — uygulanan düzeltmeler

- JSON olmayan 401 yanıtlarında da mevcut oturum temizleniyor ve korumalı ekran girişe dönüyor. Eski token ile başlamış bir isteğin 401 yanıtı yeni oturumu temizlemiyor.
- API ağ hataları, bozuk JSON, HTML/proxy yanıtları kontrollü Türkçe hata veriyor. Ham HTML/metin ve 5xx mesajı kullanıcıya aktarılmıyor. 4xx validation mesajları korunuyor.
- API adresinin son slash/boşlukları normalize ediliyor. Dosya taban adresi de aynı normalizasyonu kullanıyor; mevcut /api son eki çıkarma kuralı değişmedi.
- Tanınmayan/eksik rolün dashboard'a yönlendirilip aynı route'ta kalması yerine girişe dönüş sağlanıyor.
- Servis listesinde sayfa 2'den 1'e dönüş artık istek yapıyor.
- Liste ve detay veri yüklemelerinde önceki isteğin geç gelen sonucu, hatası veya finally bloğu yeni yüklemenin state'ini ezemiyor. Unmount/route değişimi bekleyen bu yüklemeleri geçersiz kılıyor; HTTP istekleri fiziksel olarak iptal edilmiyor.
- Dashboard tarih aralığı değişiminde eski yanıt uygulanmıyor; loading ve önceki hata temizleniyor. My Jobs ilk yüklemesinde unmount kontrolü var.
- Detay route'u değiştiğinde önceki kayıt temizleniyor; yeni kaydın yüklemesi başarısız olursa önceki müşteri/çalışan/servis gösterilmiyor.
- Servis URL'sindeki status/priority/filter, tarayıcı geri/ileri ve aynı route navigasyonunda state'e yansıtılıyor.
- Mevcut submit butonu disabled kontrollerine ek olarak form handler'larında işlem sürüyorsa erken dönüş var.
- Toast zamanlayıcısı yenisi gösterilmeden, elle kapatılırken ve unmount sırasında temizleniyor. Önceki toast'ın timer'ı yeni toast'ı erken kapatamıyor.
- Geçersiz tarih ortak format fonksiyonlarını çökerterek sayfayı düşürmüyor; '-' gösteriliyor. Servis ücretinde Infinity de reddediliyor.

## Dosya bazında değişiklikler

| Dosya | Değişiklik |
| --- | --- |
| src/services/api.js | URL normalizasyonu, 401, güvenli yanıt/ağ hatası işleme; +json desteği |
| src/App.jsx | Oturum sona erme olayını dinleme, geçersiz rol yönlendirmesi |
| src/pages/ServiceRequests.jsx | Pagination dönüşü, eski yükleme kontrolü, URL filtre senkronizasyonu, submit kontrolü |
| src/pages/Customers.jsx | Eski liste isteği/unmount ve submit kontrolü |
| src/pages/CustomerDetail.jsx | Route değişiminde eski kayıt/yanıt temizliği, callback bağımlılıkları |
| src/pages/MemberDetail.jsx | Route değişiminde eski kayıt/yanıt temizliği, callback bağımlılıkları |
| src/pages/ServiceRequestDetail.jsx | Aynı detay yükleme koruması, callback bağımlılıkları, URL normalizasyonu, sonlu ücret ve submit kontrolü |
| src/pages/Members.jsx | Yükleme/unmount, callback bağımlılıkları ve submit kontrolü |
| src/pages/Dashboard.jsx | Aralık değişimi için eski yanıt, loading/error kontrolü |
| src/pages/MyJobs.jsx | İlk yüklemede unmount kontrolü |
| src/pages/Login.jsx | İşlem sürerken tekrar submit kontrolü |
| src/context/ToastContext.jsx | Timer temizliği ve sabit showToast callback'i |
| src/components/ui/Toast.jsx | Button type, erişilebilir kapatma adı ve bildirim rolü |
| src/components/ui/ConfirmDialog.jsx | Dialog rolü ve erişilebilir adı |
| src/utils/format.js | Geçersiz tarih kontrolü |
| index.html | Türkçe sayfa dili ve BizFlow başlığı |

## Important — değiştirilmeden raporlanan sınırlar

- Customers ve ServiceRequests'te debounce ve pagination ayrı effect'lerde. Bazı geçişler/ilk yükleme yinelenen GET üretebilir; hook dependency uyarıları sürüyor. Array'lere fonksiyonları doğrudan eklemek render/istek döngüsü yaratabileceğinden yapılmadı. Veri sonuçlarına eski istek koruması eklendi; bütün effect akışı yeniden tasarlanmadı.
- Arama, sayfa ve dashboard tarih aralığı yenilemede korunmuyor. Servis status/priority/filter URL'den korunuyor. Tam URL kalıcılığı eklenmedi.
- Servis oluşturma müşteri seçimi ilk 100 müşteriyi getiriyor. 100 üzeri veriyle backend limit/pagination sözleşmesi doğrulanmalı; bu görevde sözleşme varsayılmadı.
- Dosya bağlantıları mevcut sözleşmeye göre API tabanı + filePath ile oluşuyor. Ayrı CDN, mutlak filePath veya reverse proxy alt yolları için gerçek deployment örneği gerekli. Mevcut kurala tahmini alternatif eklenmedi.
- Genel modallarda focus trap/focus iadesi yok; küçük ekran yüksekliğinde modal scroll'u elle kontrol edilmeli. Mevcut kapatma ve backdrop davranışı korunuyor. Sadece completion modalında mevcut dialog semantiği vardı; ConfirmDialog'a da eklendi.
- Backend 4xx mesajları iş kuralları/validation için korunuyor; bu mesajların teknik detay taşımadığının backend tarafında doğrulanması gerekir.
- Submit korumaları mevcut state/disabled modeliyle çalışıyor; backend idempotency sağlamıyor. Teknisyen atama ve upload/status/delete mutasyonlarının tamamı için ortak bir kilit/refactor eklenmedi. Mutasyonların route değişimi sonrasındaki bütün devam adımları için kapsamlı iptal yönetimi yapılmadı.
- Liste hatalarında mevcut kayıtlar kalabiliyor. Yeni error/empty UX tasarlanmadı. Geçerli sayfanın başka bir kullanıcı tarafından boşaltılması gibi eşzamanlı pagination senaryoları canlı veriyle doğrulanmalı.

## Cleanup

- index.css ve App.css byte düzeyinde aynı. Görsel kimlik, sınıflar ve breakpoint'ler değiştirilmedi; cascade etkisi nedeniyle CSS birleştirme/silme yapılmadı.
- Boş UI/serviceRequests placeholder dosyaları ve kullanılmayan template SVG'ler var; silinmedi.
- ToastContext Fast Refresh uyarısı geliştirme içindir; bunu susturmak için dosya bölünmedi.
- Tüm sayfalar yeniden yazılmadı; klasör yapısı korunuyor.

## Doğrulama

- Değişiklik grupları sonrasında npm run build başarılı. Son build: 43 modül, build uyarısı/hatası yok. CSS çıktısı başlangıçtakiyle aynı isim ve boyutta.
- npm run lint: exit 0; hata yok, hook/effect ve Fast Refresh uyarıları sürüyor. Uyarılar gizlenmedi/devre dışı bırakılmadı.
- npm audit --omit=dev --json ve npm audit --json: 0 bilinen açık. Paket/lockfile değişmedi.
- Geçici Node assert kontrolleri: URL/query kodlama, JWT header, HTML 401 oturum temizliği, 4xx validation, maskelenmiş 500, bozuk JSON, 204, +json, ağ hatası, AbortError, bozuk localStorage JSON, eski 401/yeni token, FormData header ve geçersiz tarihler geçti. Testler mock fetch kullanır; backend doğrulaması değildir.
- Canlı backend, gerçek kullanıcı hesabı veya tarayıcı üzerinden uçtan uca/görsel regresyon testi yapılmadı. Özellikle rol bazlı giriş, liste 2→1 dönüşü, hızlı filtre değişimi, tarayıcı geri/ileri, upload, completion ve küçük ekranda modal akışları staging ortamında doğrulanmalıdır. Build başarısı tek başına tüm davranışların korunduğunu ispatlamaz.
