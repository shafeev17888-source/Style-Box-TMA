// Telegram Web App инициализация
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Состояние приложения
let state = {
    currentPage: 'main',
    products: [],
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    user: null,
    points: 0,
    theme: 'light',
    notifications: [],
    trackedPrices: [],
    collections: {},
    socialFeed: []
};

// Инициализация
document.addEventListener('DOMContentLoaded', async () => {
    await initApp();
    setupEventListeners();
    loadState();
    renderPage('main');
    updateAllBadges();
});

// Инициализация приложения
async function initApp() {
    // Получаем данные пользователя из Telegram
    state.user = tg.initDataUnsafe.user || null;
    
    // Загружаем товары
    state.products = getProducts();
    
    // Устанавливаем тему
    if (tg.colorScheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        state.theme = 'dark';
        document.getElementById('themeToggle').textContent = '☀️';
    }
    
    // Обновляем имя пользователя
    if (state.user) {
        document.getElementById('userName').textContent = state.user.first_name;
        document.getElementById('userAvatar').textContent = getAvatar(state.user);
    }
}

// Товары с новыми полями
function getProducts() {
    return [
        { 
            id: 1, 
            name: "Красная футболка", 
            price: 999, 
            oldPrice: 1299, 
            category: "shirts", 
            emoji: "👕", 
            description: "Стильная красная футболка из 100% хлопка. Идеально подходит для повседневной носки.",
            rating: 4.5,
            reviews: [
                {user: "Анна", text: "Отличное качество!", rating: 5, date: "2024-01-15"},
                {user: "Михаил", text: "Немного маломерит", rating: 4, date: "2024-01-10"}
            ],
            likes: 0,
            purchases: 0,
            tags: ["хит", "лето"]
        },
        { 
            id: 2, 
            name: "Синие джинсы", 
            price: 1999, 
            oldPrice: 2499, 
            category: "pants", 
            emoji: "👖", 
            description: "Классические синие джинсы. Удобные и практичные.",
            rating: 4.8,
            reviews: [
                {user: "Дмитрий", text: "Лучшие джинсы!", rating: 5, date: "2024-01-12"}
            ],
            likes: 0,
            purchases: 0,
            tags: ["классика"]
        },
        { 
            id: 3, 
            name: "Кроссовки Nike", 
            price: 4999, 
            oldPrice: 5999, 
            category: "shoes", 
            emoji: "👟", 
            description: "Оригинальные кроссовки Nike. Максимальный комфорт при ходьбе.",
            rating: 4.9,
            reviews: [
                {user: "Сергей", text: "Супер удобные!", rating: 5, date: "2024-01-14"}
            ],
            likes: 0,
            purchases: 0,
            tags: ["спорт", "хит"]
        },
        { 
            id: 4, 
            name: "Белая рубашка", 
            price: 1499, 
            oldPrice: 1799, 
            category: "shirts", 
            emoji: "👔", 
            description: "Классическая белая рубашка. Подойдет для офиса и особых случаев.",
            rating: 4.3,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["офис"]
        },
        { 
            id: 5, 
            name: "Черные штаны", 
            price: 1799, 
            oldPrice: 2199, 
            category: "pants", 
            emoji: "🩳", 
            description: "Стильные черные брюки. Универсальный вариант.",
            rating: 4.6,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["база"]
        },
        { 
            id: 6, 
            name: "Кеды Converse", 
            price: 3999, 
            oldPrice: 4599, 
            category: "shoes", 
            emoji: "👞", 
            description: "Классические кеды Converse. Всегда в моде.",
            rating: 4.7,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["хит"]
        },
        { 
            id: 7, 
            name: "Худи с капюшоном", 
            price: 2999, 
            oldPrice: 3599, 
            category: "hoodies", 
            emoji: "🧥", 
            description: "Теплое худи с капюшоном. Для уютных вечеров.",
            rating: 4.8,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["зима"]
        },
        { 
            id: 8, 
            name: "Шорты летние", 
            price: 1299, 
            oldPrice: 1599, 
            category: "pants", 
            emoji: "🩲", 
            description: "Легкие летние шорты. Для жаркой погоды.",
            rating: 4.4,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["лето"]
        },
        { 
            id: 9, 
            name: "Бейсболка", 
            price: 899, 
            oldPrice: 1199, 
            category: "accessories", 
            emoji: "🧢", 
            description: "Стильная бейсболка. Защитит от солнца.",
            rating: 4.2,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["аксессуар"]
        },
        { 
            id: 10, 
            name: "Солнцезащитные очки", 
            price: 1499, 
            oldPrice: 1999, 
            category: "accessories", 
            emoji: "🕶️", 
            description: "Модные солнцезащитные очки.",
            rating: 4.5,
            reviews: [],
            likes: 0,
            purchases: 0,
            tags: ["аксессуар", "лето"]
        }
    ];
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Меню
    document.getElementById('menuToggle').addEventListener('click', toggleMenu);
    document.getElementById('closeMenu').addEventListener('click', toggleMenu);
    document.getElementById('menuOverlay').addEventListener('click', toggleMenu);
    
    // Навигация
    document.querySelectorAll('.nav-item, .menu-item[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            navigateTo(page);
        });
    });
    
    // Тема
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Закрытие модалок
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        });
    });
}

