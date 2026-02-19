// ПОЛНОЕ ОТКЛЮЧЕНИЕ ТЕМЫ TELEGRAM
if (window.Telegram?.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Отключаем автоматическую тему
    tg.setHeaderColor('#FFFFFF'); // Белая шапка
    tg.setBackgroundColor('#F8F9FF'); // Наш цвет фона
    
    // Принудительно устанавливаем светлую тему
    document.body.style.background = '#F8F9FF';
    document.body.style.color = '#1A1A2E';
    
    // Убираем красную шапку
    tg.setHeaderColor('#FFFFFF');
    
    console.log('🎨 Telegram тема отключена');
}

// Telegram Web App инициализация
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.enableClosingConfirmation();
}

// Состояние приложения
let state = {
    currentPage: 'main',
    products: [],
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    user: null,
    points: 0
};

// ТОВАРЫ С ФОТОГРАФИЯМИ (20 штук) - ИСПРАВЛЕНО: убрал images/
const products = [
    // ФУТБОЛКИ (shirts)
    { 
        id: 1, 
        name: "Красная футболка", 
        price: 999, 
        oldPrice: 1299, 
        category: "shirts", 
        emoji: "👕", 
        image: "red-tshirt.jpg",
        description: "Стильная красная футболка из 100% хлопка. Идеально для повседневной носки." 
    },
    { 
        id: 2, 
        name: "Черная футболка оверсайз", 
        price: 1199, 
        oldPrice: 1599, 
        category: "shirts", 
        emoji: "👕", 
        image: "black-tshirt.jpg",
        description: "Модная футболка свободного кроя. Подойдет к любым джинсам." 
    },
    { 
        id: 3, 
        name: "Белая футболка с принтом", 
        price: 1399, 
        oldPrice: 1799, 
        category: "shirts", 
        emoji: "👕", 
        image: "white-print.jpg",
        description: "Оригинальный принт, качественная печать, не выцветает." 
    },
    { 
        id: 4, 
        name: "Поло синее", 
        price: 1599, 
        oldPrice: 1999, 
        category: "shirts", 
        emoji: "👔", 
        image: "blue-polo.jpg",
        description: "Классическое поло из хлопка. Для стильных образов." 
    },
    
    // ШТАНЫ (pants)
    { 
        id: 5, 
        name: "Синие джинсы", 
        price: 1999, 
        oldPrice: 2499, 
        category: "pants", 
        emoji: "👖", 
        image: "blue-jeans.jpg",
        description: "Классические синие джинсы. Удобные и практичные." 
    },
    { 
        id: 6, 
        name: "Черные брюки чинос", 
        price: 1799, 
        oldPrice: 2199, 
        category: "pants", 
        emoji: "🩳", 
        image: "black-chinos.jpg",
        description: "Стильные черные брюки. Универсальный вариант для офиса и прогулок." 
    },
    { 
        id: 7, 
        name: "Джинсы скинни", 
        price: 1899, 
        oldPrice: 2399, 
        category: "pants", 
        emoji: "👖", 
        image: "skinny-jeans.jpg",
        description: "Обтягивающие джинсы, подчеркивают фигуру." 
    },
    { 
        id: 8, 
        name: "Спортивные штаны", 
        price: 1299, 
        oldPrice: 1599, 
        category: "pants", 
        emoji: "👖", 
        image: "sport-pants.jpg",
        description: "Удобные штаны для спорта и дома." 
    },
    
    // ОБУВЬ (shoes)
    { 
        id: 9, 
        name: "Кроссовки Nike Air", 
        price: 4999, 
        oldPrice: 5999, 
        category: "shoes", 
        emoji: "👟", 
        image: "nike-air.jpg",
        description: "Оригинальные кроссовки Nike. Максимальный комфорт при ходьбе." 
    },
    { 
        id: 10, 
        name: "Кеды Converse", 
        price: 3999, 
        oldPrice: 4599, 
        category: "shoes", 
        emoji: "👞", 
        image: "converse.jpg",
        description: "Классические кеды Converse. Всегда в моде." 
    },
    { 
        id: 11, 
        name: "Ботинки зимние", 
        price: 5999, 
        oldPrice: 6999, 
        category: "shoes", 
        emoji: "👢", 
        image: "winter-boots.jpg",
        description: "Теплые зимние ботинки, не скользят." 
    },
    { 
        id: 12, 
        name: "Туфли мужские", 
        price: 3299, 
        oldPrice: 3899, 
        category: "shoes", 
        emoji: "👞", 
        image: "shoes.jpg",
        description: "Классические туфли на каждый день." 
    },
    
    // ХУДИ (hoodies)
    { 
        id: 13, 
        name: "Худи с капюшоном серая", 
        price: 2999, 
        oldPrice: 3599, 
        category: "hoodies", 
        emoji: "🧥", 
        image: "grey-hoodie.jpg",
        description: "Теплое худи с капюшоном. Для уютных вечеров." 
    },
    { 
        id: 14, 
        name: "Толстовка с принтом", 
        price: 2799, 
        oldPrice: 3299, 
        category: "hoodies", 
        emoji: "🧥", 
        image: "print-hoodie.jpg",
        description: "Модная толстовка с оригинальным принтом." 
    },
    { 
        id: 15, 
        name: "Олимпийка", 
        price: 2499, 
        oldPrice: 2999, 
        category: "hoodies", 
        emoji: "🧥", 
        image: "sweatshirt.jpg",
        description: "Спортивный стиль на каждый день." 
    },
    
    // АКСЕССУАРЫ (accessories)
    { 
        id: 16, 
        name: "Бейсболка черная", 
        price: 899, 
        oldPrice: 1199, 
        category: "accessories", 
        emoji: "🧢", 
        image: "black-cap.jpg",
        description: "Стильная бейсболка. Защитит от солнца." 
    },
    { 
        id: 17, 
        name: "Солнцезащитные очки", 
        price: 1499, 
        oldPrice: 1999, 
        category: "accessories", 
        emoji: "🕶️", 
        image: "sunglasses.jpg",
        description: "Модные солнцезащитные очки." 
    },
    { 
        id: 18, 
        name: "Рюкзак городской", 
        price: 2299, 
        oldPrice: 2799, 
        category: "accessories", 
        emoji: "🎒", 
        image: "backpack.jpg",
        description: "Вместительный рюкзак для учебы и прогулок." 
    },
    { 
        id: 19, 
        name: "Шарф зимний", 
        price: 799, 
        oldPrice: 999, 
        category: "accessories", 
        emoji: "🧣", 
        image: "scarf.jpg",
        description: "Теплый шарф для холодной погоды." 
    },
    { 
        id: 20, 
        name: "Шапка вязаная", 
        price: 699, 
        oldPrice: 899, 
        category: "accessories", 
        emoji: "🧤", 
        image: "hat.jpg",
        description: "Модная вязаная шапка." 
    }
];

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    state.products = products;
    loadState();
    setupEventListeners();
    renderPage('main');
    updateAllBadges();
    
    // Показываем имя пользователя если есть
    if (tg?.initDataUnsafe?.user) {
        state.user = tg.initDataUnsafe.user;
        document.getElementById('userName').textContent = state.user.first_name;
    }
});

