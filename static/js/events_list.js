// Подчёркиваем активный фильтр
var currentPage = window.location.href.replace(/^.*\/\/[^\/]+/, '');
currentPage = decodeURIComponent(currentPage);
var links = document.querySelectorAll(".dropdown-content a");
links.forEach(function(link) {
    if (link.getAttribute("href") === currentPage) {
        link.style.textDecoration = "underline";
        link.style.textDecorationColor = "#7e868b";
    }
});
