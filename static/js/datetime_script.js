function showFields() {
  var selectedValue = document.getElementById("date_type").value;
  var datetimeFields = document.getElementById("datetime_fields");
  var dateRangeFields = document.getElementById("date_range_fields");
  var datetimeRangeFields = document.getElementById("datetime_range_fields");
  var dailyFields = document.getElementById("daily_fields");
  var noDateFields = document.getElementById("no_date_fields");

  // Скрыть все поля перед отображением новых
  datetimeFields.style.display = "none";
  dateRangeFields.style.display = "none";
  datetimeRangeFields.style.display = "none";
  dailyFields.style.display = "none";
  noDateFields.style.display = "none";

  // Удалить атрибут required у всех полей
  var allFields = document.querySelectorAll("input[type='datetime-local'], input[type='date'], input[type='time']");
  allFields.forEach(function(field) {
    field.removeAttribute("required");
  });

  // Отображаем соответствующие поля в зависимости от выбранного вида даты
  if (selectedValue === "datetime") {
    datetimeFields.style.display = "block";
    document.getElementById("datetime").setAttribute("required", "");
  } else if (selectedValue === "date_range") {
    dateRangeFields.style.display = "block";
    document.getElementById("date_range_from").setAttribute("required", "");
    document.getElementById("date_range_to").setAttribute("required", "");
  } else if (selectedValue === "datetime_range") {
    datetimeRangeFields.style.display = "block";
    document.getElementById("datetime_from_date").setAttribute("required", "");
    document.getElementById("datetime_from_time").setAttribute("required", "");
    document.getElementById("datetime_to_date").setAttribute("required", "");
    document.getElementById("datetime_to_time").setAttribute("required", "");
  } else if (selectedValue === "daily") {
    dailyFields.style.display = "block";
  } else if (selectedValue === "no_date") {
    noDateFields.style.display = "block";
  }
}

function clearFields() {
  document.getElementById("datetime").value = "";
  document.getElementById("date_range_from").value = "";
  document.getElementById("date_range_to").value = "";
  document.getElementById("datetime_from_date").value = "";
  document.getElementById("datetime_from_time").value = "";
  document.getElementById("datetime_to_date").value = "";
  document.getElementById("datetime_to_time").value = "";
}

showFields();