// Настройка обработчиков
function setupEventListeners() {
    // Меню
    document.getElementById('menuToggle')?.addEventListener('click', toggleMenu);
    document.getElementById('closeMenu')?.addEventListener('click', toggleMenu);
    document.getElementById('menuOverlay')?.addEventListener('click', toggleMenu);
    
    // Навигация
    document.querySelectorAll('.nav-item, .menu-item[data-page]').forEach(item => {
        item.addEventListener('click', (e) => {
            const page = e.currentTarget.dataset.page;
            if (page) navigateTo(page);
        });
    });
    
    // Тема
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    
    // Корзина
    document.getElementById('cartToggle')?.addEventListener('click', toggleCart);
    document.getElementById('closeCart')?.addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('bottomCartBtn')?.addEventListener('click', toggleCart);
}

// НАВИГАЦИЯ
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

// РЕНДЕРИНГ СТРАНИЦ
function renderPage(page) {
    const content = document.getElementById('mainContent');
    if (!content) return;
    
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
        case 'cart':
            content.innerHTML = renderCartPage();
            break;
        case 'profile':
            content.innerHTML = renderProfilePage();
            break;
        case 'settings':
            content.innerHTML = renderSettingsPage();
            break;
        case 'support':
            content.innerHTML = renderSupportPage();
            break;
        default:
            content.innerHTML = renderMainPage();
    }
    
    // Добавляем обработчики для кнопок на странице
    addPageButtonsListeners();
}

