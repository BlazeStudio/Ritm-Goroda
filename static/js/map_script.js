ymaps.ready(init);

var map;
var clusterer;
var myGeoObjects;
var filterState;

function init() {
  map = new ymaps.Map("map-test", {
    center: [55.753000452722546, 37.62084863478474],
    zoom: 15,
  });

  filterState = {
    sport: true,
    art: true,
    music: true,
    culture_study: true,
    entertainments: true
  };

  var listBoxItems = [
    new ymaps.control.ListBoxItem({ data: { content: 'Спорт' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Творчество и искусство' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Музыка' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Культура и образование' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Развлечения' } })
  ];

  var filterControl = new ymaps.control.ListBox({
    data: {
      content: 'Фильтр'
    },
    items: listBoxItems,
    options: {
      itemSelectOnClick: false
    }
  });

  filterControl.events.add('select', function (event) {
    var item = event.get('target');
    if (item && item.data.get('content')) {
      var eventType = item.data.get('content');
      toggleFilter(eventType);
    }
  });

  function toggleFilter(eventType) {
    filterState[eventType.toLowerCase()] = !filterState[eventType.toLowerCase()];
    showFilteredPoints();
  }

  $.getJSON('static/js/data2.json', function(data) {
    myGeoObjects = data.features.map(item => {
      return new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: item.coordinates.split(',')
        },
        properties: {
          clusterCaption: 'Описание в кластере',
          balloonContent: [`
     <div class="balloon">
     <div class="balloon_title"><h4><b><a href="/event/${ item.id }" target="_blank">${item.title}</a></b></h4></div>
        ${item.type === "art" ? 
            `<div class="tag">Творческое мероприятие</div>` : 
            item.type === "sport" ?
            `<div class="tag">Спортивное мероприятие</div>` :
            item.type === "entertainments" ?
            `<div class="tag">Развлекательное мероприятие</div>` :
            item.type === "music" ?
            `<div class="tag">Музыкальное мероприятие</div>` :
            `<div class="tag">Культура и образование</div>`
        }
     <div><img src="static/images/logo.png" width="150px" height="150px"></div>
     <div class="balloon_adress">${item.tiny_description}</div>
     <div class="links">
     <a href="${item.link}" target="_blank">${item.link}</a>
</div>
</div>
     `].join(''),
          type: item.type
        }
      }, {
        preset: getIconPreset(item.type),
      });
    });

    clusterer = new ymaps.Clusterer({
      preset: 'islands#BlueClusterIcons',
      clusterBalloonContentLayoutWidth: 800,
      clusterBalloonLeftColumnWidth: 160
    });

    clusterer.add(myGeoObjects);
    map.geoObjects.add(clusterer);
    map.setBounds(clusterer.getBounds(), {
      checkZoomRange: true
    });
  });

  map.controls.add(filterControl, { float: 'left' });
  map.controls.remove('searchControl');
  map.controls.remove('zoomControl');
  map.controls.remove('rulerControl');
}

function showFilteredPoints() {
  var filteredGeoObjects = myGeoObjects.filter(function (geoObject) {
    var type = geoObject.properties.get('type');
    return filterState[type];
  });

  var filteredClusterer = new ymaps.Clusterer({
    preset: 'islands#BlueClusterIcons',
    clusterBalloonContentLayoutWidth: 800,
    clusterBalloonLeftColumnWidth: 160
  });

  filteredClusterer.add(filteredGeoObjects);
  map.geoObjects.remove(clusterer);
  map.geoObjects.add(filteredClusterer);

  clusterer = filteredClusterer;
}

function getIconPreset(type) {
  switch (type) {
    case 'sport':
      return 'islands#redIcon';
    case 'art':
      return 'islands#greenIcon';
    case 'entertainments':
      return 'islands#orangeIcon';
    case 'music':
      return 'islands#violetIcon';
    case 'culture_study':
      return 'islands#darkBlueIcon';
    default:
      return 'islands#grayIcon';
  }
}
