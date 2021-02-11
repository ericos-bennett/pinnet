$(function () {
  // Like icon event handler, you can't currently unlike
  $(".like").on("click", function (e) {
    const likeIcon = this;
    const pin = this.parentElement.parentElement.parentElement;
    const pinId = pin.id.slice(3);
    console.log(pinId);

    $.ajax({
      url: `pins/${pinId}/like`,
      type: "POST",
      data: {},
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).always(function (data) {
      $(likeIcon).removeClass("far");
      $(likeIcon).addClass("fas");
    });
  });
});
