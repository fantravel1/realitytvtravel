/**
 * RealityTVTravel - Main Application JavaScript
 */

// ============================================
// Data Loading
// ============================================

let showsData = null;
let locationsData = null;

async function loadData(filename, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(`_data/${filename}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${filename} (attempt ${attempt}/${retries}):`, error);
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  }
  return null;
}

function showLoadError(gridElement, type = 'content') {
  if (!gridElement) return;
  gridElement.innerHTML = `
    <div class="load-error" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">😕</div>
      <h3 style="margin-bottom: 0.5rem;">Unable to load ${type}</h3>
      <p style="color: var(--color-gray-500); margin-bottom: 1rem;">This might be a network issue or you're viewing the file locally.</p>
      <p style="font-size: 0.875rem; color: var(--color-gray-400);">For local testing, use a local server: <code>python3 -m http.server 8080</code></p>
      <button onclick="location.reload()" class="btn btn-outline" style="margin-top: 1rem;">Try Again</button>
    </div>
  `;
}

async function initData() {
  [showsData, locationsData] = await Promise.all([
    loadData('shows.json'),
    loadData('locations.json')
  ]);
  return { showsData, locationsData };
}

// ============================================
// SEO: JSON-LD Structured Data
// ============================================

function injectStructuredData(data) {
  // Remove any existing JSON-LD script
  const existingScript = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-dynamic', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function createShowStructuredData(show, locations) {
  return {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    "name": show.name,
    "description": show.longDescription || show.description,
    "numberOfSeasons": show.seasons,
    "datePublished": show.yearStarted ? `${show.yearStarted}-01-01` : undefined,
    "productionCompany": {
      "@type": "Organization",
      "name": show.network
    },
    "aggregateRating": show.viewerRating ? {
      "@type": "AggregateRating",
      "ratingValue": show.viewerRating,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "contentLocation": locations.map(loc => ({
      "@type": "Place",
      "name": loc.name,
      "address": {
        "@type": "PostalAddress",
        "addressCountry": loc.country,
        "addressRegion": loc.region
      }
    })),
    "url": `https://realitytvtravel.com/show.html?id=${show.id}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "RealityTVTravel",
      "url": "https://realitytvtravel.com"
    }
  };
}

function createLocationStructuredData(location, shows) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "name": location.name,
    "description": location.longDescription || location.description,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": location.country,
      "addressRegion": location.region
    },
    "url": `https://realitytvtravel.com/location.html?id=${location.id}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "RealityTVTravel",
      "url": "https://realitytvtravel.com"
    }
  };

  if (location.image) {
    structuredData.image = location.image;
  }

  if (location.priceRange) {
    structuredData.priceRange = location.priceRange;
  }

  if (location.highlights?.length) {
    structuredData.amenityFeature = location.highlights.map(h => ({
      "@type": "LocationFeatureSpecification",
      "name": h
    }));
  }

  if (shows?.length) {
    structuredData.subjectOf = shows.map(show => ({
      "@type": "TVSeries",
      "name": show.name,
      "description": show.description
    }));
  }

  return structuredData;
}

// ============================================
// Lazy Loading for Images
// ============================================

function initLazyLoading() {
  // Lazy load background images using Intersection Observer
  const lazyImages = document.querySelectorAll('.location-card-image[data-bg]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const bgUrl = element.dataset.bg;
          if (bgUrl) {
            element.style.background = `url('${bgUrl}') center/cover no-repeat`;
            element.removeAttribute('data-bg');
          }
          imageObserver.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before entering viewport
      threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(element => {
      const bgUrl = element.dataset.bg;
      if (bgUrl) {
        element.style.background = `url('${bgUrl}') center/cover no-repeat`;
      }
    });
  }
}

// Call lazy loading after DOM updates
function triggerLazyLoading() {
  requestAnimationFrame(() => {
    initLazyLoading();
  });
}

// ============================================
// Navigation
// ============================================

function initNavigation() {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function handleScroll() {
    if (window.scrollY > 50) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
  }
}

// ============================================
// Counter Animation
// ============================================

function animateCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(target * easeOut);

          counter.textContent = current.toLocaleString();

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString() + '+';
          }
        }

        requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// ============================================
// FAQ Accordion
// ============================================

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        faqItems.forEach(other => {
          if (other !== item) other.classList.remove('active');
        });
        item.classList.toggle('active');
      });
    }
  });
}

// ============================================
// Emojis & Formatting
// ============================================

const showEmojis = {
  'the-bachelor': '🌹',
  'the-bachelorette': '🌹',
  'love-is-blind': '💍',
  'too-hot-to-handle': '🔥',
  'love-island-usa': '🏝️',
  'bachelor-in-paradise': '🌴',
  'perfect-match': '💘',
  'the-ultimatum': '💔',
  'temptation-island': '🍎',
  'fboy-island': '🏖️',
  'married-at-first-sight': '💒',
  'love-island-uk': '🇬🇧',
  'the-circle': '📱',
  'love-on-the-spectrum': '💙',
  'dating-around': '🍸',
  'are-you-the-one': '🎯',
  'sexy-beasts': '🎭',
  'the-courtship': '👑',
  'love-without-borders': '✈️',
  'indian-matchmaking': '🪔',
  'love-in-paradise': '🌺'
};

