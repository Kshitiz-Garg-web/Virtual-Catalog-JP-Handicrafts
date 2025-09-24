document.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('searchInput');
      const searchForm = document.getElementById('searchForm');
      const clearBtn = document.getElementById('clearSearch');
      const noResults = document.getElementById('noResults');
      const allListings = document.querySelectorAll('.listing-card');

      function filterListings(query) {
        const searchTerm = query.toLowerCase().trim();
        let visibleCount = 0;

        allListings.forEach(listing => {
          const title = listing.getAttribute('data-title');
          const materials = listing.getAttribute('data-material');
          
          // Check if search matches title or materials
          const titleMatch = title.includes(searchTerm);
          const materialMatch = materials.includes(searchTerm);
          
          if (titleMatch || materialMatch || searchTerm === '') {
            listing.style.display = 'block';
            visibleCount++;
          } else {
            listing.style.display = 'none';
          }
        });

        // Show/hide no results message
        if (visibleCount === 0 && searchTerm !== '') {
          noResults.style.display = 'block';
        } else {
          noResults.style.display = 'none';
        }
      }

      // Real-time search
      searchInput.addEventListener('input', function(e) {
        filterListings(e.target.value);
      });

      // Form submission
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        filterListings(searchInput.value);
      });

      // Clear search
      clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        filterListings('');
        searchInput.focus();
      });
    });