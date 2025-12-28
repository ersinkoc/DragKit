# 🚀 GitHub Pages Deployment - Hızlı Başlangıç

## Adım 1: GitHub Repository Ayarları

### GitHub Pages'i Etkinleştir

1. GitHub repository'nize gidin
2. **Settings** → **Pages**
3. **Source** kısmında: **GitHub Actions** seçin (⚠️ CRITICAL - Default "Deploy from a branch" değil!)
4. Save

![GitHub Pages Settings](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/github-actions-source.webp)

### Actions Permissions

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** → **Read and write permissions** seçin
3. **Allow GitHub Actions to create and approve pull requests** işaretleyin
4. Save

## Adım 2: Deployment

### Otomatik Deployment (Push İle)

```bash
# Tüm değişiklikleri commit et
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main

# GitHub Actions otomatik çalışacak!
```

### Manuel Deployment

GitHub Repository → **Actions** sekmesi → **Deploy Website to GitHub Pages** → **Run workflow**

## Adım 3: Kontrol Et

### Deployment Durumu

1. GitHub → **Actions** sekmesi
2. En son workflow'u aç
3. Tüm adımların yeşil ✅ olduğunu kontrol et

### Website'i Ziyaret Et

Deployment başarılı olduktan sonra (2-3 dakika):

- https://ersinkoc.github.io/dragkit/

veya custom domain ayarladıysanız:

- https://dragkit.oxog.dev

## ⚠️ Sorun Giderme

### 1. Workflow Çalışmıyor

**Sorun**: GitHub Actions tetiklenmiyor

**Çözüm**:
```bash
# .github/workflows/ dizininin push edildiğinden emin ol
git add .github/workflows/
git commit -m "Add workflows"
git push origin main
```

### 2. Build Hatası

**Sorun**: npm run build failed

**Çözüm**:
```bash
# Local'de test et
cd website
npm install
npm run build

# Hata varsa düzelt ve tekrar push et
```

### 3. 404 Not Found

**Sorun**: Website açılıyor ama 404 veriyor

**Çözüm**:
- Settings → Pages → Source: **GitHub Actions** olmalı (Branch değil!)
- Workflow'un tamamen bittiğinden emin ol (2-3 dakika sürer)

### 4. Permissions Error

**Sorun**: "Resource not accessible by integration"

**Çözüm**:
- Settings → Actions → General
- Workflow permissions → **Read and write permissions**
- Save

## 📊 Deployment Status

### Build Status Badge

README.md'ye ekleyin:

```markdown
[![Deploy Website](https://github.com/ersinkoc/dragkit/workflows/Deploy%20Website%20to%20GitHub%20Pages/badge.svg)](https://github.com/ersinkoc/dragkit/actions)
```

### Logs

Actions sekmesinde her deployment için detaylı logları görebilirsiniz.

## 🎯 Checklist

Deployment öncesi:

- [x] website/package-lock.json commit edildi
- [x] .github/workflows/deploy-website.yml mevcut
- [x] GitHub Pages: Source = GitHub Actions
- [x] Actions: Read and write permissions
- [ ] npm run build local'de çalışıyor
- [ ] git push origin main yapıldı
- [ ] Actions sekmesinde workflow yeşil ✅

## 🔗 Faydalı Linkler

- [Detaylı Deployment Rehberi](DEPLOYMENT.md)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

---

**Sorun yaşarsanız**: [DEPLOYMENT.md](DEPLOYMENT.md) dosyasında detaylı troubleshooting bulabilirsiniz.
