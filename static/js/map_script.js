ymaps.ready(init);

function init() {
  var map = new ymaps.Map("map-test", {
    center: [55.753000452722546,37.62084863478474],
    zoom: 15,
  });
  $.getJSON('static/js/data2.json', function(data) {
    // Создадим объект точек из data.Points
    var myGeoObjects = data.features.map(item => {
      return new ymaps.GeoObject({
        geometry: {
          type: "Point",
          // Переведем строку с координатами в массив
          coordinates: (item.coordinates).split(',')
        },
        properties: {
          clusterCaption: 'Описание в кластере',
          balloonContent: [`
     <div class="balloon">
     <div class="balloon_title"><h4><b><a href="">${item.title}</a></b></h4></div>
     <div class="tag">Спортивное мероприятие</div>
     <div><img src="static/images/logo.png" width="150px" height="150px"></div>
     <div class="balloon_adress">${item.description}</div>
     <div class="links">
     <a href="${item.link}" target="_blank">${item.link}</a>
</div>
</div>
     `].join('')
        }
      }, {
        preset: "islands#blueIcon",
      });
    })
    // Создадим кластеризатор после получения и добавления точек
    var clusterer = new ymaps.Clusterer({
      preset: 'islands#BlueClusterIcons',
      clusterBalloonContentLayoutWidth: 800,
      clusterBalloonLeftColumnWidth: 160
    });
    clusterer.add(myGeoObjects);
    map.geoObjects.add(clusterer);
    map.setBounds(clusterer.getBounds(), {
      checkZoomRange: true
    });
  })

  map.controls.remove('searchControl'); // удаляем поиск
  // map.controls.remove('trafficControl'); // удаляем контроль трафика
  // map.controls.remove('typeSelector'); // удаляем тип
  // map.controls.remove('fullscreenControl'); // удаляем кнопку перехода в полноэкранный режим
  map.controls.remove('zoomControl'); // удаляем контрол зуммирования
  map.controls.remove('rulerControl'); // удаляем контрол правил



}