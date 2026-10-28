
import { useState } from 'react'

type Check = {
  label: string
  passed: boolean
}

function checkPassword(password: string) {
  const checks: Check[] = [
    { label: 'At least 12 characters', passed: password.length >= 12 },
    { label: 'Contains an uppercase letter (A–Z)', passed: /[A-Z]/.test(password) },
    { label: 'Contains a lowercase letter (a–z)', passed: /[a-z]/.test(password) },
    { label: 'Contains a number (0–9)', passed: /\d/.test(password) },
    { label: 'Contains a symbol (e.g. !, @, #)', passed: /[^A-Za-z0-9]/.test(password) },
  ]

  const score = checks.filter((check) => check.passed).length

  let strength = 'Very weak'
  if (score >= 5) strength = 'Stronger'
  else if (score >= 4) strength = 'Moderate'
  else if (score >= 2) strength = 'Weak'

  return { checks, strength, score }
}

export default function PasswordChecker() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const result = checkPassword(password)

  return (
    <section className="analyzer-panel password-checker" id="password-checker">
      <div className="section-heading">
        <div>
          <p className="eyebrow">LOCAL PASSWORD CHECK</p>
          <h2>Password Strength Checker</h2>
        </div>
        <span className="online-label">Browser only</span>
      </div>

      <p className="section-description">
        Check basic password characteristics locally. Your password is not
        uploaded or saved by this feature.
      </p>

      <label className="input-label" htmlFor="password-value">
        Enter a test password
      </label>
      <input
        className="email-input"
        id="password-value"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Enter a password to check"
        autoComplete="off"
        maxLength={128}
      />

      <label className="password-show-option">
        <input
          type="checkbox"
          checked={showPassword}
          onChange={(event) => setShowPassword(event.target.checked)}
        />
        Show password while testing
      </label>

      {password.length > 0 && (
        <div className="password-result" aria-live="polite">
          <div className="password-strength-heading">
            <strong>Basic strength indicator</strong>
            <span>{result.strength}</span>
          </div>

          <p className="password-score">
            {result.score} of {result.checks.length} checks passed
          </p>

          <ul className="password-check-list">
            {result.checks.map((check) => (
              <li key={check.label}>
                <span aria-hidden="true">{check.passed ? '✓' : '○'}</span>
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="disclaimer">
        This is a basic educational check, not a guarantee of password security.
        It does not check whether a password has appeared in data breaches or
        whether it is commonly used. Never enter a real or reused password
        into a demo application.
      </p>
    </section>
  )
}