// ГЛАВНАЯ
function renderMainPage() {
    const dealOfDay = getDealOfDay();
    
    return `
        <!-- Товар дня -->
        <div class="deal-banner" onclick="showProductModal(${dealOfDay.id})">
            <div class="deal-content">
                <span class="deal-label">🔥 ТОВАР ДНЯ</span>
                <h2>${dealOfDay.name}</h2>
                <div class="deal-price">
                    <span class="current-price">${dealOfDay.price} ₽</span>
                    <span class="old-price">${dealOfDay.oldPrice} ₽</span>
                </div>
                <button class="deal-btn">Купить со скидкой</button>
            </div>
            <div class="deal-emoji">${dealOfDay.emoji}</div>
        </div>
        
        <!-- Категории -->
        <div class="section-header">
            <h3 class="section-title">📱 Категории</h3>
        </div>
        <div class="categories-scroll">
            <div class="category-item" onclick="filterByCategory('shirts')">
                <span class="category-emoji">👕</span>
                <span>Футболки</span>
            </div>
            <div class="category-item" onclick="filterByCategory('pants')">
                <span class="category-emoji">👖</span>
                <span>Штаны</span>
            </div>
            <div class="category-item" onclick="filterByCategory('shoes')">
                <span class="category-emoji">👟</span>
                <span>Обувь</span>
            </div>
            <div class="category-item" onclick="filterByCategory('hoodies')">
                <span class="category-emoji">🧥</span>
                <span>Худи</span>
            </div>
            <div class="category-item" onclick="filterByCategory('accessories')">
                <span class="category-emoji">🧢</span>
                <span>Аксессуары</span>
            </div>
        </div>
        
        <!-- Все товары -->
        <div class="section-header">
            <h3 class="section-title">🛍️ Все товары</h3>
        </div>
        <div class="products-grid">
            ${state.products.map(product => createProductCard(product)).join('')}
        </div>
    `;
}