// Навигация между страницами
function navigateTo(page) {
    state.currentPage = page;
    
    // Обновляем активные пункты меню
    document.querySelectorAll('.nav-item, .menu-item[data-page]').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === page) {
            item.classList.add('active');
        }
    });
    
    // Закрываем меню
    toggleMenu();
    
    // Рендерим страницу
    renderPage(page);
}

// Рендеринг страниц
function renderPage(page) {
    const content = document.getElementById('mainContent');
    
    switch(page) {
        case 'main':
            content.innerHTML = renderMainPage();
            break;
        case 'wishlist':
            content.innerHTML = renderWishlistPage();
            break;
        case 'recent':
            content.innerHTML = renderRecentPage();
            break;
        case 'deals':
            content.innerHTML = renderDealsPage();
            break;
        case 'collections':
            content.innerHTML = renderCollectionsPage();
            break;
        case 'bonus':
            content.innerHTML = renderBonusPage();
            break;
        case 'social':
            content.innerHTML = renderSocialPage();
            break;
        case 'settings':
            content.innerHTML = renderSettingsPage();
            break;
        case 'cart':
            content.innerHTML = renderCartPage();
            break;
        case 'profile':
            content.innerHTML = renderProfilePage();
            break;
    }
    
    // Добавляем обработчики для новой страницы
    addPageEventListeners();
}

