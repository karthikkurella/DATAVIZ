// $('Layout.html').ready(function() {
//     $('nav a').on('click', function(e) {
//       e.preventDefault();
//       var target = $(this).attr('href');
//       $('html, body').animate({
//         scrollTop: $(target).offset().top
//       }, 1000);
//     });
//   });  

  $('nav a').click(function(){
    $('html, body').animate({
      scrollTop: $($(this).attr('href')).offset().top
    }, 500); // 500ms animation duration
    return false;
  });  