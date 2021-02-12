$(function () {
  // Open the popup when you click on a pin
  $(".display-header").on("click", function () {
    const pin = this.parentElement;
    const pinId = pin.id.slice(3);
    $.ajax({
      url: `pins/${pinId}/comments`,
      type: "GET",
      data: {},
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).then((data) => {
      for (const comment of data) {
        $(".comment-content").append(
          `<p class ='child-comment'>${comment.comment_body}</p>`
        );
      }
    });

    $(pin).find("div.pop-out").removeClass("hide");
    $(pin).find("div.pop-out").addClass("show");
  });

  // Close the popup when you click on the 'x' icon
  $(".close").on("click", function () {
    const pin = this.parentElement.parentElement.parentElement.parentElement;
    $(pin).find("div.pop-out").removeClass("show");
    $(pin).find("div.pop-out").addClass("hide");
    $(".comment-area").toggleClass("collapse show");
    $(".child-comment").remove();
  });

  // Close the popup when you click on the dim space outside the popul
  $(".pop-out").on("click", function () {
    const pin = this.parentElement;
    $(pin).find("div.pop-out").removeClass("show");
    $(pin).find("div.pop-out").addClass("hide");
    $(".comment-area").toggleClass("collapse show");
    $(".child-comment").remove();
  });

  // Don't close the popup when you click within it
  $(".pop-content").on("click", function (e) {
    e.stopPropagation();
  });
});
