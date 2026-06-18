$(document).ready(function() {
    // 1. Inject navbar
const navbarHTML = `
  <nav class="navbar navbar-expand-lg sticky-top" aria-label="Main navigation">
    <div class="container">

      <a class="navbar-brand" href="/index.html" aria-label="0xdeyonna home">
        0xdeyonna<span>.sh</span>
      </a>

      <button id="dark-mode-toggle" type="button"
        class="btn btn-sm ms-auto me-2"
        aria-label="Toggle dark mode"
        title="Toggle dark mode">
        <i class="bi bi-moon-stars-fill" aria-hidden="true"></i>
      </button>

      <button class="navbar-toggler" type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNav"
        aria-controls="mainNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNav">
        <ul class="navbar-nav ms-auto" role="list">
          <li class="nav-item"><a class="nav-link" href="/index.html">Home</a></li>
          <li class="nav-item"><a class="nav-link" href="/writeups.html">Writeups</a></li>
          <li class="nav-item"><a class="nav-link" href="/tasks.html">Requests</a></li>
          <li class="nav-item"><a class="nav-link" href="/about.html">About</a></li>
          <li class="nav-item"><a class="nav-link" href="/contact.html">Contact</a></li>
        </ul>
      </div>

    </div>
  </nav>
`;

$('#navbar-placeholder').html(navbarHTML);

// Mark the current page link as active
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
$('.nav-link').each(function () {
  const linkPage = $(this).attr('href').split('/').pop();
  if (linkPage === currentPage) {
    $(this).addClass('active').attr('aria-current', 'page');
  }
})

//2. Inject footer

// 3. Dark mode
// Apply saved preference when page loads
const savedTheme = localStorage.getItem('theme') || 'light';
$('html').attr('data-bs-theme', savedTheme);
updateDarkModeIcon(savedTheme);

// Toggle on button click
$('#dark-mode-toggle').on('click', function () {
  const current = $('html').attr('data-bs-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  $('html').attr('data-bs-theme', next);
  localStorage.setItem('theme', next);
  updateDarkModeIcon(next);
});

// Swap icon based on current theme
function updateDarkModeIcon(theme) {
  const icon = $('#dark-mode-toggle i');
  if (theme === 'dark') {
    icon.removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
  } else {
    icon.removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
  }
}


// 4. CTFtime API
const CTFTIME_URL = 'https://ctftime.org/api/v1/events/?limit=6';
 
// CTFtime blocks direct browser requests (no CORS headers).
// We try two proxy services; if both fail, we show an error message.
const PROXIES = [
  'https://corsproxy.io/?' + encodeURIComponent(CTFTIME_URL),
  'https://api.allorigins.win/raw?url=' + encodeURIComponent(CTFTIME_URL)
];
 
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

$.getJSON(CTFTIME_URL)
  .done(function (data) {
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
  })
  .fail(function () {
    $('#ctf-loading').addClass('d-none');
    $('#ctf-error').removeClass('d-none');
  });

});
