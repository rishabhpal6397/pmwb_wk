import { createContext, useContext, useState, useEffect } from 'react';

// Storage keys
const USERS_KEY   = 'pmwb_users';
const SESSION_KEY = 'pmwb_session';

// Helpers 
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
  catch { return null; }
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

//  Validation (regex) 
export const REGEX = {
  email:    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
};

//  Context 
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession);

  useEffect(() => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else      localStorage.removeItem(SESSION_KEY);
  }, [user]);

  
  async function login(email, password) {
    const users = getUsers();
    const found = users.find(u => u.email === email && u.passwordHash === btoa(password));
    if (!found) return { success: false, error: 'Invalid email or password.' };
    const { passwordHash, ...authUser } = found;
    setUser(authUser);
    return { success: true };
  }

  async function register(username, email, password) {
    const users = getUsers();
    if (users.find(u => u.email === email))
      return { success: false, error: 'An account with this email already exists.' };
    const newUser = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash: btoa(password),
    };
    saveUsers([...users, newUser]);
    const { passwordHash, ...authUser } = newUser;
    setUser(authUser);
    return { success: true };
  }

  function logout() { setUser(null); }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}