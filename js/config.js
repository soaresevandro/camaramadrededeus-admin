const STORAGE_KEY = "camara_admin_session";

export function getSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveSession(apiUrl, apiKey) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ apiUrl, apiKey }));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export function requireSession() {
  const session = getSession();
  if (!session?.apiUrl || !session?.apiKey) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}