// ГЛАВНАЯ СТРАНИЦА
function renderMainPage() {
    const dealOfDay = getDealOfDay();
    const recommended = getRecommendedProducts();
    const popular = getPopularProducts();
    
    return `
        <!-- Баннер с товаром дня -->
        <div class="deal-banner" onclick="showProductModal(${dealOfDay.id})">
            <div class="deal-content">
                <span class="deal-label">🔥 ТОВАР ДНЯ</span>
                <h2>${dealOfDay.name}</h2>
                <div class="deal-price">
                    <span class="current-price">${dealOfDay.price} ₽</span>
                    <span class="old-price">${dealOfDay.oldPrice} ₽</span>
                </div>
                <button class="deal-btn">Купить со скидкой -${dealOfDay.discount}%</button>
            </div>
            <div class="deal-emoji">${dealOfDay.emoji}</div>
        </div>
        
        <!-- Горячие скидки -->
        <div class="section-header">
            <h3 class="section-title">🔥 Горячие скидки</h3>
            <span class="view-all" onclick="navigateTo('deals')">Все →</span>
        </div>
        <div class="horizontal-scroll">
            ${getDeals().map(product => `
                <div class="mini-card" onclick="showProductModal(${product.id})">
                    <div class="product-image" style="font-size: 32px;">${product.emoji}</div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">
                            <span class="current-price">${product.price} ₽</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <!-- Рекомендации -->
        <div class="section-header">
            <h3 class="section-title">🎯 Для вас</h3>
        </div>
        <div class="products-grid">
            ${recommended.map(product => createProductCard(product)).join('')}
        </div>
        
        <!-- Популярное -->
        <div class="section-header">
            <h3 class="section-title">⭐ Популярное</h3>
        </div>
        <div class="products-grid">
            ${popular.map(product => createProductCard(product)).join('')}
        </div>
        
        <!-- Колесо удачи -->
        <div class="wheel-promo" onclick="openWheelModal()">
            <span>🎡</span>
            <div>
                <h4>Крути колесо удачи!</h4>
                <p>Получи скидку до 50%</p>
            </div>
            <span>→</span>
        </div>
    `;
}

// СТРАНИЦА ИЗБРАННОГО
function renderWishlistPage() {
    const wishlistProducts = state.products.filter(p => state.wishlist.includes(p.id));
    
    if (wishlistProducts.length === 0) {
        return `
            <div class="empty-state">
                <span class="empty-emoji">❤️</span>
                <h3>Избранное пусто</h3>
                <p>Добавляйте понравившиеся товары в избранное</p>
                <button class="primary-btn" onclick="navigateTo('main')">На главную</button>
            </div>
        `;
    }
    
    return `
        <div class="section-header">
            <h3 class="section-title">❤️ Избранное (${wishlistProducts.length})</h3>
        </div>
        <div class="products-grid">
            ${wishlistProducts.map(product => createProductCard(product, true)).join('')}
        </div>
    `;
}

// СТРАНИЦА НЕДАВНИХ
function renderRecentPage() {
    const recentProducts = state.recentlyViewed
        .map(id => state.products.find(p => p.id === id))
        .filter(p => p);
    
    if (recentProducts.length === 0) {
        return `
            <div class="empty-state">
                <span class="empty-emoji">⏱️</span>
                <h3>Нет недавних просмотров</h3>
                <p>Здесь появятся товары, которые вы смотрели</p>
            </div>
        `;
    }
    
    return `
        <div class="section-header">
            <h3 class="section-title">⏱️ Недавние</h3>
            <span class="view-all" onclick="clearRecent()">Очистить</span>
        </div>
        <div class="products-grid">
            ${recentProducts.map(product => createProductCard(product)).join('')}
        </div>
    `;
}

// СТРАНИЦА СКИДОК
function renderDealsPage() {
    const deals = getDeals();
    
    return `
        <div class="section-header">
            <h3 class="section-title">🔥 Все скидки</h3>
        </div>
        <div class="deals-grid">
            ${deals.map(product => `
                <div class="deal-card" onclick="showProductModal(${product.id})">
                    <div class="deal-image">${product.emoji}</div>
                    <div class="deal-info">
                        <h4>${product.name}</h4>
                        <div class="price-block">
                            <span class="current">${product.price} ₽</span>
                            <span class="old">${product.oldPrice} ₽</span>
                            <span class="discount">-${product.discount}%</span>
                        </div>
                        <div class="timer" id="dealTimer-${product.id}">🔥 Заканчивается!</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// СТРАНИЦА КОЛЛЕКЦИЙ
function renderCollectionsPage() {
    const collections = [
        {
            id: 'summer',
            name: 'Лето 2024',
            items: [1, 8, 10],
            emoji: '☀️',
            progress: 60
        },
        {
            id: 'street',
            name: 'Уличный стиль',
            items: [2, 3, 7],
            emoji: '🏙️',
            progress: 33
        },
        {
            id: 'office',
            name: 'Офисный стиль',
            items: [4, 5],
            emoji: '💼',
            progress: 50
        }
    ];
    
    return `
        <div class="section-header">
            <h3 class="section-title">📦 Коллекции</h3>
        </div>
        <div class="collections-grid">
            ${collections.map(collection => {
                const collected = collection.items.filter(id => state.wishlist.includes(id)).length;
                const progress = (collected / collection.items.length) * 100;
                
                return `
                    <div class="collection-card" onclick="showCollection('${collection.id}')">
                        <div class="collection-header">
                            <span class="collection-emoji">${collection.emoji}</span>
                            <h4>${collection.name}</h4>
                        </div>
                        <div class="collection-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progress}%"></div>
                            </div>
                            <span class="progress-text">${collected}/${collection.items.length}</span>
                        </div>
                        ${progress === 100 ? 
                            '<div class="collection-reward">🎁 Награда: Скидка 15%</div>' : 
                            ''}
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// СТРАНИЦА БОНУСОВ
function renderBonusPage() {
    return `
        <div class="bonus-header">
            <div class="bonus-circle">
                <span class="bonus-emoji">⭐</span>
                <span class="bonus-value">${state.points}</span>
            </div>
            <h3>Ваши бонусы</h3>
            <p>Копите бонусы и получайте скидки</p>
        </div>
        
        <div class="bonus-actions">
            <div class="bonus-card" onclick="spinWheel()">
                <span class="bonus-icon">🎡</span>
                <div>
                    <h4>Колесо удачи</h4>
                    <p>Крути и выигрывай</p>
                </div>
            </div>
            
            <div class="bonus-card" onclick="showExchange()">
                <span class="bonus-icon">🔄</span>
                <div>
                    <h4>Обменять бонусы</h4>
                    <p>100 бонусов = 50₽ скидки</p>
                </div>
            </div>
        </div>
        
        <div class="bonus-history">
            <h4>История начислений</h4>
            <div class="history-item">
                <span>🛒 Покупка футболки</span>
                <span class="bonus-plus">+50</span>
            </div>
            <div class="history-item">
                <span>⭐ Регистрация</span>
                <span class="bonus-plus">+100</span>
            </div>
        </div>
    `;
}

// СОЦИАЛЬНАЯ ЛЕНТА
function renderSocialPage() {
    const feed = [
        {user: "Анна", action: "купила", item: "Красная футболка", time: "5 минут назад", avatar: "👩"},
        {user: "Дмитрий", action: "лайкнул", item: "Кроссовки Nike", time: "15 минут назад", avatar: "👨"},
        {user: "Елена", action: "добавила в избранное", item: "Худи", time: "1 час назад", avatar: "👩"}
    ];
    
    return `
        <div class="section-header">
            <h3 class="section-title">👥 Лента друзей</h3>
        </div>
        
        <div class="social-feed">
            ${feed.map(item => `
                <div class="feed-item">
                    <div class="feed-avatar">${item.avatar}</div>
                    <div class="feed-content">
                        <p>
                            <strong>${item.user}</strong> ${item.action} 
                            <span class="feed-item-name">${item.item}</span>
                        </p>
                        <span class="feed-time">${item.time}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="invite-friends">
            <h4>Пригласи друзей</h4>
            <p>За каждого друга получи 100 бонусов</p>
            <button class="primary-btn" onclick="inviteFriend()">Пригласить</button>
        </div>
    `;
}

// НАСТРОЙКИ
function renderSettingsPage() {
    return `
        <div class="section-header">
            <h3 class="section-title">⚙️ Настройки</h3>
        </div>
        
        <div class="settings-group">
            <div class="settings-item">
                <div>
                    <span class="settings-icon">🔔</span>
                    <span>Уведомления</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="notificationsToggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="settings-item">
                <div>
                    <span class="settings-icon">📱</span>
                    <span>Вибрация</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="vibrationToggle" checked>
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="settings-item">
                <div>
                    <span class="settings-icon">🔒</span>
                    <span>Приватность</span>
                </div>
                <span>→</span>
            </div>
            
            <div class="settings-item">
                <div>
                    <span class="settings-icon">💳</span>
                    <span>Способы оплаты</span>
                </div>
                <span>→</span>
            </div>
            
            <div class="settings-item">
                <div>
                    <span class="settings-icon">📍</span>
                    <span>Адреса доставки</span>
                </div>
                <span>→</span>
            </div>
        </div>
        
        <div class="settings-group">
            <h4>О приложении</h4>
            <div class="settings-item">
                <span>Версия</span>
                <span>3.0.0</span>
            </div>
            <div class="settings-item">
                <span>Политика конфиденциальности</span>
                <span>→</span>
            </div>
            <div class="settings-item">
                <span>Условия использования</span>
                <span>→</span>
            </div>
        </div>
    `;
}

// КОРЗИНА
function renderCartPage() {
    if (state.cart.length === 0) {
        return `
            <div class="empty-state">
                <span class="empty-emoji">🛒</span>
                <h3>Корзина пуста</h3>
                <p>Добавьте товары, чтобы оформить заказ</p>
                <button class="primary-btn" onclick="navigateTo('main')">На главную</button>
            </div>
        `;
    }
    
    let total = 0;
    state.cart.forEach(item => {
        total += item.price * item.quantity;
    });
    
    return `
        <div class="section-header">
            <h3 class="section-title">🛒 Корзина</h3>
            <span class="view-all" onclick="clearCart()">Очистить</span>
        </div>
        
        <div class="cart-items-list">
            ${state.cart.map(item => `
                <div class="cart-item-large">
                    <div class="cart-item-emoji">${item.emoji}</div>
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">${item.price} ₽</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <div class="summary-row">
                <span>Товары:</span>
                <span>${total} ₽</span>
            </div>
            <div class="summary-row">
                <span>Доставка:</span>
                <span>Бесплатно</span>
            </div>
            <div class="summary-row total">
                <span>Итого:</span>
                <span>${total} ₽</span>
            </div>
            
            <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
            
            <div class="gift-options">
                <h4>Добавить к заказу</h4>
                <label class="gift-checkbox">
                    <input type="checkbox" onchange="addGiftWrap(this, ${total})">
                    <span>Подарочная упаковка (+199 ₽)</span>
                </label>
                <label class="gift-checkbox">
                    <input type="checkbox" onchange="addGiftCard(this, ${total})">
                    <span>Открытка (+99 ₽)</span>
                </label>
            </div>
        </div>
    `;
}

// ПРОФИЛЬ
function renderProfilePage() {
    const stats = {
        orders: 12,
        spent: 24500,
        saved: 3500,
        reviews: 8
    };
    
    return `
        <div class="profile-header">
            <div class="profile-avatar-large">${getAvatar(state.user)}</div>
            <h2>${state.user?.first_name || 'Гость'}</h2>
            <p>${state.user?.username ? '@' + state.user.username : ''}</p>
        </div>
        
        <div class="profile-stats">
            <div class="stat-card">
                <span class="stat-value">${stats.orders}</span>
                <span class="stat-label">Заказов</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${stats.spent}₽</span>
                <span class="stat-label">Потрачено</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${stats.saved}₽</span>
                <span class="stat-label">Сэкономлено</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${stats.reviews}</span>
                <span class="stat-label">Отзывов</span>
            </div>
        </div>
        
        <div class="profile-menu">
            <div class="profile-menu-item" onclick="navigateTo('orders')">
                <span>📦</span>
                <span>Мои заказы</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('reviews')">
                <span>⭐</span>
                <span>Мои отзывы</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('addresses')">
                <span>📍</span>
                <span>Адреса доставки</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('payment')">
                <span>💳</span>
                <span>Способы оплаты</span>
                <span>→</span>
            </div>
        </div>
    `;
}

// СОЗДАНИЕ КАРТОЧКИ ТОВАРА
function createProductCard(product, isWishlist = false) {
    const inCart = state.cart.some(item => item.id === product.id);
    const inWishlist = state.wishlist.includes(product.id);
    const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    return `
        <div class="product-card" onclick="showProductModal(${product.id})">
            <div class="wishlist-badge ${inWishlist ? 'active' : ''}" 
                 onclick="event.stopPropagation(); toggleWishlist(${product.id})">
                ${inWishlist ? '❤️' : '🤍'}
            </div>
            
            ${discount > 0 ? `
                <div class="product-badge">
                    <span class="discount-badge">-${discount}%</span>
                </div>
            ` : ''}
            
            <div class="product-image">${product.emoji}</div>
            
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <div class="product-category">${getCategoryName(product.category)}</div>
                
                <div class="product-rating">
                    <div class="stars">
                        ${getStars(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews.length})</span>
                </div>
                
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                </div>
                
                <div class="product-actions">
                    <button class="add-to-cart-btn" 
                            onclick="event.stopPropagation(); addToCart(${product.id})">
                        ${inCart ? '✓ В корзине' : 'В корзину'}
                    </button>
                    <button class="share-btn" onclick="event.stopPropagation(); shareProduct(${product.id})">
                        📤
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ

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

function getStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < full; i++) stars += '⭐';
    if (half) stars += '✨';
    
    return stars;
}

function getAvatar(user) {
    if (!user) return '👤';
    return user.first_name ? user.first_name[0] : '👤';
}

function getDealOfDay() {
    const day = new Date().getDate();
    const index = day % state.products.length;
    const product = {...state.products[index]};
    product.discount = 50;
    product.price = Math.floor(product.oldPrice * 0.5);
    return product;
}

function getDeals() {
    return state.products.filter(p => p.oldPrice).map(p => ({
        ...p,
        discount: Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    }));
}

function getRecommendedProducts() {
    return state.products.slice(0, 4);
}

function getPopularProducts() {
    return [...state.products].sort(() => Math.random() - 0.5).slice(0, 4);
}

// РАБОТА С ИЗБРАННЫМ
function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index === -1) {
        state.wishlist.push(productId);
        showNotification('❤️ Добавлено в избранное', 'success');
    } else {
        state.wishlist.splice(index, 1);
        showNotification('💔 Удалено из избранного');
    }
    
    updateAllBadges();
    saveState();
    
    if (state.currentPage === 'wishlist') {
        renderPage('wishlist');
    }
}

// РАБОТА С КОРЗИНОЙ
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    const cartItem = state.cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    // Добавляем бонусы
    state.points += 5;
    
    saveState();
    updateAllBadges();
    renderProductsIfNeeded();
    
    tg.HapticFeedback.impactOccurred('light');
    showNotification(`✅ ${product.name} добавлен в корзину`, 'success');
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveState();
    updateAllBadges();
    
    if (state.currentPage === 'cart') {
        renderPage('cart');
    }
}

function updateQuantity(productId, change) {
    const cartItem = state.cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveState();
            if (state.currentPage === 'cart') {
                renderPage('cart');
            }
        }
    }
}

function clearCart() {
    if (state.cart.length > 0) {
        tg.showConfirm('Очистить корзину?', (confirmed) => {
            if (confirmed) {
                state.cart = [];
                saveState();
                updateAllBadges();
                renderPage('cart');
                tg.HapticFeedback.notificationOccurred('success');
            }
        });
    }
}

// РАБОТА С НЕДАВНИМИ
function addToRecentlyViewed(productId) {
    state.recentlyViewed = [
        productId,
        ...state.recentlyViewed.filter(id => id !== productId)
    ].slice(0, 10);
    
    saveState();
}

function clearRecent() {
    state.recentlyViewed = [];
    saveState();
    renderPage('recent');
}

// УВЕДОМЛЕНИЯ
function showNotification(message, type = 'info') {
    const container = document.getElementById('notificationContainer');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ОБНОВЛЕНИЕ БЕЙДЖЕЙ
function updateAllBadges() {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = state.wishlist.length;
    
    document.getElementById('navCartBadge').textContent = cartCount;
    document.getElementById('navWishlistBadge').textContent = wishlistCount;
    document.getElementById('wishlistBadge').textContent = wishlistCount;
    document.getElementById('bonusPoints').textContent = state.points;
    document.getElementById('pointsDisplay').textContent = state.points;
    
    if (cartCount === 0) {
        document.getElementById('navCartBadge').style.display = 'none';
    } else {
        document.getElementById('navCartBadge').style.display = 'block';
    }
}

// СОХРАНЕНИЕ СОСТОЯНИЯ
function saveState() {
    const saveData = {
        cart: state.cart,
        wishlist: state.wishlist,
        points: state.points,
        recentlyViewed: state.recentlyViewed
    };
    localStorage.setItem('stylebox_state', JSON.stringify(saveData));
}

function loadState() {
    const saved = localStorage.getItem('stylebox_state');
    if (saved) {
        const data = JSON.parse(saved);
        state.cart = data.cart || [];
        state.wishlist = data.wishlist || [];
        state.points = data.points || 0;
        state.recentlyViewed = data.recentlyViewed || [];
    }
}

// УПРАВЛЕНИЕ МЕНЮ
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    menu.classList.toggle('open');
    overlay.classList.toggle('show');
}

// ТЕМА
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    document.getElementById('themeToggle').textContent = isDark ? '🌙' : '☀️';
    
    tg.setHeaderColor(newTheme === 'dark' ? '#1A1A2E' : '#F8F9FF');
}

