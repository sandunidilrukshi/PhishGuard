
import { useState } from 'react'

type EmailAnalysis = {
  risk: 'Low' | 'Medium' | 'High'
  reasons: string[]
  urls: string[]
}

function analyzeEmail(subject: string, body: string): EmailAnalysis {
  const text = `${subject}\n${body}`
  const reasons: string[] = []

  const rules = [
    {
      pattern: /\b(urgent|immediately|act now|final warning|account suspended)\b/i,
      reason: 'Urgent or threatening language detected.',
    },
    {
      pattern: /\b(password|login credentials|verify your account|sign in)\b/i,
      reason: 'A request related to account access or credentials was detected.',
    },
    {
      pattern: /\b(send money|wire transfer|payment required|bank details|credit card)\b/i,
      reason: 'A financial or payment-related request was detected.',
    },
    {
      pattern: /\b(click here|open the attachment|download now)\b/i,
      reason: 'A message encouraging you to click or download was detected.',
    },
    {
      pattern: /\b(prize winner|you have won|claim your reward)\b/i,
      reason: 'Prize or reward-related wording was detected.',
    },
  ]

  for (const rule of rules) {
    if (rule.pattern.test(text)) {
      reasons.push(rule.reason)
    }
  }

  const urls = text.match(/https?:\/\/[^\s<>"']+/gi) ?? []

  if (urls.length > 0) {
    reasons.push(`The message contains ${urls.length} URL(s). Review them carefully before opening.`)
  }

  let risk: EmailAnalysis['risk'] = 'Low'

  if (reasons.length >= 3) {
    risk = 'High'
  } else if (reasons.length > 0) {
    risk = 'Medium'
  }

  if (reasons.length === 0) {
    reasons.push('No indicators matched the basic checks. This does not prove the email is safe.')
  }

  return { risk, reasons, urls }
}

export default function EmailAnalyzer() {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [result, setResult] = useState<EmailAnalysis | null>(null)
  const [error, setError] = useState('')

  function handleAnalyze() {
    if (!subject.trim() && !body.trim()) {
      setResult(null)
      setError('Enter an email subject or message body first.')
      return
    }

    setError('')
    setResult(analyzeEmail(subject, body))
  }

  return (
    <section className="analyzer-panel email-analyzer" id="email-analyzer">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MESSAGE INSPECTION</p>
          <h2>Email Analyzer</h2>
        </div>
        <span className="online-label">Local checks</span>
      </div>

      <p className="section-description">
        Check email text for common phishing warning indicators.
        Analysis runs locally in your browser.
      </p>

      <label className="input-label" htmlFor="email-subject">
        Email subject
      </label>
      <input
        className="email-input"
        id="email-subject"
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        placeholder="Example: Urgent account verification"
        maxLength={300}
      />

      <label className="input-label email-body-label" htmlFor="email-body">
        Email message
      </label>
      <textarea
        className="email-textarea"
        id="email-body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        placeholder="Paste the email text here. Do not include private information."
        rows={7}
        maxLength={10000}
      />

      <button className="email-analyze-button" type="button" onClick={handleAnalyze}>
        Analyze Email
      </button>

      {error && <p className="input-error" role="alert">{error}</p>}

      {result && (
        <div className={`result-card risk-${result.risk.toLowerCase()}`} aria-live="polite">
          <div className="result-header">
            <div>
              <p className="eyebrow">LOCAL ANALYSIS RESULT</p>
              <h3>{result.risk} indicator level</h3>
            </div>
            <span className="risk-badge">{result.risk}</span>
          </div>

          <h4>Findings</h4>
          <ul className="detailed-findings">
            {result.reasons.map((reason, index) => (
              <li className="finding-item" key={`${index}-${reason}`}>
                <span className="finding-number">{index + 1}</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>

          {result.urls.length > 0 && (
            <div className="result-url-section">
              <strong>URLs found in the message</strong>
              <ul>
                {result.urls.map((foundUrl, index) => (
                  <li key={`${index}-${foundUrl}`}>{foundUrl}</li>
                ))}
              </ul>
              <p>Do not open these links just to test them.</p>
            </div>
          )}

          <div className="recommendation">
            <strong>Recommended action</strong>
            <p>
              Verify the sender through a trusted channel. Do not share passwords,
              payment details, or one-time codes in response to an unexpected email.
            </p>
          </div>

          <p className="disclaimer">
            This basic keyword-based demo can produce false positives and miss
            phishing messages. A Low result does not mean the email is safe.
          </p>
        </div>
      )}
    </section>
  )
}
