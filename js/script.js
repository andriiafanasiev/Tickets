document.addEventListener('DOMContentLoaded', () => {
    const lender = document.querySelector('main.lender');
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
    const modalButton1 = document.querySelector('#modal-button1');
    const modalButton2 = document.querySelector('#modal-button2');
    const modalButton3 = document.querySelector('#modal-button3');

    modalButton1.addEventListener('click', () => {
        if (!sessionStorage.getItem('event_1')) {
            fetch(`https://hatetrfc.space/click?event1=1&upd_clickid=${clid}`, {
                mode: 'no-cors',
            })
                .then((response) => {
                    sessionStorage.setItem('event_1', '1');
                })
                .catch((error) => {
                    console.error('Error fetching the tracker:', error);
                });
        }

        modal1.style.display = 'none';
        modal1.classList.remove('fade', 'show');

        isBoxOpened = false;
    });

    modalButton2.addEventListener('click', () => {
        modal2.style.display = 'none';
        modal2.classList.remove('fade', 'show');

        isBoxOpened = false;
    });

    console.log('logged');

    modalButton3.addEventListener('click', () => {
        if (!sessionStorage.getItem('event_2')) {
            fetch(`https://hatetrfc.space/click?event2=1&upd_clickid=${clid}`, {
                mode: 'no-cors',
            })
                .then((response) => {
                    sessionStorage.setItem('event_2', '1');
                })
                .catch((error) => {
                    console.error('Error fetching the tracker:', error);
                });
        }

        modal3.style.display = 'none';
        modal3.classList.remove('fade', 'show');

        isBoxOpened = false;

        if (lender && prefil) {
            // Анімація для lender (зникнення)
            lender.classList.add('fade-out');
            lender.classList.remove('fade');
            setTimeout(() => {
                lender.style.display = 'none';

                // Анімація для prefil (поява)
                hasPassedToPrefil = true;
                localStorage.setItem('hasPassedToPrefil', 'true');
                prefil.classList.add('fade-in');
                prefil.classList.remove('fade');
                prefil.style.display = 'block';
            }, 500);
        }
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