// МОДАЛЬНЫЕ ОКНА
function showProductModal(productId) {
    const product = state.products.find(p => p.id === productId);
    addToRecentlyViewed(productId);
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-emoji">${product.emoji}</div>
            <h2>${product.name}</h2>
            
            <div class="modal-rating">
                ${getStars(product.rating)}
                <span>${product.rating} (${product.reviews.length} отзывов)</span>
            </div>
            
            <div class="modal-price-block">
                <div class="modal-price">${product.price} ₽</div>
                ${product.oldPrice ? `
                    <div class="modal-old-price">${product.oldPrice} ₽</div>
                    <div class="modal-discount">-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</div>
                ` : ''}
            </div>
            
            <p class="modal-description">${product.description}</p>
            
            <div class="modal-reviews">
                <h4>Отзывы (${product.reviews.length})</h4>
                ${product.reviews.map(review => `
                    <div class="review-item">
                        <div class="review-header">
                            <strong>${review.user}</strong>
                            <div class="review-stars">${getStars(review.rating)}</div>
                        </div>
                        <p>${review.text}</p>
                        <small>${review.date}</small>
                    </div>
                `).join('') || '<p>Пока нет отзывов. Будьте первым!</p>'}
            </div>
            
            <div class="modal-actions">
                <button class="modal-add-btn" onclick="addToCart(${product.id}); closeModal()">
                    Добавить в корзину
                </button>
                <button class="modal-wishlist-btn" onclick="toggleWishlist(${product.id})">
                    ${state.wishlist.includes(product.id) ? '❤️ В избранном' : '🤍 В избранное'}
                </button>
            </div>
            
            <div class="modal-share" onclick="shareProduct(${product.id})">
                📤 Поделиться товаром
            </div>
        </div>
    `;
    
    modal.classList.add('show');
    tg.HapticFeedback.impactOccurred('medium');
}

function closeModal() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
}

// ШАРИНГ
function shareProduct(productId) {
    const product = state.products.find(p => p.id === productId);
    
    // Показываем QR-код
    showQRModal(productId);
}

function showQRModal(productId) {
    const product = state.products.find(p => p.id === productId);
    const modal = document.getElementById('qrModal');
    const container = document.getElementById('qrCodeContainer');
    
    container.innerHTML = '';
    
    QRCode.toCanvas(document.createElement('canvas'), `https://t.me/stylebox_bot/app?start=product_${productId}`, {
        width: 200,
        margin: 1,
        color: {
            dark: document.body.getAttribute('data-theme') === 'dark' ? '#FFFFFF' : '#000000',
            light: '#0000'
        }
    }, (error, canvas) => {
        if (error) {
            showNotification('Ошибка создания QR-кода', 'error');
        } else {
            container.appendChild(canvas);
        }
    });
    
    modal.classList.add('show');
}

