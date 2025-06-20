document.addEventListener('DOMContentLoaded', () => {
    const cartTrigger = document.getElementById('cart-trigger');
    const cartContainer = document.getElementById('cart-container');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const continueShoppingBtn = document.getElementById(
        'continue-shopping-btn'
    );

    const openCart = () => cartContainer.classList.add('active');
    const closeCart = () => cartContainer.classList.remove('active');

    if (cartTrigger && cartContainer && closeCartBtn && continueShoppingBtn) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        });

        closeCartBtn.addEventListener('click', closeCart);
        continueShoppingBtn.addEventListener('click', closeCart);
    }
});
