// ─── COURSE DATA ────────────────────────────────────────────────────────────

const COURSES = [
  {
    id: 'basics', num: '1', title: 'Drawing Basics', platform: 'proko', platformLabel: 'Proko',
    desc: 'Foundational concepts everything else depends on — line control, shapes, basic form, and observation.',
    defaultStatus: 'in-progress',
    sections: ['Getting Started','Lines','Shapes','How Perspective Works','Intuitive Perspective','Values','Edges','Bonus Content']
  },
  {
    id: 'gesture', num: '2', title: 'The Gesture Course', platform: 'proko', platformLabel: 'Proko',
    desc: 'The most important course for anime and character goals. Dynamic poses, weight, rhythm, foreshortening, hands and feet.',
    defaultStatus: 'up-next',
    sections: ['Intro to Gesture','Proportions','Learning Gesture','Difficult Poses','The Gesture of Limbs','The Shape Method','Beyond Gesture']
  },
  {
    id: 'figure', num: '3', title: 'Figure Drawing Fundamentals', platform: 'proko', platformLabel: 'Proko',
    desc: 'Build the full figure from scratch. The Bean, Robo Bean, mannequinization, proportions. Invent poses from imagination.',
    defaultStatus: 'locked',
    sections: ['Gesture','The Bean','Structure','Landmarks','Robo Bean','Mannequinization','Balance','Exaggeration','Proportions','Measuring','Shading','Figure Drawing Demo','Closing Thoughts']
  },
  {
    id: 'head', num: '4', title: 'Head Drawing and Construction', platform: 'proko', platformLabel: 'Proko',
    desc: 'Loomis-inspired method for drawing heads from any angle. Foundation for stylizing into anime faces.',
    defaultStatus: 'locked',
    sections: ['Intro to Skull and Abstraction','Head Construction and Invention','Perspective Forms of the Face','Facial Features','Bonus Lessons']
  },
  {
    id: 'perspective', num: '5', title: 'The Perspective Course', platform: 'proko', platformLabel: 'Proko',
    desc: 'Unlocks backgrounds, environments, and weapon design. Makes anything drawable.',
    defaultStatus: 'locked',
    sections: ['Intro to Perspective','Materials','Depth Tricks and Old Masters','Intro to Forms','Orthos and One Point','Orthos and No Point','XYZ','Grids','Eye Level','The Picture Plane','Wide Angles','Proximity Tricks','Forms — The Great Secret','Bonus Lessons','Part 2: Mastering the Skills']
  },
  {
    id: 'shading', num: '6', title: 'The Shading Course', platform: 'proko', platformLabel: 'Proko',
    desc: 'Makes everything look 3D. Tonal value, light and form, 7 methods for volume, shading from imagination.',
    defaultStatus: 'locked',
    sections: ['Getting Started','How to Separate Light & Shadow','How to See Light Effects','How to Control Values','How to Organize Values','How to Create Realistic Shading','How to Use Light Probes','How to Show Form','How to Invent Shading','How to Use Maquettes','Bringing it all Together']
  },
  {
    id: 'style', num: '7', title: 'Develop Your Art Style', platform: 'proko', platformLabel: 'Proko',
    desc: 'Stop drawing realistically and start drawing like yourself. The 30% Truth Rule. Where you push toward anime.',
    defaultStatus: 'locked',
    sections: ['Intro to Style','Power of Line','Style and Media','Illustration from Start to Finish','Bonus Content']
  },
  {
    id: 'anime', num: '8', title: 'Anime Art Academy', platform: 'external', platformLabel: 'animeartacademy.com',
    desc: 'Anime-specific instruction from Japanese professional artists. Fills the gap Proko leaves on stylized character work.',
    defaultStatus: 'locked',
    sections: ['Foundations','Character Design','Faces & Expressions','Body & Anatomy','Clothing & Details','Coloring & Rendering','Final Projects']
  },
  {
    id: 'digital', num: '9', title: 'Digital Painting Fundamentals', platform: 'free', platformLabel: 'ctrl+paint.com — FREE',
    desc: 'Transition into digital. Brushes, layers, workflow, color, lighting. Come in with solid fundamentals.',
    defaultStatus: 'locked',
    sections: ['Getting Started Digitally','Value Fundamentals','Digital Brushwork','Edge Control','Color Fundamentals','Texture & Detail','Workflow & Process']
  },
  {
    id: 'marc', num: '10', title: "Marc Brunet's ART School", platform: 'cubebrush', platformLabel: 'Cubebrush — ex-Blizzard',
    desc: 'Capstone digital program. 10 terms, 100+ hours. Full digital workflow — design, rendering, concepting.',
    defaultStatus: 'locked',
    sections: ['Term 1: Fundamentals','Term 2: Construction','Term 3: Anatomy','Term 4: Color Theory','Term 5: Rendering','Term 6: Character Design','Term 7: Environments','Term 8: Illustration','Term 9: Advanced Techniques','Term 10: Final Projects']
  }
];

