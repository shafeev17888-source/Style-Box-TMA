// Наши товары
const products = [
    { id: 1, name: "Красная футболка", price: 999, category: "shirts", emoji: "👕", liked: false, inCart: false },
    { id: 2, name: "Синие джинсы", price: 1999, category: "pants", emoji: "👖", liked: false, inCart: false },
    { id: 3, name: "Кроссовки Nike", price: 4999, category: "shoes", emoji: "👟", liked: false, inCart: false },
    { id: 4, name: "Белая рубашка", price: 1499, category: "shirts", emoji: "👔", liked: false, inCart: false },
    { id: 5, name: "Черные штаны", price: 1799, category: "pants", emoji: "🩳", liked: false, inCart: false },
    { id: 6, name: "Кеды Converse", price: 3999, category: "shoes", emoji: "👞", liked: false, inCart: false },
    { id: 7, name: "Худи с капюшоном", price: 2999, category: "shirts", emoji: "🧥", liked: false, inCart: false },
    { id: 8, name: "Шорты летние", price: 1299, category: "pants", emoji: "🩲", liked: false, inCart: false }
];

// Когда страница загрузилась
document.addEventListener('DOMContentLoaded', function() {
    showProducts('all');
    updateCartCount();
});

// Показать товары
function showProducts(category) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    let filteredProducts = products;
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-img">${product.emoji}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price">${product.price} ₽</div>
                <div class="actions">
                    <button class="like-btn ${product.liked ? 'liked' : ''}" 
                            onclick="toggleLike(${product.id})">
                        ${product.liked ? '❤️' : '🤍'} Лайк
                    </button>
                    <button class="cart-btn" onclick="addToCart(${product.id})">
                        🛒 В корзину
                    </button>
                </div>
            </div>
        `;
        container.appendChild(productCard);
    });
}

// Фильтровать товары
function filterProducts(category) {
    showProducts(category);
}

// Лайкнуть товар
function toggleLike(productId) {
    const product = products.find(p => p.id === productId);
    product.liked = !product.liked;
    showProducts('all'); // Обновляем отображение
}

// Добавить в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product.inCart) {
        product.inCart = true;
        updateCartCount();
        alert(`"${product.name}" добавлен в корзину!`);
    } else {
        alert(`"${product.name}" уже в корзине!`);
    }
}

// Обновить счетчик корзины
function updateCartCount() {
    const cartCount = products.filter(p => p.inCart).length;
    document.getElementById('cart-count').textContent = cartCount;
}

// Показать корзину
function showCart() {
    const popup = document.getElementById('cart-popup');
    const cartItems = document.getElementById('cart-items');
    
    cartItems.innerHTML = '';
    
    const cartProducts = products.filter(p => p.inCart);
    
    if (cartProducts.length === 0) {
        cartItems.innerHTML = '<p>Корзина пуста</p>';
    } else {
        let total = 0;
        cartProducts.forEach(product => {
            total += product.price;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${product.emoji} ${product.name}</strong>
                        <p>${product.price} ₽</p>
                    </div>
                    <button onclick="removeFromCart(${product.id})">❌ Удалить</button>
                </div>
            `;
        });
        
        cartItems.innerHTML += `<hr><h3>Итого: ${total} ₽</h3>`;
    }
    
    popup.style.display = 'flex';
}

// Удалить из корзины
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    product.inCart = false;
    updateCartCount();
    showCart(); // Обновляем отображение корзины
}

// Закрыть корзину
function closeCart() {
    document.getElementById('cart-popup').style.display = 'none';
}

// Очистить корзину
function clearCart() {
    if (confirm("Очистить всю корзину?")) {
        products.forEach(p => p.inCart = false);
        updateCartCount();
        closeCart();
    }
}

// Купить сейчас
function buyNow() {
    const cartProducts = products.filter(p => p.inCart);
    if (cartProducts.length === 0) {
        alert("Корзина пуста!");
        return;
    }
    
    const total = cartProducts.reduce((sum, product) => sum + product.price, 0);
    alert(`🎉 Поздравляем с покупкой!\nВы купили ${cartProducts.length} товаров на сумму ${total} ₽\nСпасибо за заказ в StyleBox!`);
    
    // Очищаем корзину после покупки
    products.forEach(p => p.inCart = false);
    updateCartCount();
    closeCart();
}