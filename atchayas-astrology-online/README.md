# Atchaya's Astrology Online — WordPress Theme

Premium bilingual (Tamil / English) WordPress theme for **Atchaya's Astrology Online**, built for Tutor LMS, WooCommerce, and Atchaya Jyothi astrology plugins.

**Site:** https://atchayakrishna.com/

## Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Blue | `#0a3d62` | Headers, trust, night sky |
| Gold | `#f39c12` | Accents, CTAs, divine light |
| Cream | `#fffaf0` | Background, clarity |

## Features (v1)

- Custom homepage with hero, course categories, featured courses, Panchang widget, guru profile, blog, CTA
- **Tutor LMS** styling for course archive, single course, lessons, and student dashboard
- **WooCommerce** styling for cart, checkout, and orders
- **Bilingual UI** (EN / தமிழ்) via header language switcher (cookie-based)
- Page templates: **Panchang**, **Pancha Pakshi**, **Full Width**
- Integration with `[atchaya_panchang]` and `[pancha_pakshi_calculator]` shortcodes
- Mobile-first responsive design
- Compatible with Gutenberg, Divi, and Breakdance (page builders work in page content)

## Requirements

- WordPress 6.0+
- PHP 8.0+ (tested with 8.3)
- [Tutor LMS](https://wordpress.org/plugins/tutor/) (free or pro)
- WooCommerce (for paid courses)
- Atchaya Jyothi Panchang plugin (optional)
- Pancha Pakshi Calculator plugin (optional)

## Installation

1. Upload the `atchayas-astrology-online` folder to `/wp-content/themes/`
2. In **Appearance → Themes**, activate **Atchaya's Astrology Online**
3. Go to **Settings → Reading** → set **Homepage** to a static page (create "Home" and assign as front page)
4. Go to **Appearance → Customize → Academy Settings** and configure:
   - Guru name, bio (EN/TA), photo
   - Contact email & phone
   - WhatsApp group link
   - Panchang & Pancha Pakshi page assignments

## Recommended Page Setup

| Page | Slug | Template |
|------|------|----------|
| Home | `/` | Front Page (automatic) |
| About | `/about/` | **About Guru Page** |
| Courses | `/courses/` | Tutor LMS archive |
| Blog | `/blog/` | Posts page |
| Panchang | `/panchang/` | **Panchang Page** |
| Pancha Pakshi | `/pancha-pakshi/` | **Pancha Pakshi Page** |
| Contact | `/contact/` | Default or Full Width |
| Privacy Policy | `/privacy-policy/` | Default |
| Terms | `/terms/` | Default |
| Dashboard | `/dashboard/` | Tutor LMS dashboard page |

### Tutor LMS Setup

1. Install & activate Tutor LMS
2. Complete Tutor setup wizard — set Dashboard page slug to `dashboard`
3. Create course categories matching your syllabus:
   - Astrology – Basics
   - Intermediate
   - Higher
   - Vargachakra
   - Ashtakavarga
   - Prasanna
   - Pancha Pakshi
   - 7th Bava
4. Publish courses (free and paid)

### Menu Setup

**Appearance → Menus → Primary Menu:**

- Home
- About
- Courses
- Blog
- Panchang
- Pancha Pakshi
- Contact

Assign to **Primary Menu** location.

### Homepage Panchang Widget

**Appearance → Widgets → Homepage Panchang:**

Add a **Shortcode** or **Custom HTML** widget with:

```
[atchaya_panchang place="Vellore" style="south"]
```

## Bilingual System

The theme includes a built-in EN / தமிழ் switcher in the header. UI strings (menus, buttons, section titles) switch via cookie (`atchaya_lang`).

For full content translation (pages, courses), use **Polylang** or **WPML** alongside this theme.

## Guru Profile (Pre-configured)

**Founder & Lead Instructor:** Astrologer Ravichandran (ஜோதிடர் ரவிச்சந்திரன்)

Default bios and About page content are built into the theme. Upload guru photo via **Customize → Academy Settings**.

Use the **About Guru Page** template on your `/about/` page for the full profile (journey, mission, student promise).

## Logo

Upload your **ATCHAYAKRISHNA.COM** logo (gold/purple on black) via **Appearance → Customize → Site Identity → Logo**. Recommended height: 72px.

## Payment Gateway (UPI / Cards / Netbanking)

1. Install **WooCommerce**
2. Install **Razorpay for WooCommerce** (or Hostinger's payment plugin)
3. Tutor LMS → Settings → Monetization → **WooCommerce**
4. Enable in WooCommerce → Settings → Payments:
   - UPI
   - Credit / Debit cards
   - Netbanking

Cart and checkout pages show a bilingual note: *"We accept UPI, Credit/Debit cards, and Netbanking."*

## Payment (WooCommerce + Tutor)

1. Install WooCommerce
2. In Tutor LMS → Settings → Monetization → select **WooCommerce**
3. Configure Razorpay via WooCommerce payment gateway plugin on Hostinger (supports UPI, cards, netbanking)

## Logo & Favicon

- Default text logo with gold "A" mark is shown until you upload a custom logo
- SVG logo included at `assets/images/logo.svg`
- Upload logo via **Appearance → Customize → Site Identity**
- Upload favicon (golden "A" or Navagraha grid) via Site Identity

## File Structure

```
atchayas-astrology-online/
├── style.css                 # Theme header
├── functions.php
├── front-page.php            # Homepage
├── header.php / footer.php
├── page-templates/
│   ├── template-panchang.php
│   ├── template-pancha-pakshi.php
│   ├── template-panchang.php
│   └── template-about.php
├── template-parts/
│   ├── hero.php
│   ├── courses-grid.php
│   ├── guru-profile.php
│   └── content-card.php
├── inc/
│   ├── theme-setup.php
│   ├── bilingual.php
│   ├── tutor-lms.php
│   ├── woocommerce.php
│   └── customizer.php
└── assets/
    ├── css/
    ├── js/
    └── images/
```

## v2 Roadmap (not in v1)

- Razorpay deep integration
- Certificates styling
- Consultation booking (Calendly)
- Student horoscope widget
- Muhurta / Rahu Kalam alerts
- Full Polylang string packs

## License

GPL v2 or later
