/* Style / theme picker — loads saved theme instantly, mounts picker widget */
(function () {
  var THEMES = [
    { id: 'noir',      name: 'Noir',      desc: 'Bone white, no red.' },
    { id: 'blackwork', name: 'Blackwork', desc: 'Cream paper, solid ink.' },
    { id: 'neon',      name: 'Neon',      desc: 'Cyberpunk glow.' },
    { id: 'gothic',    name: 'Gothic',    desc: 'Cathedral blackletter.' },
    { id: 'crimson',   name: 'Crimson',   desc: 'Classic red on black.' }
  ];
  var KEY = 'frenzy-theme';

  // Apply saved theme ASAP (before DOMContentLoaded to avoid flash)
  try {
    var saved = localStorage.getItem(KEY);
    if (saved && THEMES.some(function (t) { return t.id === saved; })) {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'noir');
    }
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'noir');
  }

  function mountPicker() {
    if (document.querySelector('.style-picker')) return;
    var current = document.documentElement.getAttribute('data-theme') || 'noir';

    var wrap = document.createElement('div');
    wrap.className = 'style-picker';
    wrap.innerHTML =
      '<button class="style-picker-toggle" aria-expanded="false" aria-haspopup="listbox">' +
        '<span class="style-picker-label">Style</span>' +
      '</button>' +
      '<div class="style-picker-panel" role="listbox" aria-label="Site style">' +
        '<h4>Pick a Vibe</h4>' +
        THEMES.map(function (t) {
          return (
            '<div class="style-option' + (t.id === current ? ' active' : '') + '" data-theme-id="' + t.id + '" role="option" tabindex="0">' +
              '<span class="style-swatch sw-' + t.id + '"></span>' +
              '<span class="style-option-text">' +
                '<span class="style-option-name">' + t.name + '</span>' +
                '<span class="style-option-desc">' + t.desc + '</span>' +
              '</span>' +
            '</div>'
          );
        }).join('') +
      '</div>';
    document.body.appendChild(wrap);

    var toggle = wrap.querySelector('.style-picker-toggle');
    toggle.addEventListener('click', function () {
      var open = wrap.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    wrap.querySelectorAll('.style-option').forEach(function (opt) {
      opt.addEventListener('click', function () { applyTheme(opt.getAttribute('data-theme-id')); });
      opt.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          applyTheme(opt.getAttribute('data-theme-id'));
        }
      });
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) {
        wrap.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    function applyTheme(id) {
      document.documentElement.setAttribute('data-theme', id);
      try { localStorage.setItem(KEY, id); } catch (e) {}
      wrap.querySelectorAll('.style-option').forEach(function (o) {
        o.classList.toggle('active', o.getAttribute('data-theme-id') === id);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountPicker);
  } else {
    mountPicker();
  }
})();
