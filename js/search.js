function initSearch({ treeContainer, resultsContainer, resultsList, viewer, searchInput, resetBtn }) {

  resetBtn.addEventListener('click', () => {
    condenseAll();
    searchInput.value = '';
    resultsList.innerHTML = '';
    resultsContainer.style.display = 'none';
    resultsContainer.style.opacity = 0;
    treeContainer.scrollTo({ top: 0, behavior: 'smooth' });
  });

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