function closeQRModal() {
    document.getElementById('qrModal').classList.remove('show');
}

// КОЛЕСО УДАЧИ
function openWheelModal() {
    const modal = document.getElementById('wheelModal');
    modal.classList.add('show');
}

function closeWheelModal() {
    document.getElementById('wheelModal').classList.remove('show');
}

function spinWheel() {
    const wheel = document.getElementById('wheel');
    if (!wheel) return;
    
    wheel.classList.add('spinning');
    
    // Случайный угол
    const degrees = 1440 + Math.random() * 360;
    wheel.style.transform = `rotate(${degrees}deg)`;
    
    // Определяем приз
    setTimeout(() => {
        const prizes = [
            {type: 'discount', value: 10, text: 'Скидка 10%'},
            {type: 'discount', value: 20, text: 'Скидка 20%'},
            {type: 'discount', value: 30, text: 'Скидка 30%'},
            {type: 'points', value: 50, text: '50 бонусов'},
            {type: 'points', value: 100, text: '100 бонусов'},
            {type: 'freeShipping', text: 'Бесплатная доставка'}
        ];
        
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        
        wheel.classList.remove('spinning');
        
        if (prize.type === 'points') {
            state.points += prize.value;
            showNotification(`🎉 Вы выиграли ${prize.text}!`, 'success');
        } else if (prize.type === 'discount') {
            showNotification(`🎉 ${prize.text} на следующий заказ!`, 'success');
        } else {
            showNotification(`🎉 ${prize.text}!`, 'success');
        }
        
        updateAllBadges();
        tg.HapticFeedback.notificationOccurred('success');
    }, 3000);
}

