# 🎬 Medya Takip Sistemi

Kişisel film ve oyun takip sistemi. Firebase Authentication ve Firestore kullanarak izlediğim filmleri ve oynadığım oyunları 10 üzerinden puanlayıp kayıt ediyorum.

## ✨ Özellikler

- 🔐 Güvenli giriş sistemi (Firebase Authentication)
  - Google ile tek tıkla giriş
  - Email/Password ile giriş
- 🎬 Film takibi
- 🎮 Oyun takibi
- ⭐ 10 üzerinden puanlama sistemi (8.7 gibi ondalıklı değerler)
- 📝 Notlar ekleme
- 🔍 Arama ve filtreleme
- 📊 İstatistikler (toplam sayı, ortalama puan)
- 📱 Responsive tasarım
- 🌙 Modern dark mode arayüz

## 🛠️ Teknolojiler

### Frontend
- React 18
- Vite
- Tailwind CSS

### Backend
- Firebase Authentication (Google OAuth + Email/Password)
- Cloud Firestore (NoSQL Database)

### Hosting
- GitHub Pages

## 📁 Proje Yapısı

```
MyTracker/
├── frontend/              # React uygulaması
│   ├── src/
│   │   ├── components/    # React componentleri
│   │   ├── contexts/      # Context API (Auth)
│   │   ├── firebase/      # Firebase config
│   │   └── hooks/         # Custom hooks
│   └── dist/             # Build çıktısı
├── firebase/             # Firebase config ve rules
│   ├── firestore.rules   # Güvenlik kuralları
│   └── firebase.json     # Firebase config
└── .github/workflows/    # GitHub Actions
```

## 🚀 Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/KULLANICI_ADI/MyTracker.git
cd MyTracker
```

### 2. Frontend Bağımlılıklarını Yükleyin

```bash
cd frontend
npm install
```

### 3. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. Yeni bir proje oluşturun
3. **Authentication** bölümünden aşağıdaki metodları aktifleştirin:
   - **Google** (önerilen - tek tıkla giriş)
   - Email/Password (opsiyonel)
4. **Firestore Database** oluşturun (test mode'da başlatın)
5. Proje ayarlarından Firebase config bilgilerinizi alın

### 4. Environment Variables Ayarlayın

`frontend/.env` dosyası oluşturun:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Firebase Security Rules Yükleyin

```bash
cd firebase
firebase deploy --only firestore:rules
```

### 6. Giriş Yapın

- **Google ile giriş**: Direkt olarak Google hesabınızla giriş yapabilirsiniz
- **Email/Password ile giriş**: Firebase Console'dan Authentication bölümüne gidin ve manuel olarak bir kullanıcı ekleyin

### 7. Lokal Olarak Çalıştırın

```bash
cd frontend
npm run dev
```

## 📦 Production Build

```bash
cd frontend
npm run build
```

Build çıktısı `frontend/dist/` klasöründe oluşur.

## 🌐 GitHub Pages Deployment

### Otomatik Deployment (GitHub Actions)

Projeyi GitHub'a push ettiğinizde otomatik olarak deploy edilir.

#### Adımlar:

1. GitHub repository'nizde **Settings > Secrets and variables > Actions** bölümüne gidin

2. Aşağıdaki secrets'ları ekleyin:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. **Settings > Pages** bölümünde:
   - Source: GitHub Actions

4. `main` branch'ine push yaptığınızda otomatik deploy edilir

Site: `https://KULLANICI_ADI.github.io/MyTracker/`

## 🔒 Güvenlik

- Firestore güvenlik kuralları sadece authenticated kullanıcıların veri okuyup yazmasına izin verir
- Firebase config bilgileri environment variables olarak saklanır
- `.env` dosyası `.gitignore` içinde yer alır

## 📝 Kullanım

1. **Google ile** veya **Email/Şifre** ile giriş yapın
2. Film veya oyun eklemek için formu doldurun:
   - Başlık
   - Tür (Film/Oyun)
   - Puan (0-10 arası, örn: 8.7)
   - Notlar (opsiyonel)
3. Kartların üzerindeki menüden düzenleme veya silme yapabilirsiniz
4. Filtreleme ve arama özelliklerini kullanarak içerikleri bulabilirsiniz

## 📊 Veritabanı Yapısı

### Collection: `media-items`

```json
{
  "id": "auto-generated",
  "title": "Film veya Oyun Adı",
  "type": "movie" | "game",
  "rating": 8.7,
  "notes": "Opsiyonel notlar",
  "createdAt": "Firebase Timestamp",
  "updatedAt": "Firebase Timestamp"
}
```

## 🤝 Katkıda Bulunma

Bu kişisel bir proje olduğu için katkı kabul edilmemektedir.

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Not**: Bu proje sadece kişisel kullanım içindir. Firebase free tier limitleri göz önünde bulundurulmalıdır.

