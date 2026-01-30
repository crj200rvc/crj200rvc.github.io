// --------------------- Grab DOM elements ---------------------
const treeContainer = document.getElementById('tree-container');
const resultsContainer = document.getElementById('results-container');
const resultsList = document.getElementById('results-list');
const viewer = document.getElementById('viewer');
const searchInput = document.getElementById('search');
const resetBtn = document.getElementById('reset-btn');
const docSelector = document.getElementById('doc-selector');

// --------------------- URL Routing ---------------------
function loadFromURL() {
  const params = new URLSearchParams(window.location.search);
  const docKey = params.get('doc'); // e.g., ?doc=AMM05-20-00
  if (!docKey) return;

  const docLi = treeContainer.querySelector(`li[data-path*="${docKey}"]`);
  if (docLi) {
    expandPathToDoc(docLi); // open folders
    openPDF(docLi.dataset.file, docLi.dataset.path, docLi); // open PDF
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

  // Create tree and append
  const treeRoot = createTree(xmlDoc.documentElement);
  treeContainer.appendChild(treeRoot);
  updateDocPadding();

  // Check URL after tree is ready
  loadFromURL();
}

// --------------------- Handle document switching ---------------------
docSelector.addEventListener('change', () => {
  loadDocument(docSelector.value);
});

// --------------------- Initialize first document ---------------------
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
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registered'));
}
