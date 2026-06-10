import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, REGEX } from '../context/AuthContext';

// ─── Validation ───────────────────────────────────────────────────────────────

function validateLogin(email, password) {
  const errors = {};
  if (!email)                        errors.email    = 'Email is required.';
  else if (!REGEX.email.test(email)) errors.email    = 'Enter a valid email address.';
  if (!password)                     errors.password = 'Password is required.';
  return errors;
}

function validateRegister(username, email, password, confirm) {
  const errors = {};
  if (!username)                            errors.username = 'Username is required.';
  else if (!REGEX.username.test(username))  errors.username = '3–20 chars, letters, numbers or underscores only.';
  if (!email)                               errors.email    = 'Email is required.';
  else if (!REGEX.email.test(email))        errors.email    = 'Enter a valid email address.';
  if (!password)                            errors.password = 'Password is required.';
  else if (!REGEX.password.test(password))  errors.password = 'Min 8 chars, must include uppercase, lowercase, number and special character (@$!%*?&).';
  if (!confirm)                             errors.confirm  = 'Please confirm your password.';
  else if (password !== confirm)            errors.confirm  = 'Passwords do not match.';
  return errors;
}

// ─── Reusable field ───────────────────────────────────────────────────────────

function Field({ label, type = 'text', value, onChange, error, placeholder }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full text-sm px-3 py-2.5 rounded-lg border ${
            error ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
          } focus:outline-none focus:ring-2 focus:ring-indigo-400 transition`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [mode, setMode]               = useState('login');
  const [loading, setLoading]         = useState(false);
  const [serverError, setServerError] = useState('');
  const [errors, setErrors]           = useState({});

  // Login state
  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm]   = useState('');

  function switchMode(m) {
    setMode(m);
    setErrors({});
    setServerError('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setServerError('');
    const errs = validateLogin(loginEmail, loginPassword);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const result = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!result.success) setServerError(result.error || 'Login failed.');
    else navigate('/dashboard');
  }

  async function handleRegister(e) {
    e.preventDefault();
    setServerError('');
    const errs = validateRegister(regUsername, regEmail, regPassword, regConfirm);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setLoading(true);
    const result = await register(regUsername, regEmail, regPassword);
    setLoading(false);
    if (!result.success) setServerError(result.error || 'Registration failed.');
    else navigate('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">

        {/* Logo + title */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800">PMWB Workbench</h1>
          <p className="text-sm text-slate-500">
            {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* Tab toggle */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden">
          <button
            onClick={() => switchMode('login')}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              mode === 'login' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode('register')}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              mode === 'register' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            Register
          </button>
        </div>

        {/* Server error */}
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-2.5 rounded-lg">
            {serverError}
          </div>
        )}

        {/* Login form */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4" noValidate>
            <Field label="Email"    type="email"    value={loginEmail}    onChange={setLoginEmail}    error={errors.email}    placeholder="you@example.com" />
            <Field label="Password" type="password" value={loginPassword} onChange={setLoginPassword} error={errors.password} placeholder="••••••••" />
            <button type="submit" disabled={loading}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Register form */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4" noValidate>
            <Field label="Username"         value={regUsername} onChange={setRegUsername} error={errors.username} placeholder="john_doe" />
            <Field label="Email"    type="email"    value={regEmail}    onChange={setRegEmail}    error={errors.email}    placeholder="you@example.com" />
            <Field label="Password" type="password" value={regPassword} onChange={setRegPassword} error={errors.password} placeholder="••••••••" />
            <Field label="Confirm Password" type="password" value={regConfirm} onChange={setRegConfirm} error={errors.confirm} placeholder="••••••••" />
            <button type="submit" disabled={loading}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <button onClick={() => navigate('/')}
          className="text-xs text-slate-400 hover:text-slate-600 text-center transition-colors">
          ← Back to home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;