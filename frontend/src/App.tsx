
import { useEffect, useState } from 'react'
import './App.css'
import EmailAnalyzer from './EmailAnalyzer'
import PasswordChecker from './PasswordChecker'

type ScanResult = {
  url: string
  risk: 'Low' | 'Medium' | 'High'
  reasons: string[]
}

function isScanResult(value: unknown): value is ScanResult {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>

  return (
    typeof item.url === 'string' &&
    (item.risk === 'Low' ||
      item.risk === 'Medium' ||
      item.risk === 'High') &&
    Array.isArray(item.reasons) &&
    item.reasons.every((reason) => typeof reason === 'string')
  )
}

function getRiskSummary(risk: ScanResult['risk']) {
  switch (risk) {
    case 'Low':
      return 'Few warning indicators were detected.'
    case 'Medium':
      return 'Some warning indicators need your attention.'
    case 'High':
      return 'Multiple warning indicators were detected.'
  }
}

function getRecommendedAction(risk: ScanResult['risk']) {
  switch (risk) {
    case 'Low':
      return 'Continue cautiously. A low indicator level does not prove that this URL is safe.'
    case 'Medium':
      return 'Check the findings carefully. Avoid entering passwords or personal information until you verify the website.'
    case 'High':
      return 'Avoid opening the link or entering personal information. Verify the website through an independently trusted source.'
  }
}



function App() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [history, setHistory] = useState<ScanResult[]>(() => {
  try {
    const savedHistory = localStorage.getItem(
      'phishguard-analysis-history',
    )

    if (!savedHistory) {
      return []
    }

    const parsedHistory: unknown = JSON.parse(savedHistory)

    if (!Array.isArray(parsedHistory)) {
      return []
    }

    return parsedHistory
      .filter(isScanResult)
      .slice(0, 5)
  } catch {
    return []
  }
})

useEffect(() => {
  try {
    localStorage.setItem(
      'phishguard-analysis-history',
      JSON.stringify(history),
    )
  } catch {
    setError(
      'Unable to save history in this browser. Browser storage may be unavailable or full.',
    )
  }
}, [history])

async function handleScan() {
  if (!url.trim()) {
    setResult(null)
    setError('Please enter a website URL.')
    return
  }

  setError('')
  setResult(null)
  setIsLoading(true)

  try {
    const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000'
).replace(/\/+$/, '')

const response = await fetch(
  `${apiBaseUrl}/api/analyze-url`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      setError(
        data.error ?? 'URL analysis request failed.',
      )
      return
    }

    const scanResult = data as ScanResult

setResult(scanResult)

setHistory((previousHistory) =>
  [scanResult, ...previousHistory].slice(0, 5),
)
  } catch {
    setError(
      'Cannot connect to PhishGuard backend. Make sure Flask is running.',
    )
  } finally {
    setIsLoading(false)
  }
}


  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon">P</span>
          <span>PhishGuard</span>
        </div>

        <p className="nav-heading">WORKSPACE</p>
        <a className="nav-link active" href="#overview">▦ Overview</a>
        <a className="nav-link" href="#url-analyzer">⌕ URL Analyzer</a>
        <a className="nav-link" href="#email-analyzer">✉ Email Analyzer</a>
        <a className="nav-link" href="#password-checker">♙ Password Checker</a>

        <div className="sidebar-note">
          <span className="status-dot" />
          <strong>Local demo</strong>
          <p>Basic checks only. No threat-intelligence API connected yet.</p>
        </div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">CYBERSECURITY WORKSPACE</p>
            <h1>Security Overview</h1>
          </div>
          <span className="demo-badge">DEMO MODE</span>
        </header>

        <section className="welcome-panel">
          <div>
            <p className="eyebrow">YOUR DIGITAL SAFETY, SIMPLIFIED</p>
            <h2>Stay alert. Browse smarter.</h2>
            <p>
              Inspect suspicious links and learn about common phishing
              indicators before interacting with them.
            </p>
            <a className="primary-button" href="#url-analyzer">
              Analyze a URL <span>→</span>
            </a>
          </div>
          <div className="shield-art" aria-hidden="true">♢</div>
        </section>

        <section className="stats-grid" aria-label="Project status">
          <article className="stat-card">
            <span className="stat-icon purple">⌕</span>
            <p>URL ANALYZER</p>
            <h3>Ready</h3>
            <span className="stat-caption">Basic local checks</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon blue">✉</span>
            <p>EMAIL ANALYZER</p>
            <h3>Coming soon</h3>
            <span className="stat-caption">Next development step</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon orange">♙</span>
            <p>PASSWORD CHECKER</p>
            <h3>Coming soon</h3>
            <span className="stat-caption">No passwords are collected</span>
          </article>
        </section>

        <section className="analyzer-panel" id="url-analyzer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LINK INSPECTION</p>
              <h2>URL Analyzer</h2>
            </div>
            <span className="online-label"><span className="status-dot" /> Local checks</span>
          </div>

          <p className="section-description">
            Enter a URL to inspect its structure for a few common warning
            indicators. Do not open suspicious links to test them.
          </p>

          <label className="input-label" htmlFor="url-input">Website URL</label>
          <div className="url-form">
            <input
              id="url-input"
              type="text"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') handleScan()
              }}
              placeholder="https://example.com"
              autoComplete="off"
            />
            <button
  type="button"
  onClick={handleScan}
  disabled={isLoading}
