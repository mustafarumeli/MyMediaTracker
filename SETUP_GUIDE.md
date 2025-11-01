# 🚀 Hızlı Başlangıç Rehberi

Bu rehber, projenizi GitHub Pages'de yayınlamanız için gereken adımları içerir.

## ✅ Adım Adım Kurulum

### 1️⃣ Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) adresine gidin
2. "Add project" butonuna tıklayın
3. Proje adı verin (örn: "media-tracker")
4. Google Analytics'i isterseniz aktifleştirin (opsiyonel)
5. Projeyi oluşturun

### 2️⃣ Firebase Authentication Ayarları

1. Sol menüden **Build > Authentication** seçin
2. "Get started" butonuna tıklayın
3. **Sign-in method** sekmesine gidin ve aşağıdaki yöntemleri aktifleştirin:

   **a) Google Sign-in (Önerilen - Daha Kolay)**
   - Google'ı seçin
   - Enable yapın
   - Project support email seçin
   - Kaydedin
   
   **b) Email/Password (Opsiyonel)**
   - Email/Password'ü seçin
   - Enable yapın
   - Kaydedin
   - **Users** sekmesinden "Add user" ile kendinize manuel hesap oluşturun
     - Email: sizin_email@example.com
     - Password: güçlü bir şifre (en az 6 karakter)

**Not:** Google ile giriş çok daha pratiktir. Sadece Google hesabınızla giriş yapabilirsiniz.

### 3️⃣ Firestore Database Oluşturun

1. Sol menüden **Build > Firestore Database** seçin
2. "Create database" butonuna tıklayın
3. Location seçin (Europe-west3 önerilir)
4. **Test mode**'da başlatın (rules'ları sonra güncelleyeceğiz)
5. Database oluşturulmasını bekleyin

### 4️⃣ Firestore Security Rules Güncelleyin

1. Firestore Database'de **Rules** sekmesine gidin
2. Aşağıdaki kuralları yapıştırın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /media-items/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. "Publish" butonuna tıklayın

### 5️⃣ Firebase Config Bilgilerini Alın

1. Firebase Console'da proje ayarlarına gidin (⚙️ ikonu)
2. "Project settings" seçin
3. Aşağı kaydırın ve "Your apps" bölümünü bulun
4. Web uygulaması ekleyin (</> ikonu)
5. App nickname verin (örn: "media-tracker-web")
6. "Register app" butonuna tıklayın
7. Firebase SDK config bilgilerini kopyalayın

### 6️⃣ GitHub Repository Oluşturun

1. GitHub'da yeni repository oluşturun
2. Repository adı: **MyTracker** (veya istediğiniz bir ad)
3. Public olarak oluşturun
4. README, .gitignore eklemeyin (zaten var)

### 7️⃣ GitHub Secrets Ekleyin

1. Repository'nizde **Settings > Secrets and variables > Actions** gidin
2. "New repository secret" ile aşağıdaki secrets'ları ekleyin:

```
VITE_FIREBASE_API_KEY = your_api_key
VITE_FIREBASE_AUTH_DOMAIN = your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = yor_project_id
VITE_FIREBASE_STORAGE_BUCKET = your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID = your_sender_id
VITE_FIREBASE_APP_ID = your_app_id
```

### 8️⃣ GitHub Pages Aktifleştirin
u
1. Repository'de **Settings > Pages** gidin
2. **Source** olarak "GitHub Actions" seçin
3. Kaydedin

### 9️⃣ Projeyi GitHub'a Yükleyin

```bash
# Git init (eğer henüz yapılmadıysa)
git init

# Remote ekle
git remote add origin https://github.com/KULLANICI_ADINIZ/MyTracker.git

# Dosyaları ekle ve commit et
git add .
git commit -m "Initial commit: Media tracker app"

# Main branch'e push et
git branch -M main
git push -u origin main
```

### 🎯 10. Site Yayınlandı!

Birkaç dakika sonra siteniz şu adreste yayında olacak:
```
https://KULLANICI_ADINIZ.github.io/MyTracker/
```

GitHub Actions sekmesinden deployment durumunu kontrol edebilirsiniz.

## 🧪 Lokal Geliştirme (Opsiyonel)

Lokal olarak çalıştırmak isterseniz:

1. `frontend/.env` dosyası oluşturun:
```bash
cd frontend
cp .env.example .env
```

2. `.env` dosyasına Firebase config bilgilerinizi ekleyin

3. Bağımlılıkları yükleyin ve çalıştırın:
```bash
npm install
npm run dev
```

4. Tarayıcınızda `http://localhost:5173` adresini açın

## ❓ Sorun Giderme

### Build Hatası
- GitHub Secrets'ların doğru eklendiğinden emin olun
- Tüm secret isimleri `VITE_` ile başlamalı

### Authentication Çalışmıyor
- Firebase Authentication'ın Email/Password metodu aktif mi kontrol edin
- Kullanıcı oluşturdunuz mu?

### Veriler Görünmüyor
- Firestore Security Rules doğru mu?
- Firestore'da `media-items` collection'ı oluşturulmuş mu?

### 404 Hatası
- `vite.config.js` dosyasındaki `base` değeri repository adınızla eşleşiyor mu?
- GitHub Pages Source olarak "GitHub Actions" seçili mi?

## 📝 Notlar

- Firebase free tier limitleri:
  - 50K okuma/gün
  - 20K yazma/gün
  - 1GB depolama
- Kişisel kullanım için yeterli olacaktır
- Daha fazla kullanım için Firebase pricing planlarına bakabilirsiniz

## 🎉 Tebrikler!

Artık kendi medya takip sisteminiz hazır! Film ve oyunlarınızı kaydetmeye başlayabilirsiniz.

