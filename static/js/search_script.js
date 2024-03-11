var searchButton = document.getElementById('search-button');
  var searchInput = document.getElementById('search-input');
  var type = "{{ type }}";

  // Функция для обработки нажатия Enter в поле ввода
  function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
      // Получаем значение из поля ввода
      var inputValue = searchInput.value;
      // Формируем ссылку
      var hrefValue = '?search_query=' + inputValue;
      window.location.href = hrefValue;
    }
  }

  searchButton.addEventListener('click', function() {
    // Получаем значение из поля ввода
    var inputValue = searchInput.value;
    // Формируем ссылку
    var hrefValue = '?search_query=' + inputValue;
    // Устанавливаем значение атрибута href у ссылки
    this.setAttribute('href', hrefValue);
  });

  // Добавляем обработчик события для нажатия клавиши Enter в поле ввода
  searchInput.addEventListener('keypress', handleEnterKeyPress);