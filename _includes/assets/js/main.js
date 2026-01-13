// Minimal JS for RealityTVTravel - Performance optimized
(function() {
  'use strict';
  
  // YouTube lazy loading - Click to load iframe
  document.querySelectorAll('.youtube-facade').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var container = this.closest('.youtube-embed');
      var videoId = container.dataset.videoId;
      container.innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%"></iframe>';
    });
    
    // Keyboard accessibility
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
  
  // Smooth scroll for anchor links (progressive enhancement)
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.focus();
      }
    });
  });
  
})();
