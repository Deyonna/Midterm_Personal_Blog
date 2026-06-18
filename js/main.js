$(document).ready(function() {

// CTFtime API
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
