$(document).ready(function(){
  $('.modal').modal();
  $('.user-row').click(function(){
    $('#' + $(this).data('href')).modal('open');
  });
});
