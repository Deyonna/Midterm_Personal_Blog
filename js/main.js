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

  const $activityList = $('#activity-list');
  if (!$activityList.length) return;

  let tasks = [];
  try {
    tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  } catch (e) {
    tasks = [];
  }

  // Show the 4 most recently created requests
  const recent = tasks
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); })
    .slice(0, 4);

  if (recent.length === 0) {
    $activityList.html(`
      <p class="text-muted small">
        No requests yet. <a href="/tasks.html">Be the first to request a writeup!</a>
      </p>
    `);
    return;
  }

  const statusLabel = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
  const statusColour = { pending: 'secondary', 'in-progress': 'warning', completed: 'success' };

  const html = recent.map(function (t) {
    const label  = statusLabel[t.status] || 'Pending';
    const colour = statusColour[t.status] || 'secondary';
    return `
      <div class="activity-item">
        <div class="activity-dot" aria-hidden="true"></div>
        <div class="flex-grow-1">
          <span class="fw-semibold small">${t.title}</span>
          <span class="badge bg-${colour} ms-2" style="font-size:.65rem;">${label}</span>
          <p class="text-muted mb-0" style="font-size:.75rem;font-family:var(--font-mono);">
            ${t.category} &middot; ${t.createdAt ? t.createdAt.slice(0, 10) : ''}
          </p>
        </div>
      </div>
    `;
  }).join('');

  $activityList.html(html);

});
