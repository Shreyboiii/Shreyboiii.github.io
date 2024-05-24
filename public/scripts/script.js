$(document).ready(function() {
    $('.scroll').on('click', function(event) {
        event.preventDefault();
        var targetId = $(this).data('target');
        var targetElement = $('#' + targetId);
        
        if (targetElement.length) {
            $('html, body').animate({
                scrollTop: targetElement.offset().top
            }, 'smooth');
        }
    });
    var projects = $('.details-container');
    var currentIndex = 0;

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

    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // JavaScript months are zero-based, so January is 0, February is 1, ..., December is 11
    var year = currentDate.getFullYear();

    // Format the date, month, and year as needed
    var formattedDate = day < 10 ? '0' + day : day; // Add leading zero if day is single digit
    var formattedMonth = month < 10 ? '0' + month : month; // Add leading zero if month is single digit

    // Set the formatted date, month, and year in the footer
    $('#current-date').text(formattedDate);
    $('#current-month').text(formattedMonth);
    $('#current-year').text(year);

});