const SKETCHING = {
  id: 'sketching', title: 'The Ultimate Sketching Course',
  sections: ['The Basics','The Soul of the Drawing','Drawing Hands','Drawing Heads','Feet','Skeleton','Back Anatomy','Chest Anatomy','Arms','Legs and Pelvis','Imaginative Drawing','Basic Perspective','Demonstrations & Sketchbook Tours']
};

const STATUS_CYCLE = ['locked','up-next','in-progress','done'];
const STATUS_LABELS = { locked:'Locked', 'up-next':'Up Next', 'in-progress':'In Progress', done:'Done ✓' };

// ─── STATUS ─────────────────────────────────────────────────────────────────

function getStatuses() { return JSON.parse(localStorage.getItem('daj_statuses') || '{}'); }
function saveStatuses(s) { localStorage.setItem('daj_statuses', JSON.stringify(s)); }
function getStatus(id) {
  const s = getStatuses();
  const c = COURSES.find(x => x.id === id);
  return s[id] || (c ? c.defaultStatus : 'locked');
}
function cycleStatus(id) {
  const cur = getStatus(id);
  const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length];
  const s = getStatuses(); s[id] = next; saveStatuses(s);
  applyStatus(id, next);
  updateStats();
}
function applyStatus(id, status) {
  const card = document.getElementById('card-' + id);
  const badge = document.getElementById('sbadge-' + id);
  if (!card || !badge) return;
  STATUS_CYCLE.forEach(s => card.classList.remove('status-' + s));
  card.classList.add('status-' + status);
  badge.className = 'status-badge ' + status;
  badge.textContent = STATUS_LABELS[status];
}

// ─── SECTION DATA ────────────────────────────────────────────────────────────

function getSD() { return JSON.parse(localStorage.getItem('daj_sdata') || '{}'); }
function saveSD(d) { localStorage.setItem('daj_sdata', JSON.stringify(d)); }
function sKey(cid, sname) { return cid + '::' + sname; }

function getSec(cid, sname) {
  const d = getSD();
  return d[sKey(cid, sname)] || { pct: 0, photos: [] };
}
function setSecPct(cid, sname, pct) {
  const d = getSD();
  const k = sKey(cid, sname);
  if (!d[k]) d[k] = { pct: 0, photos: [] };
  d[k].pct = parseInt(pct);
  saveSD(d);
}
function addSecPhoto(cid, sname, photo) {
  const d = getSD();
  const k = sKey(cid, sname);
  if (!d[k]) d[k] = { pct: 0, photos: [] };
  d[k].photos.unshift(photo);
  saveSD(d);
}
function removeSecPhoto(cid, sname, idx) {
  const d = getSD();
  const k = sKey(cid, sname);
  if (d[k] && d[k].photos) d[k].photos.splice(idx, 1);
  saveSD(d);
}
function getAllCoursePhotos(cid) {
  const course = cid === 'sketching' ? SKETCHING : COURSES.find(c => c.id === cid);
  if (!course || !course.sections) return [];
  const d = getSD();
  return course.sections.flatMap(s => (d[sKey(cid, s)] || {}).photos || []);
}
function getCourseCompletion(cid) {
  const course = cid === 'sketching' ? SKETCHING : COURSES.find(c => c.id === cid);
  if (!course) return { done: 0, total: 0 };
  const total = course.sections.length;
  const done = course.sections.filter(s => getSec(cid, s).pct >= 100).length;
  return { done, total };
}

