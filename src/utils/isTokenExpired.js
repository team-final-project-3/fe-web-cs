// utils/isTokenExpired.js
export default function isTokenExpired(token) {
  try {
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp < now;
  } catch (e) {
    return true; // Jika token tidak bisa di-decode, anggap invalid
  }
}
