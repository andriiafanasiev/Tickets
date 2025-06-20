document.addEventListener('DOMContentLoaded', () => {
    const searchTrigger = document.getElementById('search-trigger');
    const searchContainer = document.getElementById('search-container');

    if (searchTrigger && searchContainer) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            searchContainer.classList.toggle('active');
        });
    }
});