// ─── COURSE CARDS ────────────────────────────────────────────────────────────

function buildCourses() {
  buildCard(SKETCHING, true);
  const list = document.getElementById('courses-list');
  list.innerHTML = '';
  COURSES.forEach(c => {
    const div = buildCard(c, false);
    list.appendChild(div);
  });
}

function buildCard(course, isOngoing) {
  const cid = course.id;
  const status = getStatus(cid);
  const { done, total } = getCourseCompletion(cid);
  const overallPct = total > 0 ? Math.round((done / total) * 100) : 0;

  let container;
  if (isOngoing) {
    container = document.getElementById('card-' + cid);
    container.innerHTML = '';
  } else {
    container = document.createElement('div');
    container.id = 'card-' + cid;
  }
  container.className = 'course-card status-' + status;

  container.innerHTML = `
    <div class="card-header">
      <div class="card-left">
        <div class="course-num ${isOngoing ? 'star' : ''}">${isOngoing ? '★' : course.num}</div>
        <div class="card-info">
          <h3>${course.title}</h3>
          <div class="card-meta-row">
            <span class="platform ${course.platform || 'proko'}">${course.platformLabel || 'Proko'}</span>
            <span class="completion-badge" id="comp-${cid}">${done}/${total} sections</span>
          </div>
          <p>${course.desc}</p>
        </div>
      </div>
      <div class="card-right">
        <div class="montage" id="montage-${cid}"></div>
        ${isOngoing
          ? `<button class="status-badge in-progress" id="sbadge-${cid}" onclick="cycleStatus('${cid}')">${STATUS_LABELS[getStatus(cid)]}</button>`
          : `<button class="status-badge ${status}" id="sbadge-${cid}" onclick="cycleStatus('${cid}')">${STATUS_LABELS[status]}</button>`
        }
      </div>
    </div>
    <div class="card-footer">
      <div class="overall-bar-track"><div class="overall-bar-fill" id="obar-${cid}" style="width:${overallPct}%"></div></div>
      <button class="toggle-sections-btn" id="toggle-${cid}">
        <span>Sections (${total})</span><span class="chevron">▼</span>
      </button>
    </div>
    <div class="section-panel" id="spanel-${cid}"></div>
  `;

  renderMontage(cid);
  renderSectionPanel(cid);

  container.querySelector('.toggle-sections-btn').addEventListener('click', () => toggleAccordion(cid));

  return container;
}

function toggleAccordion(cid) {
  const panel = document.getElementById('spanel-' + cid);
  const btn = document.getElementById('toggle-' + cid);
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  btn.classList.toggle('open', !isOpen);
  if (!isOpen) renderSectionPanel(cid);
}

