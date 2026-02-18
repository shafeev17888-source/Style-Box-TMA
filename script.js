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
        .filter(p => p
