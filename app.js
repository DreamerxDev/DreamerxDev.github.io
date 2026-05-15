const COURSES = [
  {
    id: 'basics',
    num: '1',
    title: 'Drawing Basics',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Foundational concepts everything else depends on — line control, shapes, basic form, and observation.',
    defaultStatus: 'in-progress'
  },
  {
    id: 'gesture',
    num: '2',
    title: 'The Gesture Course',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'The most important course for anime and character goals. 16-line method, dynamic poses, weight, rhythm, foreshortening, hands, and feet.',
    defaultStatus: 'up-next'
  },
  {
    id: 'figure',
    num: '3',
    title: 'Figure Drawing Fundamentals',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Build the full figure from scratch. The Bean, Robo Bean, mannequinization, proportions. Invent poses from imagination.',
    defaultStatus: 'locked'
  },
  {
    id: 'head',
    num: '4',
    title: 'Head Drawing and Construction',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Loomis-inspired method for drawing heads from any angle. Strong foundation for stylizing into anime faces.',
    defaultStatus: 'locked'
  },
  {
    id: 'perspective',
    num: '5',
    title: 'The Perspective Course',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Unlocks backgrounds, environments, and weapon design. 0, 1, 2, and 3-point perspective. Makes anything drawable.',
    defaultStatus: 'locked'
  },
  {
    id: 'shading',
    num: '6',
    title: 'The Shading Course',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Makes everything look 3D. Tonal value, light and form, 7 methods for volume, shading from imagination.',
    defaultStatus: 'locked'
  },
  {
    id: 'style',
    num: '7',
    title: 'Develop Your Art Style',
    platform: 'proko',
    platformLabel: 'Proko',
    desc: 'Stop drawing realistically and start drawing like yourself. The 30% Truth Rule. Where you start pushing toward anime.',
    defaultStatus: 'locked'
  },
  {
    id: 'anime',
    num: '8',
    title: 'Anime Art Academy',
    platform: 'external',
    platformLabel: 'animeartacademy.com',
    desc: 'Anime-specific instruction from Japanese professional artists. Fills the gap Proko leaves on stylized character work.',
    defaultStatus: 'locked'
  },
  {
    id: 'digital',
    num: '9',
    title: 'Digital Painting Fundamentals',
    platform: 'free',
    platformLabel: 'ctrl+paint.com — FREE',
    desc: 'Transition into digital. Brushes, layers, workflow, color, lighting. Come in with solid fundamentals so you\'re only learning the tools.',
    defaultStatus: 'locked'
  },
  {
    id: 'marc',
    num: '10',
    title: "Marc Brunet's ART School",
    platform: 'cubebrush',
    platformLabel: 'Cubebrush — ex-Blizzard',
    desc: 'Capstone digital program. 10 terms, 100+ hours. Full digital workflow — design, rendering, concepting, professional techniques.',
    defaultStatus: 'locked'
  }
];

const STATUS_ORDER = ['locked', 'up-next', 'in-progress', 'done'];
const STATUS_LABELS = {
  'locked': 'Locked',
  'up-next': 'Up Next',
  'in-progress': 'In Progress',
  'done': 'Done ✓'
};

function getStatuses() {
  return JSON.parse(localStorage.getItem('daj_statuses') || '{}');
}
function saveStatuses(s) {
  localStorage.setItem('daj_statuses', JSON.stringify(s));
}
function getStatus(id) {
  const s = getStatuses();
  const course = COURSES.find(c => c.id === id);
  return s[id] || (course ? course.defaultStatus : 'locked');
}
function setStatus(id, status) {
  const s = getStatuses();
  s[id] = status;
  saveStatuses(s);
}

function cycleStatus(id) {
  const current = getStatus(id);
  const idx = STATUS_ORDER.indexOf(current);
  const next = STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
  setStatus(id, next);
  applyStatus(id, next);
  updateStats();
}

function applyStatus(id, status) {
  const card = document.getElementById('card-' + id);
  const badge = document.getElementById('status-' + id);
  if (!card || !badge) return;
  STATUS_ORDER.forEach(s => card.classList.remove('status-' + s));
  card.classList.add('status-' + status);
  badge.className = 'status-badge ' + status;
  badge.textContent = STATUS_LABELS[status];
}

function buildCourses() {
  const list = document.getElementById('courses-list');
  list.innerHTML = '';
  COURSES.forEach(c => {
    const status = getStatus(c.id);
    const div = document.createElement('div');
    div.className = 'course-card status-' + status;
    div.id = 'card-' + c.id;
    div.innerHTML = `
      <div class="card-left">
        <div class="course-num">${c.num}</div>
        <div class="card-info">
          <h3>${c.title}</h3>
          <span class="platform ${c.platform}">${c.platformLabel}</span>
          <p>${c.desc}</p>
        </div>
      </div>
      <div class="card-right">
        <button class="status-badge ${status}" id="status-${c.id}" onclick="cycleStatus('${c.id}')">${STATUS_LABELS[status]}</button>
      </div>
    `;
    list.appendChild(div);
  });

  const sketchStatus = getStatus('sketching');
  applyStatus('sketching', sketchStatus);
}

