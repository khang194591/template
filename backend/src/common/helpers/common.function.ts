export function generateHashToken(id: number): string {
  const random = Math.floor(Math.random() * (10000 - 1000) + 1000);
  return `${id}-${Date.now()}-${random}`;
}

export function extractToken(authorization = '') {
  if (/^Bearer /.test(authorization)) {
    return authorization.substring(7, authorization.length);
  }
  return '';
}
