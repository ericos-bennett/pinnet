$(document).ready(function () {
  var maxHeight = 60;

$('.card-sm-info p').each(function () {
  var $ellipsisText = $(this);

  while ($ellipsisText.outerHeight(true) > maxHeight) {
    $ellipsisText.text(function(index, text) {
      return text.replace(/\W*\s(\S)*$/, '...');
    });
  }
});
});
