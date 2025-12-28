# DNS Setup for dragkit.oxog.dev

## Custom Domain Configuration

Website URL: **dragkit.oxog.dev**

---

## DNS Ayarları (Domain Provider)

Domain sağlayıcınızda (GoDaddy, Cloudflare, Namecheap, vb.) aşağıdaki DNS kayıtlarını ekleyin:

### Yöntem 1: CNAME Record (Önerilen)

```
Type: CNAME
Name: dragkit
Value: ersinkoc.github.io
TTL: 3600 (veya Auto)
```

### Yöntem 2: A Records (Alternatif)

Eğer CNAME çalışmazsa, A records kullanın:

```
Type: A
Name: dragkit
Value: 185.199.108.153
TTL: 3600

Type: A
Name: dragkit
Value: 185.199.109.153
TTL: 3600

Type: A
Name: dragkit
Value: 185.199.110.153
TTL: 3600

Type: A
Name: dragkit
Value: 185.199.111.153
TTL: 3600
```

---

## GitHub Pages Settings

1. GitHub Repository: https://github.com/ersinkoc/DragKit
2. **Settings** → **Pages**
3. **Custom domain** alanına: **dragkit.oxog.dev** yazın
4. **Enforce HTTPS** seçeneğini işaretleyin (SSL için)
5. **Save**

⚠️ **NOT**: DNS ayarlarının yayılması 24-48 saat sürebilir.

---

## Domain Provider Örnekleri

### Cloudflare

1. Dashboard → **DNS** → **Records**
2. **Add record**
3. Type: **CNAME**
4. Name: **dragkit**
5. Target: **ersinkoc.github.io**
6. Proxy status: **DNS only** (turuncu bulut)
7. Save

### GoDaddy

1. My Products → Domain → **Manage DNS**
2. **Add** button
3. Type: **CNAME**
4. Name: **dragkit**
5. Value: **ersinkoc.github.io**
6. TTL: **1 Hour**
7. Save

### Namecheap

1. Domain List → **Manage**
2. **Advanced DNS** tab
3. **Add New Record**
4. Type: **CNAME Record**
5. Host: **dragkit**
6. Value: **ersinkoc.github.io**
7. TTL: **Automatic**
8. Save

---

## DNS Doğrulama

DNS ayarlarının doğru yapıldığını kontrol edin:

### Terminal / Command Line

```bash
# CNAME kaydını kontrol et
nslookup dragkit.oxog.dev

# Veya dig ile
dig dragkit.oxog.dev

# Windows PowerShell
Resolve-DnsName dragkit.oxog.dev
```

### Online Tools

- https://dnschecker.org/
- https://www.whatsmydns.net/
- https://mxtoolbox.com/SuperTool.aspx

Doğru yapıldıysa şu sonucu görmelisiniz:
```
dragkit.oxog.dev -> ersinkoc.github.io
```

---

## Beklenen Timeline

1. **0-5 dakika**: DNS kaydı eklendi
2. **5-30 dakika**: DNS yayılmaya başladı (bazı DNS serverlar)
3. **1-4 saat**: Çoğu DNS server güncellendi
4. **24-48 saat**: Tüm dünyada DNS tam yayıldı

---

## GitHub Pages'de Custom Domain Kontrolü

### Başarılı Kurulum

GitHub Settings → Pages bölümünde şu mesajı görmelisiniz:

✅ **Your site is live at https://dragkit.oxog.dev**

### DNS Kontrol Ediliyor

⚠️ **DNS check in progress**

Bu mesajı görüyorsanız:
- DNS ayarlarının yayılmasını bekleyin (1-4 saat)
- DNS kayıtlarının doğru olduğundan emin olun
- Sayfayı yenileyin

### Hata Durumu

❌ **DNS check failed**

Çözüm:
1. DNS kayıtlarını tekrar kontrol edin
2. CNAME kaydının **ersinkoc.github.io** olduğundan emin olun
3. TTL süresini bekleyin
4. GitHub'da custom domain'i kaldırıp tekrar ekleyin

---

## HTTPS / SSL Sertifikası

GitHub Pages otomatik olarak Let's Encrypt SSL sertifikası sağlar.

**Enforce HTTPS** seçeneği:
- DNS doğrulaması tamamlandıktan sonra aktif edilebilir
- SSL sertifikası oluşması 5-15 dakika sürer
- Aktif olduktan sonra http:// otomatik https:// yönlendirilir

---

## Test Etme

DNS ve deployment tamamlandıktan sonra:

```bash
# HTTP test (yönlendirilmeli)
curl -I http://dragkit.oxog.dev

# HTTPS test
curl -I https://dragkit.oxog.dev

# SSL sertifika kontrolü
openssl s_client -connect dragkit.oxog.dev:443 -servername dragkit.oxog.dev
```

Tarayıcıda ziyaret edin:
- https://dragkit.oxog.dev

✅ DragKit documentation website görüntülenmeli!

---

## Sorun Giderme

### DNS yayılmıyor

**Sorun**: 24 saat geçti ama hala çalışmıyor

**Çözüm**:
```bash
# Cache'i temizle
ipconfig /flushdns  # Windows
sudo dscacheutil -flushcache  # macOS
sudo systemd-resolve --flush-caches  # Linux

# Farklı DNS server dene
# Google DNS: 8.8.8.8
# Cloudflare DNS: 1.1.1.1
```

### SSL sertifikası yüklenmiyor

**Sorun**: Enforce HTTPS seçeneği gri/disabled

**Çözüm**:
1. DNS'in tam yayıldığından emin olun
2. Custom domain'i GitHub'dan kaldırın
3. 5 dakika bekleyin
4. Tekrar ekleyin ve DNS check'i bekleyin
5. Enforce HTTPS aktif olacak

### CNAME file silinmeye devam ediyor

**Sorun**: Her deployment'ta CNAME siliniyor

**Çözüm**:
✅ Zaten düzeltildi! Workflow'da otomatik ekleniyor:
```yaml
- name: Add CNAME file for custom domain
  run: echo "dragkit.oxog.dev" > website/dist/CNAME
```

---

## Özet Checklist

Deployment için:

- [x] CNAME dosyası website/public/CNAME'de
- [x] Workflow'da CNAME otomatik ekleniyor
- [ ] DNS provider'da CNAME kaydı eklendi
- [ ] GitHub Pages'de custom domain ayarlandı
- [ ] DNS yayıldı (1-4 saat)
- [ ] HTTPS/SSL aktif
- [ ] https://dragkit.oxog.dev çalışıyor

---

## Faydalı Linkler

- [GitHub Pages Custom Domain Docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [DNS Checker](https://dnschecker.org/)
- [What's My DNS](https://www.whatsmydns.net/)
- [SSL Checker](https://www.sslshopper.com/ssl-checker.html)

---

**Domain**: dragkit.oxog.dev
**GitHub Pages URL**: ersinkoc.github.io/dragkit
**Repository**: github.com/ersinkoc/DragKit

**Son Güncelleme**: 2025-12-28
