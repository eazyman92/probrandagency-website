# ProBrand Agency Website

A multipage website for ProBrand Agency, founded by Aminata Jabateh in Houston, Texas. It presents Digital Products, Digital Services, Funding Readiness & Strategy, published books, and consultation inquiries.

Built with Node.js, HTML, CSS, and browser JavaScript. No framework, database, or third-party runtime dependencies are required.

## Features

- Ten pages: Home, About, Services, three service pages, Books, the first book detail page, Consultations, and Contact.
- Responsive layouts, mobile navigation, expandable FAQs, and scroll animations with reduced-motion support.
- Contact form that validates fields and prepares an email draft, with a copyable fallback. The visitor sends the email using their email application; the server does not store or deliver inquiries.
- Book and consultation inquiry links. Checkout, scheduling, payments, and course enrollment are not yet integrated.

## Requirements and local setup

Use a supported Node.js LTS release with npm, Git, and access to the private repository. Run these commands in Git Bash or a terminal:

```bash
git clone https://github.com/eazyman92/probrandagency-website.git
cd probrandagency-website
npm run check
npm start
```

Open http://127.0.0.1:4173. Stop with Ctrl+C. No `npm install` is required because there are no dependencies. If you already have the project locally, run commands from the folder containing `package.json` instead of cloning again.

| Command | Purpose |
| --- | --- |
| `npm start` | Generate pages and start the server |
| `npm run dev` | Same server for local development |
| `npm run build` | Generate the ten HTML pages |
| `npm run check` | Check JavaScript syntax |

The server listens on **127.0.0.1:4173**. It does not currently read `HOST` or `PORT` environment variables. On a server, use a reverse proxy in front of it.

## Project structure and editing

| Path | Purpose |
| --- | --- |
| `src/build.mjs` | Page content, templates, shared layout, and HTML generator |
| `src/server.mjs` | Node HTTP server with an explicit route allowlist |
| `src/app.js` | Navigation, scroll animations, and contact email behavior |
| `src/styles.css`, `src/enhancements.css` | Layout and styling |
| `public/` | Generated HTML; overwritten by builds |
| `content/company/company-copy-draft.json` | Company wording consumed by the generator |
| `brand/logo/originals/` | Logo used by the server |
| `assets/generated/hero/` | Illustrative homepage image |
| `assets/reference/founder/` | Founder photograph used by the server |
| `assets/approved/books/` | Supplied book cover used by the server |

Edit source templates or company JSON, then run `npm run build` and refresh. CSS and browser JavaScript edits need a refresh. Server changes require a restart. Preserve asset filenames or update their routes in `src/server.mjs`. The founder crop uses `object-position: 50% 5%` in `src/styles.css`.

Planning documents and the original sketch may also exist locally, but are not needed to run the website. Do not serve the entire repository as a public directory.

## Deploy to a Linux server

The following example uses a Linux VPS with Node.js, systemd, Nginx, SSH access, and administrator permission. A static-only hosting plan cannot run this version. GitHub push alone does not deploy the site.

### 1. Clone and verify

As the non-root account that will run the application:

```bash
git clone https://github.com/eazyman92/probrandagency-website.git
cd probrandagency-website
npm run check
npm run build
pwd
command -v node
```

Authenticate to the private repository using your own GitHub access method. Keep credentials out of project files and remote URLs. Record the project directory and Node executable paths printed above.

Keep `src/`, the company JSON, and all four image directories listed above in the deployment. **The `public/` folder alone does not contain the CSS, scripts, and images needed by this server.**

### 2. Create a systemd service

Save this as `/etc/systemd/system/probrand.service`. Replace `YOUR_USER`, `/absolute/project/path`, and `/absolute/path/to/node` with the real account and absolute paths. The service account must be able to write `public/` because startup generates the pages.

```ini
[Unit]
Description=ProBrand Agency website
After=network.target

[Service]
Type=simple
User=YOUR_USER
WorkingDirectory=/absolute/project/path
ExecStart=/absolute/path/to/node /absolute/project/path/src/server.mjs
Environment=NODE_ENV=production
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now probrand
sudo systemctl status probrand
curl -I http://127.0.0.1:4173/
```

### 3. Configure Nginx and your domain

Install Nginx using your server's package manager if needed. Add this server block to its HTTP configuration, using the domain you control. On Ubuntu/Debian, save it as `/etc/nginx/sites-available/probrand`:

```nginx
server {
    listen 80;
    server_name probrandagency.com www.probrandagency.com;

    location / {
        proxy_pass http://127.0.0.1:4173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

On Ubuntu/Debian, enable the file once, check configuration, and reload:

```bash
sudo ln -s /etc/nginx/sites-available/probrand /etc/nginx/sites-enabled/probrand
sudo nginx -t
sudo systemctl reload nginx
```

Check for conflicting existing domain configurations before enabling the file. Point the domain DNS records to the server and permit HTTP/HTTPS in the firewall. Configure a trusted HTTPS certificate using your hosting provider or certificate tooling before public launch. The example above provides HTTP only. Port 4173 stays private to localhost.

### 4. Verify

Check every page, images, styling, mobile menu, FAQs, animations, contact email behavior, domain redirects, and HTTPS. Verify that internal paths such as `/planning/` return 404.

## Public launch and indexing

**Search indexing is currently disabled** by a robots meta tag in `src/build.mjs` and the `X-Robots-Tag` response header in `src/server.mjs`. Keep these for staging. At approved public launch, remove both noindex restrictions, rebuild, restart, and verify the resulting HTML and headers. Setting `NODE_ENV=production` does not remove them automatically.

Before launch, review company wording, public contact details, service scope, palette, and image publication quality. A clean cover, purchase URL, consultation terms, and scheduling/payment providers remain outstanding. Published courses will be added when provided. Sitemap and other domain-specific SEO work remain to be completed.

## Deploying updates

After committing and pushing local changes, run on the server from the project directory:

```bash
git pull --ff-only origin main
npm run check
npm run build
sudo systemctl restart probrand
sudo systemctl status probrand
```

Record the current commit or take a backup before updating production. If the pull or checks fail, resolve the error before restarting. Verify changed pages after deployment.

## Troubleshooting

- **Port in use:** stop the previous server instance before starting another.
- **Nginx 502:** check `sudo systemctl status probrand` and `sudo journalctl -u probrand -n 100 --no-pager`; verify localhost port 4173 responds.
- **Missing images or startup errors:** check asset paths, the company JSON, permissions, and service working directory.
- **Old wording:** rebuild and refresh; restart after server changes.
- **Email application does not open:** copy the prepared message and email `info@probrandagency.com` manually.
- **Unstyled pages on static hosting:** this version needs its Node server; uploading `public/` alone is insufficient.

## Verification status

Local syntax and build checks have passed. Previous checks covered ten pages, 156 internal links, mobile navigation, and contact layout. The server deployment recipe above has not been executed on your hosting account. No live scheduling, payment, or email delivery verification is claimed.