function renderSectionPanel(cid) {
  const course = cid === 'sketching' ? SKETCHING : COURSES.find(c => c.id === cid);
  const panel = document.getElementById('spanel-' + cid);
  if (!panel || !course) return;
  panel.innerHTML = '';

  course.sections.forEach((sname, idx) => {
    const sd = getSec(cid, sname);
    const pct = sd.pct || 0;
    const photoCount = (sd.photos || []).length;
    const isDone = pct >= 100;

    const row = document.createElement('div');
    row.className = 'section-row' + (isDone ? ' section-done' : '');

    row.innerHTML = `
      <div class="srow-top">
        <div class="srow-name">
          <span class="srow-check">${isDone ? '✓' : (idx + 1)}</span>
          <span class="srow-label">${sname}</span>
        </div>
        <div class="srow-right">
          <button class="s-photo-btn">
            📷${photoCount > 0 ? `<span class="s-photo-count">${photoCount}</span>` : ''}
          </button>
          <span class="s-pct-label">${pct}%</span>
        </div>
      </div>
      <div class="srow-bar-wrap">
        <input type="range" class="s-slider" min="0" max="100" step="5" value="${pct}" />
      </div>
    `;

    const slider = row.querySelector('.s-slider');
    slider.style.setProperty('--val', pct + '%');
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value);
      slider.style.setProperty('--val', v + '%');
      row.querySelector('.s-pct-label').textContent = v + '%';
      setSecPct(cid, sname, v);
      if (v >= 100) {
        row.classList.add('section-done');
        row.querySelector('.srow-check').textContent = '✓';
      } else {
        row.classList.remove('section-done');
        row.querySelector('.srow-check').textContent = idx + 1;
      }
      updateCourseProgress(cid);
    });

    row.querySelector('.s-photo-btn').addEventListener('click', () => {
      openSectionModal(cid, sname);
    });

    panel.appendChild(row);
  });
}

function updateCourseProgress(cid) {
  const { done, total } = getCourseCompletion(cid);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const bar = document.getElementById('obar-' + cid);
  const badge = document.getElementById('comp-' + cid);
  if (bar) bar.style.width = pct + '%';
  if (badge) badge.textContent = done + '/' + total + ' sections';
  renderMontage(cid);
  updateStats();
}

function renderMontage(cid) {
  const el = document.getElementById('montage-' + cid);
  if (!el) return;
  const photos = getAllCoursePhotos(cid);
  el.innerHTML = '';
  if (photos.length === 0) return;
  const show = photos.slice(0, 5);
  show.forEach(p => {
    const img = document.createElement('img');
    img.className = 'montage-thumb';
    img.src = p.src;
    img.alt = p.caption || '';
    el.appendChild(img);
  });
  if (photos.length > 5) {
    const more = document.createElement('span');
    more.className = 'montage-more';
    more.textContent = '+' + (photos.length - 5);
    el.appendChild(more);
  }
}

// ─── HOURS ───────────────────────────────────────────────────────────────────

function logHours(n) {
  const week = parseFloat(localStorage.getItem('daj_week') || '0') + n;
  const total = parseFloat(localStorage.getItem('daj_total') || '0') + n;
  localStorage.setItem('daj_week', week);
  localStorage.setItem('daj_total', total);
  updateHoursUI();
  updateStats();
}
function logCustom() {
  const v = parseFloat(document.getElementById('custom-input').value);
  if (!v || v <= 0) return;
  logHours(v);
  document.getElementById('custom-input').value = '';
}
function resetWeek() {
  localStorage.setItem('daj_week', '0');
  updateHoursUI();
}
function updateHoursUI() {
  const hrs = parseFloat(localStorage.getItem('daj_week') || '0');
  const pct = Math.min((hrs / 15) * 100, 100);
  const circ = 2 * Math.PI * 68;
  document.getElementById('bar-fill').style.width = pct + '%';
  document.getElementById('week-text').textContent = hrs + ' hours this week';
  document.getElementById('ring-num').textContent = hrs % 1 === 0 ? hrs : hrs.toFixed(1);
  const fg = document.getElementById('ring-fg');
  fg.style.strokeDasharray = circ;
  fg.style.strokeDashoffset = circ - (pct / 100) * circ;
}

// ─── GALLERY ─────────────────────────────────────────────────────────────────

function getPhotos() { return JSON.parse(localStorage.getItem('daj_photos') || '[]'); }
function savePhotos(p) { localStorage.setItem('daj_photos', JSON.stringify(p)); }

