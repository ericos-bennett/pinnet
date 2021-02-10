$(document).ready(function () {
  $(".create-pin").on("click", function () {
    $(".create-form").addClass("show");
    $(".create-form").removeClass("hide");
  });

  $(".form-close").on("click", function () {
    $(".create-form").addClass("hide");
    $(".create-form").removeClass("show");
  });

  // Close the popup when you click on the dim space outside the popul
  $(".create-form").on("click", function () {
    $(".create-form").addClass("hide");
    $(".create-form").removeClass("show");
  });

  // Don't close the popup when you click within it
  $(".create-content").on("click", function (event) {
    event.stopPropagation();
  });
});