const locationEmojis = {
  'bachelor-mansion': '🏰',
  'playa-escondida-resort': '🏖️',
  'emerald-pavilion': '🌴',
  'casa-tau': '🏠',
  'grand-velas-riviera-maya': '🏨',
  'andaz-maui': '🌺',
  'sheraton-fiji': '🐚',
  'azura-beach-resort': '🌊',
  'santorini-grace': '🇬🇷',
  'castle-howard': '🏰',
  'cabo-resort': '🏜️',
  'new-orleans-justine': '🎷',
  'austin-rainey-street': '🤠',
  'thailand-resort': '🐘',
  'bali-resort': '🛕',
  'iceland-blue-lagoon': '🧊',
  'jamaica-sandals': '🇯🇲',
  'maldives-resort': '🏝️',
  'new-zealand-queenstown': '🏔️',
  'scotland-highlands': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'paris-france': '🗼',
  'turks-caicos-beaches': '🏖️',
  'atlanta-buckhead': '🍑',
  'dubai-resort': '🌆'
};

const networkColors = {
  'ABC': { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', accent: '#f4d03f' },
  'Netflix': { bg: 'linear-gradient(135deg, #1a0000 0%, #2d0000 100%)', accent: '#e50914' },
  'Peacock': { bg: 'linear-gradient(135deg, #000428 0%, #004e92 100%)', accent: '#00d4aa' },
  'HBO Max': { bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)', accent: '#b17acc' },
  'USA Network': { bg: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)', accent: '#2980b9' },
  'Lifetime': { bg: 'linear-gradient(135deg, #4a0e4e 0%, #7b1fa2 100%)', accent: '#e91e63' },
  'ITV': { bg: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)', accent: '#00bcd4' },
  'MTV': { bg: 'linear-gradient(135deg, #1a1a1a 0%, #333333 100%)', accent: '#ffeb3b' },
  'NBC': { bg: 'linear-gradient(135deg, #0d47a1 0%, #1565c0 100%)', accent: '#ff9800' },
  'Bravo': { bg: 'linear-gradient(135deg, #004d40 0%, #00695c 100%)', accent: '#00e676' },
  'TLC': { bg: 'linear-gradient(135deg, #b71c1c 0%, #c62828 100%)', accent: '#ffcdd2' }
};

// Trending shows for badges (popular and actively discussed shows)
const trendingShows = ['love-is-blind', 'too-hot-to-handle', 'the-bachelor', 'married-at-first-sight', 'love-island-uk', 'the-golden-bachelor', 'perfect-match', 'singles-inferno'];
// New shows (recently premiered or upcoming)
const newShows = ['love-is-blind-habibi', 'love-is-blind-germany', 'the-ultimatum-queer-love', 'love-island-all-stars', 'couple-to-throuple'];

function formatPrice(priceRange) {
  if (!priceRange) return '';
  const { min, currency, unit } = priceRange;
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(min);
  return `${formatted}/${unit}`;
}

// ============================================
// Show Cards
// ============================================

function createShowCard(show) {
  const emoji = showEmojis[show.id] || '📺';
  const colors = networkColors[show.network] || networkColors['ABC'];
  const isTrending = trendingShows.includes(show.id);
  const isNew = newShows.includes(show.id);
  const ratingStars = show.viewerRating ? '★'.repeat(Math.floor(show.viewerRating)) + (show.viewerRating % 1 >= 0.5 ? '½' : '') : '';

  return `
    <a href="show.html?id=${show.id}" class="show-card">
      <div class="show-card-image" style="background: ${colors.bg}">
        <span class="show-card-network" style="color: ${colors.accent}">${show.network}</span>
        ${isTrending ? '<span class="badge badge-trending">🔥 Trending</span>' : ''}
        ${isNew ? '<span class="badge badge-new">✨ New</span>' : ''}
        <span class="show-card-emoji">${emoji}</span>
      </div>
      <div class="show-card-body">
        <h3 class="show-card-title">${show.name}</h3>
        ${show.tagline ? `<p class="show-card-tagline">"${show.tagline}"</p>` : ''}
        <div class="show-card-meta">
          <span>${show.seasons} Seasons</span>
          <span>•</span>
          <span>${show.destinations?.length || 0} Locations</span>
          ${show.viewerRating ? `<span>•</span><span class="show-rating" title="${show.viewerRating}/5">${ratingStars} ${show.viewerRating}</span>` : ''}
        </div>
        <p class="show-card-description">${show.description.slice(0, 150)}${show.description.length > 150 ? '...' : ''}</p>
      </div>
    </a>
  `;
}

function createSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton-card-image"></div>
      <div class="skeleton-card-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    </div>
  `;
}

async function loadShowsGrid() {
  const grid = document.getElementById('shows-grid');
  if (!grid) return;

  // Show skeletons while loading
  grid.innerHTML = Array(8).fill(createSkeletonCard()).join('');

  const data = showsData || await loadData('shows.json');
  if (!data?.shows) {
    showLoadError(grid, 'shows');
    return;
  }

  // Show first 8 on homepage for more variety
  grid.innerHTML = data.shows.slice(0, 8).map(show => createShowCard(show)).join('');
}

// ============================================
// Location Cards
// ============================================

function createLocationCard(location, shows) {
  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = shows?.find(s => s.id === showId);
    return show?.name || showId;
  }).slice(0, 2).join(', ') || '';

  const categoryColors = {
    'mansion': 'linear-gradient(135deg, #2c3e50 0%, #4a6fa5 100%)',
    'luxury-villa': 'linear-gradient(135deg, #1a1a2e 0%, #4a3728 100%)',
    'beach-resort': 'linear-gradient(135deg, #0f4c5c 0%, #1a7f8e 100%)',
    'all-inclusive': 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
    'luxury-resort': 'linear-gradient(135deg, #3a1c71 0%, #d76d77 100%)',
    'luxury-hotel': 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    'historic-estate': 'linear-gradient(135deg, #5d4037 0%, #795548 100%)',
    'restaurant': 'linear-gradient(135deg, #c62828 0%, #e53935 100%)',
    'neighborhood': 'linear-gradient(135deg, #37474f 0%, #546e7a 100%)',
    'spa-destination': 'linear-gradient(135deg, #006064 0%, #00838f 100%)',
    'destination': 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
    'beach': 'linear-gradient(135deg, #00acc1 0%, #26c6da 100%)'
  };

  const bgStyle = categoryColors[location.category] || 'var(--gradient-hero)';

  // Use lazy loading for images - show gradient initially, load image when in viewport
  const hasImage = !!location.image;
  const lazyAttr = hasImage ? `data-bg="${location.image}"` : '';
  // Show gradient as placeholder, image loads via lazy loading
  const initialBg = bgStyle;

  const favoriteClass = isFavorite(location.id) ? 'active' : '';
  const favoriteIcon = isFavorite(location.id) ? '❤️' : '🤍';

  const regionEmojis = {
    'North America': '🌎',
    'Europe': '🌍',
    'Asia': '🌏',
    'Caribbean': '🏝️',
    'Oceania': '🌊',
    'Central America': '🌴',
    'Middle East': '🕌'
  };

  return `
    <div class="location-card" data-country="${location.country}" data-region="${location.region || ''}" data-price="${location.priceRange?.min || 0}">
      <div class="location-card-image" style="background: ${initialBg}" ${lazyAttr}>
        <button class="favorite-btn ${favoriteClass}" data-location-id="${location.id}" onclick="toggleFavorite('${location.id}', event)" title="${isFavorite(location.id) ? 'Remove from wishlist' : 'Add to wishlist'}">
          ${favoriteIcon}
        </button>
        <div class="location-card-badges">
          ${location.bookable ? '<span class="badge badge-bookable">Bookable</span>' : ''}
          ${location.region ? `<span class="badge badge-region">${regionEmojis[location.region] || '🌍'} ${location.region}</span>` : ''}
        </div>
        <span class="location-card-emoji">${emoji}</span>
      </div>
      <div class="location-card-body">
        <h3 class="location-card-title">${location.name}</h3>
        ${location.tagline ? `<p class="location-card-tagline">"${location.tagline}"</p>` : ''}
        <p class="location-card-location">
          <span>📍</span>
          ${location.city}, ${location.country}
        </p>
        ${showNames ? `<p class="location-card-shows"><span>📺</span> ${showNames}</p>` : ''}
        ${location.priceRange ? `
          <div class="location-card-price">
            <span class="price-label">From</span>
            <span class="price-value">${formatPrice(location.priceRange).split('/')[0]}</span>
            <span class="price-unit">/${location.priceRange.unit}</span>
          </div>
        ` : ''}
        ${location.bestTimeToVisit ? `<p class="location-card-timing"><span>📅</span> ${location.bestTimeToVisit}</p>` : ''}
        ${location.highlights ? `
          <div class="location-card-highlights">
            ${location.highlights.slice(0, 2).map(h => `<span class="highlight-tag">${h}</span>`).join('')}
          </div>
        ` : ''}
        <div class="location-card-cta">
          <a href="location.html?id=${location.id}" class="btn btn-primary">View Details</a>
        </div>
      </div>
    </div>
  `;
}

async function loadLocationsGrid() {
  const grid = document.getElementById('locations-grid');
  if (!grid) return;

  // Show skeletons while loading
  grid.innerHTML = Array(6).fill(createSkeletonCard()).join('');

  await initData();
  if (!locationsData?.locations) {
    showLoadError(grid, 'locations');
    return;
  }

  // Show first 6 on homepage for more variety
  grid.innerHTML = locationsData.locations
    .slice(0, 6)
    .map(location => createLocationCard(location, showsData?.shows))
    .join('');

  // Trigger lazy loading for images
  triggerLazyLoading();
}

// ============================================
// Shows Page with Search & Filters
// ============================================

async function loadShowsPage() {
  const grid = document.getElementById('all-shows-grid');
  const searchInput = document.getElementById('show-search');
  const filterBtns = document.querySelectorAll('.filter-btn[data-network]');

  if (!grid) return;

  await initData();
  if (!showsData?.shows) {
    showLoadError(grid, 'shows');
    return;
  }

  let currentFilter = 'all';
  let searchQuery = '';

  function renderShows() {
    let filtered = showsData.shows;

    // Apply network filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(show => show.network === currentFilter);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(show =>
        show.name.toLowerCase().includes(query) ||
        show.network.toLowerCase().includes(query) ||
        show.description.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-results">No shows found matching your criteria.</p>';
    } else {
      grid.innerHTML = filtered.map(show => createShowCard(show)).join('');
    }
  }

  // Search handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderShows();
    });
  }

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.network;
      renderShows();
    });
  });

  renderShows();
}

// ============================================
// Locations Page with Search & Filters
// ============================================

async function loadLocationsPage() {
  const grid = document.getElementById('all-locations-grid');
  const searchInput = document.getElementById('location-search');
  const regionFilterBtns = document.querySelectorAll('.filter-btn[data-region]');
  const countryFilterBtns = document.querySelectorAll('.filter-btn[data-country]');
  const sortSelect = document.getElementById('sort-locations');

  if (!grid) return;

  await initData();
  if (!locationsData?.locations) {
    showLoadError(grid, 'locations');
    return;
  }

  let currentRegionFilter = 'all';
  let currentCountryFilter = 'all';
  let searchQuery = '';
  let sortBy = 'name';

  function renderLocations() {
    let filtered = [...locationsData.locations];

    // Apply region filter
    if (currentRegionFilter !== 'all') {
      filtered = filtered.filter(loc => loc.region === currentRegionFilter);
    }

    // Apply country filter (legacy support)
    if (currentCountryFilter !== 'all') {
      filtered = filtered.filter(loc => loc.country === currentCountryFilter);
    }

    // Apply search - now searches show names too
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(loc => {
        // Search in location fields
        const matchesLocation =
          loc.name.toLowerCase().includes(query) ||
          loc.city.toLowerCase().includes(query) ||
          loc.country.toLowerCase().includes(query) ||
          (loc.region && loc.region.toLowerCase().includes(query)) ||
          (loc.tagline && loc.tagline.toLowerCase().includes(query));

        // Search in associated show names
        const matchesShow = loc.shows?.some(showId => {
          const show = showsData?.shows?.find(s => s.id === showId);
          return show && show.name.toLowerCase().includes(query);
        });

        return matchesLocation || matchesShow;
      });
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => (a.priceRange?.min || 0) - (b.priceRange?.min || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => (b.priceRange?.min || 0) - (a.priceRange?.min || 0));
    } else if (sortBy === 'rating') {
      // Sort by average rating of associated shows
      filtered.sort((a, b) => {
        const avgRatingA = a.shows?.reduce((sum, showId) => {
          const show = showsData?.shows?.find(s => s.id === showId);
          return sum + (show?.viewerRating || 0);
        }, 0) / (a.shows?.length || 1) || 0;
        const avgRatingB = b.shows?.reduce((sum, showId) => {
          const show = showsData?.shows?.find(s => s.id === showId);
          return sum + (show?.viewerRating || 0);
        }, 0) / (b.shows?.length || 1) || 0;
        return avgRatingB - avgRatingA;
      });
    } else {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} location${filtered.length !== 1 ? 's' : ''}`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<p class="no-results">No locations found matching your criteria. Try a different region or search term.</p>';
    } else {
      grid.innerHTML = filtered.map(loc => createLocationCard(loc, showsData?.shows)).join('');
      triggerLazyLoading();
    }

    // Update favorite buttons after rendering
    updateFavoriteButtons();
  }

  // Search handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderLocations();
    });
  }

  // Region filter handlers
  regionFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      regionFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRegionFilter = btn.dataset.region;
      renderLocations();
    });
  });

  // Country filter handlers (legacy support)
  countryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      countryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCountryFilter = btn.dataset.country;
      renderLocations();
    });
  });

  // Sort handler
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderLocations();
    });
  }

  renderLocations();
}

