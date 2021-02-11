$(document).ready(function() {
  $('.rate-me input').change(function () {
    var $radio = $(this);
    $('.rate-me .selected').removeClass('selected');
    $radio.closest('label').addClass('selected');

    $.ajax({
      type: "POST",
      url: `/pins/${$(".rate-me").attr('id')}/rating`,
      data: {
        userId: $(".rate-me").attr('data-user'),
        rating: $(this).val()
      },
      success: () => {
        alert("Success");
      }
    });
  });
});
