// ===== NAV HAMBURGER MENU =====
// This runs on every page to make the mobile menu work.

document.addEventListener('DOMContentLoaded', function () {

  // Grab the button and the list of links
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('nav-links');

  // If either element doesn't exist on this page, stop here
  if (!hamburger || !navLinks) return;

  // Close the menu and reset the hamburger icon
  function closeMenu() {
    navLinks.classList.remove('open');
    var spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  // When hamburger is clicked, toggle (open/close) the menu
  hamburger.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    var spans = hamburger.querySelectorAll('span');

    if (isOpen) {
      // Animate the three lines into an X
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      closeMenu();
    }
  });

  // Close the menu when any nav link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close menu if user clicks anywhere outside it
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      closeMenu();
    }
  });

});
