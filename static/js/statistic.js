var chartData = JSON.parse(document.getElementById('chart-data').dataset.chart);

var ctx = document.getElementById('myChart').getContext('2d');

var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Количество просмотров',
            data: chartData.views_count,
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            borderColor: 'rgba(255, 165, 0, 1)',
            borderWidth: 4,
            pointRadius: 0,
        },
        {
            label: 'Количество лайков',
            data: chartData.likes_count,
            backgroundColor: 'rgba(0, 255, 0, 0.2)', // измените цвет на зеленый или другой по вашему выбору
            borderColor: 'rgba(0, 255, 0, 1)', // измените цвет на зеленый или другой по вашему выбору
            borderWidth: 4,
            pointRadius: 0,
        },
        {
            label: 'Количество закладок',
            data: chartData.bookmarks_count,
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // измените цвет на синий или другой по вашему выбору
            borderColor: 'rgba(0, 0, 255, 1)', // измените цвет на синий или другой по вашему выбору
            borderWidth: 4,
            pointRadius: 0,
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество дней' // Переименовываем ось x
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество' // Переименовываем ось y
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            point: {
                radius: 0 // Скрываем точки при обычном отображении
            }
        },
        tooltips: {
            mode: 'point',
            intersect: false
        }
    }
});

var viewsCtx = document.getElementById('viewsChart').getContext('2d');
var likesCtx = document.getElementById('likesChart').getContext('2d');
var bookmarksCtx = document.getElementById('bookmarksChart').getContext('2d');

var viewsChart = new Chart(viewsCtx, {
    type: 'line',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Количество просмотров',
            data: chartData.views_count,
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            borderColor: 'rgba(255, 165, 0, 1)',
            borderWidth: 4,
            pointRadius: 0,
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество дней' // Переименовываем ось x
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество просмотров' // Переименовываем ось y
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            point: {
                radius: 0 // Скрываем точки при обычном отображении
            }
        },
        tooltips: {
            mode: 'nearest', // изменяем режим на "ближайший"
            intersect: false
        }
    }
});

var likesChart = new Chart(likesCtx, {
    type: 'line',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Количество лайков',
            data: chartData.likes_count,
            backgroundColor: 'rgba(0, 255, 0, 0.2)', // измените цвет на зеленый или другой по вашему выбору
            borderColor: 'rgba(0, 255, 0, 1)', // измените цвет на зеленый или другой по вашему выбору
            borderWidth: 4,
            pointRadius: 0,
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество дней' // Переименовываем ось x
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество лайков' // Переименовываем ось y
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            point: {
                radius: 0 // Скрываем точки при обычном отображении
            }
        },
        tooltips: {
            mode: 'nearest', // изменяем режим на "ближайший"
            intersect: false
        }
    }
});

var bookmarksChart = new Chart(bookmarksCtx, {
    type: 'line',
    data: {
        labels: chartData.labels,
        datasets: [{
            label: 'Количество закладок',
            data: chartData.bookmarks_count,
            backgroundColor: 'rgba(0, 0, 255, 0.2)', // измените цвет на синий или другой по вашему выбору
            borderColor: 'rgba(0, 0, 255, 1)', // измените цвет на синий или другой по вашему выбору
            borderWidth: 4,
            pointRadius: 0,
        }]
    },
    options: {
        scales: {
            xAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество дней' // Переименовываем ось x
                }
            }],
            yAxes: [{
                scaleLabel: {
                    display: true,
                    labelString: 'Количество закладок' // Переименовываем ось y
                },
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        elements: {
            point: {
                radius: 0 // Скрываем точки при обычном отображении
            }
        },
        tooltips: {
            mode: 'nearest', // изменяем режим на "ближайший"
            intersect: false
        }
    }
});
