var searchButton = document.getElementById('search-button');
var searchInput = document.getElementById('search-input');
var priceSubmit = document.getElementById('price_submit');
var maxInput = document.getElementById('max-input');
var minInput = document.getElementById('min-input');
  var type = "{{ type }}";

  // Функция для обработки нажатия Enter в поле ввода
  function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      // Получаем значение из поля ввода
      var inputValue = searchInput.value;
      var maxPrice = maxInput.value;
      var minPrice = minInput.value;
      // Формируем ссылку
var hrefValue = '?search_query=' + inputValue + '&max_price=' + maxPrice + '&min_price=' + minPrice;
      window.location.href = hrefValue
    }
  }

  searchButton.addEventListener('click', function() {
    var inputValue = searchInput.value;
    var maxPrice = maxInput.value;
    var minPrice = minInput.value;

var hrefValue = '?search_query=' + inputValue + '&max_price=' + maxPrice + '&min_price=' + minPrice;
    // Устанавливаем значение атрибута href у ссылки
    this.setAttribute('href', hrefValue);
  });

  priceSubmit.addEventListener('click', function() {
    var inputValue = searchInput.value;
    var maxPrice = maxInput.value;
    var minPrice = minInput.value;

var hrefValue = '?search_query=' + inputValue + '&max_price=' + maxPrice + '&min_price=' + minPrice;
    // Устанавливаем значение атрибута href у ссылки
    this.setAttribute('href', hrefValue);
  });

  // Добавляем обработчик события для нажатия клавиши Enter в поле ввода
  searchInput.addEventListener('keypress', handleEnterKeyPress);