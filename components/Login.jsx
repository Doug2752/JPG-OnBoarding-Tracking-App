import React, { useState } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#000000',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  logo: {
    marginBottom: '24px',
  },
  headerText: {
    color: '#B8912A',
    fontSize: '13px',
    fontWeight: '600',
    letterSpacing: '2px',
    margin: '0 0 28px 0',
    textAlign: 'center',
  },
  appTitle: {
    color: '#B8912A',
    fontSize: '26px',
    fontWeight: '700',
    letterSpacing: '1px',
    margin: '0 0 36px 0',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '320px',
    gap: '14px',
  },
  input: {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333333',
    color: '#e8e8e8',
    padding: '13px 15px',
    fontSize: '14px',
    borderRadius: '4px',
    fontFamily: 'inherit',
    outline: 'none',
  },
  checkboxWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '4px 0',
  },
  checkboxInput: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: '#B8912A',
  },
  checkboxLabel: {
    color: '#9a9a9a',
    fontSize: '13px',
    cursor: 'pointer',
    userSelect: 'none',
  },
  errorMsg: {
    color: '#ff6b6b',
    fontSize: '12px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#B8912A',
    color: '#000000',
    border: 'none',
    padding: '14px',
    fontSize: '14px',
    fontWeight: '700',
    letterSpacing: '1px',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
    fontFamily: 'inherit',
  },
  footer: {
    position: 'fixed',
    bottom: '20px',
    color: '#9a9a9a',
    fontSize: '11px',
    letterSpacing: '1px',
    textAlign: 'center',
    width: '100%',
  },
};

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setError('');
    onLogin(username.trim());
  }

  return (
    <div style={styles.container}>

      <img
        src="jpglogo.png"
        alt="Jones Performance Group"
        style={{ width: '280px', marginBottom: '20px' }}
      />

      <div style={styles.appTitle}>14 DAY TRACKING</div>

      <form style={styles.form} onSubmit={handleSubmit}>

        <input
          style={styles.input}
          type="text"
          placeholder="Performer"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoComplete="username"
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <div style={styles.checkboxWrapper}>
          <input
            style={styles.checkboxInput}
            type="checkbox"
            id="stayLoggedIn"
            checked={stayLoggedIn}
            onChange={e => setStayLoggedIn(e.target.checked)}
          />
          <label style={styles.checkboxLabel} htmlFor="stayLoggedIn">
            Stay logged in for 30 days
          </label>
        </div>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <button style={styles.button} type="submit">ENTER</button>

      </form>

      <div style={styles.footer}>JONES PERFORMANCE GROUP LLC — CONFIDENTIAL</div>

    </div>
  );
}
