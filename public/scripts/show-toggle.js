$(document).ready(function () {
  $(".close").on("click", function () {
    $("#display").addClass("hide");
    $("#display").removeClass("show");
    console.log("clicked");
  });
});
