var eventId = document.getElementById('eventid').value;

// LIKE
var isLiked = false;
var heartIcon = document.getElementById('heartIcon');

document.getElementById('likeButton').addEventListener('click', function() {
    var likeCountElement = document.getElementById('likeCount');
    var currentLikes = parseInt(likeCountElement.textContent);
    if (!isLiked) {
        heartIcon.style.color = 'red';
        likeCountElement.textContent = currentLikes + 1;
        isLiked = true;
    } else {
        heartIcon.style.color = 'currentColor';
        // Уменьшаем количество лайков на 1
        likeCountElement.textContent = currentLikes - 1;
        isLiked = false; // Сбрасываем флаг
    }
    likeButton(eventId);
});

function likeButton(eventId) {
    $.ajax({
        type: 'GET',
        url: '/like/' + eventId,
        success: function(response) {
            $('#result').text(response);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}

// BOOKMARK (кнопка есть только у авторизованных пользователей)
var isBookmarked = document.getElementById('bookmarkStatus');
var bookmarkIcon = document.getElementById('bookmarkIcon');
var bookmarkButtonElement = document.getElementById('bookmarkButton');
var BookmarkTitle = document.getElementById('BookmarkTitle');

if (bookmarkButtonElement) {
    if (isBookmarked.value === "True") {
        bookmarkIcon.style.color = 'orange';
        BookmarkTitle.textContent = "Событие добавлено в закладки";
    } else {
        bookmarkIcon.style.color = 'currentColor';
        BookmarkTitle.textContent = "";
    }

    bookmarkButtonElement.addEventListener('click', function() {
        if (isBookmarked.value === "False") {
            bookmarkIcon.style.color = 'orange';
            BookmarkTitle.textContent = "Событие добавлено в закладки";
            isBookmarked.value = "True";
        } else {
            bookmarkIcon.style.color = 'currentColor';
            BookmarkTitle.textContent = "";
            isBookmarked.value = "False";
        }
        bookmarkButton(eventId);
    });
}

function bookmarkButton(eventId) {
    $.ajax({
        type: 'GET',
        url: '/bookmark/' + eventId,
        success: function(response) {
            $('#result').text(response);
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
        }
    });
}
