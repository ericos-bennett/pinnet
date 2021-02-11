$(document).ready(function () {
  $(".edit").on("click", function () {
    $(".edit-form").addClass("show");
    $(".edit-form").removeClass("hide");
    console.log(this.innerText);
  });
  $(".form-close").on("click", function () {
    $(".edit-form").addClass("hide");
    $(".edit-form").removeClass("show");
  });

  // Close the popup when you click on the dim space outside the popul
  $(".edit-form").on("click", function () {
    $(".edit-form").addClass("hide");
    $(".edit-form").removeClass("show");
  });

  // Don't close the popup when you click within it
  $(".edit-content").on("click", function (event) {
    event.stopPropagation();
  });
});