>
  {isLoading ? 'Analyzing...' : 'Analyze URL'}
</button>
          </div>
          {error && (
  <p className="input-error" role="alert">
    {error}
  </p>
)}

         {result && (
  <div
    className={`result-card risk-${result.risk.toLowerCase()}`}
    aria-live="polite"
  >
    <div className="result-header">
      <div>
        <p className="eyebrow">LOCAL ANALYSIS RESULT</p>
        <h3>{result.risk} indicator level</h3>
        <p className="risk-summary">
          {getRiskSummary(result.risk)}
        </p>
      </div>

      <span className="risk-badge">{result.risk}</span>
    </div>

    <div className="risk-metrics">
      <div className="risk-metric">
        <span className="risk-metric-label">Risk indicator</span>
        <strong>{result.risk}</strong>
      </div>

      <div className="risk-metric">
        <span className="risk-metric-label">Findings detected</span>
        <strong>{result.reasons.length}</strong>
      </div>
    </div>

    <div className="result-url-section">
      <strong>Analyzed URL</strong>
      <p className="result-url">{result.url}</p>
    </div>

    <div className="findings-section">
      <h4>Why was this result given?</h4>

      {result.reasons.length === 0 ? (
        <p className="no-findings">
          No warning indicators were reported by these basic checks.
          This does not prove that the URL is safe.
        </p>
      ) : (
        <ul className="detailed-findings">
          {result.reasons.map((reason, index) => (
            <li
              key={`${index}-${reason}`}
              className="finding-item"
            >
              <span className="finding-number">{index + 1}</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      )}
    </div>

    <div className={`recommendation risk-${result.risk.toLowerCase()}`}>
      <strong>Recommended action</strong>
      <p>{getRecommendedAction(result.risk)}</p>
    </div>

    <p className="disclaimer">
      This is a simple heuristic demo, not a verified phishing detector.
      Risk levels reflect basic URL indicators only. A low indicator
      level does not mean a URL is safe.
    </p>
  </div>
)}
        </section>

                <section className="history-panel" id="analysis-history">
          <div className="section-heading">
            <div>
              <p className="eyebrow">RECENT ACTIVITY</p>
              <h2>Analysis History</h2>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                className="history-clear-button"
                onClick={() => setHistory([])}
              >
                Clear History
              </button>
            )}
          </div>

          <p className="section-description">
            Your five most recent successful URL analyses in this session.
          </p>

          {history.length === 0 ? (
            <p className="history-empty">
              No analysis history yet. Analyze a URL to see it here.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <article
                  className="history-item"
                  key={`${item.url}-${index}`}
                >
                  <div className="history-item-details">
                    <strong className="history-url">{item.url}</strong>
                    <span className="history-findings">
                      {item.reasons.length} finding(s)
                    </span>
                  </div>

                  <span
                    className={`risk-badge risk-${item.risk.toLowerCase()}`}
                  >
                    {item.risk}
                  </span>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="coming-grid">
         <EmailAnalyzer />
          <PasswordChecker />
        </section>

        <footer>
          PhishGuard · Learning project · Results are informational only
        </footer>
      </main>
    </div>
  )
}

export default App
