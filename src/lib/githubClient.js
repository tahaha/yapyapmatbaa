/**
 * Admin panelinden GitHub reposuna dosya yazmak için küçük istemci.
 *
 * Site statik olduğu için kalıcı değişiklikler (ör. admin şifresi) repoya commit
 * edilir; GitHub Actions siteyi otomatik olarak yeniden derleyip yayınlar.
 *
 * Erişim anahtarı (token) yalnızca bu tarayıcının localStorage'ında tutulur,
 * hiçbir zaman repoya yazılmaz.
 */

const settingsKey = 'yapyapmatbaa_github_settings_v1';

export const defaultGitHubSettings = {
  owner: 'tahaha',
  repo: 'yapyapmatbaa',
  branch: 'main',
  token: '',
};

export function getGitHubSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(settingsKey));
    return { ...defaultGitHubSettings, ...(stored || {}) };
  } catch {
    return { ...defaultGitHubSettings };
  }
}

export function saveGitHubSettings(settings) {
  const next = {
    owner: String(settings.owner || '').trim(),
    repo: String(settings.repo || '').trim(),
    branch: String(settings.branch || '').trim() || 'main',
    token: String(settings.token || '').trim(),
  };
  localStorage.setItem(settingsKey, JSON.stringify(next));
  return next;
}

export function clearGitHubToken() {
  saveGitHubSettings({ ...getGitHubSettings(), token: '' });
}

export function isGitHubConfigured(settings = getGitHubSettings()) {
  return Boolean(settings.owner && settings.repo && settings.token);
}

export function actionsUrl(settings = getGitHubSettings()) {
  return `https://github.com/${settings.owner}/${settings.repo}/actions`;
}

function utf8ToBase64(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary);
}

function base64ToUtf8(b64) {
  const binary = atob(b64.replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function request(settings, path, options = {}) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${settings.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!response.ok) {
    let detail = '';
    try { detail = (await response.json()).message || ''; } catch { /* yok */ }
    const messages = {
      401: 'Token gecersiz veya suresi dolmus.',
      403: 'Token bu islem icin yetkili degil (Contents: Read and write izni gerekli).',
      404: 'Repo, dal veya dosya bulunamadi. Token bu repoya erisebiliyor mu?',
      409: 'Dosya bu sirada degisti. Tekrar deneyin.',
      422: 'GitHub istegi reddetti.',
    };
    const error = new Error(`${messages[response.status] || 'GitHub hatasi.'}${detail ? ` (${detail})` : ''}`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

/** Token ve repo erişimini kontrol eder; yazma izni yoksa hata verir. */
export async function testGitHubConnection(settings = getGitHubSettings()) {
  const repo = await request(settings, `/repos/${settings.owner}/${settings.repo}`);
  await request(settings, `/repos/${settings.owner}/${settings.repo}/branches/${encodeURIComponent(settings.branch)}`);
  if (repo.permissions && !repo.permissions.push) {
    throw new Error('Token repoyu okuyabiliyor ama yazamiyor (Contents: Read and write izni gerekli).');
  }
  return { fullName: repo.full_name, private: repo.private };
}

/** Repodaki bir metin dosyasını okur. Dosya yoksa null döner. */
export async function readRepoFile(path, settings = getGitHubSettings()) {
  try {
    const data = await request(
      settings,
      `/repos/${settings.owner}/${settings.repo}/contents/${path}?ref=${encodeURIComponent(settings.branch)}`,
    );
    return { sha: data.sha, content: base64ToUtf8(data.content) };
  } catch (error) {
    if (error.status === 404) return null;
    throw error;
  }
}

/** Repodaki bir metin dosyasını oluşturur veya günceller (tek commit). */
export async function writeRepoFile(path, content, message, settings = getGitHubSettings()) {
  const existing = await readRepoFile(path, settings);
  const result = await request(settings, `/repos/${settings.owner}/${settings.repo}/contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify({
      message,
      content: utf8ToBase64(content),
      branch: settings.branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  return { commitUrl: result.commit?.html_url, commitSha: result.commit?.sha };
}
