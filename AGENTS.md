# AGENTS.md

## Cursor Cloud specific instructions

### What this repo is

WordPress plugins for Tamil/Vedic astrology (not a Node monorepo):

| Product | Path | Shortcode |
|---------|------|-----------|
| Pancha Pakshi Calculator | Repo root (`pancha-pakshi.php`, `pancha_pakshi_calculator.py`) | `[pancha_pakshi_calculator]` |
| Atchaya Jyothi Panchang | `atchaya-jyothi-panchang-plugin/` | `[atchaya_panchang]` |

PHP calls Python via `shell_exec()`. Pancha Pakshi **requires** `pyswisseph` when running through WordPress (see `INSTALLATION_FIX.md`). Panchang’s `panchang_calc.py` uses Python stdlib only.

### Python (calculation-only, no WordPress)

```bash
python3 pancha_pakshi_calculator.py "Name" "1990-01-01" "12:00" "Chennai"
python3 atchaya-jyothi-panchang-plugin/panchang_calc.py '{"date":"2026-05-30","latitude":13.0827,"longitude":80.2707}'
```

### Local WordPress dev stack (VM)

A full WP instance is provisioned at **`/home/ubuntu/wordpress-dev`** with plugins symlinked from this repo:

- `wp-content/plugins/pancha-pakshi` → `/workspace`
- `wp-content/plugins/atchaya-jyothi-panchang` → `/workspace/atchaya-jyothi-panchang-plugin`

**Start services (each new VM session):**

1. MariaDB: `sudo service mariadb start`
2. Web server (tmux recommended): from `/home/ubuntu/wordpress-dev`, run `php -S 127.0.0.1:8080`

**URLs / credentials:**

- Site: http://127.0.0.1:8080/
- Admin: `admin` / `adminpass` (http://127.0.0.1:8080/wp-admin/)
- Demo pages: Pancha Pakshi `?page_id=4`, Panchang `?page_id=5`

**WP-CLI:** `php /tmp/wp-cli.phar` (from `/home/ubuntu/wordpress-dev`).

### Gotchas

- **`pyswisseph` build**: needs `python3-dev` and `build-essential` on Ubuntu before `pip3 install --user pyswisseph`.
- **PHP → Python**: uses `/usr/bin/python3`, which picks up user-site packages under `~/.local/lib/python3.12/site-packages` on this VM.
- **No automated lint/test suite** in the repo; validate via the Python commands above and/or the WP pages + `admin-ajax.php` endpoints (`pancha_pakshi_calculate`, `atchaya_get_panchang`).
- **Optional**: Nominatim (OpenStreetMap) for city autocomplete in the browser; fixed cities work offline.

See `README.md`, `INSTALLATION_GUIDE.md`, and `INSTALLATION_FIX.md` for production deployment notes.
