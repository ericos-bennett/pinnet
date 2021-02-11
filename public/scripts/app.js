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
    drop: function(event, ui) {
      $(this).removeClass('btn-success').addClass('btn-outline-primary');
      console.log('dropped');

      const pinId = ui.draggable[0].parentNode.id.slice(3);
      const topicId = event.target.id.slice(5);

      console.log('pinId', pinId);
      console.log('topicId', topicId);

      // ajax request - add to topics route
      $.ajax({
        url: `/pins/${pinId}/topic`,
        type: "POST",
        data: {topicId}
      }).always(function(data) {

      });



    }
  });

});
