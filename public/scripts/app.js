$(function() {

  $('.like').on('click', function(e) {
    const pin = this.parentElement.parentElement;
    const pinId = pin.id.slice(3);
    console.log(pinId);

    $.ajax({
      url: `pins/${pinId}/like`,
      type: 'POST',
      data: {},
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (res) => {
        console.log(res)
        ;
      }
    });
  });

});
