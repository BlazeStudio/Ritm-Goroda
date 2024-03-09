ymaps.ready(init);

function init() {
    var eventElement = document.getElementById('map-atrib');
    var event = {
        id: eventElement.getAttribute('data-id'),
        title: eventElement.getAttribute('data-title'),
        type: eventElement.getAttribute('data-type'),
        image: eventElement.getAttribute('data-image'),
        tiny_description: eventElement.getAttribute('data-tiny-description'),
        description: eventElement.getAttribute('data-description'),
        link: eventElement.getAttribute('data-link'),
        address: eventElement.getAttribute('data-address'),
        coordinates: eventElement.getAttribute('data-coordinates'),
        views: eventElement.getAttribute('data-views'),
        datetime: eventElement.getAttribute('data-datetime')
    };

    var map = new ymaps.Map("event-map", {
        center: event.coordinates.split(','),
        zoom: 13,
    });

    var myGeoObject = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: event.coordinates.split(','),
        },
        properties: {
            clusterCaption: 'Описание в кластере',
            balloonContent: `
                <div class="balloon">
                    <div class="balloon_title"><b><a href="/event/${event.id}" target="_blank">${event.title}</a></b></div>
                    ${event.type === "art" ? `<div class="tag">Творческое мероприятие</div>` :
                        event.type === "sport" ? `<div class="tag">Спортивное мероприятие</div>` :
                        event.type === "entertainments" ? `<div class="tag">Развлекательное мероприятие</div>` :
                        event.type === "music" ? `<div class="tag">Музыкальное мероприятие</div>` :
                        `<div class="tag">Культура и образование</div>`
                    }
                    <div class="balloon_adress">${event.tiny_description}</div>
                    <div class="links">
                        <a href="${event.link}" target="_blank">${event.link}</a>
                    </div>
                </div>
            `,
            address: '' // Здесь будет адрес после геокодирования
        }
    }, {
        preset: "islands#blueIcon",
    });
    map.geoObjects.add(myGeoObject);

    map.controls.remove('searchControl');
    map.controls.remove('zoomControl');
    map.controls.remove('rulerControl'); // удаляем контрол правил

    // Создание объекта геокодера
    var geocoder = ymaps.geocode(event.coordinates);
    // Запрос на получение адреса по координатам метки
    geocoder.then(
        function (res) {
            // Получение первого найденного объекта геокодирования
            var firstGeoObject = res.geoObjects.get(0);

            // Получение адреса и добавление его в свойства метки
            var address = firstGeoObject.getAddressLine();
            myGeoObject.properties.set('address', address);

            // Обновление содержимого балуна с учетом адреса
            myGeoObject.properties.set('balloonContent', `
                <div class="balloon">
                    <div class="balloon_title"><b style="font-size: 15px">${event.title}</b></div>
                    ${event.type === "art" ? `<div class="tag">Творческое мероприятие</div>` :
                        event.type === "sport" ? `<div class="tag">Спортивное мероприятие</div>` :
                        event.type === "entertainments" ? `<div class="tag">Развлекательное мероприятие</div>` :
                        event.type === "music" ? `<div class="tag">Музыкальное мероприятие</div>` :
                        `<div class="tag">Культура и образование</div>`
                    }
                    <div class="balloon_adress"><i>${address}</i></div>
                    <div class="links">
                        <a href="${event.link}" target="_blank">${event.link}</a>
                    </div>
                </div>
            `);
        },
        function (err) {
            console.log('Ошибка геокодирования: ' + err.message);
        }
    );
}
