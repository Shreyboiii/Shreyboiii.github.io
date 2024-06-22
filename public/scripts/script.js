$(document).ready(function() {
    $('.scroll').on('click', function(event) {
      event.preventDefault();
      let targetId = $(this).data('target');
      let targetElement = $('#' + targetId);
      let offset = 10 * $(window).height() / 100; // Calculate 10vh

      if (targetElement.length) {
          $('html, body').animate({
              scrollTop: targetElement.offset().top - offset
          }, 'smooth');
        }
    });
    let projects = $('.details-container');
    let currentIndex = 0;

    // Hide all projects initially except the first one
    projects.hide();
    projects.eq(currentIndex).show();

    // Show next project
    $('#right-button').click(function() {
      projects.eq(currentIndex).hide();
      currentIndex = (currentIndex + 1) % projects.length;
      projects.eq(currentIndex).show();
    });

    // Show previous project
    $('#left-button').click(function() {
      projects.eq(currentIndex).hide();
      currentIndex = (currentIndex - 1 + projects.length) % projects.length;
      projects.eq(currentIndex).show();
    });

    // Prevent buttons from disappearing
    $('.btn-nav').mousedown(function(event) {
      event.preventDefault();
    });

    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1; // JavaScript months are zero-based, so January is 0, February is 1, ..., December is 11
    let year = currentDate.getFullYear();

    // Format the date, month, and year as needed
    let formattedDate = day < 10 ? '0' + day : day; // Add leading zero if day is single digit
    let formattedMonth = month < 10 ? '0' + month : month; // Add leading zero if month is single digit

    // Set the formatted date, month, and year in the footer
    $('#current-date').text(formattedDate);
    $('#current-month').text(formattedMonth);
    $('#current-year').text(year);

});

function showAlert() {
  alert("This feature is currently unavailable. I am making changes / updating it at the moment.");
}