function renderGallery() {
  const photos = getPhotos();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';
  empty.style.display = photos.length === 0 ? 'block' : 'none';
  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <img class="photo-img" src="${p.src}" alt="${p.caption || ''}" />
      <div class="photo-meta">
        <div class="photo-caption">${p.caption || 'Untitled'}</div>
        <div class="photo-sub">
          <span class="photo-date">${p.date || ''}</span>
          ${p.course ? `<span class="photo-course-tag">${p.course}</span>` : ''}
        </div>
      </div>
      <button class="photo-delete" data-idx="${i}">Remove</button>
    `;
    card.querySelector('.photo-delete').addEventListener('click', () => {
      const ps = getPhotos(); ps.splice(i, 1); savePhotos(ps);
      renderGallery(); updateStats();
    });
    grid.appendChild(card);
  });
  updateStats();
}

// ─── GALLERY MODAL ───────────────────────────────────────────────────────────

let galleryTab = 'file';
let galleryFile = null;

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  document.getElementById('photo-date').value = new Date().toISOString().split('T')[0];
  galleryFile = null;
}
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('photo-file').value = '';
  document.getElementById('photo-url').value = '';
  document.getElementById('photo-caption').value = '';
  document.getElementById('photo-course').value = '';
  document.getElementById('photo-preview').classList.add('hidden');
  galleryFile = null;
}
function closeOutside(e) { if (e.target.id === 'modal-overlay') closeModal(); }
function switchTab(tab) {
  galleryTab = tab;
  document.getElementById('tab-file').classList.toggle('hidden', tab !== 'file');
  document.getElementById('tab-url').classList.toggle('hidden', tab !== 'url');
  document.getElementById('tab-file-btn').classList.toggle('active', tab === 'file');
  document.getElementById('tab-url-btn').classList.toggle('active', tab === 'url');
  document.getElementById('photo-preview').classList.add('hidden');
  galleryFile = null;
}
function previewFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  new FileReader().onload = ev => {
    galleryFile = ev.target.result;
    showPreview('photo-preview', galleryFile);
  };
  const fr = new FileReader(); fr.onload = ev => { galleryFile = ev.target.result; showPreview('photo-preview', galleryFile); }; fr.readAsDataURL(file);
}
function previewUrl() {
  const url = document.getElementById('photo-url').value.trim();
  showPreview('photo-preview', url || null);
}
function showPreview(id, src) {
  const el = document.getElementById(id);
  if (src) { el.src = src; el.classList.remove('hidden'); }
  else { el.classList.add('hidden'); }
}
function savePhoto() {
  const src = galleryTab === 'file' ? galleryFile : document.getElementById('photo-url').value.trim();
  if (!src) { alert('Add a photo first.'); return; }
  const photo = {
    src,
    date: document.getElementById('photo-date').value,
    caption: document.getElementById('photo-caption').value.trim(),
    course: document.getElementById('photo-course').value
  };
  const ps = getPhotos(); ps.unshift(photo);
  try { savePhotos(ps); } catch(e) { alert('Storage full. Use a URL instead of a file upload.'); ps.shift(); return; }
  closeModal(); renderGallery(); updateStats();
}

// ─── SECTION PHOTO MODAL ─────────────────────────────────────────────────────

let secModalCid = null;
let secModalSname = null;
let secModalFile = null;
let secModalTab = 'file';

function openSectionModal(cid, sname) {
  secModalCid = cid;
  secModalSname = sname;
  secModalFile = null;
  secModalTab = 'file';
  document.getElementById('sm-overlay').classList.add('open');
  document.getElementById('sm-title').textContent = sname;
  document.getElementById('sm-caption').value = '';
  document.getElementById('sm-file').value = '';
  document.getElementById('sm-url').value = '';
  document.getElementById('sm-preview').classList.add('hidden');
  document.getElementById('sm-tab-file').classList.add('hidden');
  document.getElementById('sm-tab-url').classList.add('hidden');
  document.getElementById('sm-tab-file').classList.remove('hidden');
  document.getElementById('sm-file-btn').classList.add('active');
  document.getElementById('sm-url-btn').classList.remove('active');
  renderSecPhotos();
}
function closeSectionModal() {
  document.getElementById('sm-overlay').classList.remove('open');
  secModalCid = null; secModalSname = null;
}
function closeSecOutside(e) { if (e.target.id === 'sm-overlay') closeSectionModal(); }

function switchSecTab(tab) {
  secModalTab = tab;
  secModalFile = null;
  document.getElementById('sm-tab-file').classList.toggle('hidden', tab !== 'file');
  document.getElementById('sm-tab-url').classList.toggle('hidden', tab !== 'url');
  document.getElementById('sm-file-btn').classList.toggle('active', tab === 'file');
  document.getElementById('sm-url-btn').classList.toggle('active', tab === 'url');
  document.getElementById('sm-preview').classList.add('hidden');
}
function smPreviewFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const fr = new FileReader();
  fr.onload = ev => { secModalFile = ev.target.result; showPreview('sm-preview', secModalFile); };
  fr.readAsDataURL(file);
}
function smPreviewUrl() {
  const url = document.getElementById('sm-url').value.trim();
  showPreview('sm-preview', url || null);
}
function saveSecPhoto() {
  const src = secModalTab === 'file' ? secModalFile : document.getElementById('sm-url').value.trim();
  if (!src) { alert('Add a photo first.'); return; }
  const photo = { src, caption: document.getElementById('sm-caption').value.trim(), date: new Date().toISOString().split('T')[0] };
  addSecPhoto(secModalCid, secModalSname, photo);
  renderSecPhotos();
  renderMontage(secModalCid);
  // refresh photo count badge on the section row
  rebuildSectionRow(secModalCid, secModalSname);
  updateStats();
  document.getElementById('sm-file').value = '';
  document.getElementById('sm-url').value = '';
  document.getElementById('sm-preview').classList.add('hidden');
  secModalFile = null;
}
function renderSecPhotos() {
  const grid = document.getElementById('sm-photo-grid');
  const emptyEl = document.getElementById('sm-empty');
  const sd = getSec(secModalCid, secModalSname);
  const photos = sd.photos || [];
  grid.innerHTML = '';
  emptyEl.style.display = photos.length === 0 ? 'block' : 'none';
  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'sm-photo-card';
    card.innerHTML = `
      <img src="${p.src}" alt="${p.caption || ''}" class="sm-photo-img" />
      ${p.caption ? `<div class="sm-photo-cap">${p.caption}</div>` : ''}
      <button class="sm-delete" data-idx="${i}">✕</button>
    `;
    card.querySelector('.sm-delete').addEventListener('click', () => {
      removeSecPhoto(secModalCid, secModalSname, i);
      renderSecPhotos();
      renderMontage(secModalCid);
      rebuildSectionRow(secModalCid, secModalSname);
      updateStats();
    });
    grid.appendChild(card);
  });
}
function rebuildSectionRow(cid, sname) {
  // Just re-render the entire section panel — simplest approach
  renderSectionPanel(cid);
  // Re-attach toggle listener
  const btn = document.getElementById('toggle-' + cid);
  if (btn) {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => toggleAccordion(cid));
  }
}

// ─── STATS ───────────────────────────────────────────────────────────────────

function updateStats() {
  const statuses = getStatuses();
  let done = 0;
  COURSES.forEach(c => { if ((statuses[c.id] || c.defaultStatus) === 'done') done++; });
  if ((statuses['sketching'] || 'in-progress') === 'done') done++;
  const total = parseFloat(localStorage.getItem('daj_total') || '0');
  const photoCount = getPhotos().length + COURSES.reduce((acc, c) => acc + getAllCoursePhotos(c.id).length, 0) + getAllCoursePhotos('sketching').length;
  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-hours').textContent = total % 1 === 0 ? total : total.toFixed(1);
  document.getElementById('stat-photos').textContent = photoCount;
}

// ─── INIT ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  buildCourses();
  updateHoursUI();
  renderGallery();
  updateStats();
});
