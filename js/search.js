function initSearch({ treeContainer, resultsContainer, resultsList, viewer, searchInput, resetBtn }) {

  // ---------------- Single click: normal reset ----------------
  resetBtn.addEventListener('click', () => {
    condenseAll();
    searchInput.value = '';
    resultsList.innerHTML = '';
    resultsContainer.style.display = 'none';
    resultsContainer.style.opacity = 0;
    treeContainer.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------------- Full reset: double-click (desktop) or long-press (mobile) ----------------
let longPressTimer = null;
const LONG_PRESS_TIME = 600; // ms

function fullReset() {
  // Remove ?doc=... from URL
  const url = new URL(window.location);
  url.searchParams.delete('doc');
  window.history.replaceState({}, '', url);

  // Reload initial document tree for current manual
  loadDocument(docSelector.value);

  // Clear search & results
  searchInput.value = '';
  resultsList.innerHTML = '';
  resultsContainer.style.display = 'none';
  resultsContainer.style.opacity = 0;
}

// Desktop double-click
resetBtn.addEventListener('dblclick', fullReset);

// Mobile long-press
resetBtn.addEventListener('touchstart', () => {
  longPressTimer = setTimeout(fullReset, LONG_PRESS_TIME);
});
resetBtn.addEventListener('touchend', () => {
  clearTimeout(longPressTimer);
});
resetBtn.addEventListener('touchmove', () => {
  clearTimeout(longPressTimer);
});

  // ---------------- Search ----------------
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    resultsList.innerHTML = '';
    if (!term) {
      resultsContainer.style.display = 'none';
      resultsContainer.style.opacity = 0;
      return;
    }
    resultsContainer.style.display = 'block';
    resultsContainer.style.opacity = 1;

    const docs = treeContainer.querySelectorAll('li.doc');
    docs.forEach(doc => {
      const title = doc.dataset.path.toLowerCase();
      if (title.includes(term)) {
        const li = document.createElement('li');
        li.innerHTML = doc.dataset.path.replace(new RegExp(term, 'gi'), match => `<mark>${match}</mark>`);
        li.addEventListener('click', () => {
          openPDF(doc.dataset.file, doc.dataset.path, doc);
          expandPathToDoc(doc);
        });
        resultsList.appendChild(li);
      }
    });
  });

}
