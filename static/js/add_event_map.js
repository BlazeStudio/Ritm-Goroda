ymaps.ready(init);

function init() {
    var eventElement = document.getElementById('map-atrib');
    coordinates = eventElement.getAttribute('data-coordinates')
    var moscowBounds = [
        [55.503749, 37.345276],
        [56.009657, 37.967190]
    ];

    var myMap = new ymaps.Map("map", {
        center: coordinates.split(','),
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

    function updateMarkerAndAddress() {
        var latitude = parseFloat(document.getElementById('latitude').value);
        var longitude = parseFloat(document.getElementById('longitude').value);
        var coords = [latitude, longitude];

        if (isNaN(latitude) || isNaN(longitude)) {
            alert('Пожалуйста, введите корректные координаты.');
            return;
        }

        // Проверяем, находятся ли координаты в пределах Москвы
        if (latitude >= moscowBounds[0][0] && latitude <= moscowBounds[1][0] &&
            longitude >= moscowBounds[0][1] && longitude <= moscowBounds[1][1]) {
            placemark.geometry.setCoordinates(coords);
            updateFormFields(coords);
            myMap.setCenter(coords);
        } else {
            alert("Пожалуйста, выберите место в пределах Москвы.");
        }
    }

    document.getElementById('latitude').addEventListener('input', updateMarkerAndAddress);
    document.getElementById('longitude').addEventListener('input', updateMarkerAndAddress);
}

