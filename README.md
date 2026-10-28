# PhishGuard

**An educational phishing-awareness web application built with React, TypeScript, and Flask.**

PhishGuard helps users inspect URLs and email text for common phishing warning indicators and evaluate basic password strength.

## Live Demo

- **Live Website:** https://phish-guard-bgss7u20v-sandunidilrukshika.vercel.app
- **Backend API Health:** https://phishguard-api-08fr.onrender.com/api/health

## Features

- **URL Analyzer:** Analyzes URLs for common warning indicators.
- **Email Analyzer:** Checks email text for suspicious wording and extracts visible HTTP/HTTPS URLs.
- **Password Strength Checker:** Evaluates password length and character variety locally in the browser.
- **URL Scan History:** Stores up to five recent URL analysis results in browser local storage.

## Screenshots

### URL Analyzer

![PhishGuard URL Analyzer](docs/screenshots/01-url-analyzer.png)

### Email Analyzer

![PhishGuard Email Analyzer](docs/screenshots/02-email-analyzer.png)

### Password Strength Checker

![PhishGuard Password Strength Checker](docs/screenshots/03-password-checker.png)

### URL Scan History

![PhishGuard URL Scan History](docs/screenshots/04-scan-history.png)

## Technology Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Python
- Flask
- Flask-CORS
- Gunicorn

## Running Locally

### Backend

Open PowerShell:

```powershell
cd E:\PhishGuard\backend
.\.venv\Scripts\Activate.ps1
python app.py
```

The local API runs at `http://127.0.0.1:5000`.

### Frontend

Open a second PowerShell window:

```powershell
cd E:\PhishGuard\frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

### Validation

Run these commands from the frontend directory:

```powershell
npm run build
npm run lint
```

## Deployment

- **Frontend:** Vercel
- **Backend:** Render
- The frontend connects to the backend using `VITE_API_BASE_URL`.
- The backend provides an `/api/health` endpoint.

## Security and Limitations

PhishGuard is an educational demonstration, not a production-grade phishing detection service.

- URL and email analysis uses heuristic indicators and may produce false positives or miss malicious content.
- A low-risk result does not guarantee that a URL or email is safe.
- The password checker performs basic checks only and does not check breached-password databases.
- Do not enter real passwords, credentials, one-time codes, or confidential email content.
- Scan history is stored in browser local storage and is not a secure long-term record system.

## Project Status

The core features have been deployed and tested on the live website, including URL analysis, email analysis, password strength checks, and URL scan history persistence.

This project demonstrates frontend development, API integration, basic cybersecurity concepts, and full-stack application deployment.