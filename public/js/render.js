/* Builds the content cards from js/data.js. Runs synchronously before
   js/script.js, which wires up the interactions. Every data value goes
   through textContent / setAttribute — never innerHTML. */
(function () {
  var KIND_LABEL = { technical: 'Technical', creative: 'Creative' };

  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (attrs[k] != null && attrs[k] !== false) node.setAttribute(k, attrs[k]);
      });
    }
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function newTab(href, attrs, children) {
    var a = Object.assign({ href: href, target: '_blank', rel: 'noopener' }, attrs);
    return h('a', a, children);
  }

  // "a **b** c" → ['a ', <strong>b</strong>, ' c']
  function bold(text) {
    return text.split('**').map(function (part, i) {
      return i % 2 ? h('strong', null, [part]) : part;
    }).filter(function (part) { return part !== ''; });
  }

  // Lines separated by <br>
  function lines(list) {
    var out = [];
    list.forEach(function (line, i) {
      if (i) out.push(h('br'));
      out.push(line);
    });
    return out;
  }

  // Struck-through content for delayed projects
  function strike(project, children) {
    return project.delayed ? [h('s', null, children)] : children;
  }

  function renderCard(p) {
    var descBody = p.credits
      ? lines(p.credits).concat([h('br'), h('br'), p.desc])
      : [p.desc];
    var desc = strike(p, descBody);
    if (p.delayed) desc.push(' ', h('strong', null, ['UPDATE: DELAYED.']));

    var video = p.video || {};
    return h('div', {
      class: 'project-card ' + p.kind + (p.fullLogo ? ' full-logo' : ''),
      'data-github': p.github,
      'data-logo': p.logo,          // also a CSS hook for per-logo sizing
      'data-logo-link': p.logoLink,
      'data-video-type': video.type,
      'data-video-href': video.href,
      'data-video-id': video.id,
      'data-video-src': video.src
    }, [
      h('span', { class: 'project-tag' }, [h('span', { class: 'dot' }), KIND_LABEL[p.kind]]),
      h('h4', null, strike(p, [p.title])),
      h('p', { class: 'year' }, strike(p, [p.year])),
      p.stack && h('ul', { class: 'stack-list' }, p.stack.map(function (s) { return h('li', null, [s]); })),
      p.role && h('p', { class: 'role' }, strike(p, [p.role])),
      p.org && h('p', { class: 'org' }, strike(p, [p.org])),
      h('p', { class: 'desc' }, desc)
    ]);
  }

  function renderExperience(x) {
    return h('div', { class: 'school exp' }, [
      newTab(x.href, { class: 'crest-link', 'aria-label': x.label }, [
        h('img', { class: 'crest', src: x.logo, alt: x.logoAlt })
      ]),
      h('div', { class: 'school-text' }, [
        h('h3', null, [x.title]),
        h('p', { class: 'meta' }, [x.meta]),
        h('ul', { class: 'bullets' }, x.bullets.map(function (b) { return h('li', null, bold(b)); }))
      ])
    ]);
  }

  function renderActivities(list) {
    var out = [];
    list.forEach(function (a, i) {
      if (i) out.push(' ', h('span', { class: 'sep' }, ['·']), ' ');
      var pair = [a.role + ', ', a.href ? newTab(a.href, null, [a.org]) : a.org];
      if (a.nowrap) out.push(h('span', { class: 'role-group' }, pair));
      else out.push.apply(out, pair);
    });
    return out;
  }

  function renderSchool(s) {
    return h('div', { class: 'school' }, [
      h('img', { class: 'crest', src: s.logo, alt: s.logoAlt }),
      h('div', { class: 'school-text' }, [
        h('h3', null, [s.name]),
        h('p', { class: 'meta' }, [s.meta])
      ].concat(s.degrees.map(function (d) {
        return h('p', { class: 'degree' }, [d]);
      }), [
        h('p', { class: 'activities' }, renderActivities(s.activities))
      ]))
    ]);
  }

  function renderResearch(r) {
    return h('div', { class: 'research-card' }, [
      newTab(r.href, { class: 'lab-logo ' + r.logoShape, 'aria-label': r.label }, [
        h('img', { src: r.logo, alt: r.label })
      ]),
      h('p', null, r.body.map(function (run) {
        return typeof run === 'string' ? run : newTab(run.href, null, [run.text]);
      }))
    ]);
  }

  // Fill a container, keeping anything already in it (e.g. a rail spacer) last
  function fill(selector, items, render) {
    var container = document.querySelector(selector);
    if (!container) return;
    var tail = container.firstChild;
    items.forEach(function (item) { container.insertBefore(render(item), tail); });
  }

  fill('#experience .panel-inner', EXPERIENCE, renderExperience);
  fill('#projects .panel-inner', PROJECTS, renderCard);
  fill('#research .panel-inner', RESEARCH, renderResearch);
  fill('#education .panel-inner', EDUCATION, renderSchool);
})();
