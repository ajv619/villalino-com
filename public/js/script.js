// Shared values declared once in css/style.css (:root)
var rootStyles = getComputedStyle(document.documentElement);
function cssNumber(name) {
  return parseFloat(rootStyles.getPropertyValue(name));
}
var COLLAPSED_W = cssNumber('--card-w');                 // px
var PANEL_SWITCH_DELAY = cssNumber('--panel-switch-delay'); // ms

var MEDIA_PLACEHOLDER = 'Demo / video coming soon';

var GITHUB_ICON =
  '<svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">' +
  '<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 ' +
  '0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 ' +
  '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 ' +
  '0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 ' +
  '1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 ' +
  '3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 ' +
  '8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>';

var YOUTUBE_ICON =
  '<svg class="yt-ico" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
  '<path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.51' +
  'A3.02 3.02 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3.02 3.02 0 0 0 ' +
  '2.12 2.14c1.88.51 9.38.51 9.38.51s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14A31.5 31.5 ' +
  '0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>';

// ── DOM helpers: data values only ever go through attributes/textContent ──
// el('a', { href: url, class: 'x' }, [child, 'text']) → element
function el(tag, attrs, children) {
  var node = document.createElement(tag);
  if (attrs) {
    Object.keys(attrs).forEach(function (k) {
      if (attrs[k] != null) node.setAttribute(k, attrs[k]);
    });
  }
  (children || []).forEach(function (c) {
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

// Parse one of the constant icon strings above (never data) into a node
function svg(markup) {
  var t = document.createElement('template');
  t.innerHTML = markup;
  return t.content.firstChild;
}

function externalLink(href, className, children) {
  return el('a', { class: className, href: href, target: '_blank', rel: 'noopener' }, children);
}

var bar = document.querySelector('.bar');
var links = document.querySelectorAll('.nav a');
var panels = document.querySelectorAll('.panel');

function collapse() {
  closeProject();
  bar.classList.remove('active');
  links.forEach(function (l) { l.classList.remove('selected'); });
  panels.forEach(function (p) { p.classList.remove('shown'); });
}

var switchTimer = null;
links.forEach(function (link) {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    // Clicking the link that's already open collapses back to center
    if (link.classList.contains('selected')) {
      collapse();
      return;
    }

    var id = link.getAttribute('data-section');

    // Is a panel currently shown? If so, let it fully collapse before the
    // new one forms — a brief blank buffer instead of overlapping.
    var wasShowing = bar.classList.contains('active') &&
      Array.prototype.some.call(panels, function (p) {
        return p.classList.contains('shown');
      });

    bar.classList.add('active');
    links.forEach(function (l) { l.classList.remove('selected'); });
    link.classList.add('selected');

    closeProject();
    panels.forEach(function (p) { p.classList.remove('shown'); });

    clearTimeout(switchTimer);
    var reveal = function () {
      document.getElementById(id).classList.add('shown');
      updateProjectFades();
      updateExperienceFades();
    };
    if (wasShowing) {
      switchTimer = setTimeout(reveal, PANEL_SWITCH_DELAY);
    } else {
      reveal();
    }
  });
});

// Escape collapses: first an open project, otherwise the whole menu
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Escape') return;
  if (projectsSection.classList.contains('expanded')) {
    closeProject();
  } else {
    collapse();
  }
});

// Clicking outside the open content (but not on the links or icon) collapses.
// While a project is expanded, outside clicks are ignored (X / Esc close it).
document.addEventListener('click', function (e) {
  if (!bar.classList.contains('active')) return;
  if (projectsSection.classList.contains('expanded')) return;
  if (e.target.closest('.nav')) return;
  if (e.target.closest('.project-filter')) return;
  if (e.target.closest('.panel-inner')) return;
  if (e.target.closest('.social')) return;
  collapse();
});

// Projects carousel: show edge fades only when there's hidden content there
var projectsSection = document.getElementById('projects');
var projectsScroller = document.querySelector('.panel-inner.projects');
var projectCards = document.querySelectorAll('.project-card');
var expandedCard = null;

