function getBasePath() {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname;
  const routeIndex = ['/urunler', '/admin'].map((part) => pathname.indexOf(part)).find((index) => index >= 0);
  if (routeIndex !== undefined) return `${pathname.slice(0, routeIndex)}/`.replace(/\/+/g, '/');
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export const siteBasePath = getBasePath();
export const homeHref = siteBasePath;
export const productsHref = `${siteBasePath}urunler/`;
export const productHref = (slug) => `${productsHref}${slug}/`;
export const assetHref = (path) => `${siteBasePath}${String(path).replace(/^\/+/, '')}`;

export function getCurrentProductSlug() {
  if (typeof window === 'undefined') return null;
  const match = window.location.pathname.match(/\/urunler\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

