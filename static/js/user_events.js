document.querySelectorAll('.delete-event').forEach(function(button) {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        if (confirm('Вы уверены, что хотите удалить событие?')) {
            window.location.href = '/delete/' + this.dataset.eventId;
        }
    });
});
