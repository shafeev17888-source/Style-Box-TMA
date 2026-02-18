// Telegram Web App инициализация
const tg = window.Telegram.WebApp;
tg.expand(); // Растягиваем на весь экран
tg.enableClosingConfirmation(); // Подтверждение закрытия

// Тема Telegram
if (tg.colorScheme === 'dark') {
    document.body.classList.add('telegram-dark');
} else {
    document.body.classList.add('telegram-light');
}

// Данные товаров
const products = [
    { id: 1, name: "Красная футболка", price: 999, oldPrice: 1299, category: "shirts", emoji: "👕", description: "Стильная красная футболка из 100% хлопка. Идеально подходит для повседневной носки.", liked: false, inCart: false, quantity: 0, discount: 23 },
    { id: 2, name: "Синие джинсы", price: 1999, oldPrice: 2499, category: "pants", emoji: "👖", description: "Классические синие джинсы. Удобные и практичные.", liked: false, inCart: false, quantity: 0, discount: 20 },
    { id: 3, name: "Кроссовки Nike", price: 4999, oldPrice: 5999, category: "shoes", emoji: "👟", description: "Оригинальные кроссовки Nike. Максимальный комфорт при ходьбе.", liked: false, inCart: false, quantity: 0, discount: 16 },
    { id: 4, name: "Белая рубашка", price: 1499, oldPrice: 1799, category: "shirts", emoji: "👔", description: "Классическая белая рубашка. Подойдет для офиса и особых случаев.", liked: false, inCart: false, quantity: 0, discount: 17 },
    { id: 5, name: "Черные штаны", price: 1799, oldPrice: 2199, category: "pants", emoji: "🩳", description: "Стильные черные брюки. Универсальный вариант.", liked: false, inCart: false, quantity: 0, discount: 18 },
    { id: 6, name: "Кеды Converse", price: 3999, oldPrice: 4599, category: "shoes", emoji: "👞", description: "Классические кеды Converse. Всегда в моде.", liked: false, inCart: false, quantity: 0, discount: 13 },
    { id: 7, name: "Худи с капюшоном", price: 2999, oldPrice: 3599, category: "hoodies", emoji: "🧥", description: "Теплое худи с капюшоном. Для уютных вечеров.", liked: false, inCart: false, quantity: 0, discount: 17 },
    { id: 8, name: "Шорты летние", price: 1299, oldPrice: 1599, category: "pants", emoji: "🩲", description: "Легкие летние шорты. Для жаркой погоды.", liked: false, inCart: false, quantity: 0, discount: 19 },
    { id: 9, name: "Бейсболка", price: 899, oldPrice: 1199, category: "accessories", emoji: "🧢", description: "Стильная бейсболка. Защитит от солнца.", liked: false, inCart: false, quantity: 0, discount: 25 },
    { id: 10, name: "Солнцезащитные очки", price: 1499, oldPrice: 1999, category: "accessories", emoji: "🕶️", description: "Модные солнцезащитные очки.", liked: false, inCart: false, quantity: 0, discount: 25 }
];

// Состояние приложения
let currentFilter = 'all';
let currentSort = 'default';
let searchQuery = '';
let cart = [];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    renderProducts();
    setupEventListeners();
    updateCartBadge();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтры
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderProducts();
        });
    });

    // Поиск
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderProducts();
    });

    // Сортировка
    document.getElementById('sortSelect').addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderProducts();
    });

    // Тема
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Корзина
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);

    // Закрытие модалки по клику вне
    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('product-modal')) {
            closeModal();
        }
    });
}

// Отрисовка товаров
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    let filteredProducts = products;
    
    // Фильтрация по категории
    if (currentFilter !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === currentFilter);
    }
    
    // Фильтрация по поиску
    if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(searchQuery) ||
            p.category.toLowerCase().includes(searchQuery)
        );
    }
    
    // Сортировка
    filteredProducts = sortProducts(filteredProducts);
    
    // Отрисовка
    grid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Добавляем обработчики для кнопок
    filteredProducts.forEach(product => {
        const addBtn = document.querySelector(`[data-add-id="${product.id}"]`);
        const likeBtn = document.querySelector(`[data-like-id="${product.id}"]`);
        const card = document.querySelector(`[data-card-id="${product.id}"]`);
        
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(product.id);
            });
        }
        
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleLike(product.id);
            });
        }
        
        if (card) {
            card.addEventListener('click', () => showProductModal(product.id));
        }
    });
}

