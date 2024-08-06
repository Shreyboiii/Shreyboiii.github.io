$(document).ready(function() {

  //smooth scroll
    $('.scroll').on('click', function(event) {
      event.preventDefault();
      let targetId = $(this).data('target');
      let targetElement = $('#' + targetId);
      $('html, body').animate({
          scrollTop: targetElement.offset().top
      }, 'smooth');
    });

    /*

    Displaying Projects

    */

    const projects = ['web_crawler.html', 'riscv_emu.html', 'pong_game.html', 'pipeline.html', 'port_website2.html'];
    let currentIndex = 0;

    const loadProjects = async () => {
      const container = document.getElementById('projects-container');
      for (const project of projects) {
        const response = await fetch(`./public/projects/${project}`);
        const html = await response.text();
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        projectElement.innerHTML = html;
        container.appendChild(projectElement);
      }

      // Hide all projects initially except the first one
      const projectElements = document.querySelectorAll('.project');
      projectElements.forEach((project, index) => {
        if (index !== currentIndex) {
          project.style.display = 'none';
        }
      });

      // Show next project
      document.getElementById('right-button').addEventListener('click', () => {
        projectElements[currentIndex].style.display = 'none';
        currentIndex = (currentIndex + 1) % projectElements.length;
        projectElements[currentIndex].style.display = 'block';
      });

      // Show previous project
      document.getElementById('left-button').addEventListener('click', () => {
        projectElements[currentIndex].style.display = 'none';
        currentIndex = (currentIndex - 1 + projectElements.length) % projectElements.length;
        projectElements[currentIndex].style.display = 'block';
      });
    };

    /*

    Preventing buttong

    */

    $('.btn-nav').mousedown(function(event) {
      event.preventDefault();
    });


    /*

    Automatic footer date

    */
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

  loadProjects();

});

function showAlert() {
  alert("This feature is currently unavailable. I am making changes / updating it at the moment.");
}