// ИЗБРАННОЕ
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
            ${wishlistProducts.map(product => createProductCard(product)).join('')}
        </div>
    `;
}

// НЕДАВНИЕ
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

// СКИДКИ
function renderDealsPage() {
    const deals = state.products.filter(p => p.oldPrice);
    
    return `
        <div class="section-header">
            <h3 class="section-title">🔥 Товары со скидкой</h3>
        </div>
        <div class="products-grid">
            ${deals.map(product => createProductCard(product)).join('')}
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
            <div class="summary-row total">
                <span>Итого:</span>
                <span>${total} ₽</span>
            </div>
            
            <button class="checkout-btn" onclick="checkout()">Оформить заказ</button>
        </div>
    `;
}

// ПРОФИЛЬ
function renderProfilePage() {
    return `
        <div class="profile-header">
            <div class="profile-avatar-large">${getAvatar()}</div>
            <h2>${state.user?.first_name || 'Гость'}</h2>
            <p>${state.user?.username ? '@' + state.user.username : ''}</p>
        </div>
        
        <div class="profile-stats">
            <div class="stat-card">
                <span class="stat-value">${state.wishlist.length}</span>
                <span class="stat-label">В избранном</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${state.recentlyViewed.length}</span>
                <span class="stat-label">Просмотрено</span>
            </div>
            <div class="stat-card">
                <span class="stat-value">${state.points}</span>
                <span class="stat-label">Бонусы</span>
            </div>
        </div>
        
        <div class="profile-menu">
            <div class="profile-menu-item" onclick="navigateTo('wishlist')">
                <span>❤️</span>
                <span>Избранное</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('recent')">
                <span>⏱️</span>
                <span>Недавние</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('deals')">
                <span>🔥</span>
                <span>Скидки</span>
                <span>→</span>
            </div>
            <div class="profile-menu-item" onclick="navigateTo('settings')">
                <span>⚙️</span>
                <span>Настройки</span>
                <span>→</span>
            </div>
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
                    <span class="settings-icon">🌙</span>
                    <span>Темная тема</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="darkThemeToggle" onchange="toggleTheme()">
                    <span class="slider"></span>
                </label>
            </div>
            
            <div class="settings-item" onclick="clearAllData()">
                <div>
                    <span class="settings-icon">🗑️</span>
                    <span>Очистить данные</span>
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
                <span>Разработчик</span>
                <span>StyleBox</span>
            </div>
        </div>
    `;
}

// СТРАНИЦА ПОДДЕРЖКИ
function renderSupportPage() {
    return `
        <div class="section-header">
            <h3 class="section-title">🆘 Поддержка</h3>
        </div>
        
        <div class="support-container">
            <div class="support-card">
                <h4>📞 Контакты</h4>
                
                <!-- Телефон - копируется при нажатии -->
                <div class="contact-item" onclick="copyPhone()">
                    <div class="contact-icon">📱</div>
                    <div class="contact-info">
                        <div class="contact-label">Телефон</div>
                        <div class="contact-value" id="phoneNumber">+7 (987) 149-48-82</div>
                    </div>
                    <div class="contact-action">📋</div>
                </div>
                
                <!-- Telegram - открывает чат -->
                <div class="contact-item" onclick="openTelegram()">
                    <div class="contact-icon">✈️</div>
                    <div class="contact-info">
                        <div class="contact-label">Telegram</div>
                        <div class="contact-value" id="telegramUsername">@dewwreqqqqq</div>
                    </div>
                    <div class="contact-action">↗️</div>
                </div>
            </div>
            
            <div class="support-card">
                <h4>💬 Написать нам</h4>
                <p class="support-text">Есть вопросы? Напиши нам в Telegram, и мы поможем!</p>
                <button class="support-chat-btn" onclick="openTelegram()">
                    Открыть чат →
                </button>
            </div>
            
            <div class="support-card">
                <h4>⏰ Время работы</h4>
                <div class="work-time">
                    <div>Пн-Пт: 9:00 - 20:00</div>
                    <div>Сб-Вс: 10:00 - 18:00</div>
                </div>
            </div>
        </div>
    `;
}

// Функция для копирования телефона
function copyPhone() {
    const phone = document.getElementById('phoneNumber')?.textContent;
    if (!phone) return;
    
    // Убираем скобки и пробелы для копирования
    const phoneClean = phone.replace(/[^\d+]/g, '');
    
    // Копируем
    navigator.clipboard.writeText(phoneClean).then(() => {
        showNotification('✅ Номер скопирован!');
        
        // Визуальный эффект
        const el = document.getElementById('phoneNumber');
        if (el) {
            el.style.color = '#00B894';
            setTimeout(() => {
                el.style.color = '';
            }, 500);
        }
        
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }).catch(() => {
        // Если не получилось скопировать - показываем старый номер
        showNotification('📱 ' + phone);
    });
}

// Функция для открытия Telegram
function openTelegram() {
    const username = 'dewwreqqqqq'; // Твой username без @
    
    // Пробуем открыть в Telegram
    window.open(`https://t.me/${username}`, '_blank');
    
    // Визуальный эффект
    const el = document.getElementById('telegramUsername');
    if (el) {
        el.style.color = '#0088cc';
        setTimeout(() => {
            el.style.color = '';
        }, 500);
    }
    
    showNotification('✈️ Открываю Telegram...');
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
}