// ============================================
// Show Detail Page
// ============================================

async function loadShowDetail() {
  const container = document.getElementById('show-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const showId = params.get('id');

  if (!showId) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Show not found</h1><a href="shows.html" class="btn btn-primary">Browse Shows</a></div>';
    return;
  }

  // Show loading state
  container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><div class="spinner"></div><p>Loading show details...</p></div>';

  await initData();

  if (!showsData?.shows) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><div style="font-size: 3rem; margin-bottom: 1rem;">😕</div><h2>Unable to load show data</h2><p style="color: var(--color-gray-500); margin-bottom: 1rem;">Please check your connection or try again.</p><button onclick="location.reload()" class="btn btn-primary">Try Again</button></div>';
    return;
  }

  const show = showsData.shows.find(s => s.id === showId);

  if (!show) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Show not found</h1><p style="color: var(--color-gray-500); margin-bottom: 1rem;">The show "' + showId + '" doesn\'t exist.</p><a href="shows.html" class="btn btn-primary">Browse Shows</a></div>';
    return;
  }

  const emoji = showEmojis[show.id] || '📺';
  const colors = networkColors[show.network] || networkColors['ABC'];
  const showLocations = locationsData?.locations?.filter(loc => loc.shows?.includes(show.id)) || [];
  const ratingStars = show.viewerRating ? '★'.repeat(Math.floor(show.viewerRating)) + (show.viewerRating % 1 >= 0.5 ? '½' : '') : '';

  document.title = `${show.name} Filming Locations | RealityTVTravel`;

  // Inject JSON-LD structured data for SEO
  const structuredData = createShowStructuredData(show, showLocations);
  injectStructuredData(structuredData);

  // Update meta description dynamically
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `Explore ${showLocations.length} filming locations from ${show.name} on ${show.network}. ${show.description}`);
  }

  container.innerHTML = `
    <div class="detail-header" style="background: ${colors.bg}">`
      <div class="container">
        <div class="detail-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="shows.html">Shows</a>
          <span>›</span>
          ${show.name}
        </div>
        <div class="detail-grid">
          <div class="detail-main">
            <div style="font-size: 4rem; margin-bottom: var(--space-md);">${emoji}</div>
            <h1>${show.name}</h1>
            ${show.tagline ? `<p class="detail-tagline">"${show.tagline}"</p>` : ''}
            <div class="detail-meta">
              <span style="color: ${colors.accent}; font-weight: 700;">${show.network}</span>
              <span>${show.seasons} Seasons</span>
              <span>Since ${show.yearStarted || 'N/A'}</span>
              <span>${show.status === 'active' ? '🟢 Active' : '⚫ Ended'}</span>
              ${show.viewerRating ? `<span class="detail-rating">${ratingStars} ${show.viewerRating}/5</span>` : ''}
            </div>
            <p class="detail-description">${show.longDescription || show.description}</p>
            ${createShareButtons(show.name + ' Filming Locations')}
          </div>
          <div class="detail-sidebar">
            <div style="text-align: center; margin-bottom: var(--space-lg);">
              <div style="font-size: 3rem; margin-bottom: var(--space-sm);">${emoji}</div>
              <span class="badge ${show.status === 'active' ? 'badge-bookable' : 'badge-show'}" style="font-size: 0.875rem;">
                ${show.status === 'active' ? 'Currently Airing' : 'Completed Series'}
              </span>
            </div>
            <div class="sidebar-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-lg);">
              <div style="text-align: center; padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${show.seasons}</div>
                <div style="font-size: 0.75rem; color: var(--color-gray-500); text-transform: uppercase;">Seasons</div>
              </div>
              <div style="text-align: center; padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md);">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">${showLocations.length}</div>
                <div style="font-size: 0.75rem; color: var(--color-gray-500); text-transform: uppercase;">Locations</div>
              </div>
            </div>
            ${show.viewerRating ? `
              <div style="text-align: center; padding: var(--space-md); background: var(--color-gray-50); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
                <div style="font-size: 1.25rem; color: #f4d03f;">${ratingStars}</div>
                <div style="font-size: 0.875rem; font-weight: 600;">${show.viewerRating}/5 Rating</div>
              </div>
            ` : ''}
            ${show.avgEpisodeLength ? `
              <div style="text-align: center; padding: var(--space-sm); background: var(--color-gray-50); border-radius: var(--radius-md); margin-bottom: var(--space-md);">
                <div style="font-size: 0.875rem;"><span style="font-weight: 600;">${show.avgEpisodeLength}</span> min episodes</div>
              </div>
            ` : ''}
            <div class="sidebar-cta">
              ${show.trailerUrl ? `<a href="${show.trailerUrl}" target="_blank" rel="noopener" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);">▶️ Watch Trailer</a>` : ''}
              <a href="locations.html" class="btn ${show.trailerUrl ? 'btn-outline' : 'btn-primary'}" style="width: 100%; margin-bottom: var(--space-sm);">Browse Locations</a>
              <a href="shows.html" class="btn btn-outline" style="width: 100%;">All Shows</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${show.bestSeasons?.length > 0 ? `
          <div class="detail-section magazine-section">
            <h2>🏆 Best Seasons to Watch</h2>
            <div class="best-seasons-grid">
              ${show.bestSeasons.map((season, i) => `
                <div class="best-season-item">
                  <span class="best-season-rank">${i + 1}</span>
                  <span class="best-season-number">Season ${season}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${showLocations.length > 0 ? `
          <div class="detail-section">
            <h2>📍 Filming Locations</h2>
            <p class="section-intro">Explore the real-world destinations where ${show.name} brings romance to life.</p>
            <div class="locations-grid">
              ${showLocations.map(loc => createLocationCard(loc, showsData?.shows)).join('')}
            </div>
          </div>
        ` : '<div class="detail-section"><p>No bookable locations available for this show yet.</p></div>'}

        ${show.travelTips?.length > 0 ? `
          <div class="detail-section magazine-section">
            <h2>✈️ Travel Tips</h2>
            <div class="travel-tips-list">
              ${show.travelTips.map(tip => `
                <div class="travel-tip-item">
                  <span class="tip-icon">💡</span>
                  <span>${tip}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${show.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>❓ Frequently Asked Questions</h2>
            <div class="faq-grid">
              ${show.faqs.map(faq => `
                <div class="faq-item">
                  <button class="faq-question">
                    <span>${faq.question}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer">
                    <p>${faq.answer}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${(() => {
          // Get similar shows by network
          const similarShows = showsData?.shows?.filter(s =>
            s.id !== show.id && s.network === show.network
          ).slice(0, 3) || [];
          // If not enough, add shows from other networks
          if (similarShows.length < 3) {
            const moreShows = showsData?.shows?.filter(s =>
              s.id !== show.id && s.network !== show.network
            ).slice(0, 3 - similarShows.length) || [];
            similarShows.push(...moreShows);
          }
          return similarShows.length > 0 ? `
            <div class="detail-section">
              <h2>💕 You May Also Like</h2>
              <p class="section-intro">Other dating shows with amazing travel destinations</p>
              <div class="shows-grid similar-shows-grid">
                ${similarShows.map(s => createShowCard(s)).join('')}
              </div>
            </div>
          ` : '';
        })()}
      </div>
    </div>
  `;

  initFAQ();
  triggerLazyLoading();
}

// ============================================
// Location Detail Page
// ============================================

async function loadLocationDetail() {
  const container = document.getElementById('location-detail');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const locationId = params.get('id');

  if (!locationId) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Location not found</h1><a href="locations.html" class="btn btn-primary">Browse Locations</a></div>';
    return;
  }

  // Show loading state
  container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><div class="spinner"></div><p>Loading location details...</p></div>';

  await initData();

  if (!locationsData?.locations) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><div style="font-size: 3rem; margin-bottom: 1rem;">😕</div><h2>Unable to load location data</h2><p style="color: var(--color-gray-500); margin-bottom: 1rem;">Please check your connection or try again.</p><button onclick="location.reload()" class="btn btn-primary">Try Again</button></div>';
    return;
  }

  const location = locationsData.locations.find(l => l.id === locationId);

  if (!location) {
    container.innerHTML = '<div class="container" style="padding: 4rem 0; text-align: center;"><h1>Location not found</h1><p style="color: var(--color-gray-500); margin-bottom: 1rem;">The location "' + locationId + '" doesn\'t exist.</p><a href="locations.html" class="btn btn-primary">Browse Locations</a></div>';
    return;
  }

  const emoji = locationEmojis[location.id] || '📍';
  const showNames = location.shows?.map(showId => {
    const show = showsData?.shows?.find(s => s.id === showId);
    return show?.name || showId;
  }) || [];

  document.title = `${location.name} | RealityTVTravel`;

  // Get show objects for structured data
  const locationShows = location.shows?.map(showId =>
    showsData?.shows?.find(s => s.id === showId)
  ).filter(Boolean) || [];

  // Inject JSON-LD structured data for SEO
  const structuredData = createLocationStructuredData(location, locationShows);
  injectStructuredData(structuredData);

  // Update meta description dynamically
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `Visit ${location.name} in ${location.country} - a filming location from ${showNames.join(', ')}. ${location.description}`);
  }

  const amenityEmojis = {
    'pool': '🏊', 'infinity-pool': '🏊', 'spa': '💆', 'beach-access': '🏖️',
    'restaurant': '🍽️', 'bar': '🍹', 'chef-available': '👨‍🍳', 'private-chef': '👨‍🍳',
    'butler-service': '🎩', 'gym': '💪', 'yoga': '🧘', 'surf-lessons': '🏄',
    'home-theater': '🎬', 'wine-cellar': '🍷', 'event-space': '🎉', '10-acres': '🌳',
    'mountain-views': '⛰️', 'ocean-views': '🌊', 'tennis-court': '🎾', 'all-inclusive': '✨',
    'multiple-pools': '🏊', 'fine-dining': '🍷', 'fitness-center': '💪', 'kids-club': '👶',
    'water-sports': '🚤', 'snorkeling': '🤿', 'adults-only': '🔞', 'surfing': '🏄', 'luau': '🌺',
    'private-beach': '🏝️', 'diving': '🤿', 'overwater-villas': '🏠', 'seaplane-transfer': '✈️',
    'bungee-jumping': '🎢', 'jet-boating': '🚤', 'skiing': '⛷️', 'wine-tours': '🍷',
    'helicopter-tours': '🚁', 'hiking': '🥾', 'castle-stays': '🏰', 'whisky-tours': '🥃',
    'lochs': '🌊', 'golf': '⛳', 'fishing': '🎣', 'river-cruises': '🚢', 'museums': '🏛️',
    'iconic-landmarks': '🗼', 'geothermal-spa': '♨️', 'silica-masks': '💆', 'retreat-hotel': '🏨',
    'private-island': '🏝️', 'over-water-bungalows': '🏠', 'scuba': '🤿', 'underwater-restaurant': '🐠',
    'cocktails': '🍸', 'romantic-ambiance': '💕', 'french-cuisine': '🇫🇷', 'bars': '🍺',
    'restaurants': '🍽️', 'live-music': '🎵', 'food-trucks': '🚚', 'nightlife': '🌙',
    'thai-cuisine': '🍜', 'cooking-classes': '👩‍🍳', 'rafting': '🚣', 'rice-paddy-views': '🌾',
    'caldera-views': '🌋', 'champagne-lounge': '🥂', 'sunset-views': '🌅', 'historic-house-tour': '🏛️',
    'gardens': '🌸', 'cafe': '☕', 'gift-shop': '🛍️', 'events': '🎭', 'holiday-cottages': '🏡',
    'shopping': '🛒', 'hotels': '🏨', 'beachfront-dining': '🍽️', 'resorts': '🏨'
  };

  const regionEmojis = {
    'North America': '🌎',
    'Europe': '🌍',
    'Asia': '🌏',
    'Caribbean': '🏝️',
    'Oceania': '🌊',
    'Central America': '🌴',
    'Middle East': '🕌'
  };

  // Use actual image for hero if available
  const heroImageStyle = location.image
    ? `background: linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${location.image}') center/cover no-repeat;`
    : '';

  container.innerHTML = `
    ${location.image ? `
      <div class="location-hero-image" style="height: 300px; ${heroImageStyle} display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-lg);">
        <span style="font-size: 5rem; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));">${emoji}</span>
      </div>
    ` : ''}
    <div class="detail-header">
      <div class="container">
        <div class="detail-breadcrumb">
          <a href="/">Home</a>
          <span>›</span>
          <a href="locations.html">Locations</a>
          <span>›</span>
          ${location.name}
        </div>
        <div class="detail-grid">
          <div class="detail-main">
            ${!location.image ? `<div style="font-size: 4rem; margin-bottom: var(--space-md);">${emoji}</div>` : ''}
            <h1>${location.name}</h1>
            ${location.tagline ? `<p class="detail-tagline">"${location.tagline}"</p>` : ''}
            <div class="detail-meta">
              <span>📍 ${location.city}, ${location.country}</span>
              ${location.region ? `<span>${regionEmojis[location.region] || '🌍'} ${location.region}</span>` : ''}
              ${showNames.length > 0 ? `<span>📺 ${showNames.join(', ')}</span>` : ''}
              ${location.bookable ? '<span>✅ Bookable</span>' : ''}
            </div>
            <p class="detail-description">${location.description || location.address}</p>
            ${createShareButtons(location.name)}
            ${location.highlights ? `
              <div style="display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-md);">
                ${location.highlights.map(h => `<span class="badge badge-show">${h}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="detail-sidebar">
            ${location.priceRange ? `
              <div class="sidebar-price">
                <span class="sidebar-price-label">Starting from</span>
                <div>
                  <span class="sidebar-price-value">${formatPrice(location.priceRange).split('/')[0]}</span>
                  <span class="sidebar-price-unit">/${location.priceRange.unit}</span>
                </div>
                ${location.priceRange.max ? `<div style="font-size: 0.875rem; color: var(--color-gray-500);">Up to ${new Intl.NumberFormat('en-US', { style: 'currency', currency: location.priceRange.currency || 'USD', minimumFractionDigits: 0 }).format(location.priceRange.max)}/${location.priceRange.unit}</div>` : ''}
              </div>
            ` : ''}
            ${location.bestTimeToVisit ? `
              <div class="sidebar-timing">
                <span class="sidebar-timing-label">📅 Best Time to Visit</span>
                <p>${location.bestTimeToVisit}</p>
              </div>
            ` : ''}
            ${location.bookingPlatform ? `<p style="font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: var(--space-md);">Book via ${location.bookingPlatform}</p>` : ''}
            <div class="sidebar-cta">
              ${location.bookable && location.bookingUrl ? `
                <a href="${location.bookingUrl}" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);" target="_blank" rel="noopener">
                  Book Now →
                </a>
              ` : location.bookable ? `
                <a href="#" class="btn btn-primary" style="width: 100%; margin-bottom: var(--space-sm);">
                  Check Availability
                </a>
              ` : ''}
              <button class="btn btn-outline" style="width: 100%; margin-bottom: var(--space-sm);" onclick="toggleFavorite('${location.id}')">
                ${isFavorite(location.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
              </button>
              <a href="locations.html" class="btn btn-outline" style="width: 100%;">All Locations</a>
            </div>
            ${location.coordinates ? `
              <div class="sidebar-map">
                <a href="https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}" target="_blank" rel="noopener" class="map-link">
                  🗺️ View on Google Maps
                </a>
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
    <div class="detail-content">
      <div class="container">
        ${location.amenities?.length > 0 ? `
          <div class="detail-section">
            <h2>🏨 Amenities & Features</h2>
            <div class="amenities-grid">
              ${location.amenities.map(amenity => `
                <div class="amenity">
                  <span>${amenityEmojis[amenity] || '✨'}</span>
                  <span>${amenity.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${location.featuredSeasons?.length > 0 ? `
          <div class="detail-section">
            <h2>📺 Featured On</h2>
            <p class="section-intro">This location has been featured on the following shows:</p>
            <div style="display: flex; flex-wrap: wrap; gap: var(--space-md);">
              ${location.featuredSeasons.map(fs => {
                const show = showsData?.shows?.find(s => s.id === fs.show);
                const showEmoji = showEmojis[fs.show] || '📺';
                return `
                  <a href="show.html?id=${fs.show}" class="featured-show-card">
                    <div style="display: flex; align-items: center; gap: var(--space-sm);">
                      <span style="font-size: 1.5rem;">${showEmoji}</span>
                      <div>
                        <strong>${show?.name || fs.show}</strong>
                        <div style="font-size: 0.875rem; color: var(--color-gray-500);">
                          ${fs.seasons.length > 5 ? `Seasons ${fs.seasons[0]}-${fs.seasons[fs.seasons.length-1]}` : `Seasons ${fs.seasons.join(', ')}`}
                        </div>
                      </div>
                    </div>
                  </a>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        ${location.faqs?.length > 0 ? `
          <div class="detail-section">
            <h2>❓ Frequently Asked Questions</h2>
            <div class="faq-grid">
              ${location.faqs.map(faq => `
                <div class="faq-item">
                  <button class="faq-question">
                    <span>${faq.question}</span>
                    <span class="faq-icon">+</span>
                  </button>
                  <div class="faq-answer">
                    <p>${faq.answer}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${location.videos?.length > 0 ? `
          <div class="detail-section">
            <h2>🎬 Destination Videos</h2>
            <p class="section-intro">Explore ${location.name} through these official tourism and experience videos</p>
            <div class="videos-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--space-lg);">
              ${location.videos.map(video => `
                <a href="${video.url}" target="_blank" rel="noopener" class="video-card" style="display: block; background: var(--color-gray-50); border-radius: var(--radius-lg); overflow: hidden; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s;">
                  <div style="position: relative; padding-top: 56.25%; background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));">
                    <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
                      <span style="font-size: 3rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">▶️</span>
                    </div>
                    <span style="position: absolute; top: var(--space-sm); right: var(--space-sm); background: rgba(0,0,0,0.7); color: white; padding: 2px 8px; border-radius: var(--radius-sm); font-size: 0.75rem; text-transform: capitalize;">${video.type}</span>
                  </div>
                  <div style="padding: var(--space-md);">
                    <h4 style="margin: 0; color: var(--color-gray-900); font-size: 0.95rem;">${video.title}</h4>
                    <p style="margin: var(--space-xs) 0 0; color: var(--color-gray-500); font-size: 0.8rem;">Watch on YouTube →</p>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${location.nearbyAttractions?.length > 0 ? `
          <div class="detail-section">
            <h2>🗺️ Nearby Attractions</h2>
            <p class="section-intro">Explore these popular attractions near ${location.name}</p>
            <div class="attractions-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: var(--space-md);">
              ${location.nearbyAttractions.map(attraction => {
                const typeEmojis = {
                  'landmark': '🏛️', 'beach': '🏖️', 'nature': '🌿', 'museum': '🖼️',
                  'shopping': '🛍️', 'entertainment': '🎭', 'activity': '🎯', 'town': '🏘️',
                  'city': '🏙️', 'tour': '🚌', 'hotel': '🏨', 'bar': '🍹', 'dining': '🍽️',
                  'experience': '✨', 'attraction': '🎡'
                };
                return `
                  <div class="attraction-card" style="background: var(--color-gray-50); padding: var(--space-md); border-radius: var(--radius-md); display: flex; align-items: flex-start; gap: var(--space-sm);">
                    <span style="font-size: 1.5rem;">${typeEmojis[attraction.type] || '📍'}</span>
                    <div>
                      <h4 style="margin: 0; font-size: 0.95rem; color: var(--color-gray-900);">${attraction.name}</h4>
                      <p style="margin: var(--space-xs) 0 0; font-size: 0.8rem; color: var(--color-gray-500);">
                        ${attraction.distance} • ${attraction.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}

        <div class="detail-section magazine-section">
          <h2>📍 Location Details</h2>
          <div class="location-info-grid">
            <div class="location-info-item">
              <span class="info-label">Address</span>
              <span class="info-value">${location.address}</span>
            </div>
            ${location.coordinates ? `
              <div class="location-info-item">
                <span class="info-label">Coordinates</span>
                <span class="info-value">${location.coordinates.lat.toFixed(4)}, ${location.coordinates.lng.toFixed(4)}</span>
              </div>
            ` : ''}
            ${location.category ? `
              <div class="location-info-item">
                <span class="info-label">Category</span>
                <span class="info-value">${location.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
              </div>
            ` : ''}
          </div>
        </div>

        ${(() => {
          // Get similar locations - same region or category
          const similarLocations = locationsData?.locations?.filter(loc =>
            loc.id !== location.id && (loc.region === location.region || loc.category === location.category)
          ).slice(0, 3) || [];
          // If not enough, add from other regions
          if (similarLocations.length < 3) {
            const moreLocations = locationsData?.locations?.filter(loc =>
              loc.id !== location.id &&
              loc.region !== location.region &&
              loc.category !== location.category
            ).slice(0, 3 - similarLocations.length) || [];
            similarLocations.push(...moreLocations);
          }
          return similarLocations.length > 0 ? `
            <div class="detail-section">
              <h2>🗺️ Explore More Destinations</h2>
              <p class="section-intro">Similar locations you might love</p>
              <div class="locations-grid similar-locations-grid">
                ${similarLocations.map(loc => createLocationCard(loc, showsData?.shows)).join('')}
              </div>
            </div>
          ` : '';
        })()}
      </div>
    </div>
  `;

  initFAQ();
  updateFavoriteButtons();
  triggerLazyLoading();
}

// ============================================
// Smooth Scroll
// ============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================
// Back to Top Button
// ============================================

function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  function toggleVisibility() {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', toggleVisibility);
  toggleVisibility();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================
// Toast Notifications
// ============================================

function showToast(message, type = 'success') {
  // Remove existing toasts
  const existingToast = document.querySelector('.toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
    <span class="toast-message">${message}</span>
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  // Auto dismiss
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================
// Newsletter Form
// ============================================

async function handleNewsletterSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const emailInput = form.querySelector('input[type="email"]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const email = emailInput?.value;

  if (!email) {
    showToast('Please enter your email address.', 'error');
    return;
  }

  // Disable button and show loading state
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    if (response.ok) {
      showToast('Thanks for subscribing! You\'ll be the first to know about new locations.', 'success');
      form.reset();
    } else {
      throw new Error('Subscription failed');
    }
  } catch (error) {
    showToast('Oops! Something went wrong. Please try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Make function globally available
window.handleNewsletterSubmit = handleNewsletterSubmit;

// ============================================
// Social Sharing
// ============================================

function shareContent(platform, title, url) {
  const encodedUrl = encodeURIComponent(url || window.location.href);
  const encodedTitle = encodeURIComponent(title || document.title);

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
    copy: null
  };

  if (platform === 'copy') {
    navigator.clipboard.writeText(url || window.location.href).then(() => {
      showToast('Link copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy link', 'error');
    });
    return;
  }

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

window.shareContent = shareContent;

function createShareButtons(title) {
  return `
    <div class="share-buttons">
      <span class="share-label">Share:</span>
      <button class="share-btn share-twitter" onclick="shareContent('twitter', '${title}')" title="Share on Twitter">
        <span>𝕏</span>
      </button>
      <button class="share-btn share-facebook" onclick="shareContent('facebook', '${title}')" title="Share on Facebook">
        <span>f</span>
      </button>
      <button class="share-btn share-copy" onclick="shareContent('copy')" title="Copy link">
        <span>📋</span>
      </button>
    </div>
  `;
}

// ============================================
// Theme Toggle (Dark Mode)
// ============================================

function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  });

  // Listen for system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
    }
  });
}

// ============================================
// Favorites / Wishlist
// ============================================

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
  updateFavoritesCount();
}

function toggleFavorite(locationId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const favorites = getFavorites();
  const index = favorites.indexOf(locationId);

  if (index === -1) {
    favorites.push(locationId);
    showToast('Added to your wishlist! ❤️', 'success');
  } else {
    favorites.splice(index, 1);
    showToast('Removed from wishlist', 'info');
  }

  saveFavorites(favorites);
  updateFavoriteButtons();
}

function isFavorite(locationId) {
  return getFavorites().includes(locationId);
}

function updateFavoriteButtons() {
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    const locationId = btn.dataset.locationId;
    if (isFavorite(locationId)) {
      btn.classList.add('active');
      btn.innerHTML = '❤️';
      btn.title = 'Remove from wishlist';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '🤍';
      btn.title = 'Add to wishlist';
    }
  });
}

function updateFavoritesCount() {
  const count = getFavorites().length;
  const countEl = document.getElementById('favorites-count');
  if (countEl) {
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

window.toggleFavorite = toggleFavorite;

// ============================================
// Parallax Effect
// ============================================

function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  // Only enable on larger screens
  if (window.innerWidth < 768) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    hero.style.backgroundPositionY = `${rate}px`;
  }, { passive: true });
}

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initSmoothScroll();
  initBackToTop();
  initThemeToggle();
  initParallax();
  animateCounters();
  initFAQ();
  updateFavoritesCount();

  // Load dynamic content based on page
  await Promise.all([
    loadShowsGrid(),
    loadLocationsGrid(),
    loadShowsPage(),
    loadLocationsPage(),
    loadShowDetail(),
    loadLocationDetail()
  ]);

  // Update favorite buttons after content loads
  updateFavoriteButtons();
});
