$(document).ready(function() {
  $('.rate-me input').change(function () {
    var $radio = $(this);

    $('.rate-me .selected').removeClass('selected');
    $radio.closest('label').addClass('selected');

    $.ajax({
      type: "POST",
      url: `/pins/${$(this).parent().parent()[0].getAttribute('data-id')}/rating`,
      data: {
        pin_id: $(this).parent().parent()[0].getAttribute('data-id'),
        rating: $(this).val()
      },
      success: function(data) {
        console.log("Success");
      }
    });
  });
});
