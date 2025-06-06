// Проверка статуса авторизации
function checkAuthStatus() {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    const profileBtn = document.getElementById('profileBtn');

    if (isAuthenticated) {
        profileBtn.href = "profile.html";
        profileBtn.title = "Перейти в личный кабинет";
    } else {
        profileBtn.href = "auth.html";
        profileBtn.title = "Авторизация / Регистрация";
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    checkAuthStatus();

    // Обработчик клика для аватара
    document.querySelector('.user-avatar-btn').addEventListener('click', () => {
        checkAuthStatus(); // Обновляем статус перед переходом
        window.location.href = profileBtn.href;
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    checkAuthStatus();

    // Обработчик клика для аватара
    document.querySelector('.user-avatar-btn').addEventListener('click', () => {
        checkAuthStatus(); // Обновляем статус перед переходом
        window.location.href = profileBtn.href;
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
    checkAuthStatus();

    // Инициализация слайдера
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.form');

    if (tabs.length > 0 && forms.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                forms.forEach(f => f.classList.remove('active'));

                tab.classList.add('active');
                const target = tab.dataset.target;
                document.querySelector(target).classList.add('active');
            });
        });
    }

    // Слайдер
    if ($('.content-slider').length > 0) {
        let bannerTimer = setInterval(bannerSwitcher, 5000);

        $('nav .controls label').on('click', function (e) {
            e.preventDefault();
            clearInterval(bannerTimer);
            bannerTimer = setInterval(bannerSwitcher, 5000);
        });
    }
});

// Функция переключения слайдера
$(document).ready(function() {
    const $slider = $('.simple-slider');
    const $images = $slider.find('img');
    const imageCount = $images.length; // Получаем количество изображений
    let currentIndex = 0; // Индекс текущего изображения

    // Функция для показа конкретного слайда
    function showSlide(index) {
        // Убеждаемся, что индекс находится в пределах допустимых значений
        if (index < 0) {
            currentIndex = imageCount - 1; // Переход с первого на последний
        } else if (index >= imageCount) {
            currentIndex = 0; // Переход с последнего на первый
        } else {
            currentIndex = index;
        }

        const margin = currentIndex * -100; // Рассчитываем сдвиг
        $slider.css('margin-left', margin + '%'); // Применяем сдвиг
    }

    // Обработчик клика по кнопке "Следующий"
    $('.slider-button.next').click(function() {
        showSlide(currentIndex + 1);
    });

    // Обработчик клика по кнопке "Предыдущий"
    $('.slider-button.prev').click(function() {
        showSlide(currentIndex - 1);
    });

     const autoSlide = setInterval(function() {
         showSlide(currentIndex + 1);
     }, 5000);

     $('.simple-slider-container').hover(
         function() { clearInterval(autoSlide); },
         function() { autoSlide = setInterval(function() { showSlide(currentIndex + 1); }, 5000); }
     );
});

// Сохранение статуса авторизации
function setAuthStatus(status) {
    localStorage.setItem('auth', status ? 'true' : 'false');
    checkAuthStatus();
}

// Пример авторизации
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.btn-primary')?.addEventListener('click', () => {
        setAuthStatus(true);
    });
});

new Swiper('.swiper', {
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

