$(document).ready(() => {

  // Dummy test AJAX request
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((res) => {
    for (let user of res.users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });

});
