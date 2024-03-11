ymaps.ready(init);

function init() {
    var moscowBounds = [
        [55.503749, 37.345276], // Юго-западный угол границ Москвы
        [56.009657, 37.967190]  // Северо-восточный угол границ Москвы
    ];

    var myMap = new ymaps.Map("map", {
        center: [55.7558, 37.6173],
        zoom: 10,
        restrictMapArea: moscowBounds // Устанавливаем ограничения на карту
    });

    var placemark = new ymaps.Placemark(myMap.getCenter(), {}, {
        draggable: false
    });

    // Добавляем метку на карту
    myMap.geoObjects.add(placemark);

    // Функция для обновления значений полей формы и адреса при клике на карту
    function updateFormFields(coords) {
        document.getElementById('latitude').value = coords[0];
        document.getElementById('longitude').value = coords[1];
        var geocoder = ymaps.geocode(coords);
        geocoder.then(
            function (res) {
                var firstGeoObject = res.geoObjects.get(0);
                var address = firstGeoObject.getAddressLine();
                document.getElementById('address').value = address;
            },
            function (err) {
                console.log('Ошибка геокодирования: ' + err.message);
            }
        );
    }

    // Обработчик события клика на карту
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');
        // Проверяем, находятся ли координаты в пределах Москвы
        if (coords[0] >= moscowBounds[0][0] && coords[0] <= moscowBounds[1][0] &&
            coords[1] >= moscowBounds[0][1] && coords[1] <= moscowBounds[1][1]) {
            placemark.geometry.setCoordinates(coords);
            updateFormFields(coords);
        } else {
            alert("Пожалуйста, выберите место в пределах Москвы.");
        }
    });
}
