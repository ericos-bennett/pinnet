$(document).ready(function () {
    $('.card-sm-link h2').click(function(){
      $('#screen, #modal').show();
    });

    $('.close').click(function(){
      $('#screen, #modal').hide();
    });
});
