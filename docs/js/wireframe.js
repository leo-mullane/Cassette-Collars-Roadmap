/* ==========================================================================
   wireframe.js — shared interaction behaviour for lo-fi wireframes.

   Everything here is driven by data attributes and classes, so pages stay
   declarative and no page needs its own inline script. Keep it that way: a
   wireframe pack with five slightly different accordion implementations is
   how nav bugs get reported in a client review.

   All patterns are keyboard-operable and dismissible with Escape, because
   accessibility is cheaper to design in at wireframe stage than to retrofit.
   ========================================================================== */

(function () {
  'use strict';

  /* --- Navigation flyouts ------------------------------------------------
     Opened on hover AND focus. Hover alone would make the whole navigation
     unusable by keyboard, which is the single most common wireframe defect
     that survives into build. */
  function initNav() {
    var backdrop = document.querySelector('.flyout-backdrop');
    var items = document.querySelectorAll('.nav-item');

    function closeAll() {
      document.querySelectorAll('.nav-item.open').forEach(function (i) {
        i.classList.remove('open');
      });
      if (backdrop) backdrop.classList.remove('active');
    }

    items.forEach(function (item) {
      var flyout = item.querySelector('.nav-flyout');
      if (!flyout) return;

      var trigger = item.querySelector('.nav-link');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-haspopup', 'true');
      }

      function open() {
        closeAll();
        item.classList.add('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
        if (backdrop) backdrop.classList.add('active');
      }

      function close() {
        item.classList.remove('open');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        if (backdrop) backdrop.classList.remove('active');
      }

      item.addEventListener('mouseenter', open);
      item.addEventListener('mouseleave', close);
      item.addEventListener('focusin', open);
      item.addEventListener('focusout', function () {
        window.setTimeout(function () {
          if (!item.contains(document.activeElement)) close();
        }, 10);
      });

      if (trigger) {
        trigger.addEventListener('click', function (ev) {
          if (trigger.getAttribute('href') === '#') {
            ev.preventDefault();
            item.classList.contains('open') ? close() : open();
          }
        });
      }
    });

    if (backdrop) backdrop.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
  }

  /* --- Accordions --------------------------------------------------------
     Markup: <div class="accordion-item"><button class="accordion-title">…
     Multiple panels may be open at once unless the .accordion carries
     data-single. */
  function initAccordions() {
    document.querySelectorAll('.accordion-title').forEach(function (title) {
      var startOpen = title.closest('.accordion-item').classList.contains('open');
      title.setAttribute('aria-expanded', startOpen ? 'true' : 'false');
      title.addEventListener('click', function () {
        var item = title.closest('.accordion-item');
        var group = title.closest('.accordion');
        var willOpen = !item.classList.contains('open');

        if (group && group.hasAttribute('data-single')) {
          group.querySelectorAll('.accordion-item.open').forEach(function (o) {
            o.classList.remove('open');
            var t = o.querySelector('.accordion-title');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
        }

        item.classList.toggle('open', willOpen);
        title.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
  }

  /* --- Tabs --------------------------------------------------------------
     Markup: <button class="tab" data-tab="panel-id"> and
             <div class="tab-panel" id="panel-id"> */
  function initTabs() {
    document.querySelectorAll('.tabs').forEach(function (group) {
      var tabs = group.querySelectorAll('.tab');
      tabs.forEach(function (tab) {
        tab.setAttribute('role', 'tab');
        tab.addEventListener('click', function () {
          tabs.forEach(function (t) {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');

          var target = document.getElementById(tab.getAttribute('data-tab'));
          if (!target) return;
          var container = target.parentElement;
          container.querySelectorAll('.tab-panel').forEach(function (p) {
            p.classList.remove('active');
          });
          target.classList.add('active');
        });
      });
    });
  }

  /* --- Carousels ---------------------------------------------------------
     Markup: <div class="carousel" data-autoplay="6000"> containing
             .carousel-track > .carousel-item, .carousel-arrow[data-dir],
             and an empty .carousel-indicators which is populated here. */
  function initCarousels() {
    document.querySelectorAll('.carousel').forEach(function (carousel) {
      var track = carousel.querySelector('.carousel-track');
      if (!track) return;
      var items = track.querySelectorAll('.carousel-item');
      var dotsHost = carousel.querySelector('.carousel-indicators');
      var index = 0;
      var timer = null;

      function render() {
        track.style.transform = 'translateX(-' + index * 100 + '%)';
        if (!dotsHost) return;
        dotsHost.querySelectorAll('.carousel-dot').forEach(function (d, i) {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-current', i === index ? 'true' : 'false');
        });
      }

      function go(n) {
        index = (n + items.length) % items.length;
        render();
      }

      if (dotsHost) {
        items.forEach(function (_, i) {
          var dot = document.createElement('button');
          dot.className = 'carousel-dot';
          dot.type = 'button';
          dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          dot.addEventListener('click', function () { go(i); });
          dotsHost.appendChild(dot);
        });
      }

      carousel.querySelectorAll('.carousel-arrow').forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          go(index + (arrow.getAttribute('data-dir') === 'prev' ? -1 : 1));
        });
      });

      var interval = parseInt(carousel.getAttribute('data-autoplay'), 10);
      if (interval > 0) {
        var start = function () { timer = window.setInterval(function () { go(index + 1); }, interval); };
        var stop = function () { window.clearInterval(timer); };
        start();
        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('focusin', stop);
        carousel.addEventListener('mouseleave', start);
      }

      render();
    });
  }

  /* --- Modals ------------------------------------------------------------
     Markup: any element with data-modal-open="modal-id", and
             <div class="wf-modal" id="modal-id"> */
  function initModals() {
    function close(modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function (ev) {
        ev.preventDefault();
        var modal = document.getElementById(trigger.getAttribute('data-modal-open'));
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        var panel = modal.querySelector('.wf-modal-panel');
        if (panel) {
          panel.setAttribute('tabindex', '-1');
          panel.focus();
        }
      });
    });

    document.querySelectorAll('.wf-modal').forEach(function (modal) {
      modal.addEventListener('click', function (ev) {
        if (ev.target === modal || ev.target.classList.contains('wf-modal-close')) close(modal);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      document.querySelectorAll('.wf-modal.open').forEach(close);
    });
  }

  /* --- Notes toggle -------------------------------------------------------
     A switch in the prototype navigator shows or hides everything marked
     as a note: the "what we're proposing and why" panel at the top of each
     prototype and the numbered annotations within it. Off by default; the
     choice is remembered for the session so it carries between prototypes. */
  function initNotes() {
    var hidden = true;
    try { hidden = window.sessionStorage.getItem('wf-notes-hidden') !== '0'; } catch (e) { /* private mode */ }
    var toggles = document.querySelectorAll('[data-notes-toggle]');
    if (!document.querySelector('.wf-note, .proposal')) {
      toggles.forEach(function (t) { t.hidden = true; });
      return;
    }
    function apply() {
      document.body.classList.toggle('wf-notes-hidden', hidden);
      toggles.forEach(function (t) {
        t.setAttribute('aria-checked', hidden ? 'false' : 'true');
        var l = t.querySelector('.notes-label');
        if (l) l.textContent = hidden ? 'Notes off' : 'Notes on';
      });
    }
    toggles.forEach(function (t) {
      t.addEventListener('click', function () {
        hidden = !hidden;
        try { window.sessionStorage.setItem('wf-notes-hidden', hidden ? '1' : '0'); } catch (e) { /* private mode */ }
        apply();
        if (!hidden) {
          var panel = document.querySelector('.proposal');
          if (panel && panel.getBoundingClientRect().top < 0) panel.scrollIntoView({ block: 'start' });
        }
      });
    });
    apply();
  }

  /* --- Prototype navigator: current page and previous / next ------------- */
  function initProtoNav() {
    var file = (window.location.pathname.split('/').pop() || 'index.html').replace('.html', '') || 'index';
    var links = Array.prototype.slice.call(document.querySelectorAll('.proto-links a[data-proto]'));
    var index = -1;
    links.forEach(function (a, i) {
      if (a.getAttribute('data-proto').split(' ').indexOf(file) !== -1) { a.setAttribute('aria-current', 'page'); index = i; }
    });
    var current = document.querySelector('.proto-links a[aria-current]');
    if (current && window.innerWidth < 1024) {
      var ul = current.closest('.proto-links');
      if (ul) ul.scrollLeft = current.offsetLeft - 16;
    }
    var pager = document.querySelector('[data-proto-pager]');
    if (!pager || index < 0) return;
    function label(a) { return a.textContent.replace(/\s+/g, ' ').trim(); }
    var html = '';
    if (index > 0) html += '<a class="prev" href="' + links[index - 1].getAttribute('href') + '"><span class="wf-meta">Previous</span>' + label(links[index - 1]) + '</a>';
    else html += '<span></span>';
    if (index < links.length - 1) html += '<a class="next" href="' + links[index + 1].getAttribute('href') + '"><span class="wf-meta">Next</span>' + label(links[index + 1]) + '</a>';
    else html += '<a class="next" href="' + links[0].getAttribute('href') + '"><span class="wf-meta">Back to</span>Overview</a>';
    pager.innerHTML = html;
  }

  /* ======================================================================
     Cassette Collars prototype behaviour
     Driven by ids and data attributes on the pages. Product, fitment and
     colour data come from data.js.
     ====================================================================== */

  var COLLARS = window.CC_COLLARS || {};
  var DEFLECTORS = window.CC_DEFLECTORS || {};
  var RULES = window.CC_RULES || {};
  var BRANDS = window.CC_BRANDS || [];
  var RAL = window.CC_RAL || [];
  var PROJECTS = window.CC_PROJECTS || [];
  var VAT = window.CC_VAT || 0.2;
  var money = window.CC_MONEY || function (n) { return '£' + n.toFixed(2); };
  var collarFor = window.CC_COLLAR_FOR_FACIA || function () { return '750'; };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* Query parameters carry context between prototypes (?size=, ?model=, ?ral=).
     Some hosts strip the query string, so the last clicked link's query is also
     kept in sessionStorage for the page it points to. */
  function currentFile() { return (window.location.pathname.split('/').pop() || 'index.html'); }
  function param(name) {
    var v = null;
    try { v = new URLSearchParams(window.location.search).get(name); } catch (e) { v = null; }
    if (v) return v;
    try {
      var saved = JSON.parse(window.sessionStorage.getItem('cc-q') || 'null');
      if (saved && saved.file === currentFile()) return new URLSearchParams(saved.q).get(name);
    } catch (e) { /* private mode */ }
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    try {
      if (href.indexOf('?') !== -1) window.sessionStorage.setItem('cc-q', JSON.stringify({ file: href.split('?')[0].split('/').pop(), q: href.split('?')[1].split('#')[0] }));
      else if (href.charAt(0) !== '#') window.sessionStorage.removeItem('cc-q');
    } catch (err) { /* private mode */ }
  }, true);

  /* --- Toast ------------------------------------------------------------ */
  var toastTimer = null;
  function toast(msg) {
    var t = $('#wf-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'wf-toast';
      t.className = 'toast';
      t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.hidden = true; }, 2800);
  }

  /* --- Header height, used by sticky elements ---------------------------- */
  function initHeaderHeight() {
    var header = $('.site-header');
    if (!header) return;
    function set() { document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px'); }
    set();
    window.addEventListener('resize', set);
  }

  /* --- Pricing ------------------------------------------------------------
     Live price bands are inclusive ranges in mm. A depth that falls outside
     every band (above the largest, or in a gap such as 301–319mm on the
     750 collar) is treated as a custom depth, priced on request. */
  function bandFor(size, depth) {
    var c = COLLARS[size];
    if (!c || isNaN(depth)) return null;
    for (var i = 0; i < c.bands.length; i++) {
      if (depth >= c.bands[i][0] && depth <= c.bands[i][1]) return { index: i, price: c.bands[i][2] };
    }
    return null;
  }
  function maxDepth(size) { var b = COLLARS[size].bands; return b[b.length - 1][1]; }
  function isRal(colour) { return colour && colour !== 'white'; }
  function colourLabel(colour) {
    if (!isRal(colour)) return 'White (standard)';
    for (var i = 0; i < RAL.length; i++) if (RAL[i][0] === colour) return 'RAL ' + RAL[i][0] + ' ' + RAL[i][1];
    return 'RAL ' + colour;
  }
  function bandLabel(b) { return b[0] === b[1] ? String(b[0]) : b[0] + '–' + b[1]; }

  /* Unit price ex VAT for one quote line, or null when priced on request. */
  function unitPrice(line) {
    var base = null;
    if (line.kind === 'collar') { var band = bandFor(line.size, line.depth); base = band ? band.price : null; }
    else if (line.kind === 'deflector') base = DEFLECTORS[line.size] ? DEFLECTORS[line.size].price : null;
    else return null;
    if (base === null) return null;
    if (isRal(line.colour)) base = base * (1 + RULES.ralSurcharge);
    return Math.round(base * 100) / 100;
  }
  function lineLabel(line) {
    if (line.kind === 'collar') return COLLARS[line.size].name + ', ' + line.depth + 'mm deep';
    if (line.kind === 'deflector') return DEFLECTORS[line.size].name;
    return 'Custom collar ' + line.w + ' × ' + line.l + 'mm, ' + line.depth + 'mm deep' + (line.angle ? ', ' + line.angle + '° ceiling' : '');
  }

  /* --- Quote basket, kept for the session so it carries between pages ---- */
  function getQuote() {
    try { return JSON.parse(window.sessionStorage.getItem('cc-quote') || '[]'); } catch (e) { return window.__ccQuote || []; }
  }
  function setQuote(list) {
    window.__ccQuote = list;
    try { window.sessionStorage.setItem('cc-quote', JSON.stringify(list)); } catch (e) { /* private mode */ }
    $all('[data-quote-count]').forEach(function (el) { el.textContent = list.reduce(function (n, l) { return n + l.qty; }, 0); });
    document.dispatchEvent(new CustomEvent('cc:quote'));
  }
  function addToQuote(line) {
    var list = getQuote();
    line.id = 'l' + Date.now() + Math.floor(Math.random() * 1000);
    list.push(line);
    setQuote(list);
    toast('Added to your quote: ' + line.qty + ' × ' + lineLabel(line));
  }
  function quoteTotals(list) {
    var sub = 0, units = 0, onRequest = 0;
    list.forEach(function (l) {
      var p = unitPrice(l);
      if (p === null) onRequest += 1; else sub += p * l.qty;
      if (l.kind !== 'deflector') units += l.qty;
    });
    var discount = units >= RULES.volumeFrom ? Math.round(sub * RULES.volumeDiscount * 100) / 100 : 0;
    var net = sub - discount;
    var delivery = list.length === 0 ? 0 : (net >= RULES.freeDeliveryOver ? 0 : RULES.delivery);
    var exVat = net + delivery;
    var vat = Math.round(exVat * VAT * 100) / 100;
    return { sub: sub, discount: discount, delivery: delivery, exVat: exVat, vat: vat, inc: exVat + vat, units: units, onRequest: onRequest };
  }
  function initQuoteCount() { setQuoteCountOnly(); }
  function setQuoteCountOnly() {
    var n = getQuote().reduce(function (s, l) { return s + l.qty; }, 0);
    $all('[data-quote-count]').forEach(function (el) { el.textContent = n; });
  }

  /* --- Dispatch cut-off message (live site: same day before 10am) -------- */
  function initCutoff() {
    $all('[data-cutoff]').forEach(function (el) {
      var now = new Date();
      var day = now.getDay();
      var cut = RULES.cutoffHour || 10;
      var msg;
      if (day === 0 || day === 6) msg = 'Order over the weekend and standard white sizes are dispatched on Monday.';
      else if (now.getHours() < cut) {
        var mins = (cut * 60) - (now.getHours() * 60 + now.getMinutes());
        msg = 'Order in the next ' + (mins >= 60 ? Math.floor(mins / 60) + ' hr ' : '') + (mins % 60) + ' min and standard white sizes are dispatched today.';
      } else msg = 'Ordered now, standard white sizes are dispatched next working day. Order before ' + cut + 'am for same-day dispatch.';
      el.textContent = msg;
    });
  }

  /* --- Steppers (quantity) ---------------------------------------------- */
  function initSteppers() {
    $all('.stepper').forEach(function (s) {
      var input = $('input', s);
      $all('button', s).forEach(function (b) {
        b.addEventListener('click', function () {
          var v = parseInt(input.value, 10) || 1;
          v = Math.max(1, Math.min(999, v + (b.getAttribute('data-step') === '-1' ? -1 : 1)));
          input.value = v;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
      });
    });
  }

  /* --- Shared colour <select> options ----------------------------------- */
  function fillColourSelect(sel, chosen) {
    if (!sel) return;
    var html = '<option value="white">White (standard)</option><optgroup label="RAL colours (+' + Math.round(RULES.ralSurcharge * 100) + '%, ' + RULES.ralLeadDays + ')">';
    RAL.forEach(function (r) { html += '<option value="' + r[0] + '">RAL ' + r[0] + ' ' + r[1] + '</option>'; });
    sel.innerHTML = html + '</optgroup>';
    if (chosen) sel.value = chosen;
    if (!sel.value) sel.value = 'white';
  }

  /* ======================================================================
     1. Fitment finder (R10–R15)
     ====================================================================== */
  function allModels() {
    var out = [];
    BRANDS.forEach(function (b) {
      b.ranges.forEach(function (r, ri) {
        r.models.forEach(function (m) { out.push({ brand: b, range: r, ri: ri, model: m }); });
      });
    });
    return out;
  }
  function initFinder() {
    var root = $('#finder');
    if (!root) return;
    var brandsHost = $('#ff-brands'), rangesHost = $('#ff-ranges'), result = $('#ff-result');
    var search = $('#ff-search'), suggest = $('#ff-suggest');
    var state = { brand: null, ri: null, facia: null, model: null };
    var MODELS = allModels();

    brandsHost.innerHTML = BRANDS.map(function (b) {
      return '<button type="button" class="chip" aria-pressed="false" data-brand="' + b.id + '">' + esc(b.name) + '</button>';
    }).join('') + '<button type="button" class="chip" aria-pressed="false" data-brand="other">Another brand</button>';

    function brandById(id) { for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i].id === id) return BRANDS[i]; return null; }

    function renderRanges() {
      $all('[data-brand]', brandsHost).forEach(function (c) { c.setAttribute('aria-pressed', c.getAttribute('data-brand') === state.brand ? 'true' : 'false'); });
      if (state.brand === 'other') {
        rangesHost.innerHTML = '<div class="panel surface"><p><strong>We haven\'t listed that brand yet.</strong> Universal collars fit most four-way cassettes. Tell us the indoor unit model number and we\'ll confirm the size before you order.</p><a class="btn btn-secondary" href="quote.html?custom=1">Ask us to check a model</a></div>';
        result.hidden = true;
        return;
      }
      var b = brandById(state.brand);
      if (!b) { rangesHost.innerHTML = '<p class="muted">Choose a brand above, or type a model number.</p>'; result.hidden = true; return; }
      rangesHost.innerHTML = '<fieldset><legend>Which ' + esc(b.name) + ' range?</legend><div class="range-list">' + b.ranges.map(function (r, i) {
        return '<label class="range-opt"><input type="radio" name="ff-range" value="' + i + '"' + (state.ri === i ? ' checked' : '') + '>' +
          '<span><strong>' + esc(r.range) + '</strong><span class="muted"> · cassette body ' + r.body + ' × ' + r.body + 'mm · ' + r.models.length + ' models</span></span></label>';
      }).join('') + '</div></fieldset>';
      $all('input[name="ff-range"]', rangesHost).forEach(function (inp) {
        inp.addEventListener('change', function () { state.ri = parseInt(inp.value, 10); state.facia = null; state.model = null; renderResult(); });
      });
      renderResult();
    }

    function renderResult() {
      var b = brandById(state.brand);
      if (!b || state.ri === null || !b.ranges[state.ri]) { result.hidden = true; return; }
      var r = b.ranges[state.ri];
      if (state.facia === null) state.facia = 0;
      var f = r.facias[state.facia];
      var size = collarFor(f[1]);
      var c = COLLARS[size];
      var from = Math.min.apply(null, c.bands.map(function (x) { return x[2]; }));
      var q = 'size=' + size + '&brand=' + b.id + '&model=' + encodeURIComponent(state.model || r.models[0]) + '&facia=' + encodeURIComponent(f[0]);
      result.hidden = false;
      result.innerHTML =
        '<div class="ff-result-grid">' +
          '<div class="stack">' +
            '<p class="eyebrow-sm">Your unit</p>' +
            '<h2 class="h3">' + esc(b.name) + ' ' + esc(r.range) + '</h2>' +
            (state.model ? '<p>Model <strong class="num">' + esc(state.model) + '</strong></p>' : '<p class="muted">Models in this range: ' + esc(r.models.slice(0, 6).join(', ')) + (r.models.length > 6 ? ' and ' + (r.models.length - 6) + ' more' : '') + '</p>') +
            (r.facias.length > 1 ? '<fieldset class="facia-pick"><legend>Which facia is fitted?</legend>' + r.facias.map(function (fx, i) {
              return '<label class="check"><input type="radio" name="ff-facia" value="' + i + '"' + (i === state.facia ? ' checked' : '') + '> ' + esc(fx[0]) + ' <span class="muted">(' + fx[1] + ' × ' + fx[1] + 'mm)</span></label>';
            }).join('') + '</fieldset>' : '<p>Facia <strong>' + esc(f[0]) + '</strong> <span class="muted">(' + f[1] + ' × ' + f[1] + 'mm)</span></p>') +
          '</div>' +
          '<div class="ff-match">' +
            '<p class="eyebrow-sm">The collar that fits</p>' +
            '<div class="wf-placeholder ratio-4-3" data-photo="collar-' + size + '">' + c.size + ' × ' + c.size + ' collar</div>' +
            '<h3>' + esc(c.name) + '</h3>' +
            '<dl class="kv"><dt>Hole size</dt><dd>' + c.hole + 'mm</dd><dt>Depths</dt><dd>0–' + maxDepth(size) + 'mm</dd><dt>From</dt><dd>' + money(from) + ' ex VAT</dd></dl>' +
            '<div class="row"><a class="btn" href="product.html?' + q + '">Choose depth and colour</a>' +
            '<button type="button" class="btn btn-secondary" id="ff-add-deflector">Add a deflector</button></div>' +
          '</div>' +
        '</div>';
      $all('input[name="ff-facia"]', result).forEach(function (inp) {
        inp.addEventListener('change', function () { state.facia = parseInt(inp.value, 10); renderResult(); });
      });
      $('#ff-add-deflector', result).addEventListener('click', function () {
        addToQuote({ kind: 'deflector', size: 'cassette', qty: 1, colour: 'white', note: b.name + ' ' + (state.model || r.range) });
      });
    }

    brandsHost.addEventListener('click', function (e) {
      var c = e.target.closest('[data-brand]');
      if (!c) return;
      state.brand = c.getAttribute('data-brand'); state.ri = null; state.facia = null; state.model = null;
      renderRanges();
    });

    /* Model number search across every brand */
    var active = -1, matches = [];
    function closeSuggest() { suggest.hidden = true; search.setAttribute('aria-expanded', 'false'); active = -1; }
    function choose(m) {
      state.brand = m.brand.id; state.ri = m.ri; state.facia = null; state.model = m.model;
      search.value = m.model;
      closeSuggest();
      renderRanges();
      result.scrollIntoView({ block: 'nearest' });
    }
    search.addEventListener('input', function () {
      var v = search.value.trim().toUpperCase().replace(/\s+/g, '');
      if (v.length < 2) { closeSuggest(); return; }
      matches = MODELS.filter(function (m) { return m.model.toUpperCase().replace(/\s+/g, '').indexOf(v) !== -1; }).slice(0, 8);
      if (!matches.length) {
        suggest.innerHTML = '<li class="muted" role="option" aria-disabled="true">No match. Check the number on the unit\'s rating plate, or <a href="quote.html?custom=1">ask us</a>.</li>';
      } else {
        suggest.innerHTML = matches.map(function (m, i) {
          return '<li role="option" id="ff-opt-' + i + '" data-i="' + i + '"><strong>' + esc(m.model) + '</strong> <span class="muted">' + esc(m.brand.name) + ' · ' + esc(m.range.range) + '</span></li>';
        }).join('');
      }
      suggest.hidden = false;
      search.setAttribute('aria-expanded', 'true');
    });
    search.addEventListener('keydown', function (e) {
      if (suggest.hidden) return;
      var opts = $all('[data-i]', suggest);
      if (e.key === 'ArrowDown') { e.preventDefault(); active = Math.min(opts.length - 1, active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); active = Math.max(0, active - 1); }
      else if (e.key === 'Enter') { e.preventDefault(); if (matches[active < 0 ? 0 : active]) choose(matches[active < 0 ? 0 : active]); return; }
      else if (e.key === 'Escape') { closeSuggest(); return; }
      else return;
      opts.forEach(function (o, i) { o.classList.toggle('active', i === active); });
      if (opts[active]) search.setAttribute('aria-activedescendant', opts[active].id);
    });
    suggest.addEventListener('mousedown', function (e) {
      var li = e.target.closest('[data-i]');
      if (li) { e.preventDefault(); choose(matches[parseInt(li.getAttribute('data-i'), 10)]); }
    });
    search.addEventListener('blur', function () { window.setTimeout(closeSuggest, 150); });

    $all('[data-try-model]').forEach(function (b) {
      b.addEventListener('click', function () { search.value = b.getAttribute('data-try-model'); search.dispatchEvent(new Event('input')); search.focus(); });
    });

    var pb = param('brand');
    if (pb && brandById(pb)) state.brand = pb;
    renderRanges();
  }

  /* ======================================================================
     2/3. Product page (R20–R29)
     ====================================================================== */
  function initProduct() {
    var root = $('#product');
    if (!root) return;
    var size = param('size') || '1000';
    if (!COLLARS[size]) size = '1000';
    var c = COLLARS[size];
    var depth = $('#pd-depth'), colour = $('#pd-colour'), qty = $('#pd-qty');

    $all('[data-size-link]').forEach(function (a) {
      if (a.getAttribute('data-size-link') === size) a.setAttribute('aria-current', 'page');
    });
    $all('[data-pd="name"]').forEach(function (el) { el.textContent = c.name; });
    $all('[data-pd="size"]').forEach(function (el) { el.textContent = c.size + ' × ' + c.size; });
    $all('[data-pd="hole"]').forEach(function (el) { el.textContent = c.hole; });
    $all('[data-pd="taper"]').forEach(function (el) { el.textContent = c.tapered; });
    $all('[data-pd="max"]').forEach(function (el) { el.textContent = maxDepth(size); });
    $all('[data-pd="from"]').forEach(function (el) { el.textContent = money(Math.min.apply(null, c.bands.map(function (b) { return b[2]; }))); });
    $all('[data-pd="gallery"]').forEach(function (el) { el.textContent = c.size + ' × ' + c.size + ' collar'; el.setAttribute('data-photo', 'collar-' + size); });

    var model = param('model'), brand = param('brand'), facia = param('facia');
    var ctx = $('#pd-context');
    if (ctx && model) {
      ctx.hidden = false;
      ctx.innerHTML = 'Matched to <strong>' + esc(model) + '</strong>' + (facia ? ' with facia <strong>' + esc(facia) + '</strong>' : '') + '. <a href="fitment-finder.html' + (brand ? '?brand=' + esc(brand) : '') + '">Change unit</a>';
    }

    fillColourSelect(colour, param('ral') || 'white');

    var tbody = $('#pd-table tbody');
    tbody.innerHTML = c.bands.map(function (b, i) {
      return '<tr data-band="' + i + '"><td class="depth">' + bandLabel(b) + '</td><td class="num">' + money(b[2]) + '</td><td class="num">' + money(b[2] * (1 + VAT)) + '</td></tr>';
    }).join('');
    $all('tr', tbody).forEach(function (tr) {
      tr.addEventListener('click', function () {
        var b = c.bands[parseInt(tr.getAttribute('data-band'), 10)];
        depth.value = b[0] === 0 ? 25 : b[0];
        update();
      });
    });

    var out = $('#pd-price');
    function update() {
      var d = parseInt(depth.value, 10);
      var n = Math.max(1, parseInt(qty.value, 10) || 1);
      var field = depth.closest('.field');
      var err = $('.field-error', field);
      $all('tr', tbody).forEach(function (tr) { tr.classList.remove('hit'); tr.removeAttribute('aria-current'); });
      if (isNaN(d) || d < 0) {
        out.innerHTML = '<p class="muted">Enter the depth in millimetres to see the price.</p>';
        field.classList.remove('has-error'); err.hidden = true;
        $('#pd-add').disabled = true;
        return;
      }
      var band = bandFor(size, d);
      $('#pd-add').disabled = false;
      if (!band) {
        field.classList.add('has-error'); err.hidden = false;
        err.textContent = d > maxDepth(size) ? 'Our standard depths go to ' + maxDepth(size) + 'mm. We can make deeper collars to order; add it and we\'ll price it.' : 'That depth sits between our standard bands. Add it and we\'ll price it.';
        out.innerHTML = '<p class="price-big">Priced on request</p><p class="muted">Made to order, usually ' + RULES.customLeadDays + '.</p>';
        return;
      }
      field.classList.remove('has-error'); err.hidden = true;
      var tr = $('tr[data-band="' + band.index + '"]', tbody);
      tr.classList.add('hit'); tr.setAttribute('aria-current', 'true');
      var unit = unitPrice({ kind: 'collar', size: size, depth: d, colour: colour.value });
      out.innerHTML = '<p class="price-big">' + money(unit) + ' <small>each ex VAT</small></p>' +
        '<p class="muted">' + money(unit * (1 + VAT)) + ' inc VAT · ' + n + ' × = ' + money(unit * n) + ' ex VAT</p>' +
        (isRal(colour.value) ? '<p class="muted">Includes ' + Math.round(RULES.ralSurcharge * 100) + '% for ' + esc(colourLabel(colour.value)) + '. Adds ' + RULES.ralLeadDays + '.</p>' : '') +
        (n >= RULES.volumeFrom ? '<p><strong>' + Math.round(RULES.volumeDiscount * 100) + '% volume discount</strong> applies at ' + RULES.volumeFrom + ' or more.</p>' : '');
    }
    [depth, colour, qty].forEach(function (el) { el.addEventListener('input', update); el.addEventListener('change', update); });

    $('#pd-add').addEventListener('click', function () {
      var d = parseInt(depth.value, 10);
      if (isNaN(d)) { depth.focus(); return; }
      addToQuote({ kind: bandFor(size, d) ? 'collar' : 'custom', size: size, w: c.size, l: c.size, depth: d, qty: Math.max(1, parseInt(qty.value, 10) || 1), colour: colour.value, note: model ? 'For ' + model : '' });
    });

    /* Which units this collar fits, from the brand data */
    var fits = $('#pd-fits');
    if (fits) {
      var rows = [];
      BRANDS.forEach(function (b) {
        b.ranges.forEach(function (r) {
          var f = r.facias.filter(function (fx) { return collarFor(fx[1]) === size; });
          if (f.length) rows.push('<li><strong>' + esc(b.name) + '</strong> ' + esc(r.range) + ' <span class="muted">· facia ' + esc(f.map(function (x) { return x[0]; }).join(', ')) + '</span></li>');
        });
      });
      fits.innerHTML = rows.length ? rows.join('') : '<li class="muted">Brand-specific fitment for this size to be confirmed. It is often used as an oversize collar to cover a larger opening.</li>';
    }
    if (param('depth')) depth.value = param('depth');
    update();
  }

  /* ======================================================================
     3. Quote builder (R30–R39)
     ====================================================================== */
  function initQuote() {
    var root = $('#quote');
    if (!root) return;
    var linesHost = $('#q-lines'), totalsHost = $('#q-totals');

    /* Opens in a realistic state: if the quote is empty, load clearly labelled sample lines. */
    var sampleBanner = $('#q-sample');
    if (!getQuote().length && !param('custom')) {
      setQuote([
        { id: 's1', kind: 'collar', size: '1000', depth: 100, qty: 6, colour: 'white', note: 'Sample line' },
        { id: 's2', kind: 'collar', size: '750', depth: 60, qty: 2, colour: '9005', note: 'Sample line' },
        { id: 's3', kind: 'deflector', size: 'cassette', qty: 4, colour: 'white', note: 'Sample line' }
      ]);
      if (sampleBanner) sampleBanner.hidden = false;
    }
    if (sampleBanner) $('button', sampleBanner).addEventListener('click', function () { setQuote([]); sampleBanner.hidden = true; });

    function render() {
      var list = getQuote();
      if (!list.length) {
        linesHost.innerHTML = '<div class="empty-state"><p><strong>Your quote is empty.</strong></p><p class="muted">Add a line below, or <a href="fitment-finder.html">find the collar for your unit</a>.</p></div>';
      } else {
        linesHost.innerHTML = '<div class="table-scroll"><table class="data-table q-table"><thead><tr><th scope="col">Item</th><th scope="col">Colour</th><th scope="col" class="num">Qty</th><th scope="col" class="num">Each ex VAT</th><th scope="col" class="num">Line ex VAT</th><th scope="col"><span class="sr-only">Remove</span></th></tr></thead><tbody>' +
          list.map(function (l) {
            var p = unitPrice(l);
            return '<tr data-line="' + l.id + '"><td><strong>' + esc(lineLabel(l)) + '</strong>' + (l.note ? '<br><span class="muted">' + esc(l.note) + '</span>' : '') + '</td>' +
              '<td>' + esc(colourLabel(l.colour)) + '</td>' +
              '<td class="num"><label class="sr-only" for="qty-' + l.id + '">Quantity</label><input class="qty-input" type="number" min="1" max="999" id="qty-' + l.id + '" value="' + l.qty + '"></td>' +
              '<td class="num">' + (p === null ? 'On request' : money(p)) + '</td>' +
              '<td class="num">' + (p === null ? 'On request' : money(p * l.qty)) + '</td>' +
              '<td><button type="button" class="btn-link" data-remove="' + l.id + '">Remove</button></td></tr>';
          }).join('') + '</tbody></table></div>';
      }
      var t = quoteTotals(list);
      totalsHost.innerHTML = '<dl class="kv">' +
        '<dt>Items</dt><dd>' + money(t.sub) + '</dd>' +
        (t.discount ? '<dt>Volume discount (' + Math.round(RULES.volumeDiscount * 100) + '%, ' + t.units + ' collars)</dt><dd>−' + money(t.discount) + '</dd>' : '') +
        '<dt>Delivery' + (t.delivery === 0 && list.length ? ' (free over ' + money(RULES.freeDeliveryOver) + ')' : '') + '</dt><dd>' + money(t.delivery) + '</dd>' +
        '<dt>Total ex VAT</dt><dd>' + money(t.exVat) + '</dd>' +
        '<dt>VAT at 20%</dt><dd>' + money(t.vat) + '</dd>' +
        '<dt class="total">Total inc VAT</dt><dd class="total">' + money(t.inc) + '</dd></dl>' +
        (t.onRequest ? '<p class="muted">' + t.onRequest + ' line' + (t.onRequest > 1 ? 's are' : ' is') + ' made to order and will be priced in our reply.</p>' : '') +
        (!t.discount && t.units > 0 && t.units < RULES.volumeFrom ? '<p class="muted">Order ' + (RULES.volumeFrom - t.units) + ' more collar' + (RULES.volumeFrom - t.units > 1 ? 's' : '') + ' for ' + Math.round(RULES.volumeDiscount * 100) + '% off.</p>' : '');
      $('#q-next').disabled = !list.length;
      $all('[data-remove]', linesHost).forEach(function (b) {
        b.addEventListener('click', function () {
          setQuote(getQuote().filter(function (l) { return l.id !== b.getAttribute('data-remove'); }));
          toast('Line removed');
        });
      });
      $all('.qty-input', linesHost).forEach(function (inp) {
        inp.addEventListener('change', function () {
          var id = inp.id.replace('qty-', '');
          var v = Math.max(1, Math.min(999, parseInt(inp.value, 10) || 1));
          setQuote(getQuote().map(function (l) { if (l.id === id) l.qty = v; return l; }));
        });
      });
    }
    document.addEventListener('cc:quote', render);

    /* Add a line */
    var form = $('#q-add'), kind = $('#qa-kind'), size = $('#qa-size'), depthF = $('#qa-depth'), colourF = $('#qa-colour'), qtyF = $('#qa-qty');
    fillColourSelect(colourF, 'white');
    function syncKind() {
      var k = kind.value;
      $all('[data-for-kind]', form).forEach(function (el) { el.hidden = el.getAttribute('data-for-kind').split(' ').indexOf(k) === -1; });
      size.innerHTML = k === 'deflector'
        ? Object.keys(DEFLECTORS).map(function (key) { return '<option value="' + key + '">' + esc(DEFLECTORS[key].name) + '</option>'; }).join('')
        : Object.keys(COLLARS).map(function (key) { return '<option value="' + key + '">' + esc(COLLARS[key].name) + '</option>'; }).join('');
      if (k === 'collar') size.value = '1000';
    }
    kind.addEventListener('change', syncKind);
    syncKind();
    if (param('custom')) { kind.value = 'custom'; syncKind(); form.scrollIntoView({ block: 'start' }); }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var k = kind.value, ok = true;
      function need(input, test) {
        var f = input.closest('.field');
        var bad = !test(input.value);
        f.classList.toggle('has-error', bad);
        $('.field-error', f).hidden = !bad;
        if (bad && ok) { input.focus(); ok = false; }
      }
      if (k !== 'deflector') need(depthF, function (v) { var n = parseInt(v, 10); return !isNaN(n) && n >= 0 && n <= 600; });
      if (k === 'custom') { need($('#qa-w'), function (v) { return parseInt(v, 10) >= 300; }); need($('#qa-l'), function (v) { return parseInt(v, 10) >= 300; }); }
      if (!ok) return;
      var line = { kind: k, size: size.value, depth: parseInt(depthF.value, 10), qty: Math.max(1, parseInt(qtyF.value, 10) || 1), colour: colourF.value, note: '' };
      if (k === 'collar' && !bandFor(line.size, line.depth)) { line.kind = 'custom'; line.w = COLLARS[line.size].size; line.l = COLLARS[line.size].size; line.note = 'Non-standard depth'; }
      if (k === 'custom') {
        line.w = parseInt($('#qa-w').value, 10); line.l = parseInt($('#qa-l').value, 10);
        line.angle = parseInt($('#qa-angle').value, 10) || 0;
        var file = $('#qa-photo').files[0];
        line.note = file ? 'Photo attached: ' + file.name : 'No photo attached';
      }
      addToQuote(line);
      if (sampleBanner) sampleBanner.hidden = true;
    });

    /* Steps */
    var steps = $all('.q-step');
    function go(n) {
      steps.forEach(function (s, i) { s.hidden = i !== n; });
      $all('.steps-indicator li').forEach(function (li, i) {
        li.classList.toggle('done', i < n); li.classList.toggle('current', i === n);
        if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
      });
      var h = $('h2', steps[n]); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
      window.scrollTo(0, 0);
    }
    $('#q-next').addEventListener('click', function () { go(1); });
    $('#q-back').addEventListener('click', function () { go(0); });

    var details = $('#q-details');
    details.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      $all('[required]', details).forEach(function (input) {
        var f = input.closest('.field');
        var v = input.value.trim();
        var bad = !v || (input.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) ||
          (input.type === 'tel' && v.replace(/[^\d]/g, '').length < 10) ||
          (input.id === 'qd-postcode' && !/^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/.test(v));
        f.classList.toggle('has-error', bad);
        $('.field-error', f).hidden = !bad;
        if (bad && !first) first = input;
      });
      if (first) { first.focus(); return; }
      var ref = 'CC-' + String(Date.now()).slice(-6);
      var list = getQuote(), t = quoteTotals(list);
      $('#q-ref').textContent = ref;
      $('#q-email-echo').textContent = $('#qd-email').value.trim();
      $('#q-summary').innerHTML = list.map(function (l) { return '<li>' + l.qty + ' × ' + esc(lineLabel(l)) + ', ' + esc(colourLabel(l.colour)) + '</li>'; }).join('') +
        '<li><strong>Indicative total ' + money(t.exVat) + ' ex VAT (' + money(t.inc) + ' inc VAT)</strong></li>';
      go(2);
    });
    $('#q-restart').addEventListener('click', function () { setQuote([]); go(0); });

    render();
  }

  /* ======================================================================
     4. RAL colour selector (R40–R45)
     ====================================================================== */
  function initColours() {
    var root = $('#colours');
    if (!root) return;
    var grid = $('#rc-grid'), search = $('#rc-search'), detail = $('#rc-detail'), count = $('#rc-count');
    var fam = 'all', chosen = param('ral') || '9010';
    var fams = [['all', 'All'], ['white', 'Whites'], ['grey', 'Greys'], ['black', 'Blacks'], ['metallic', 'Metallics'], ['blue', 'Blues'], ['green', 'Greens'], ['red', 'Reds'], ['yellow', 'Yellows'], ['orange', 'Oranges']];
    $('#rc-fams').innerHTML = fams.map(function (f) { return '<button type="button" class="chip" data-fam="' + f[0] + '" aria-pressed="' + (f[0] === fam) + '">' + f[1] + '</button>'; }).join('');
    $('#rc-fams').addEventListener('click', function (e) {
      var b = e.target.closest('[data-fam]'); if (!b) return;
      fam = b.getAttribute('data-fam');
      $all('[data-fam]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      render();
    });
    search.addEventListener('input', render);

    function find(code) { for (var i = 0; i < RAL.length; i++) if (RAL[i][0] === code) return RAL[i]; return null; }
    function render() {
      var v = search.value.trim().toLowerCase().replace(/^ral\s*/, '');
      var list = RAL.filter(function (r) { return (fam === 'all' || r[3] === fam) && (!v || r[0].indexOf(v) !== -1 || r[1].toLowerCase().indexOf(v) !== -1); });
      count.textContent = list.length + ' colour' + (list.length === 1 ? '' : 's');
      grid.innerHTML = list.length ? list.map(function (r) {
        return '<button type="button" class="swatch-btn" data-ral="' + r[0] + '" aria-pressed="' + (r[0] === chosen) + '"><span class="swatch" style="background:' + r[2] + '"></span><span class="swatch-code">RAL ' + r[0] + '</span><span class="swatch-name">' + esc(r[1]) + '</span></button>';
      }).join('') : '<div class="empty-state"><p>No colours match "' + esc(search.value) + '". Any RAL Classic code can be made; <a href="quote.html?custom=1">ask us</a>.</p></div>';
      showDetail();
    }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ral]'); if (!b) return;
      chosen = b.getAttribute('data-ral');
      $all('[data-ral]', grid).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      showDetail();
      if (window.innerWidth < 1024) detail.scrollIntoView({ block: 'nearest' });
    });
    function showDetail() {
      var r = find(chosen);
      if (!r) { detail.innerHTML = '<p class="muted">Choose a colour to see lead time and price.</p>'; return; }
      var white = r[4] === true;
      detail.innerHTML = '<div class="swatch swatch-lg" style="background:' + r[2] + '"></div>' +
        '<h2 class="h3">RAL ' + r[0] + ' ' + esc(r[1]) + '</h2>' +
        '<dl class="kv"><dt>Lead time</dt><dd>' + (white ? 'Standard, same day before 10am' : RULES.ralLeadDays) + '</dd>' +
        '<dt>Price</dt><dd>' + (white ? 'Standard price' : '+' + Math.round(RULES.ralSurcharge * 100) + '%') + '</dd></dl>' +
        '<p class="muted small">Screen colours are approximate. Check against a physical RAL card before ordering.</p>' +
        '<label for="rc-size">Collar size</label><select id="rc-size">' + Object.keys(COLLARS).map(function (k) { return '<option value="' + k + '"' + (k === '1000' ? ' selected' : '') + '>' + esc(COLLARS[k].name) + '</option>'; }).join('') + '</select>' +
        '<div class="row"><a class="btn" id="rc-go" href="product.html?size=1000&ral=' + r[0] + '">Choose this colour</a>' +
        '<button type="button" class="btn btn-secondary" id="rc-apply">Apply to my quote</button></div>';
      var sel = $('#rc-size', detail), go = $('#rc-go', detail);
      sel.addEventListener('change', function () { go.setAttribute('href', 'product.html?size=' + sel.value + '&ral=' + r[0]); });
      $('#rc-apply', detail).addEventListener('click', function () {
        var list = getQuote();
        if (!list.length) { toast('Your quote is empty. Choose a collar first.'); return; }
        setQuote(list.map(function (l) { l.colour = r[4] === true ? 'white' : r[0]; return l; }));
        toast('All ' + list.length + ' quote lines set to RAL ' + r[0] + ' ' + r[1]);
      });
    }
    render();
  }

  /* ======================================================================
     5. Projects and reviews (R50–R55)
     ====================================================================== */
  function initProjects() {
    var root = $('#projects');
    if (!root) return;
    var grid = $('#pj-grid'), count = $('#pj-count');
    var setting = 'All', product = 'All', visible = [];
    function chips(host, values, get, set) {
      host.innerHTML = values.map(function (v) { return '<button type="button" class="chip" aria-pressed="' + (v === get()) + '" data-v="' + esc(v) + '">' + esc(v) + '</button>'; }).join('');
      host.addEventListener('click', function (e) {
        var b = e.target.closest('[data-v]'); if (!b) return;
        set(b.getAttribute('data-v'));
        $all('[data-v]', host).forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        render();
      });
    }
    chips($('#pj-settings'), ['All', 'Restaurants', 'Offices', 'Schools', 'Retail', 'Hotels'], function () { return setting; }, function (v) { setting = v; });
    chips($('#pj-products'), ['All', 'Collars', 'Deflectors'], function () { return product; }, function (v) { product = v; });
    function render() {
      visible = PROJECTS.filter(function (p) { return (setting === 'All' || p.setting === setting) && (product === 'All' || p.product === product); });
      count.textContent = visible.length + ' project' + (visible.length === 1 ? '' : 's');
      grid.innerHTML = visible.length ? visible.map(function (p, i) {
        return '<li class="pj-card"><button type="button" class="pj-open" data-i="' + i + '"><span class="wf-placeholder ratio-4-3" data-photo="project-' + p.id + '">Install photo</span>' +
          '<span class="pj-meta"><span class="badge">' + esc(p.setting) + '</span> <span class="badge">' + esc(p.product) + '</span></span>' +
          '<span class="pj-title">' + esc(p.title) + '</span></button></li>';
      }).join('') : '<li class="empty-state">No projects match. <button type="button" class="btn-link" id="pj-reset">Show all</button></li>';
      var reset = $('#pj-reset');
      if (reset) reset.addEventListener('click', function () { setting = 'All'; product = 'All'; $all('#pj-settings [data-v], #pj-products [data-v]').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-v') === 'All' ? 'true' : 'false'); }); render(); });
    }
    var modal = $('#pj-modal'), at = 0, opener = null;
    function show(i) {
      at = (i + visible.length) % visible.length;
      var p = visible[at];
      $('#pj-m-title').textContent = p.title;
      $('#pj-m-photo').setAttribute('data-photo', 'project-' + p.id);
      $('#pj-m-meta').textContent = p.setting + ' · ' + p.product;
      $('#pj-m-detail').textContent = p.detail;
      $('#pj-m-pos').textContent = (at + 1) + ' of ' + visible.length;
    }
    function close() { modal.classList.remove('open'); document.body.style.overflow = ''; if (opener) opener.focus(); }
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.pj-open'); if (!b) return;
      opener = b;
      show(parseInt(b.getAttribute('data-i'), 10));
      modal.classList.add('open'); document.body.style.overflow = 'hidden';
      $('.wf-modal-panel', modal).focus();
    });
    $('#pj-prev').addEventListener('click', function () { show(at - 1); });
    $('#pj-next').addEventListener('click', function () { show(at + 1); });
    modal.addEventListener('click', function (e) { if (e.target === modal || e.target.classList.contains('wf-modal-close')) close(); });
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(at - 1);
      if (e.key === 'ArrowRight') show(at + 1);
    });
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initAccordions();
    initTabs();
    initCarousels();
    initModals();
    initNotes();
    initProtoNav();
    initHeaderHeight();
    initQuoteCount();
    initCutoff();
    initSteppers();
    initFinder();
    initProduct();
    initQuote();
    initColours();
    initProjects();
  });
})();
