//-------------------------------------
//
//  Scroll to internal link
//
//  Usage: 
//  
//  Add CSS Class "scroll-link"
//  (case sensitive) to the HTML element
//  you want to animate.
//
//-----------------------------------
module.exports =
  (function () {
    const ANIMATE_TIME = 600;

    $(".scroll-link").on('click', function (event) {
      var thisHref = $(event.target).attr('href');
      if (typeof thisHref !== "undefined") { //  Check if it's in an anchor tag or with href
        if (thisHref[0] === '#') { //  Check if it's internal link
          event.preventDefault();

          //  Store the internal link address
          let thisHash = this.hash;

          $('html, body').animate({
            scrollTop: $(thisHash).offset().top
          }, ANIMATE_TIME, () => {
            //  Jump to the address
            window.location.hash = thisHash;
          });
        }
      }
    });
  })();