// --------------------- Grab DOM elements ---------------------
const treeContainer = document.getElementById('tree-container');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list');
const viewer = document.getElementById('viewer');
const searchInput = document.getElementById('search');
const resetBtn = document.getElementById('reset-btn');
const docSelector = document.getElementById('doc-selector');
const menuBtn = document.getElementById('menu-btn');
const overlay = document.getElementById('menu-overlay');

// --------------------- URL Routing ---------------------
function getUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function loadFromURL() {
  const docKey = getUrlParam('doc'); // e.g., ?doc=AMM05-20-00
  if (!docKey) return;

  const docLi = treeContainer.querySelector(`li[data-key="${docKey}"]`);
  if (docLi) {
    expandPathToDoc(docLi);             
    openPDF(docLi.dataset.file, docLi.dataset.path, docLi);
  }
}

// --------------------- Load a document tree ---------------------
function loadDocument(key) {
  const parser = new DOMParser();
  const xmlString = documents[key];
  const xmlDoc = parser.parseFromString(xmlString.trim(), "text/xml");

  treeContainer.innerHTML = '';
  resultsList.innerHTML = '';
  resultsContainer.style.display = 'none';
  resultsContainer.style.opacity = 0;
  viewer.innerHTML = `<h2>Select a document</h2>`;

  // Create tree
  const treeRoot = createTree(xmlDoc.documentElement);
  treeContainer.appendChild(treeRoot);
  updateDocPadding();

  // Load document from URL if present
  loadFromURL();
}

// --------------------- Handle document switching ---------------------
docSelector.addEventListener('change', () => {
  loadDocument(docSelector.value);
});

// --------------------- Initialize first document ---------------------
document.addEventListener('DOMContentLoaded', () => {
loadDocument('AMM');

// --------------------- Initialize search/reset ---------------------
initSearch({
  treeContainer,
  resultsContainer,
  resultsList,
  viewer,
  searchInput,
  resetBtn
});

// --------------------- Optional: register Service Worker for PWA ---------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(() => console.log('Service Worker registered'))
      .catch(console.error);
  });
}

// --------------------- Mobile detection ---------------------
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  document.body.classList.add('mobile');
}

// --------------------- Mobile sidebar toggle and auto-open ---------------------
if (document.body.classList.contains('mobile')) {
  const sidebar = document.getElementById('sidebar');

  function openMenu() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    if (menuBtn) menuBtn.textContent = '✕';
  }

  function closeMenu() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    if (menuBtn) menuBtn.textContent = '☰';
  }

  function toggleMenu() {
    if (sidebar.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', toggleMenu);
  if (overlay) overlay.addEventListener('click', closeMenu);

  sidebar.querySelectorAll('li.doc').forEach(li => {
    li.addEventListener('click', closeMenu);
  });

  // ---------- AUTO-OPEN sidebar on first mobile load ----------
  
  const docKey = getUrlParam('doc');
  if (!docKey) {
    // Use requestAnimationFrame to wait for the browser to render DOM
    requestAnimationFrame(() => {
      openMenu();
    });
  }
}

});