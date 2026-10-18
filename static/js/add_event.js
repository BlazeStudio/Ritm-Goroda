// Тип даты (showFields / clearFields из datetime_script.js)
document.getElementById("date_type").addEventListener('change', function() {
    showFields();
    clearFields();
});

// Цена
function validateInput(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

function showFields2() {
    var priceType = document.getElementById("price_type").value;
    if (priceType === "price_free") {
        document.getElementById("price_paid").style.display = "none";
        document.getElementById("rub").style.display = "none";
    } else if (priceType === "price_paid") {
        document.getElementById("price_paid").style.display = "block";
        document.getElementById("rub").style.display = "block";
    }
}

function clearFields2() {
    document.getElementById("price_paid").value = "";
}

document.getElementById("price_type").addEventListener('change', function() {
    showFields2();
    clearFields2();
});

document.getElementById("price_paid").addEventListener('input', function() {
    validateInput(this);
});

$('textarea').keypress(function(event) {
    if (event.which == 13) {
        event.stopPropagation();
    }
});

// Счётчики символов
function countCharacters(inputId, countId, maxLength) {
    var input = document.getElementById(inputId);
    var count = document.getElementById(countId);

    input.addEventListener('input', function() {
        var remaining = maxLength - input.value.length;
        count.textContent = 'Осталось символов: ' + remaining;
    });
}

countCharacters('title', 'title-count', 100);

countCharacters('description', 'description-count', 250);

countCharacters('description2', 'description2-count', 1400);

// Функция для форматирования номера телефона в реальном времени
function formatPhoneNumber(input) {
    // Убираем все нецифровые символы из введенного значения
    const cleaned = ('' + input.value).replace(/\D/g, '');
    // Форматируем номер телефона как +(код страны) (код региона) номер
    let formatted = '';
    if (cleaned.length >= 1) {
        formatted += '+' + cleaned[0];
    }
    if (cleaned.length > 1) {
        formatted += ' (' + cleaned.substring(1, 4);
    }
    if (cleaned.length > 4) {
        formatted += ') ' + cleaned.substring(4, 7);
    }
    if (cleaned.length > 7) {
        formatted += '-' + cleaned.substring(7, 11);
    }
    // Выводим отформатированный номер телефона обратно в поле ввода
    input.value = formatted;
}

// Получаем поле ввода номера телефона
const phoneInput = document.getElementById('phone');

// Слушаем событие ввода в поле номера телефона
phoneInput.addEventListener('input', function() {
    // Форматируем введенный номер телефона
    formatPhoneNumber(this);
});