// Give each card its close button, logo slot and links/media block
projectCards.forEach(function (card) {
  var close = document.createElement('button');
  close.className = 'card-close';
  close.setAttribute('aria-label', 'Close project');
  close.textContent = '\u00d7';
  close.addEventListener('click', function (e) {
    e.stopPropagation();
    closeProject();
  });
  card.appendChild(close);

  // APP ICON / LOGO — BUILT FOR EVERY CARD SO THE SLOT IS UNIVERSAL.
  // A CARD OPTS IN WITH data-logo="path" (AND OPTIONAL data-logo-link
  // TO MAKE IT CLICK THROUGH). WITH NO data-logo IT STAYS AS A QUIET
  // DASHED PLACEHOLDER — THE PLUMBING IS THERE, JUST DROP IN AN IMAGE.
  var logo = document.createElement('div');
  logo.className = 'card-logo';
  var logoSrc = card.getAttribute('data-logo');
  if (logoSrc) {
    var titleEl = card.querySelector('h4');
    var logoImg = el('img', { src: logoSrc, alt: titleEl ? titleEl.textContent + ' logo' : '' });
    var logoLink = card.getAttribute('data-logo-link');
    logo.appendChild(logoLink ? externalLink(logoLink, null, [logoImg]) : logoImg);
  } else {
    logo.classList.add('empty'); // NO LOGO YET → SHOW THE PLACEHOLDER
  }
  card.appendChild(logo);

  // Technical projects get a GitHub button when the card carries a
  // data-github repo. Cards without one render no links. Creative: neither.
  var extra = el('div', { class: 'card-extra' });
  var githubUrl = card.getAttribute('data-github');
  if (githubUrl && !card.classList.contains('creative')) {
    extra.appendChild(el('div', { class: 'card-links' }, [
      externalLink(githubUrl, 'card-btn', [svg(GITHUB_ICON), el('span', null, ['GitHub'])])
    ]));
  }
  extra.appendChild(el('div', { class: 'card-media' }, [MEDIA_PLACEHOLDER]));
  card.appendChild(extra);

  card.addEventListener('click', function () {
    if (card === expandedCard) return;
    openProject(card);
  });
});


// Trailing spacer that gives room to scroll an expanded card to center
var railSpacer = document.createElement('div');
railSpacer.className = 'rail-spacer';
if (projectsScroller) projectsScroller.appendChild(railSpacer);

function expandedWidth() {
  return Math.min(720, Math.round(projectsScroller.clientWidth * 0.82));
}

// Center based on the card's resting (collapsed) position so the scroll
// target is correct even while widths are still animating.
function railMetrics() {
  var styles = getComputedStyle(projectsScroller);
  return {
    padLeft: parseFloat(styles.paddingLeft) || 0,
    gap: parseFloat(styles.columnGap || styles.gap) || 20
  };
}

// Mirrors the card's CSS flex-basis, min(var(--card-w), 88vw), so the
// scroll math matches the rendered width on phones.
function collapsedWidth() {
  return Math.min(COLLAPSED_W, window.innerWidth * 0.88);
}

function centerCard(card, w) {
  var m = railMetrics();
  // count only the visible cards before this one (filter-aware)
  var visibleIndex = 0;
  for (var i = 0; i < projectCards.length; i++) {
    if (projectCards[i] === card) break;
    if (projectCards[i].style.display !== 'none') visibleIndex++;
  }
  var baseLeft = m.padLeft + visibleIndex * (collapsedWidth() + m.gap);
  var target = baseLeft + w / 2 - projectsScroller.clientWidth / 2;
  projectsScroller.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
}

function isGridView() {
  return projectsSection.classList.contains('grid-view');
}

// Build the right video player from a card's data-* attributes:
//   data-video-type="youtube|vimeo|file|link" + data-video-id / -src / -href
function videoEmbed(card) {
  var type = card.getAttribute('data-video-type');
  var id = card.getAttribute('data-video-id');
  var src = card.getAttribute('data-video-src');
  var href = card.getAttribute('data-video-href');
  if (type === 'youtube' && id) {
    return el('iframe', {
      src: 'https://www.youtube.com/embed/' + encodeURIComponent(id) + '?rel=0',
      title: 'Project video', loading: 'lazy', allowfullscreen: '',
      allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    });
  }
  if (type === 'vimeo' && id) {
    return el('iframe', {
      src: 'https://player.vimeo.com/video/' + encodeURIComponent(id),
      title: 'Project video', loading: 'lazy', allowfullscreen: '',
      allow: 'autoplay; fullscreen; picture-in-picture'
    });
  }
  if (type === 'file' && src) {
    return el('video', { src: src, controls: '', preload: 'metadata' });
  }
  if (type === 'link' && href) {
    return externalLink(href, 'card-btn watch-btn', [svg(YOUTUBE_ICON), el('span', null, ['Watch on YouTube'])]);
  }
  return null;
}

function mountVideo(card) {
  var media = card.querySelector('.card-media');
  if (!media) return;
  var player = videoEmbed(card);
  if (player) {
    // Embeds fill a 16:9 player; the click-out link is a compact pill button.
    media.classList.add(card.getAttribute('data-video-type') === 'link' ? 'has-link' : 'has-embed');
    media.textContent = '';
    media.appendChild(player);
  }
}

