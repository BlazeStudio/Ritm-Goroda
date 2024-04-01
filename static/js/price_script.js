function limitInputValue(inputId) {
        var inputValue = parseInt(document.getElementById(inputId).value);
        if (isNaN(inputValue)) {
            inputValue = 0;
        } else if (inputValue < 0) { // Если значение меньше 0
            inputValue = 0; // Устанавливаем значение в 0
        } else if (inputValue > 10000) { // Если значение больше 10000
            inputValue = 10000; // Устанавливаем значение в 10000
        }
        document.getElementById(inputId).value = inputValue; // Устанавливаем скорректированное значение обратно в поле ввода
    }

    // Вызываем функцию при изменении значения в полях ввода
    document.getElementById('min-input').addEventListener('input', function() {
        limitInputValue('min-input');
        checkMinMaxRanges();
    });

    document.getElementById('max-input').addEventListener('input', function() {
        limitInputValue('max-input');
        checkMinMaxRanges();
    });

    const rangeValue = document.querySelector(".slider-container .price-slider");
    const rangeInputs = document.querySelectorAll(".range-input input");

    let priceGap = 500;

    const priceInputs = document.querySelectorAll(".price-input input");
    priceInputs.forEach(input => {
        input.addEventListener("input", () => {
            updatePriceSlider();
        });
    });

    // Add event listeners to range input elements
    rangeInputs.forEach(input => {
        input.addEventListener("input", () => {
            updatePriceInputs();
        });
    });

    function updatePriceSlider() {
        let minPrice = parseInt(priceInputs[0].value);
        let maxPrice = parseInt(priceInputs[1].value);

        let minRange = parseInt(rangeInputs[0].min);
        let maxRange = parseInt(rangeInputs[1].max);

        if (minPrice > maxPrice) {
            minPrice = maxPrice;
            priceInputs[0].value = minPrice;
        }

        let minPos = ((minPrice - minRange) / (maxRange - minRange)) * 100;
        let maxPos = ((maxRange - maxPrice) / (maxRange - minRange)) * 100;

        rangeValue.style.left = `${minPos}%`;
        rangeValue.style.right = `${maxPos}%`;

        // Автоматическое обновление range input значения
        rangeInputs[0].value = minPrice;
        rangeInputs[1].value = maxPrice;
    }

    function updatePriceInputs() {
        let minRange = parseInt(rangeInputs[0].value);
        let maxRange = parseInt(rangeInputs[1].value);

        if (minRange > maxRange) {
            maxRange = minRange;
            rangeInputs[1].value = maxRange;
        }

        priceInputs[0].value = minRange;
        priceInputs[1].value = maxRange;

        updatePriceSlider();
    }

    document.addEventListener("DOMContentLoaded", function() {
        // Получите текущие значения min_price и max_price
        let minPriceValue = parseInt(document.querySelector(".min-input").value);
        let maxPriceValue = parseInt(document.querySelector(".max-input").value);

        // Получите максимальное значение из диапазона
        let maxRangeValue = parseInt(document.querySelector(".min-range").max);

        // Установите положение slide-container
        let rangevalue = document.querySelector(".slider-container .price-slider");
        rangevalue.style.left = `${(minPriceValue / maxRangeValue) * 100}%`;
        rangevalue.style.right = `${100 - (maxPriceValue / maxRangeValue) * 100}%`;
    });

    function checkMinMaxRanges() {
        let minPrice = parseInt(priceInputs[0].value);
        let maxPrice = parseInt(priceInputs[1].value);

        if (minPrice > maxPrice) {
            priceInputs[0].value = maxPrice;
        }
    }