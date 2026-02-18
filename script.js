// Telegram Web App инициализация
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.expand();
    tg.enableClosingConfirmation();
} else {
    console.log('Telegram Web App не найден, работаем в обычном режиме');
}

// Базовое состояние с проверками
let state = {
    currentPage: 'main',
    products: [],
    cart: [],
    wishlist: [],
    recentlyViewed: [],
    user: null,
    points: 0,
    theme: 'light'
};

// Минимальные товары для теста
const testProducts = [
    { id: 1, name: "Красная футболка", price: 999, oldPrice: 1299, category: "shirts", emoji: "👕", description: "Тест", rating: 4.5, reviews: [] },
    { id: 2, name: "Синие джинсы", price: 1999, oldPrice: 2499, category: "pants", emoji: "👖", description: "Тест", rating: 4.5, reviews: [] }
];

// Ждем полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация...');
    
    try {
        // Загружаем товары
        state.products = testProducts;
        
        // Загружаем сохраненное состояние
        loadState();
        
        // Проверяем существование всех элементов
        checkElements();
        
        // Настраиваем обработчики
        setupEventListeners();
        
        // Показываем главную страницу
        renderMainPageSimple();
        
        // Обновляем бейджи
        updateBadges();
        
        console.log('Инициализация завершена успешно');
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        showErrorMessage();
    }
});

// Проверка всех необходимых элементов
function checkElements() {
    const required = ['menuToggle', 'themeToggle', 'mainContent'];
    required.forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Элемент #${id} не найден!`);
        } else {
            console.log(`✅ #${id} найден`);
        }
    });
}