/* ─── HOURS ─── */
function getWeekHours() {
  return parseFloat(localStorage.getItem('daj_week_hours') || '0');
}
function getTotalHours() {
  return parseFloat(localStorage.getItem('daj_total_hours') || '0');
}

function logHours(n) {
  const week = getWeekHours() + n;
  const total = getTotalHours() + n;
  localStorage.setItem('daj_week_hours', week.toString());
  localStorage.setItem('daj_total_hours', total.toString());
  updateHoursUI();
  updateStats();
}

function logCustom() {
  const val = parseFloat(document.getElementById('custom-input').value);
  if (!val || val <= 0) return;
  logHours(val);
  document.getElementById('custom-input').value = '';
}

function resetWeek() {
  localStorage.setItem('daj_week_hours', '0');
  updateHoursUI();
}

function updateHoursUI() {
  const hours = getWeekHours();
  const goal = 15;
  const pct = Math.min((hours / goal) * 100, 100);

  document.getElementById('bar-fill').style.width = pct + '%';
  document.getElementById('week-text').textContent = hours + ' hours this week';
  document.getElementById('ring-num').textContent = hours % 1 === 0 ? hours : hours.toFixed(1);

  const circumference = 2 * Math.PI * 68;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('ring-fg').style.strokeDashoffset = offset;
  document.getElementById('ring-fg').style.strokeDasharray = circumference;
}

/* ─── GALLERY ─── */
function getPhotos() {
  return JSON.parse(localStorage.getItem('daj_photos') || '[]');
}
function savePhotos(photos) {
  localStorage.setItem('daj_photos', JSON.stringify(photos));
}

function renderGallery() {
  const photos = getPhotos();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';

  if (photos.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  photos.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.innerHTML = `
      <img class="photo-img" src="${p.src}" alt="${p.caption || 'Progress photo'}" />
      <div class="photo-meta">
        <div class="photo-caption">${p.caption || 'Untitled'}</div>
        <div class="photo-sub">
          <span class="photo-date">${p.date || ''}</span>
          ${p.course ? `<span class="photo-course-tag">${p.course}</span>` : ''}
        </div>
      </div>
      <button class="photo-delete" onclick="deletePhoto(${i})">Remove</button>
    `;
    grid.appendChild(card);
  });
}

function deletePhoto(i) {
  const photos = getPhotos();
  photos.splice(i, 1);
  savePhotos(photos);
  renderGallery();
  updateStats();
}

/* ─── MODAL ─── */
let activeTab = 'file';
let fileDataUrl = null;

function openModal() {
  document.getElementById('modal-overlay').classList.add('open');
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('photo-date').value = today;
  fileDataUrl = null;
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.getElementById('photo-file').value = '';
  document.getElementById('photo-url').value = '';
  document.getElementById('photo-caption').value = '';
  document.getElementById('photo-course').value = '';
  document.getElementById('photo-preview').classList.add('hidden');
  fileDataUrl = null;
}

function closeOutside(e) {
  if (e.target.id === 'modal-overlay') closeModal();
}

function switchTab(tab) {
  activeTab = tab;
  document.getElementById('tab-file').classList.toggle('hidden', tab !== 'file');
  document.getElementById('tab-url').classList.toggle('hidden', tab !== 'url');
  document.getElementById('tab-file-btn').classList.toggle('active', tab === 'file');
  document.getElementById('tab-url-btn').classList.toggle('active', tab === 'url');
  document.getElementById('photo-preview').classList.add('hidden');
  fileDataUrl = null;
}

function previewFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    fileDataUrl = ev.target.result;
    const preview = document.getElementById('photo-preview');
    preview.src = fileDataUrl;
    preview.classList.remove('hidden');
  };
  reader.readAsDataURL(file);
}

function previewUrl() {
  const url = document.getElementById('photo-url').value.trim();
  const preview = document.getElementById('photo-preview');
  if (url) {
    preview.src = url;
    preview.classList.remove('hidden');
  } else {
    preview.classList.add('hidden');
  }
}

function savePhoto() {
  let src = '';
  if (activeTab === 'file') {
    src = fileDataUrl;
  } else {
    src = document.getElementById('photo-url').value.trim();
  }
  if (!src) { alert('Please add a photo first.'); return; }

  const photo = {
    src,
    date: document.getElementById('photo-date').value,
    caption: document.getElementById('photo-caption').value.trim(),
    course: document.getElementById('photo-course').value
  };

  const photos = getPhotos();
  photos.unshift(photo);
  try {
    savePhotos(photos);
  } catch (e) {
    alert('Storage full. Try using a URL instead of a file upload.');
    photos.shift();
    return;
  }

  closeModal();
  renderGallery();
  updateStats();
}

/* ─── STATS ─── */
function updateStats() {
  const statuses = getStatuses();
  let done = 0;
  COURSES.forEach(c => {
    const s = statuses[c.id] || c.defaultStatus;
    if (s === 'done') done++;
  });
  if ((statuses['sketching'] || 'locked') === 'done') done++;

  document.getElementById('stat-done').textContent = done;
  document.getElementById('stat-hours').textContent = getTotalHours() % 1 === 0 ? getTotalHours() : getTotalHours().toFixed(1);
  document.getElementById('stat-photos').textContent = getPhotos().length;
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded', () => {
  buildCourses();
  updateHoursUI();
  renderGallery();
  updateStats();
});
