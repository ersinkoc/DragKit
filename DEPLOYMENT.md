# DragKit - Deployment Guide

## GitHub Pages Deployment

### Otomatik Deployment (GitHub Actions)

Website her `main` branch'e push edildiğinde otomatik olarak deploy edilir.

#### Ön Gereksinimler

1. **GitHub Repository Settings** → **Pages**:
   - Source: **GitHub Actions**
   - Bu ayarı yapmazsanız deployment çalışmaz!

2. **Actions Permissions**:
   - Settings → Actions → General
   - "Workflow permissions" → **Read and write permissions** seçili olmalı
   - "Allow GitHub Actions to create and approve pull requests" işaretli olmalı

#### Workflow Dosyası

[.github/workflows/deploy-website.yml](.github/workflows/deploy-website.yml)

```yaml
name: Deploy Website to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'website/**'
  workflow_dispatch:  # Manuel tetikleme

permissions:
  contents: read
  pages: write
  id-token: write
```

#### Manuel Deployment Tetikleme

1. GitHub Repository → **Actions** sekmesi
2. **Deploy Website to GitHub Pages** workflow'unu seç
3. **Run workflow** butonuna tıkla
4. **Run workflow** ile onayla

### Manuel Deployment (Alternatif)

Eğer GitHub Actions kullanmak istemezseniz, manuel olarak deploy edebilirsiniz:

```bash
# 1. Website'ı build et
cd website
npm install
npm run build

# 2. GitHub Pages branch'ine push et
cd dist
git init
git add -A
git commit -m 'Deploy website'
git push -f git@github.com:ersinkoc/dragkit.git main:gh-pages

# 3. GitHub Settings → Pages:
#    Source: Deploy from a branch
#    Branch: gh-pages / (root)
```

### Build Komutları

```bash
# Core package build
npm run build

# Website build
cd website
npm run build

# Website preview (local)
cd website
npm run preview
```

### Deployment URL'leri

- **Production**: https://dragkit.oxog.dev
- **GitHub Pages**: https://ersinkoc.github.io/dragkit/

### Özel Domain (dragkit.oxog.dev)

#### DNS Ayarları

Domain sağlayıcınızda (GoDaddy, Cloudflare, vb.) şu DNS kayıtlarını ekleyin:

```
Type: CNAME
Name: dragkit
Value: ersinkoc.github.io
```

veya A records:

```
Type: A
Name: dragkit
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

#### GitHub Ayarları

1. Repository Settings → **Pages**
2. Custom domain: **dragkit.oxog.dev**
3. **Enforce HTTPS** işaretle
4. Save

CNAME dosyası otomatik olarak workflow tarafından oluşturuluyor.

### Deployment Doğrulama

Deployment başarılı oldu mu kontrol et:

1. **Actions sekmesinde** workflow'un yeşil tick ✅ aldığından emin ol
2. **Deployment URL'ini** ziyaret et
3. **Console'da** hata olmadığını kontrol et
4. **Network sekmesinde** 404 olmadığından emin ol

### Sorun Giderme

#### 1. Workflow Çalışmıyor

**Sorun**: Push yapıyorum ama workflow tetiklenmiyor

**Çözüm**:
```bash
# .github/workflows/ dizininin commit edildiğinden emin ol
git add .github/workflows/
git commit -m "Add GitHub Actions workflow"
git push origin main

# Manuel tetikle
# GitHub → Actions → Run workflow
```

#### 2. Build Başarısız

**Sorun**: `npm run build` hatası

**Çözüm**:
```bash
# Local'de test et
cd website
npm install
npm run build

# Hataları düzelt ve tekrar push et
```

#### 3. 404 Not Found

**Sorun**: Deployment başarılı ama sayfa 404 veriyor

**Çözüm**:
- GitHub Settings → Pages → Source: **GitHub Actions** olmalı
- `.nojekyll` dosyası dist/ klasöründe olmalı (workflow otomatik ekliyor)
- `index.html` dosyası dist/ root'unda olmalı

#### 4. Assets Yüklenmiyor

**Sorun**: CSS/JS dosyaları 404 veriyor

**Çözüm**:
```bash
# vite.config.ts dosyasında base path kontrol et
# base: '/' olmalı (repository adı değil)

export default defineConfig({
  base: '/',  // ✅ Doğru
  // base: '/dragkit/',  // ❌ Yanlış (subpath varsa kullan)
})
```

#### 5. Permissions Hatası

**Sorun**: `Resource not accessible by integration`

**Çözüm**:
1. Settings → Actions → General
2. Workflow permissions → **Read and write permissions**
3. Save

#### 6. Custom Domain Çalışmıyor

**Sorun**: dragkit.oxog.dev açılmıyor

**Çözüm**:
1. DNS ayarlarının yayılmasını bekle (24-48 saat)
2. `dig dragkit.oxog.dev` ile DNS'i kontrol et
3. GitHub Pages → Custom domain'e tekrar ekle
4. CNAME dosyasının website/dist/'de olduğundan emin ol

### Environment Variables (Opsiyonel)

Eğer API keys veya secret'lar kullanmanız gerekirse:

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Workflow'da kullan:

```yaml
- name: Build website
  env:
    VITE_API_KEY: ${{ secrets.API_KEY }}
  run: npm run build
```

### Monitoring

#### Build Status Badge

README.md'ye ekle:

```markdown
![Deploy Website](https://github.com/ersinkoc/dragkit/workflows/Deploy%20Website%20to%20GitHub%20Pages/badge.svg)
```

#### Deployment History

- Actions sekmesinde tüm deploymentları görüntüle
- Her deployment için logs incelenebilir
- Failed deploymentları yeniden çalıştırabilirsin

### Best Practices

1. **Test before deploy**: Local'de build'i test et
2. **Semantic versioning**: Önemli değişikliklerde version bump yap
3. **Changelog**: CHANGELOG.md'yi güncelle
4. **Branch protection**: main branch'i koru, PR'lar üzerinden merge yap
5. **Review deployments**: Deployment'tan önce preview URL'lerde kontrol et

### Performance Optimization

```bash
# Build size analizi
cd website
npm run build -- --mode analyze

# Lighthouse audit
npx lighthouse https://dragkit.oxog.dev --view
```

### Rollback (Geri Alma)

Eğer deployment'ta sorun olursa:

```bash
# 1. Önceki commit'e geri dön
git revert HEAD
git push origin main

# 2. Veya doğrudan eski commit'i deploy et
git checkout <old-commit-hash>
git push -f origin main

# 3. Workflow otomatik çalışacak ve eski versiyonu deploy edecek
```

### Multi-Environment Setup (Gelişmiş)

Development, staging, production ortamları için:

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    # ... staging ortamına deploy et
```

---

## NPM Package Deployment

### NPM'e Publish

```bash
# 1. Version bump
npm version patch  # veya minor, major

# 2. Build
npm run build

# 3. Test
npm test

# 4. Publish
npm publish --access public

# 5. Git push
git push --follow-tags
```

### Otomatik NPM Publish (GitHub Actions)

`.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Checklist

Deployment öncesi kontrol listesi:

- [ ] `npm run build` başarılı
- [ ] `npm test` başarılı
- [ ] TypeScript errors yok
- [ ] Lint errors yok
- [ ] CHANGELOG.md güncellendi
- [ ] Version number güncellendi
- [ ] README.md güncel
- [ ] GitHub Actions permissions doğru
- [ ] DNS ayarları yapıldı (custom domain için)
- [ ] .nojekyll dosyası var
- [ ] Screenshots/assets commit edildi

---

**Son Güncelleme**: 2025-12-28
**Maintainer**: Ersin KOÇ
