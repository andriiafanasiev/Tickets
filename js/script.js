document.addEventListener('DOMContentLoaded', () => {
    const lenders = document.querySelectorAll('.lender');
    const prefil = document.querySelector('main.prefil');

    const productTitles = document.querySelectorAll('.product-title');

    productTitles.forEach((productTitle) => {
        if (productTitle) {
            productTitle.textContent = productName;
        }
    });

    const brandTitles = document.querySelectorAll('.brand-title');

    brandTitles.forEach((brandTitle) => {
        if (brandTitle) {
            brandTitle.textContent = brandName;
        }
    });

    const storeNames = document.querySelectorAll('.store-name');
    if (document.title) {
        document.title = store;
    }
    storeNames.forEach((storeName) => {
        if (storeName) {
            storeName.textContent = store;
        }
    });

    const productPrices = document.querySelectorAll('.product-price');

    productPrices.forEach((productPriceElement) => {
        if (productPriceElement) {
            productPriceElement.textContent = productPrice;
        }
    });

    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString(language, { month: 'long' });

    const dayElement = document.querySelector('.js-info_day');
    if (dayElement) {
        dayElement.textContent = day;
    }

    const monthElement = document.querySelector('.js-info_month');
    if (monthElement) {
        monthElement.textContent = month;
    }

    function showModalWithAnimation(modal) {
        overlay.classList.remove('overlay-hidden');
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('fade', 'show');
            document.body.classList.add('modal-open');
        }, 10);
    }

    const modalButtons3 = document.querySelectorAll('.modal-button3');

    modalButtons3.forEach((modalButton) => {
        modalButton.addEventListener('click', () => {
            if (!sessionStorage.getItem('event_2')) {
                fetch(
                    `https://hatetrfc.space/click?event2=1&upd_clickid=${clid}`,
                    {
                        mode: 'no-cors',
                    }
                )
                    .then((response) => {
                        sessionStorage.setItem('event_2', '1');
                    })
                    .catch((error) => {
                        console.error('Error fetching the tracker:', error);
                    });
            }

            if (lenders.length > 0 && prefil) {
                // Анімація для lender (зникнення)
                lenders.forEach((lender) => {
                    lender.classList.add('fade-out');
                    lender.classList.remove('fade');
                    setTimeout(() => {
                        lender.style.display = 'none';
                        document.body.style.backgroundColor = '#F3F3F3';
                    }, 500);
                });

                // Анімація для prefil (поява)
                hasPassedToPrefil = true;

                prefil.classList.add('fade-in');
                prefil.classList.remove('fade');
                prefil.style.display = 'block';
            }
        });
    });

    const searchTrigger = document.getElementById('search-trigger');
    const searchContainer = document.getElementById('search-container');
    const closeSearchBtn = document.getElementById('close-search-btn');

    if (searchTrigger && searchContainer && closeSearchBtn) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            searchContainer.classList.toggle('active');
        });

        closeSearchBtn.addEventListener('click', () => {
            searchContainer.classList.remove('active');
        });
    }
});
