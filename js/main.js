$(document).ready(function() {

// CTFtime API
const CTFTIME_URL = 'https://ctftime.org/api/v1/events/?limit=6';

// CTFtime blocks direct browser requests (no CORS headers).
// allorigins /get wraps the response in JSON so it survives in sandboxed
// WebViews (VS Code integrated browser) better than raw-passthrough proxies.
const PROXIES = [
  { url: 'https://api.allorigins.win/get?url=' + encodeURIComponent(CTFTIME_URL), unwrap: true },
  { url: 'https://corsproxy.io/?' + encodeURIComponent(CTFTIME_URL) },
  { url: 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(CTFTIME_URL) },
  { url: 'https://thingproxy.freeboard.io/fetch/' + CTFTIME_URL }
];

function renderCTFs(data) {
  $('#ctf-loading').addClass('d-none');

  if (!data || data.length === 0) {
    $('#ctf-error').removeClass('d-none');
    return;
  }

  const cards = data.map(function (ctf) {
    const start = new Date(ctf.start).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
    const finish = new Date(ctf.finish).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    return `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="card h-100" aria-label="CTF event: ${ctf.title}">
          <div class="card-body">
            <h3 class="card-title h6">
              <a href="${ctf.ctftime_url}" target="_blank" rel="noopener noreferrer">
                ${ctf.title}
              </a>
            </h3>
            <span class="badge bg-secondary mb-2">${ctf.format}</span>
            <p class="card-text small text-muted mb-1">
              <i class="bi bi-calendar-event" aria-hidden="true"></i>
              ${start} → ${finish}
            </p>
            ${ctf.weight > 0 ? `
            <p class="card-text small text-muted mb-0">
              <i class="bi bi-star" aria-hidden="true"></i>
              Weight: ${ctf.weight.toFixed(2)}
            </p>` : ''}
          </div>
        </article>
      </div>
    `;
  }).join('');

  $('#ctf-list').html(cards);
}

// Use native fetch with explicit CORS + no-credentials so Firefox's
// tracking protection is less likely to treat these as tracking requests.
function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, {
    mode: 'cors',
    credentials: 'omit',
    signal: controller.signal
  }).finally(() => clearTimeout(timer));
}

function tryProxy(index) {
  if (index >= PROXIES.length) {
    $('#ctf-loading').addClass('d-none');
    $('#ctf-error').removeClass('d-none');
    return;
  }
  const proxy = PROXIES[index];
  fetchWithTimeout(proxy.url, 8000)
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function (data) {
      return proxy.unwrap ? JSON.parse(data.contents) : data;
    })
    .then(renderCTFs)
    .catch(function () { tryProxy(index + 1); });
}

tryProxy(0);

});
