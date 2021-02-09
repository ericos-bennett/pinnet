$(document).ready(function () {
  $(".close").on("click", function () {
    $("#display").addClass("hide");
    $("#display").removeClass("show");
    console.log("clicked");
  });

  $(".explore article").on("click", function () {
    $("#display").addClass("show");
    $("#display").removeClass("hide");
  });
});
