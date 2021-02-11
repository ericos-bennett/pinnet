$(function() {

  // Like icon event handler, you can't currently unlike
  $(".like").on("click", function(e) {
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
    }).always(function(data) {
      $(likeIcon).removeClass("far");
      $(likeIcon).addClass("fas");
    });
  });

  // Make the pins cards draggable
  $('.mypins-cards').draggable({
    revert: true,
    zIndex: 100,
    opacity: 0.5,
    containment: $(".content")
  });

  // Make the topics droppable
  $(".topic-button").droppable({
    tolerance: "pointer",
    over: function() {
      $(this).removeClass('btn-outline-primary').addClass('btn-success');
    },
    out: function() {
      $(this).removeClass('btn-success').addClass('btn-outline-primary');
    },
    drop: function() {
      $(this).removeClass('btn-success').addClass('btn-outline-primary');
      console.log('dropped');
      // ajax request - add to topics route
    }
  });

});
