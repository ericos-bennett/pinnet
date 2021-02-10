$(document).ready(function () {
  $(".display").on("click", function (e) {
    if ($(event.target).hasClass("close")) {
      $(this).find("div.pop-out").removeClass("show");
      $(this).find("div.pop-out").addClass("hide");
    } else {
      $(this).find("div.pop-out").removeClass("hide");
      $(this).find("div.pop-out").addClass("show");
    }
  });
});