function unmountVideo(card) {
  var media = card && card.querySelector('.card-media');
  if (media && (media.classList.contains('has-embed') || media.classList.contains('has-link'))) {
    media.classList.remove('has-embed');
    media.classList.remove('has-link');
    media.textContent = MEDIA_PLACEHOLDER; // tears down iframe -> stops playback
  }
}

// Smoothly scroll the grid so the expanded card is vertically centered
function centerCardInGrid(card) {
  requestAnimationFrame(function () {
    var cardRect = card.getBoundingClientRect();
    var contRect = projectsScroller.getBoundingClientRect();
    var delta = (cardRect.top + cardRect.height / 2) -
                (contRect.top + contRect.height / 2);
    projectsScroller.scrollTo({
      top: projectsScroller.scrollTop + delta,
      behavior: 'smooth'
    });
  });
}

function openProject(card) {
  closeProject();
  expandedCard = card;
  card.classList.add('expanded');
  projectsSection.classList.add('expanded');
  mountVideo(card);

  if (isGridView()) {
    // grid: the card spans the row in place, then we glide it to center
    updateProjectFades();
    centerCardInGrid(card);
    return;
  }

  var w = expandedWidth();

  // Grow the spacer to exactly enough room to center the last (oldest) card
  // and no more — so there's no empty surplus scroll past it.
  var m = railMetrics();
  var needed = Math.max(m.padLeft, (projectsScroller.clientWidth - w) / 2 - m.gap);

  railSpacer.style.transition = 'none';
  railSpacer.style.flexBasis = needed + 'px';
  void projectsScroller.offsetWidth; // force reflow

  card.style.flexBasis = w + 'px';
  updateProjectFades();
  centerCard(card, w);
}

function closeProject() {
  if (!expandedCard) return;
  unmountVideo(expandedCard);
  expandedCard.classList.remove('expanded');
  expandedCard.style.flexBasis = '';
  expandedCard.scrollTop = 0;
  expandedCard = null;
  projectsSection.classList.remove('expanded');

  // Ease the spacer back so the scroll settles smoothly (no jump)
  railSpacer.style.transition = 'flex-basis 0.32s ease';
  railSpacer.style.flexBasis = '6vw';
}

// View toggle: Rail ⇄ Grid
var viewBtns = document.querySelectorAll('.view-btn');
viewBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var view = btn.getAttribute('data-view');
    viewBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    closeProject();
    projectsSection.classList.toggle('grid-view', view === 'grid');
    if (view === 'grid') {
      projectsScroller.scrollTop = 0;
    } else {
      projectsScroller.scrollLeft = 0;
    }
    updateProjectFades();
  });
});

// Clicking empty space in the carousel: close an open project, otherwise
// collapse the whole menu (matching the other panels' deadspace behavior)
if (projectsScroller) {
  projectsScroller.addEventListener('click', function (e) {
    if (e.target.closest('.project-card')) return;
    if (expandedCard) {
      closeProject();
    } else {
      collapse();
    }
  });
}

// PROJECTS filter: All / Technical / Creative
var filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    var filter = btn.getAttribute('data-filter');
    filterBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    closeProject();
    projectCards.forEach(function (card) {
      var show = filter === 'all' || card.classList.contains(filter);
      card.style.display = show ? '' : 'none';
    });
    projectsScroller.scrollTo({ left: 0, behavior: 'auto' });
    updateProjectFades();
  });
});

// Edge fades show only when there's hidden content in that direction.
// `suppressed` hides both (e.g. grid view or an expanded project).
function updateEdgeFades(section, scroller, suppressed) {
  if (suppressed) {
    section.classList.remove('show-left', 'show-right');
    return;
  }
  var max = scroller.scrollWidth - scroller.clientWidth;
  section.classList.toggle('show-left', scroller.scrollLeft > 4);
  section.classList.toggle('show-right', scroller.scrollLeft < max - 4);
}

function updateProjectFades() {
  if (!projectsScroller) return;
  updateEdgeFades(projectsSection, projectsScroller,
    isGridView() || projectsSection.classList.contains('expanded'));
}

if (projectsScroller) {
  projectsScroller.addEventListener('scroll', updateProjectFades);
  window.addEventListener('resize', updateProjectFades);
  updateProjectFades();
}

// Experience rail: same edge fades as PROJECTS
var experienceSection = document.getElementById('experience');
var experienceScroller = experienceSection.querySelector('.panel-inner');

function updateExperienceFades() {
  updateEdgeFades(experienceSection, experienceScroller, false);
}

// The rail fills the panel, so clicks on its deadspace collapse (like PROJECTS)
experienceScroller.addEventListener('click', function (e) {
  if (e.target.closest('.school')) return;
  collapse();
});

experienceScroller.addEventListener('scroll', updateExperienceFades);
window.addEventListener('resize', updateExperienceFades);
updateExperienceFades();