// Простая главная страница для теста
function renderMainPageSimple() {
    const content = document.getElementById('mainContent');
    if (!content) {
        console.error('mainContent не найден!');
        return;
    }
    
    content.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h2 style="color: #8A2BE2; margin-bottom: 20px;">👕 StyleBox</h2>
            <p style="margin-bottom: 20px;">Приложение работает!</p>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
                ${state.products.map(p => `
                    <div style="background: white; padding: 15px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                        <div style="font-size: 40px; margin-bottom: 10px;">${p.emoji}</div>
                        <h4>${p.name}</h4>
                        <p style="color: #8A2BE2; font-weight: bold;">${p.price} ₽</p>
                        <button onclick="addToCart(${p.id})" style="background: #8A2BE2; color: white; border: none; padding: 8px 15px; border-radius: 8px; cursor: pointer;">
                            В корзину
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button onclick="testNavigation('wishlist')" style="background: #f0f0f0; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">❤️ Избранное</button>
                <button onclick="testNavigation('cart')" style="background: #f0f0f0; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">🛒 Корзина</button>
                <button onclick="testNavigation('profile')" style="background: #f0f0f0; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer;">👤 Профиль</button>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px; font-size: 12px; color: #666;">
                Статус: ✅ Работает<br>
                Корзина: ${state.cart.length} товаров<br>
                Избранное: ${state.wishlist.length} товаров
            </div>
        </div>
    `;
}

// Функции для тестирования
function testNavigation(page) {
    console.log('Навигация на:', page);
    state.currentPage = page;
    
    const content = document.getElementById('mainContent');
    if (!content) return;
    
    if (page === 'wishlist') {
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>❤️ Избранное</h3>
                ${state.wishlist.length === 0 ? 
                    '<p>Пока пусто</p>' : 
                    '<p>Товаров: ' + state.wishlist.length + '</p>'
                }
                <button onclick="testNavigation('main')" style="background: #8A2BE2; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 20px; cursor: pointer;">
                    На главную
                </button>
            </div>
        `;
    } else if (page === 'cart') {
        let total = 0;
        state.cart.forEach(item => { total += item.price * item.quantity; });
        
        content.innerHTML = `
            <div style="padding: 20px; text-align: center;">
                <h3>🛒 Корзина</h3>
                ${state.cart.length === 0 ? 
                    '<p>Корзина пуста</p>' : 
                    state.cart.map(item => `
                        <div style="background: white; padding: 10px; margin: 10px; border-radius: 8px;">
                            ${item.name} x${item.quantity} = ${item.price * item.quantity}₽
                        </div>
                    `).join('')
                }
                ${state.cart.length > 0 ? 
                    `<p style="font-weight: bold; margin: 10px;">Итого: ${total}₽</p>
                     <button onclick="checkout()" style="background: #00B894; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
                        Оформить заказ
                     </button>` : 
                    ''
                }
                <button onclick="testNavigation('main')" style="background: #8A2BE2; color: white; border: none; padding: 10px 20px; border-radius: 8px; margin-top: 20px; cursor: pointer;">
                    На главную
                </button>
            </div>
        `;
    }
}

// Простые функции корзины
function addToCart(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;
    
    const cartItem = state.cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        state.cart.push({ ...product, quantity: 1 });
    }
    
    saveState();
    updateBadges();
    
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    alert(`✅ ${product.name} добавлен в корзину!`);
}

function removeFromCart(productId) {
    state.cart = state.cart.filter(item => item.id !== productId);
    saveState();
    updateBadges();
    testNavigation('cart');
}

// Простая функция избранного
function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index === -1) {
        state.wishlist.push(productId);
        alert('❤️ Добавлено в избранное');
    } else {
        state.wishlist.splice(index, 1);
        alert('💔 Удалено из избранного');
    }
    saveState();
    updateBadges();
}

// Оформление заказа
function checkout() {
    if (state.cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    const total = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Заказ на сумму ${total}₽. Подтвердить?`)) {
        if (tg) {
            tg.sendData(JSON.stringify({
                action: 'purchase',
                items: state.cart,
                total: total
            }));
        }
        
        state.cart = [];
        saveState();
        updateBadges();
        alert('🎉 Спасибо за покупку!');
        testNavigation('main');
    }
}

// Обновление бейджей
function updateBadges() {
    const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = state.wishlist.length;
    
    const cartBadge = document.getElementById('navCartBadge');
    const wishlistBadge = document.getElementById('navWishlistBadge');
    const menuWishlistBadge = document.getElementById('wishlistBadge');
    
    if (cartBadge) {
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'block' : 'none';
    }
    
    if (wishlistBadge) {
        wishlistBadge.textContent = wishlistCount;
    }
    
    if (menuWishlistBadge) {
        menuWishlistBadge.textContent = wishlistCount;
    }
}

// Сохранение состояния
function saveState() {
    try {
        const saveData = {
            cart: state.cart,
            wishlist: state.wishlist,
            points: state.points
        };
        localStorage.setItem('stylebox_state', JSON.stringify(saveData));
        console.log('Состояние сохранено');
    } catch (e) {
        console.error('Ошибка сохранения:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('stylebox_state');
        if (saved) {
            const data = JSON.parse(saved);
            state.cart = data.cart || [];
            state.wishlist = data.wishlist || [];
            state.points = data.points || 0;
            console.log('Состояние загружено');
        }
    } catch (e) {
        console.error('Ошибка загрузки:', e);
    }
}

// Простая настройка событий
function setupEventListeners() {
    // Меню
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            alert('Меню скоро будет готово!');
        });
    }
    
    // Тема
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            this.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
    }
}

// Показать ошибку
function showErrorMessage() {
    const content = document.getElementById('mainContent');
    if (content) {
        content.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: #666;">
                <div style="font-size: 60px; margin-bottom: 20px;">😕</div>
                <h3 style="margin-bottom: 20px;">Что-то пошло не так</h3>
                <p style="margin-bottom: 30px;">Попробуйте обновить страницу</p>
                <button onclick="location.reload()" style="background: #8A2BE2; color: white; border: none; padding: 12px 30px; border-radius: 8px; cursor: pointer;">
                    Обновить
                </button>
            </div>
        `;
    }
}
