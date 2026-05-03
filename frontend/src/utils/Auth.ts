export function parseJwt(token: string) {
  const base64 = token.split('.')[1];
  return JSON.parse(atob(base64));
}
