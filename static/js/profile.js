document.getElementById('toggleFormButton').addEventListener('click', function() {
    var formContainer = document.getElementById('editFormContainer');
    var formContainer2 = document.getElementById('editFormContainer2');
    var old_password = document.getElementById('old_password');
    var new_password = document.getElementById('new_password');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        old_password.value = "";
        new_password.value = "";
        formContainer2.style.display = 'none';
    } else {
        formContainer.style.display = 'none';
    }
});

document.getElementById('toggleFormButton2').addEventListener('click', function() {
    var formContainer = document.getElementById('editFormContainer2');
    var formContainer2 = document.getElementById('editFormContainer');
    var password = document.getElementById('password');
    if (formContainer.style.display === 'none' || formContainer.style.display === '') {
        formContainer.style.display = 'block';
        formContainer2.style.display = 'none';
        password.value = "";
    } else {
        formContainer.style.display = 'none';
    }
});