// Создание карточки товара
function createProductCard(product) {
    const inCart = cart.some(item => item.id === product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" data-card-id="${product.id}">
            <div class="product-image">
                ${product.emoji}
                ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-category">${getCategoryName(product.category)}</div>
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" data-add-id="${product.id}">
                        ${inCart ? '✓ В корзине' : 'В корзину'}
                    </button>
                    <button class="like-btn ${product.liked ? 'liked' : ''}" data-like-id="${product.id}">
                        ${product.liked ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Сортировка товаров
function sortProducts(products) {
    const sorted = [...products];
    
    switch(currentSort) {
        case 'priceAsc':
            return sorted.sort((a, b) => a.price - b.price);
        case 'priceDesc':
            return sorted.sort((a, b) => b.price - a.price);
        case 'nameAsc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'nameDesc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        default:
            return sorted;
    }
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        shirts: 'Футболки',
        pants: 'Штаны',
        shoes: 'Обувь',
        hoodies: 'Худи',
        accessories: 'Аксессуары'
    };
    return categories[category] || category;
}

// Переключение лайка
function toggleLike(productId) {
    const product = products.find(p => p.id === productId);
    product.liked = !product.liked;
    renderProducts();
}

// Работа с корзиной
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    saveCart();
    updateCartBadge();
    renderProducts();
    
    // Анимация кнопки
    tg.HapticFeedback.impactOccurred('light');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    renderCart();
    renderProducts();
}

function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
        }
    }
}

// Отрисовка корзины
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <span class="cart-item-emoji">${item.emoji}</span>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price} ₽</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `${total} ₽`;
}

// Сохранение и загрузка корзины
function saveCart() {
    localStorage.setItem('stylebox_cart', JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem('stylebox_cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Обновление бейджа корзины
function updateCartBadge() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = count;
}

// Переключение корзины
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        renderCart();
    }
}

// Очистка корзины
function clearCart() {
    if (cart.length > 0) {
        tg.showConfirm('Очистить корзину?', (confirmed) => {
            if (confirmed) {
                cart = [];
                saveCart();
                updateCartBadge();
                renderCart();
                renderProducts();
                tg.HapticFeedback.notificationOccurred('success');
            }
        });
    }
}

// Оформление заказа
function checkout() {
    if (cart.length === 0) {
        tg.showAlert('Корзина пуста!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    tg.showConfirm(`Ваш заказ:\n${items}\n\nИтого: ${total} ₽\n\nПодтвердить покупку?`, (confirmed) => {
        if (confirmed) {
            // Отправка данных в Telegram бота
            tg.sendData(JSON.stringify({
                action: 'purchase',
                items: cart,
                total: total,
                date: new Date().toISOString()
            }));
            
            cart = [];
            saveCart();
            updateCartBadge();
            toggleCart();
            renderProducts();
            
            tg.HapticFeedback.notificationOccurred('success');
            tg.showAlert('Спасибо за покупку! 🎉');
        }
    });
}

// Модальное окно товара
function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-emoji">${product.emoji}</div>
        <h2 class="modal-name">${product.name}</h2>
        <div class="modal-price">${product.price} ₽</div>
        ${product.oldPrice ? `<div style="color: var(--text-secondary); text-decoration: line-through;">Старая цена: ${product.oldPrice} ₽</div>` : ''}
        <p class="modal-description">${product.description}</p>
        <button class="modal-add-to-cart" onclick="addToCart(${product.id}); closeModal();">Добавить в корзину</button>
    `;
    
    modal.classList.add('show');
    tg.HapticFeedback.impactOccurred('medium');
}

function closeModal() {
    document.getElementById('productModal').classList.remove('show');
}

// Переключение темы
function toggleTheme() {
    const isDark = document.body.classList.toggle('telegram-dark');
    const themeBtn = document.getElementById('themeToggle');
    themeBtn.textContent = isDark ? '☀️' : '🌙';
    tg.setHeaderColor(isDark ? '#1A1A2E' : '#F8F9FF');
}
