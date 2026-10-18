// Показываем тост при загрузке страницы
$(document).ready(function() {
    $('.toast').toast('show');
});

document.addEventListener("DOMContentLoaded", function() {
    // Поиск прелоадера
    var preloader = document.querySelector('.preloader');
    if (!preloader) return;

    // Функция для удаления класса "loaded" у прелоадера
    function removeLoadedClass() {
        preloader.classList.remove('loaded');
    }

    // Обработчик события перед уходом со страницы
    window.addEventListener('beforeunload', function() {
        // Удаление класса "loaded" перед уходом со страницы
        removeLoadedClass();
    });

    // Обработчик события перед загрузкой новой страницы
    window.addEventListener('unload', function() {
        // Удаление класса "loaded" перед загрузкой новой страницы
        removeLoadedClass();
    });
});
