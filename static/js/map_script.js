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
    new ymaps.control.ListBoxItem({ data: { content: 'Спорт', type: 'sport'} }),
    new ymaps.control.ListBoxItem({ data: { content: 'Творчество и искусство', type: 'art' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Музыка', type: 'music' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Культура и образование', type: 'culture_study' } }),
    new ymaps.control.ListBoxItem({ data: { content: 'Развлечения', type: 'entertainments' } })
  ];
  listBoxItems.forEach(item => item.state.set('selected', true));
  var filterControl = new ymaps.control.ListBox({
    data: {
      content: 'Фильтр',
    },
    items: listBoxItems,
    options: {
      itemSelectOnClick: true,
      iconContent: '✓'
    }
  });

  filterControl.events.add('select', function (event) {
    handleFilterChange(event);
  });

  filterControl.events.add('deselect', function (event) {
    handleFilterChange(event);
  });

  function handleFilterChange(event) {
    var selectedItem = event.get('target');
    if (selectedItem && selectedItem.data.get('content')) {
      var selectedType = selectedItem.data.get('type').toLowerCase();
      filterState[selectedType] = !filterState[selectedType];
      showFilteredPoints();
    }
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
              <div class="tag">${getTag(item.type)}</div>
<!--              <div><img src="static/images/logo.png" width="150px" height="150px"></div>-->
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
      preset: 'islands#invertedBlueClusterIcons',
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
  map.geoObjects.remove(clusterer);

  var filteredGeoObjects = myGeoObjects.filter(function (geoObject) {
    var type = geoObject.properties.get('type').toLowerCase();
    return filterState[type];
  });

  clusterer = new ymaps.Clusterer({
    preset: 'islands#invertedBlueClusterIcons',
    clusterBalloonContentLayoutWidth: 800,
    clusterBalloonLeftColumnWidth: 160
  });

  clusterer.add(filteredGeoObjects);
  map.geoObjects.add(clusterer);
}


function getIconPreset(type) {
  switch (type.toLowerCase()) {
    case 'sport':
      return 'islands#blueSportIcon';
    case 'art':
      return 'islands#blueTheaterIcon';
    case 'entertainments':
      return 'islands#blueBarIcon';
    case 'music':
      return 'islands#blueStarIcon';
    case 'culture_study':
      return 'islands#blueBookIcon';
    default:
      return 'islands#grayIcon';
  }
}

function getTag(type) {
  switch (type) {
    case 'art':
      return 'Творческое мероприятие';
    case 'sport':
      return 'Спортивное мероприятие';
    case 'entertainments':
      return 'Развлекательное мероприятие';
    case 'music':
      return 'Музыкальное мероприятие';
    case 'culture_study':
      return 'Культура и образование';
    default:
      return 'Другое';
  }
}

ymaps.ready(init);