// СОЗДАНИЕ КАРТОЧКИ ТОВАРА (с поддержкой фото)
function createProductCard(product) {
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
            
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.style.display='none'; this.parentNode.innerHTML='${product.emoji}';">` : 
                    product.emoji
                }
            </div>
            
            <div class="product-info">
                <h4 class="product-name">${product.name}</h4>
                <div class="product-category">${getCategoryName(product.category)}</div>
                
                <div class="product-price">
                    <span class="current-price">${product.price} ₽</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
                </div>
                
                <button class="add-to-cart-btn" 
                        onclick="event.stopPropagation(); addToCart(${product.id})">
                    ${inCart ? '✓ В корзине' : 'В корзину'}
                </button>
            </div>
        </div>
    `;
}

// МОДАЛЬНОЕ ОКНО ТОВАРА (с поддержкой фото)
function showProductModal(productId) {
    const product = state.products.find(p => p.id === productId);
    
    // Добавляем в недавние
    addToRecentlyViewed(productId);
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" class="modal-img" onerror="this.style.display='none'; this.parentNode.innerHTML='${product.emoji}';">` : 
                    `<div class="modal-emoji">${product.emoji}</div>`
                }
            </div>
            <h2>${product.name}</h2>
            
            <div class="modal-price-block">
                <div class="modal-price">${product.price} ₽</div>
                ${product.oldPrice ? `
                    <div class="modal-old-price">${product.oldPrice} ₽</div>
                    <div class="modal-discount">-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%</div>
                ` : ''}
            </div>
            
            <p class="modal-description">${product.description}</p>
            
            <button class="modal-add-btn" onclick="addToCart(${product.id}); closeModal()">
                Добавить в корзину
            </button>
            
            <button class="modal-wishlist-btn" onclick="toggleWishlist(${product.id})">
                ${state.wishlist.includes(product.id) ? '❤️ В избранном' : '🤍 В избранное'}
            </button>
        </div>
    `;
    
    modal.classList.add('show');
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
}

function closeModal() {
    document.getElementById('productModal')?.classList.remove('show');
}

// РАБОТА С ИЗБРАННЫМ
function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index === -1) {
        state.wishlist.push(productId);
        showNotification('❤️ Добавлено в избранное');
    } else {
        state.wishlist.splice(index, 1);
        showNotification('💔 Удалено из избранного');
    }
    
    saveState();
    updateAllBadges();
    
    // Обновляем страницу если нужно
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
    
    if (tg?.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
    showNotification(`✅ ${product.name} добавлен в корзину`);
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
        if (confirm('Очистить корзину?')) {
            state.cart = [];
            saveState();
            updateAllBadges();
            if (state.currentPage === 'cart') {
                renderPage('cart');
            }
            if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
        }
    }
}

// НЕДАВНИЕ ПРОСМОТРЫ
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

// ОФОРМЛЕНИЕ ЗАКАЗА
function checkout() {
    if (state.cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Заказ на сумму ${total}₽. Подтвердить покупку?`)) {
        if (tg) {
            tg.sendData(JSON.stringify({
                action: 'purchase',
                items: state.cart,
                total: total
            }));
        }
        
        // Начисляем бонусы
        state.points += Math.floor(total / 100);
        
        state.cart = [];
        saveState();
        updateAllBadges();
        
        alert('🎉 Спасибо за покупку!');
        navigateTo('main');
        
        if (tg?.HapticFeedback) tg.HapticFeedback.notificationOccurred('success');
    }
}

