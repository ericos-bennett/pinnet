$(document).ready(function () {
  $(".comments").on("click", function () {
    $(".comment-area").toggleClass("collapse show");
  });

  $(".comment-form").on("submit", function (event) {
    event.preventDefault();
    const pin = this;
    const pinId = pin.id;
    const newComment = $("#comment-text");
    $.ajax({
      url: `pins/${pinId}/comments`,
      type: "POST",
      data: newComment,
      contentType: "application/json; charset=utf-8",
    })
      .then((data) => {
        $(".comment-content").append(
          `<p class ='child-comment'>${data[0].comment_body}</p>`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  });
});