// ПРИГЛАШЕНИЕ ДРУЗЕЙ
function inviteFriend() {
    const shareText = '👕 Присоединяйся к StyleBox - тут крутая одежда!';
    
    if (tg.shareToStory) {
        tg.shareToStory(shareText);
    } else {
        navigator.clipboard.writeText(shareText);
        showNotification('Ссылка скопирована!');
    }
}

// ПОДАРОЧНАЯ УПАКОВКА
function addGiftWrap(checkbox, total) {
    if (checkbox.checked) {
        showNotification('🎁 Добавлена подарочная упаковка');
        // Обновляем итог
        document.querySelector('.summary-row.total span:last-child').textContent = total + 199 + ' ₽';
    }
}

function addGiftCard(checkbox, total) {
    if (checkbox.checked) {
        showNotification('💌 Добавлена открытка');
        document.querySelector('.summary-row.total span:last-child').textContent = total + 99 + ' ₽';
    }
}

// ОФОРМЛЕНИЕ ЗАКАЗА
function checkout() {
    if (state.cart.length === 0) {
        tg.showAlert('Корзина пуста!');
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const items = state.cart.map(item => `${item.name} x${item.quantity}`).join('\n');
    
    // Добавляем бонусы за покупку
    const pointsEarned = Math.floor(total / 100);
    
    tg.showConfirm(
        `Ваш заказ:\n${items}\n\nИтого: ${total} ₽\n\nНачислим бонусов: ${pointsEarned}\n\nПодтвердить покупку?`, 
        (confirmed) => {
            if (confirmed) {
                // Отправляем данные в бота
                tg.sendData(JSON.stringify({
                    action: 'purchase',
                    items: state.cart,
                    total: total,
                    points: pointsEarned,
                    date: new Date().toISOString()
                }));
                
                // Начисляем бонусы
                state.points += pointsEarned;
                
                // Очищаем корзину
                state.cart = [];
                saveState();
                updateAllBadges();
                
                // Закрываем корзину
                if (state.currentPage === 'cart') {
                    renderPage('cart');
                }
                
                tg.HapticFeedback.notificationOccurred('success');
                showNotification('🎉 Заказ оформлен! Спасибо за покупку!', 'success');
            }
        }
    );
}

// ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ
function renderProductsIfNeeded() {
    if (state.currentPage === 'main' || state.currentPage === 'wishlist') {
        renderPage(state.currentPage);
    }
}

// Коллекции
function showCollection(collectionId) {
    // Показать товары коллекции
    navigateTo('collections');
}

// Обмен бонусов
function showExchange() {
    tg.showConfirm(`Обменять ${Math.min(500, state.points)} бонусов на скидку?`, (confirmed) => {
        if (confirmed) {
            const points = Math.min(500, state.points);
            const discount = Math.floor(points / 2);
            state.points -= points;
            showNotification(`✅ Получена скидка ${discount}₽ на следующий заказ!`, 'success');
            updateAllBadges();
        }
    });
}