// ТОВАР ДНЯ
function getDealOfDay() {
    const day = new Date().getDate();
    const index = day % state.products.length;
    const product = {...state.products[index]};
    if (product.oldPrice) {
        product.price = Math.floor(product.oldPrice * 0.7); // 30% скидка
    }
    return product;
}

// ФИЛЬТРАЦИЯ ПО КАТЕГОРИЯМ
function filterByCategory(category) {
    const filtered = state.products.filter(p => p.category === category);
    const content = document.getElementById('mainContent');
    
    content.innerHTML = `
        <div class="section-header">
            <h3 class="section-title">${getCategoryName(category)}</h3>
            <span class="view-all" onclick="navigateTo('main')">Назад</span>
        </div>
        <div class="products-grid">
            ${filtered.map(product => createProductCard(product)).join('')}
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

function getAvatar() {
    if (state.user?.first_name) {
        return state.user.first_name[0];
    }
    return '👤';
}

// УВЕДОМЛЕНИЯ
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #8A2BE2;
        color: white;
        padding: 12px 24px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(138, 43, 226, 0.3);
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// ОБНОВЛЕННАЯ функция updateAllBadges
function updateAllBadges() {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = state.wishlist.length;
    
    const cartBadge = document.getElementById('navCartBadge');
    const bottomCartBadge = document.getElementById('bottomCartBadge');
    const wishlistBadge = document.getElementById('navWishlistBadge');
    const menuWishlistBadge = document.getElementById('wishlistBadge');
    const pointsDisplay = document.getElementById('pointsDisplay');
    const bottomBonus = document.getElementById('bottomBonus');
    
    // Обновляем бейдж корзины в шапке
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    
    // ОБНОВЛЯЕМ БЕЙДЖ КОРЗИНЫ ВНИЗУ
    if (bottomCartBadge) {
        bottomCartBadge.textContent = cartCount;
        bottomCartBadge.style.display = cartCount > 0 ? 'flex' : 'none';
    }
    
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
    }
    
    if (menuWishlistBadge) {
        menuWishlistBadge.textContent = wishlistCount;
    }
    
    if (pointsDisplay) {
        pointsDisplay.textContent = state.points;
    }
    
    // Обновляем бонусы внизу
    if (bottomBonus) {
        bottomBonus.textContent = state.points;
    }
}

// СОХРАНЕНИЕ ДАННЫХ
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
        try {
            const data = JSON.parse(saved);
            state.cart = data.cart || [];
            state.wishlist = data.wishlist || [];
            state.points = data.points || 0;
            state.recentlyViewed = data.recentlyViewed || [];
        } catch (e) {
            console.error('Ошибка загрузки:', e);
        }
    }
}

// ОЧИСТКА ВСЕХ ДАННЫХ
function clearAllData() {
    if (confirm('Очистить все данные? Это действие нельзя отменить.')) {
        state.cart = [];
        state.wishlist = [];
        state.points = 0;
        state.recentlyViewed = [];
        localStorage.removeItem('stylebox_state');
        updateAllBadges();
        navigateTo('main');
        showNotification('✅ Данные очищены');
    }
}

// УПРАВЛЕНИЕ МЕНЮ
function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('menuOverlay');
    
    if (menu && overlay) {
        menu.classList.toggle('open');
        overlay.classList.toggle('show');
    }
}

// УПРАВЛЕНИЕ КОРЗИНОЙ
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
        if (sidebar.classList.contains('open')) {
            renderCartInSidebar();
        }
    }
}

function renderCartInSidebar() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (state.cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999;">Корзина пуста</p>';
        cartTotal.textContent = '0 ₽';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = state.cart.map(item => {
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
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = `${total} ₽`;
}

// ТЕМА
function toggleTheme() {
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    
    if (tg) {
        tg.setHeaderColor(newTheme === 'dark' ? '#1A1A2E' : '#F8F9FF');
    }
}

// Добавление обработчиков для кнопок на странице
function addPageButtonsListeners() {
    // Здесь можно добавить специфичные обработчики если нужно
}

