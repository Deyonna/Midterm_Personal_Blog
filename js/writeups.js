$(document).ready(function () {


  const WRITEUPS = [
    {
      title:    'HackTheBox — Machine: Facts',
      slug:     '#',
      category: 'HTB',
      tags:     ['linux', 'web', 'privesc'],
      date:     '2025-08-02',
      difficulty: 'Easy',
      excerpt:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Duis aute irure dolor in reprehenderit.',
      featured: false
    },
    {
      title:    'WolfCTF 2025 — Web Challenge: Broken Auth',
      slug:     '#',
      category: 'CTF',
      tags:     ['web', 'auth', 'jwt'],
      date:     '2025-10-30',
      difficulty: 'Medium',
      excerpt:  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      featured: false
    },
    {
      title:    'Malware Sample Analysis — AsyncRAT',
      slug:     '#',
      category: 'Malware',
      tags:     ['windows', 'rat', 'network'],
      date:     '2025-12-05',
      difficulty: 'Hard',
      excerpt:  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      featured: false
    },
    {
      title:    'HackTheBox — Machine TheFrizz',
      slug:     '#',
      category: 'HTB',
      tags:     ['windows', 'ad', 'cms', 'gssapi', 'GPOABuse', 'kerberos', 'privesc'],
      date:     '2026-01-20',
      difficulty: 'Medium',
      excerpt:  '`TheFrizz` is a medium-difficulty Windows machine featuring a web application showcasing Walkerville Elementary School and a Gibbon CMS instance. The Gibbon-LMS instance is susceptible to unauthenticated arbitrary file write (CVE-2023-45878), which is used to write a PHP shell to the web application and gain access to the target. After gaining access to the system, a database settings file containing credentials to access MySQL includes a hash and salt for the user f.frizzle that can be cracked. After cracking the password, we authenticate to the target using SSH with GSSAPI/Kerberos. We request a TGT, which is then used to authenticate via Kerberos authentication. A deleted 7Zip archive is discovered in the `fiona` user&#039;s recycling bin which is extracted revealing a WAPT setup and includes a configuration file with base64-encoded credentials used to authenticate as the `M.Schoolbus` user. `M.Schoolbus` is a member of the `Group Policy Creator Owners`, which allows them to create GPOs within the domain, which is leveraged to escalate privileges to `NT Authority\System`.',
      featured: false
    },
    {
      title:    'CTF 2025 — Forensics: Memory Dump',
      slug:     '#',
      category: 'CTF',
      tags:     ['forensics', 'volatility', 'windows'],
      date:     '2026-02-01',
      difficulty: 'Medium',
      excerpt:  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
      featured: false
    },
    {
      title:    'Malware Analysis — Cobalt Strike Beacon',
      slug:     '#',
      category: 'Malware',
      tags:     ['c2', 'cobalt-strike', 'network'],
      date:     '2026-04-15',
      difficulty: 'Hard',
      excerpt:  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit sed quia consequuntur.',
      featured: false
    },
    {
      title:    'HackTheBox — Sherlock: Easy Money',
      slug:     '#',
      category: 'HTB',
      tags:     ['forensics', 'sherlock', 'autopsy', 'MFT', 'prefetch'],
      date:     '2026-05-23',
      difficulty: 'Medium',
      excerpt:  'This Sherlock challenges you to investigate a user lured by a giveaway into executing a malicious shortcut. Reconstruct the attack chain using Windows artifacts (UserAssist, Prefetch, PowerShell EVTX, MFT) to uncover initial access, system enumeration, and persistence. You’ll trace a PowerShell-delivered payload, a DLL search order hijack against Yandex Browser (CVE-2024-6473), and the deployment of a malicious wldp.dll that launches a C2 implant, extracting key timelines and indicators along the way.',
      featured: true
    },
    {
      title:    'CTF 2024 — Crypto: EasyRSA',
      slug:     '#',
      category: 'CTF',
      tags:     ['crypto', 'rsa', 'python'],
      date:     '2026-06-01',
      difficulty: 'Hard',
      excerpt:  'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti.',
      featured: false
    }
  ];

  /* ── State ───────────────────────────────────────────────────── */
  let activeCategory = 'all';
  let activeTag      = null;
  let searchQuery    = '';

  /* ── Difficulty badge colours ─────────────────────────────────── */
  const diffClass = {
    Easy:   'bg-success',
    Medium: 'bg-warning text-dark',
    Hard:   'bg-danger'
  };

  /* ── Date formatter ──────────────────────────────────────────── */
  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

/* featured writeup card */

  function renderFeatured() {
    const featured = WRITEUPS.find(function (w) { return w.featured; });
    if (!featured) {
      $('#featured-writeup').addClass('d-none');
      return;
    }

    const tagsHTML = featured.tags.map(function (tag) {
      return `<span class="tag" data-tag="${tag}" role="button"
                    tabindex="0" aria-label="Filter by tag: ${tag}">#${tag}</span>`;
    }).join('');

    $('#featured-writeup').html(`
      <div class="featured-card" aria-label="Featured writeup">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <span class="featured-badge mb-1">Featured</span>
            <span class="badge ${diffClass[featured.difficulty] || 'bg-secondary'} mb-2">
              ${featured.difficulty}
            </span>
            <span class="badge bg-secondary ms-1 mb-2">${featured.category}</span>
            <h3 class="h4 fw-bold mt-1">${featured.title}</h3>
            <p class="text-muted mb-3">${featured.excerpt}</p>
            <div class="mb-3">${tagsHTML}</div>
          </div>
          <div class="col-lg-4 text-lg-end">
            <p class="text-muted small mb-3">
              <i class="bi bi-calendar3 me-1" aria-hidden="true"></i>
              ${fmtDate(featured.date)}
            </p>
            <a href="${featured.slug}" class="btn btn-outline-success">
              Read Writeup
              <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
    `);
  }

  /* WRITEUP GRID */

  function buildCard(w) {
    const tagsHTML = w.tags.map(function (tag) {
      return `<span class="tag" data-tag="${tag}" role="button"
                    tabindex="0" aria-label="Filter by tag: ${tag}">#${tag}</span>`;
    }).join('');

    return `
      <div class="col-12 col-md-6 col-lg-4">
        <article class="writeup-card card h-100"
                 aria-label="Writeup: ${w.title}">
          <div class="card-body d-flex flex-column">
            <div class="mb-2">
              <span class="badge ${diffClass[w.difficulty] || 'bg-secondary'}">
                ${w.difficulty}
              </span>
              <span class="badge bg-secondary ms-1">${w.category}</span>
            </div>
            <h3 class="card-title h6 fw-bold">${w.title}</h3>
            <p class="card-text text-muted small flex-grow-1">${w.excerpt}</p>
            <div class="mt-2 mb-3">${tagsHTML}</div>
            <div class="d-flex justify-content-between align-items-center mt-auto">
              <small class="text-muted">
                <i class="bi bi-calendar3 me-1" aria-hidden="true"></i>
                ${fmtDate(w.date)}
              </small>
              <a href="${w.slug}"
                 class="btn btn-sm btn-outline-success"
                 aria-label="Read writeup: ${w.title}">
                Read →
              </a>
            </div>
          </div>
        </article>
      </div>
    `;
  }

  function renderGrid() {
    // Apply all active filters together
    const results = WRITEUPS.filter(function (w) {
      const matchCat    = activeCategory === 'all' || w.category === activeCategory;
      const matchTag    = !activeTag || w.tags.includes(activeTag);
      const matchSearch = !searchQuery ||
        w.title.toLowerCase().includes(searchQuery) ||
        w.excerpt.toLowerCase().includes(searchQuery) ||
        w.tags.some(function (t) { return t.includes(searchQuery); });
      return matchCat && matchTag && matchSearch;
    });

    if (results.length === 0) {
      $('#writeup-grid').html('');
      $('#writeup-empty').removeClass('d-none');
    } else {
      $('#writeup-empty').addClass('d-none');
      $('#writeup-grid').html(results.map(buildCard).join(''));
    }

    // Update live region count for screen readers
    $('#writeup-count').text(
      results.length === 1 ? '1 writeup' : results.length + ' writeups'
    );
  }

  /* TAG CLOUD */

  function buildTagCloud() {
    // Collect all unique tags with a count
    const tagMap = {};
    WRITEUPS.forEach(function (w) {
      w.tags.forEach(function (tag) {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    // Sort by frequency
    const tags = Object.entries(tagMap).sort(function (a, b) {
      return b[1] - a[1];
    });

    const html = tags.map(function (entry) {
      const tag   = entry[0];
      const count = entry[1];
      return `
        <button class="tag-cloud-item"
                data-tag="${tag}"
                aria-pressed="false"
                aria-label="Filter by tag: ${tag} (${count} writeup${count > 1 ? 's' : ''})">
          #${tag} <span class="tag-count">${count}</span>
        </button>
      `;
    }).join('');

    $('#tag-cloud').html(html);
  }

  /* EVENT HANDLERS*/

  // Category filter chips
  $(document).on('click', '.filter-btn', function () {
    activeCategory = $(this).data('filter');
    activeTag      = null;   // clear tag filter when switching category

    $('.filter-btn').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');

    // Reset tag cloud selections
    $('.tag-cloud-item').removeClass('active').attr('aria-pressed', 'false');

    renderGrid();
  });

  // Tag cloud clicks
  $(document).on('click', '.tag-cloud-item', function () {
    const tag = $(this).data('tag');

    if (activeTag === tag) {
      // Deselect: clear tag filter
      activeTag = null;
      $(this).removeClass('active').attr('aria-pressed', 'false');
    } else {
      activeTag = tag;
      $('.tag-cloud-item').removeClass('active').attr('aria-pressed', 'false');
      $(this).addClass('active').attr('aria-pressed', 'true');
    }

    renderGrid();
  });

  // Inline tag clicks inside cards (delegate from document)
  function activateCardTag(el) {
    const tag = $(el).data('tag');
    if (!tag) return;
    activeTag = tag;
    $('.tag-cloud-item').removeClass('active').attr('aria-pressed', 'false');
    $(`.tag-cloud-item[data-tag="${tag}"]`).addClass('active').attr('aria-pressed', 'true');
    renderGrid();
  }

  $(document).on('click', '.writeup-card .tag, .featured-card .tag', function () {
    activateCardTag(this);
  });

  $(document).on('keydown', '.writeup-card .tag, .featured-card .tag', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activateCardTag(this);
    }
  });

  // Live search
  $('#writeup-search').on('input', function () {
    searchQuery = $(this).val().trim().toLowerCase();
    renderGrid();
  });

  // Clear search button
  $('#search-clear').on('click', function () {
    searchQuery = '';
    $('#writeup-search').val('').trigger('focus');
    renderGrid();
  });

  /* ── Initial render ──────────────────────────────────────────── */
  renderFeatured();
  buildTagCloud();
  renderGrid();

});
