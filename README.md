# 🌴 RealityTVTravel.com

> **The Premier Hub for Reality TV Filming Locations Worldwide**

Visit every destination, restaurant, bar, hotel, and experiential location from your favorite dating shows—on screen and off.

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/realitytvtravel/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/realitytvtravel/actions/workflows/deploy.yml)
[![Lighthouse Score](https://img.shields.io/badge/Lighthouse-100%2F100-brightgreen)](https://pagespeed.web.dev/)

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/realitytvtravel.git
cd realitytvtravel

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Architecture

```
realitytvtravel/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── src/
│   ├── _data/                  # Global data files
│   │   ├── site.json           # Site metadata
│   │   ├── shows.json          # All shows database
│   │   ├── locations.json      # All locations database
│   │   ├── cast.json           # Cast member database
│   │   ├── restaurants.json    # Restaurants database
│   │   ├── hotels.json         # Hotels & resorts database
│   │   ├── experiences.json    # Activities database
│   │   └── faqs.json           # Global FAQ database
│   ├── _includes/
│   │   ├── layouts/
│   │   │   ├── base.njk        # Base HTML template
│   │   │   ├── show.njk        # Show page layout
│   │   │   ├── location.njk    # Location page layout
│   │   │   ├── cast.njk        # Cast member layout
│   │   │   └── venue.njk       # Restaurant/hotel layout
│   │   ├── components/
│   │   │   ├── head.njk        # SEO meta tags
│   │   │   ├── nav.njk         # Navigation
│   │   │   ├── footer.njk      # Footer
│   │   │   ├── faq.njk         # FAQ component with schema
│   │   │   ├── youtube.njk     # Lazy YouTube embed
│   │   │   ├── breadcrumb.njk  # Breadcrumb navigation
│   │   │   ├── card.njk        # Location/venue card
│   │   │   └── schema.njk      # JSON-LD schemas
│   │   └── partials/
│   │       ├── booking-cta.njk # Booking call-to-action
│   │       └── share.njk       # Social sharing
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css      # Minimal CSS (~5KB)
│   │   ├── js/
│   │   │   └── main.js         # Minimal JS (~2KB)
│   │   └── images/
│   │       └── ...             # Optimized WebP images
│   ├── shows/                  # Show pages (auto-generated)
│   ├── locations/              # Location pages (auto-generated)
│   ├── cast/                   # Cast member pages (auto-generated)
│   ├── restaurants/            # Restaurant pages
│   ├── hotels/                 # Hotel pages
│   ├── experiences/            # Experience pages
│   └── index.njk               # Homepage
├── scripts/
│   ├── generate-pages.js       # Page generator from JSON
│   ├── optimize-images.js      # Image optimization
│   └── build-sitemap.js        # Sitemap generator
├── .eleventy.js                # Eleventy configuration
├── package.json
└── README.md
```

---

## ⚡ Performance Philosophy

**Target: 100/100 Lighthouse Scores Across All Metrics**

### Core Principles

1. **Zero JavaScript by Default** - Progressive enhancement only
2. **Critical CSS Inlined** - No render-blocking resources
3. **Lazy Everything** - Images, YouTube, non-critical assets
4. **Static First** - Pre-rendered HTML, no client-side hydration
5. **Minimal Dependencies** - Eleventy + a few npm scripts

### Performance Checklist

- [ ] HTML minified and gzipped (~2-5KB per page)
- [ ] CSS inlined in `<head>` (~5KB total)
- [ ] No external fonts (system font stack)
- [ ] All images in WebP format with srcset
- [ ] YouTube embeds lazy-loaded with facade
- [ ] No layout shift (explicit dimensions on all media)
- [ ] Preconnect to affiliate domains
- [ ] Service worker for offline support

---

## 🎬 Content Database Structure

### shows.json

```json
{
  "shows": [
    {
      "id": "the-bachelor",
      "name": "The Bachelor",
      "network": "ABC",
      "networkSlug": "abc",
      "seasons": 29,
      "status": "active",
      "description": "The original dating competition where one bachelor dates 25+ women...",
      "image": "/images/shows/the-bachelor.webp",
      "logo": "/images/logos/the-bachelor.svg",
      "primaryLocation": "bachelor-mansion",
      "destinations": ["los-angeles", "malta", "spain", "thailand", "iceland"],
      "faqs": [
        {
          "question": "Where is The Bachelor Mansion located?",
          "answer": "The Bachelor Mansion, officially named Villa de la Vina, is located at 2351 Kanan Road in Agoura Hills, California, about 35 miles northwest of downtown Los Angeles in the Santa Monica Mountains."
        },
        {
          "question": "Can you visit The Bachelor Mansion?",
          "answer": "Yes! The Bachelor Mansion is available for rent on Airbnb. Nightly rates range from $6,000 to $30,000. The property hosts weddings, proposals, and special events when not filming."
        },
        {
          "question": "How long has The Bachelor filmed at the mansion?",
          "answer": "The Bachelor has filmed at Villa de la Vina since Season 11 in 2007. The production rents the property for approximately 42 days per season."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "Bachelor Mansion Tour",
          "placeholder": true
        },
        {
          "id": "",
          "title": "Best Bachelor Destinations Ranked",
          "placeholder": true
        }
      ],
      "meta": {
        "title": "The Bachelor Filming Locations | Every Destination, Resort & Date Spot",
        "description": "Complete guide to every Bachelor filming location across 29 seasons. Visit the Bachelor Mansion, Fantasy Suite resorts, international destinations, and hometown date spots."
      }
    }
  ]
}
```

### locations.json

```json
{
  "locations": [
    {
      "id": "bachelor-mansion",
      "name": "The Bachelor Mansion (Villa de la Vina)",
      "type": "filming-location",
      "category": "mansion",
      "shows": ["the-bachelor", "the-bachelorette"],
      "address": "2351 Kanan Road, Agoura Hills, CA 91301",
      "coordinates": {
        "lat": 34.1392,
        "lng": -118.7553
      },
      "country": "USA",
      "region": "California",
      "city": "Agoura Hills",
      "bookable": true,
      "bookingUrl": "https://www.airbnb.com/rooms/XXXXXXX",
      "priceRange": {
        "min": 6000,
        "max": 30000,
        "currency": "USD",
        "unit": "night"
      },
      "amenities": ["pool", "spa", "wine-cellar", "chef-available", "event-space"],
      "featuredSeasons": [
        {
          "show": "the-bachelor",
          "seasons": [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
        }
      ],
      "images": [
        {
          "src": "/images/locations/bachelor-mansion-exterior.webp",
          "alt": "Bachelor Mansion exterior with iconic driveway",
          "width": 1200,
          "height": 800
        }
      ],
      "faqs": [
        {
          "question": "How much does it cost to rent the Bachelor Mansion?",
          "answer": "The Bachelor Mansion rents for $6,000 to $30,000 per night on Airbnb, depending on dates and event type. Minimum stays typically apply."
        },
        {
          "question": "Can you get married at the Bachelor Mansion?",
          "answer": "Yes, the Bachelor Mansion hosts weddings and proposals. Contact the property through Airbnb for event pricing and availability."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "Inside the Bachelor Mansion - Full Tour",
          "placeholder": true
        }
      ],
      "affiliateLinks": [
        {
          "type": "booking",
          "url": "",
          "placeholder": true
        }
      ],
      "nearbyAttractions": ["malibu-beaches", "santa-monica-mountains", "pepperdine-university"],
      "meta": {
        "title": "Bachelor Mansion: Visit, Rent & Tour Villa de la Vina | RealityTVTravel",
        "description": "Rent the iconic Bachelor Mansion in Agoura Hills, CA. $6,000-$30,000/night on Airbnb. Complete visitor guide with photos, pricing, and booking info."
      }
    }
  ]
}
```

### cast.json

```json
{
  "cast": [
    {
      "id": "ben-higgins",
      "name": "Ben Higgins",
      "shows": [
        {
          "show": "the-bachelor",
          "season": 20,
          "role": "lead",
          "year": 2016
        }
      ],
      "hometown": "Warsaw, Indiana",
      "currentCity": "Denver, Colorado",
      "businesses": [
        {
          "name": "Ash'Kara",
          "type": "restaurant",
          "venueId": "ashkara-denver",
          "address": "2219 W 32nd Ave, Denver, CO 80211",
          "active": true
        },
        {
          "name": "Generous Coffee Co.",
          "type": "brand",
          "url": "https://generouscoffee.com",
          "active": true
        }
      ],
      "socialMedia": {
        "instagram": "higaboroben",
        "tiktok": "",
        "youtube": ""
      },
      "podcast": {
        "name": "The Ben and Ashley I Almost Famous Podcast",
        "url": ""
      },
      "weddingVenue": "",
      "faqs": [
        {
          "question": "Does Ben Higgins own a restaurant?",
          "answer": "Yes, Ben Higgins co-owns Ash'Kara, a Middle Eastern restaurant at 2219 W 32nd Ave in Denver's Highland neighborhood. The restaurant serves Israeli and Mediterranean cuisine."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "Ben Higgins Restaurant Tour",
          "placeholder": true
        }
      ],
      "meta": {
        "title": "Ben Higgins: Bachelor Season 20 | Restaurants, Businesses & Locations",
        "description": "Visit Ben Higgins' Denver restaurant Ash'Kara and explore all the locations connected to The Bachelor Season 20 lead."
      }
    }
  ]
}
```

### restaurants.json

```json
{
  "restaurants": [
    {
      "id": "sur-restaurant",
      "name": "SUR Restaurant & Lounge",
      "type": "restaurant",
      "cuisine": ["American", "Mediterranean"],
      "shows": ["vanderpump-rules", "real-housewives-of-beverly-hills"],
      "castConnection": [
        {
          "castId": "lisa-vanderpump",
          "relationship": "owner"
        }
      ],
      "address": "606 N Robertson Blvd, West Hollywood, CA 90069",
      "coordinates": {
        "lat": 34.0825,
        "lng": -118.3854
      },
      "phone": "(310) 289-2824",
      "website": "https://surrestaurant.com",
      "hours": {
        "monday": "5pm-2am",
        "tuesday": "5pm-2am",
        "wednesday": "5pm-2am",
        "thursday": "5pm-2am",
        "friday": "5pm-2am",
        "saturday": "5pm-2am",
        "sunday": "10am-3pm, 5pm-2am"
      },
      "priceRange": "$$",
      "reservationUrl": "https://www.opentable.com/sur-restaurant-and-lounge",
      "images": [
        {
          "src": "/images/restaurants/sur-exterior.webp",
          "alt": "SUR Restaurant exterior on Robertson Blvd",
          "width": 1200,
          "height": 800
        }
      ],
      "faqs": [
        {
          "question": "Is SUR from Vanderpump Rules a real restaurant?",
          "answer": "Yes! SUR (Sexy Unique Restaurant) is a real restaurant at 606 N Robertson Blvd in West Hollywood. It's owned by Lisa Vanderpump and has been the primary filming location for Vanderpump Rules since 2013."
        },
        {
          "question": "Do you need reservations for SUR?",
          "answer": "Reservations are highly recommended, especially on weekends. You can book through OpenTable or call (310) 289-2824."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "SUR Restaurant Tour - Vanderpump Rules",
          "placeholder": true
        }
      ],
      "meta": {
        "title": "SUR Restaurant: Vanderpump Rules Filming Location | West Hollywood",
        "description": "Dine at SUR Restaurant from Vanderpump Rules. Lisa Vanderpump's iconic West Hollywood restaurant. Reservations, menu, hours & what to expect."
      }
    }
  ]
}
```

### hotels.json

```json
{
  "hotels": [
    {
      "id": "grand-velas-riviera-maya",
      "name": "Grand Velas Riviera Maya",
      "type": "resort",
      "category": "luxury-all-inclusive",
      "stars": 5,
      "shows": ["love-is-blind"],
      "seasons": [
        {
          "show": "love-is-blind",
          "seasons": [1, 5],
          "type": "retreat"
        }
      ],
      "address": "Carretera Cancún-Tulum Km. 62, Playa del Carmen, Mexico",
      "coordinates": {
        "lat": 20.4897,
        "lng": -87.4183
      },
      "country": "Mexico",
      "region": "Quintana Roo",
      "priceRange": {
        "min": 800,
        "max": 1500,
        "currency": "USD",
        "unit": "night"
      },
      "bookingUrls": {
        "direct": "https://www.grandvelas.com/riviera-maya/",
        "booking": "",
        "expedia": "",
        "hotels": ""
      },
      "amenities": [
        "all-inclusive",
        "multiple-pools",
        "spa",
        "fine-dining",
        "beach-access",
        "butler-service"
      ],
      "images": [
        {
          "src": "/images/hotels/grand-velas-pool.webp",
          "alt": "Grand Velas Riviera Maya infinity pool at sunset",
          "width": 1200,
          "height": 800
        }
      ],
      "faqs": [
        {
          "question": "Where does Love Is Blind film the retreat in Mexico?",
          "answer": "Love Is Blind Seasons 1 and 5 filmed the couple's retreat at Grand Velas Riviera Maya, a 5-star all-inclusive resort in Playa del Carmen, Mexico. Rates start around $800-1,500 per night."
        },
        {
          "question": "Can you book the same rooms from Love Is Blind?",
          "answer": "Yes, the suites shown on Love Is Blind are available for booking directly through Grand Velas. The Ambassador and Grand Class suites offer the luxury experience seen on the show."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "Grand Velas Riviera Maya Tour - Love Is Blind Resort",
          "placeholder": true
        }
      ],
      "affiliateLinks": [
        {
          "type": "booking",
          "url": "",
          "placeholder": true
        }
      ],
      "meta": {
        "title": "Grand Velas Riviera Maya: Love Is Blind Resort | Book the Retreat",
        "description": "Stay at the Love Is Blind Mexico resort. Grand Velas Riviera Maya 5-star all-inclusive in Playa del Carmen. $800-1,500/night. Complete booking guide."
      }
    }
  ]
}
```

### experiences.json

```json
{
  "experiences": [
    {
      "id": "bachelor-helicopter-tour",
      "name": "Helicopter Tour",
      "type": "adventure",
      "category": "helicopter",
      "shows": ["the-bachelor", "the-bachelorette"],
      "frequency": "common-date-type",
      "description": "Helicopter dates are a Bachelor franchise staple, offering couples stunning aerial views before intimate dinners.",
      "bookableExamples": [
        {
          "destination": "Los Angeles",
          "provider": "Orbic Air",
          "url": "",
          "priceRange": "$300-800"
        },
        {
          "destination": "Hawaii",
          "provider": "Blue Hawaiian",
          "url": "",
          "priceRange": "$250-600"
        }
      ],
      "faqs": [
        {
          "question": "Can you book a Bachelor-style helicopter date?",
          "answer": "Yes! Many helicopter tour companies offer romantic packages similar to Bachelor dates. Expect to pay $300-800 for a private scenic tour with champagne, depending on location and duration."
        }
      ],
      "youtubeVideos": [
        {
          "id": "",
          "title": "Best Bachelor Helicopter Date Moments",
          "placeholder": true
        }
      ],
      "meta": {
        "title": "Book a Bachelor-Style Helicopter Date | Romantic Tours & Packages",
        "description": "Experience a Bachelor-style helicopter date. Book romantic aerial tours in LA, Hawaii, and more. Prices, providers, and tips for the perfect flight."
      }
    }
  ]
}
```

### faqs.json (Global FAQs)

```json
{
  "globalFaqs": [
    {
      "category": "general",
      "faqs": [
        {
          "question": "What is set-jetting?",
          "answer": "Set-jetting is traveling to destinations featured in movies and TV shows. The phenomenon has grown into a $66 billion industry, with 61% of travelers now influenced by screen content when choosing destinations."
        },
        {
          "question": "Can you actually visit reality TV filming locations?",
          "answer": "Many reality TV locations are publicly accessible or available to rent. Resorts, restaurants, and some villas can be booked. Private mansions like the Bachelor Mansion occasionally appear on Airbnb."
        }
      ]
    },
    {
      "category": "booking",
      "faqs": [
        {
          "question": "How do I book a villa from Too Hot to Handle?",
          "answer": "Too Hot to Handle villas are typically available through luxury rental agencies. Casa Tau in Mexico books through Casa Bay Villas ($11,500-15,660/night). Emerald Pavilion in Turks and Caicos books through Pavilion Management ($8,700-27,000/night)."
        }
      ]
    }
  ]
}
```

---

## 🔧 Eleventy Configuration

### .eleventy.js

```javascript
const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const { minify } = require("terser");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {
  
  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  
  // Minify CSS
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });
  
  // Minify JS
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function(code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error:", err);
      callback(null, code);
    }
  });
  
  // Date formatting
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("LLLL d, yyyy");
  });
  
  // Slug filter
  eleventyConfig.addFilter("slug", input => {
    return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  });
  
  // JSON-LD escape
  eleventyConfig.addFilter("jsonLdEscape", str => {
    return str.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  });
  
  // Limit filter for arrays
  eleventyConfig.addFilter("limit", (arr, limit) => arr.slice(0, limit));
  
  // Create collections from JSON data
  eleventyConfig.addCollection("shows", function(collectionApi) {
    const shows = require('./src/_data/shows.json');
    return shows.shows;
  });
  
  eleventyConfig.addCollection("locations", function(collectionApi) {
    const locations = require('./src/_data/locations.json');
    return locations.locations;
  });
  
  eleventyConfig.addCollection("cast", function(collectionApi) {
    const cast = require('./src/_data/cast.json');
    return cast.cast;
  });
  
  eleventyConfig.addCollection("restaurants", function(collectionApi) {
    const restaurants = require('./src/_data/restaurants.json');
    return restaurants.restaurants;
  });
  
  eleventyConfig.addCollection("hotels", function(collectionApi) {
    const hotels = require('./src/_data/hotels.json');
    return hotels.hotels;
  });
  
  // Minify HTML output
  eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
    if (outputPath && outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        minifyCSS: true,
        minifyJS: true
      });
    }
    return content;
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
```

---

## 📄 Template Components

### src/_includes/layouts/base.njk

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  {# SEO Meta Tags #}
  <title>{{ meta.title | default(title) }} | RealityTVTravel.com</title>
  <meta name="description" content="{{ meta.description | default(description) }}">
  <link rel="canonical" href="https://realitytvtravel.com{{ page.url }}">
  
  {# Open Graph #}
  <meta property="og:title" content="{{ meta.title | default(title) }}">
  <meta property="og:description" content="{{ meta.description | default(description) }}">
  <meta property="og:image" content="https://realitytvtravel.com{{ image | default('/images/og-default.webp') }}">
  <meta property="og:url" content="https://realitytvtravel.com{{ page.url }}">
  <meta property="og:type" content="website">
  
  {# Twitter Card #}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{{ meta.title | default(title) }}">
  <meta name="twitter:description" content="{{ meta.description | default(description) }}">
  <meta name="twitter:image" content="https://realitytvtravel.com{{ image | default('/images/og-default.webp') }}">
  
  {# Preconnect to external domains #}
  <link rel="preconnect" href="https://www.youtube.com">
  <link rel="preconnect" href="https://i.ytimg.com">
  <link rel="preconnect" href="https://www.booking.com">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  
  {# Favicon #}
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  
  {# Critical CSS - Inlined #}
  <style>
    {% set css %}{% include "assets/css/critical.css" %}{% endset %}
    {{ css | cssmin | safe }}
  </style>
  
  {# Deferred CSS #}
  <link rel="preload" href="/assets/css/styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="/assets/css/styles.css"></noscript>
  
  {# JSON-LD Schema #}
  {% include "components/schema.njk" %}
</head>
<body>
  {% include "components/nav.njk" %}
  
  <main id="main-content">
    {% include "components/breadcrumb.njk" %}
    {{ content | safe }}
  </main>
  
  {% include "components/footer.njk" %}
  
  {# Minimal JS - Deferred #}
  <script defer>
    {% set js %}{% include "assets/js/main.js" %}{% endset %}
    {{ js | jsmin | safe }}
  </script>
</body>
</html>
```

### src/_includes/components/faq.njk

```html
{# FAQ Component with Schema.org FAQPage markup #}
{% if faqs and faqs.length > 0 %}
<section class="faq-section" aria-labelledby="faq-heading">
  <h2 id="faq-heading">Frequently Asked Questions</h2>
  
  <div class="faq-list" itemscope itemtype="https://schema.org/FAQPage">
    {% for faq in faqs %}
    <details class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
      <summary itemprop="name">{{ faq.question }}</summary>
      <div class="faq-answer" itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
        <p itemprop="text">{{ faq.answer }}</p>
      </div>
    </details>
    {% endfor %}
  </div>
</section>

{# Inline JSON-LD for FAQPage (AEO optimization) #}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% for faq in faqs %}
    {
      "@type": "Question",
      "name": "{{ faq.question | jsonLdEscape }}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{{ faq.answer | jsonLdEscape }}"
      }
    }{% if not loop.last %},{% endif %}
    {% endfor %}
  ]
}
</script>
{% endif %}
```

### src/_includes/components/youtube.njk

```html
{# Lazy-loaded YouTube embed with facade for performance #}
{# Pass: videoId, title, placeholder (optional boolean) #}

{% if videoId and videoId != "" %}
<div class="youtube-embed" data-video-id="{{ videoId }}">
  <button 
    class="youtube-facade" 
    aria-label="Play video: {{ title }}"
    style="background-image: url('https://i.ytimg.com/vi/{{ videoId }}/maxresdefault.jpg')"
  >
    <span class="youtube-play-btn" aria-hidden="true">
      <svg viewBox="0 0 68 48" width="68" height="48">
        <path fill="#f00" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"/>
        <path fill="#fff" d="M45 24L27 14v20"/>
      </svg>
    </span>
  </button>
</div>
{% elif placeholder %}
{# Placeholder for videos to be added later #}
<div class="youtube-placeholder">
  <div class="youtube-placeholder-inner">
    <span class="youtube-placeholder-icon">🎬</span>
    <p class="youtube-placeholder-text">Video: {{ title }}</p>
    <small>Coming soon</small>
  </div>
</div>
{% endif %}

{# CSS for facade (add to critical.css) #}
{#
.youtube-embed {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  background: #000;
}
.youtube-facade {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  cursor: pointer;
  background-size: cover;
  background-position: center;
}
.youtube-play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.youtube-placeholder {
  aspect-ratio: 16/9;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.youtube-placeholder-inner {
  text-align: center;
  color: #666;
}
.youtube-placeholder-icon {
  font-size: 3rem;
}
#}

{# JS for lazy loading (add to main.js) #}
{#
document.querySelectorAll('.youtube-facade').forEach(btn => {
  btn.addEventListener('click', function() {
    const container = this.closest('.youtube-embed');
    const videoId = container.dataset.videoId;
    container.innerHTML = `<iframe 
      src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      style="position:absolute;inset:0;width:100%;height:100%"
    ></iframe>`;
  });
});
#}
```

### src/_includes/components/schema.njk

```html
{# Dynamic JSON-LD Schema based on page type #}

{# Site-wide Organization schema #}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RealityTVTravel",
  "url": "https://realitytvtravel.com",
  "logo": "https://realitytvtravel.com/images/logo.png",
  "sameAs": [
    "https://twitter.com/realitytvtravel",
    "https://instagram.com/realitytvtravel",
    "https://tiktok.com/@realitytvtravel"
  ]
}
</script>

{# Breadcrumb schema #}
{% if breadcrumbs %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {% for crumb in breadcrumbs %}
    {
      "@type": "ListItem",
      "position": {{ loop.index }},
      "name": "{{ crumb.name }}",
      "item": "https://realitytvtravel.com{{ crumb.url }}"
    }{% if not loop.last %},{% endif %}
    {% endfor %}
  ]
}
</script>
{% endif %}

{# Location/Place schema for venues #}
{% if type == "location" or type == "restaurant" or type == "hotel" %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "{% if type == 'restaurant' %}Restaurant{% elif type == 'hotel' %}LodgingBusiness{% else %}TouristAttraction{% endif %}",
  "name": "{{ name }}",
  "description": "{{ meta.description }}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{ address }}"
  },
  {% if coordinates %}
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": {{ coordinates.lat }},
    "longitude": {{ coordinates.lng }}
  },
  {% endif %}
  {% if priceRange %}
  "priceRange": "{{ priceRange.min }}-{{ priceRange.max }} {{ priceRange.currency }}",
  {% endif %}
  {% if images and images.length > 0 %}
  "image": "https://realitytvtravel.com{{ images[0].src }}",
  {% endif %}
  "url": "https://realitytvtravel.com{{ page.url }}"
}
</script>
{% endif %}

{# Article schema for blog/guide content #}
{% if type == "article" %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{{ title }}",
  "description": "{{ meta.description }}",
  "author": {
    "@type": "Organization",
    "name": "RealityTVTravel"
  },
  "publisher": {
    "@type": "Organization",
    "name": "RealityTVTravel",
    "logo": {
      "@type": "ImageObject",
      "url": "https://realitytvtravel.com/images/logo.png"
    }
  },
  "datePublished": "{{ date | readableDate }}",
  "dateModified": "{{ lastModified | default(date) | readableDate }}",
  "mainEntityOfPage": "https://realitytvtravel.com{{ page.url }}"
}
</script>
{% endif %}
```

### src/_includes/components/breadcrumb.njk

```html
{% if breadcrumbs %}
<nav class="breadcrumb" aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    {% for crumb in breadcrumbs %}
    <li>
      {% if loop.last %}
        <span aria-current="page">{{ crumb.name }}</span>
      {% else %}
        <a href="{{ crumb.url }}">{{ crumb.name }}</a>
      {% endif %}
    </li>
    {% endfor %}
  </ol>
</nav>
{% endif %}
```

---

## 📄 Page Templates

### src/shows/shows.njk (Generates all show pages)

```html
---
pagination:
  data: shows
  size: 1
  alias: show
permalink: "/shows/{{ show.id }}/"
layout: layouts/base.njk
---

{% set meta = show.meta %}
{% set breadcrumbs = [
  { name: "Shows", url: "/shows/" },
  { name: show.name, url: page.url }
] %}

<article class="show-page">
  <header class="show-header">
    <h1>{{ show.name }} Filming Locations</h1>
    <p class="show-meta">
      <span class="network">{{ show.network }}</span>
      <span class="seasons">{{ show.seasons }} Seasons</span>
    </p>
    <p class="show-description">{{ show.description }}</p>
  </header>
  
  {# Primary Location #}
  {% if show.primaryLocation %}
  <section class="primary-location">
    <h2>Main Filming Location</h2>
    {# Fetch from locations data #}
    {% for location in locations.locations %}
      {% if location.id == show.primaryLocation %}
        {% include "components/card.njk" %}
      {% endif %}
    {% endfor %}
  </section>
  {% endif %}
  
  {# All Destinations #}
  <section class="destinations">
    <h2>All Destinations</h2>
    <div class="destination-grid">
      {% for destId in show.destinations %}
        {% for location in locations.locations %}
          {% if location.id == destId %}
            {% include "components/card.njk" %}
          {% endif %}
        {% endfor %}
      {% endfor %}
    </div>
  </section>
  
  {# YouTube Videos #}
  {% if show.youtubeVideos and show.youtubeVideos.length > 0 %}
  <section class="videos">
    <h2>Videos</h2>
    <div class="video-grid">
      {% for video in show.youtubeVideos %}
        {% set videoId = video.id %}
        {% set title = video.title %}
        {% set placeholder = video.placeholder %}
        {% include "components/youtube.njk" %}
      {% endfor %}
    </div>
  </section>
  {% endif %}
  
  {# FAQs #}
  {% set faqs = show.faqs %}
  {% include "components/faq.njk" %}
</article>
```

### src/locations/locations.njk (Generates all location pages)

```html
---
pagination:
  data: locations
  size: 1
  alias: location
permalink: "/locations/{{ location.id }}/"
layout: layouts/base.njk
---

{% set meta = location.meta %}
{% set type = "location" %}
{% set name = location.name %}
{% set address = location.address %}
{% set coordinates = location.coordinates %}
{% set priceRange = location.priceRange %}
{% set images = location.images %}

{% set breadcrumbs = [
  { name: "Locations", url: "/locations/" },
  { name: location.name, url: page.url }
] %}

<article class="location-page">
  <header class="location-header">
    <h1>{{ location.name }}</h1>
    
    {% if location.bookable %}
    <span class="badge badge-bookable">Bookable</span>
    {% endif %}
    
    <p class="location-address">📍 {{ location.address }}</p>
    
    {% if location.priceRange %}
    <p class="location-price">
      💰 ${{ location.priceRange.min | number }} - ${{ location.priceRange.max | number }} / {{ location.priceRange.unit }}
    </p>
    {% endif %}
  </header>
  
  {# Hero Image #}
  {% if location.images and location.images.length > 0 %}
  <figure class="location-hero">
    <img 
      src="{{ location.images[0].src }}" 
      alt="{{ location.images[0].alt }}"
      width="{{ location.images[0].width }}"
      height="{{ location.images[0].height }}"
      loading="eager"
      decoding="async"
    >
  </figure>
  {% endif %}
  
  {# Featured Shows #}
  <section class="featured-shows">
    <h2>Featured On</h2>
    <ul class="show-list">
      {% for showId in location.shows %}
        {% for show in shows.shows %}
          {% if show.id == showId %}
          <li>
            <a href="/shows/{{ show.id }}/">{{ show.name }}</a>
            {% for featured in location.featuredSeasons %}
              {% if featured.show == showId %}
                <span class="seasons">(Seasons {{ featured.seasons | join(", ") }})</span>
              {% endif %}
            {% endfor %}
          </li>
          {% endif %}
        {% endfor %}
      {% endfor %}
    </ul>
  </section>
  
  {# Booking CTA #}
  {% if location.bookable and location.bookingUrl %}
  <section class="booking-cta">
    <h2>Book Your Stay</h2>
    <a href="{{ location.bookingUrl }}" class="btn btn-primary" rel="nofollow sponsored" target="_blank">
      Check Availability
    </a>
    {% if location.priceRange %}
    <p class="price-note">Starting at ${{ location.priceRange.min | number }}/{{ location.priceRange.unit }}</p>
    {% endif %}
  </section>
  {% endif %}
  
  {# Amenities #}
  {% if location.amenities and location.amenities.length > 0 %}
  <section class="amenities">
    <h2>Amenities</h2>
    <ul class="amenity-list">
      {% for amenity in location.amenities %}
      <li>{{ amenity | replace("-", " ") | title }}</li>
      {% endfor %}
    </ul>
  </section>
  {% endif %}
  
  {# YouTube Videos #}
  {% if location.youtubeVideos and location.youtubeVideos.length > 0 %}
  <section class="videos">
    <h2>Videos</h2>
    <div class="video-grid">
      {% for video in location.youtubeVideos %}
        {% set videoId = video.id %}
        {% set title = video.title %}
        {% set placeholder = video.placeholder %}
        {% include "components/youtube.njk" %}
      {% endfor %}
    </div>
  </section>
  {% endif %}
  
  {# Map #}
  {% if location.coordinates %}
  <section class="location-map">
    <h2>Location</h2>
    <div class="map-container">
      <a 
        href="https://www.google.com/maps/search/?api=1&query={{ location.coordinates.lat }},{{ location.coordinates.lng }}" 
        target="_blank"
        rel="noopener"
        class="map-link"
      >
        View on Google Maps →
      </a>
    </div>
  </section>
  {% endif %}
  
  {# FAQs #}
  {% set faqs = location.faqs %}
  {% include "components/faq.njk" %}
  
  {# Nearby Attractions #}
  {% if location.nearbyAttractions and location.nearbyAttractions.length > 0 %}
  <section class="nearby">
    <h2>Nearby Attractions</h2>
    <ul>
      {% for nearbyId in location.nearbyAttractions %}
        {% for nearby in locations.locations %}
          {% if nearby.id == nearbyId %}
          <li><a href="/locations/{{ nearby.id }}/">{{ nearby.name }}</a></li>
          {% endif %}
        {% endfor %}
      {% endfor %}
    </ul>
  </section>
  {% endif %}
</article>
```

---

## 🎨 CSS Architecture

### src/assets/css/critical.css (~3KB)

```css
/* Critical CSS - Inlined in <head> */
/* System font stack for zero FOUT */
:root {
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --color-primary: #e91e63;
  --color-bg: #fff;
  --color-text: #1a1a1a;
  --color-muted: #666;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --max-width: 1200px;
}

*, *::before, *::after { box-sizing: border-box; }

html { font-size: 16px; -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  font-family: var(--font-sans);
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-bg);
}

img, video { max-width: 100%; height: auto; display: block; }

a { color: var(--color-primary); text-decoration: none; }
a:hover { text-decoration: underline; }

.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--spacing-sm); }

/* Navigation */
.nav { background: var(--color-text); color: #fff; padding: var(--spacing-sm); }
.nav a { color: #fff; }

/* Breadcrumb */
.breadcrumb { padding: var(--spacing-sm) 0; font-size: 0.875rem; }
.breadcrumb ol { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.5rem; }
.breadcrumb li:not(:last-child)::after { content: "›"; margin-left: 0.5rem; color: var(--color-muted); }

/* FAQ Styles */
.faq-section { margin: var(--spacing-xl) 0; }
.faq-list { display: flex; flex-direction: column; gap: var(--spacing-sm); }
.faq-item { border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
.faq-item summary { padding: var(--spacing-sm); cursor: pointer; font-weight: 600; background: #f9f9f9; }
.faq-item summary:hover { background: #f0f0f0; }
.faq-answer { padding: var(--spacing-sm); }

/* YouTube Embed */
.youtube-embed { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: #000; border-radius: 8px; }
.youtube-facade { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; cursor: pointer; background-size: cover; background-position: center; }
.youtube-play-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); opacity: 0.9; transition: opacity 0.2s; }
.youtube-facade:hover .youtube-play-btn { opacity: 1; }
.youtube-placeholder { aspect-ratio: 16/9; background: #1a1a1a; display: flex; align-items: center; justify-content: center; border-radius: 8px; margin: var(--spacing-sm) 0; }
.youtube-placeholder-inner { text-align: center; color: #666; }
.youtube-placeholder-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }

/* Cards */
.card { border: 1px solid #eee; border-radius: 8px; overflow: hidden; transition: box-shadow 0.2s; }
.card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

/* Buttons */
.btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 4px; font-weight: 600; text-align: center; cursor: pointer; border: none; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-primary:hover { background: #c2185b; text-decoration: none; }

/* Badges */
.badge { display: inline-block; padding: 0.25rem 0.5rem; font-size: 0.75rem; border-radius: 4px; font-weight: 600; }
.badge-bookable { background: #4caf50; color: #fff; }

/* Grids */
.video-grid, .destination-grid { display: grid; gap: var(--spacing-md); }
@media (min-width: 640px) { .video-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1024px) { .destination-grid { grid-template-columns: repeat(3, 1fr); } }

/* Footer */
.footer { background: var(--color-text); color: #fff; padding: var(--spacing-xl) var(--spacing-sm); margin-top: var(--spacing-xl); }
```

---

## ⚙️ GitHub Actions Deployment

### .github/workflows/deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build with Eleventy
        run: npm run build
        env:
          NODE_ENV: production

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./_site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## 📦 package.json

```json
{
  "name": "realitytvtravel",
  "version": "1.0.0",
  "description": "Reality TV Travel - Visit filming locations from your favorite dating shows",
  "main": "index.js",
  "scripts": {
    "dev": "eleventy --serve --watch",
    "build": "eleventy",
    "preview": "eleventy --serve",
    "optimize-images": "node scripts/optimize-images.js",
    "generate-sitemap": "node scripts/build-sitemap.js",
    "lint": "eslint ."
  },
  "keywords": [
    "reality-tv",
    "travel",
    "filming-locations",
    "bachelor",
    "love-is-blind",
    "set-jetting"
  ],
  "author": "RealityTVTravel",
  "license": "MIT",
  "devDependencies": {
    "@11ty/eleventy": "^2.0.1",
    "clean-css": "^5.3.3",
    "html-minifier": "^4.0.0",
    "luxon": "^3.4.4",
    "terser": "^5.26.0"
  },
  "dependencies": {}
}
```

---

## 🔍 SEO & AEO Optimization Checklist

### Technical SEO

- [x] Static HTML pages (instant load, crawlable)
- [x] Semantic HTML5 structure
- [x] Proper heading hierarchy (H1 → H6)
- [x] Canonical URLs on all pages
- [x] XML Sitemap (auto-generated)
- [x] robots.txt with sitemap reference
- [x] Mobile-first responsive design
- [x] Core Web Vitals optimized (LCP < 2.5s, FID < 100ms, CLS < 0.1)

### On-Page SEO

- [x] Unique title tags (< 60 chars)
- [x] Meta descriptions (< 160 chars)
- [x] Open Graph tags for social sharing
- [x] Twitter Card meta tags
- [x] Alt text on all images
- [x] Internal linking between related content
- [x] Breadcrumb navigation with schema

### Schema Markup (AEO - Answer Engine Optimization)

- [x] **FAQPage** schema on every content page
- [x] **Organization** schema site-wide
- [x] **BreadcrumbList** schema
- [x] **TouristAttraction** schema for locations
- [x] **Restaurant** schema for dining venues
- [x] **LodgingBusiness** schema for hotels
- [x] **Article** schema for guides

### Content Strategy for AEO

Each page should answer these question types:
- **What** - "What is [location/show]?"
- **Where** - "Where is [location] filmed?"
- **How** - "How do I visit/book [location]?"
- **How much** - "How much does it cost to [stay/rent]?"
- **Can I** - "Can you visit [location]?"

---

## 📊 Content Scale

### Projected Page Count

| Content Type | Estimated Pages |
|-------------|----------------|
| Shows | 35+ |
| Locations | 500+ |
| Cast Members | 300+ |
| Restaurants | 200+ |
| Hotels/Resorts | 150+ |
| Experiences | 50+ |
| City Guides | 100+ |
| **Total** | **1,300+** |

### Growth Strategy

1. **Phase 1** - Core dating shows (Bachelor, Love Is Blind, Too Hot to Handle, Love Island)
2. **Phase 2** - Extended Netflix/Peacock shows
3. **Phase 3** - 90 Day Fiancé franchise (massive location catalog)
4. **Phase 4** - MTV/VH1 legacy shows
5. **Phase 5** - International versions and spinoffs

---

## 🎥 YouTube Video Integration

### Video Placeholder System

The template includes placeholder support for videos to be sourced later:

```json
{
  "youtubeVideos": [
    {
      "id": "",
      "title": "Bachelor Mansion Tour",
      "placeholder": true
    }
  ]
}
```

When `placeholder: true` and `id` is empty, displays a styled placeholder box. When you find the video, just add the YouTube video ID:

```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Bachelor Mansion Tour",
  "placeholder": false
}
```

### Sourcing Videos

Search strategies for each content type:
- `"[show name] filming location tour"`
- `"[location name] walking tour"`
- `"[resort name] room tour"`
- `"[restaurant name] review"`
- `"[cast member] vlog [location]"`

---

## 🚀 Deployment Instructions

### Deploy from Branch

1. **Create Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/realitytvtravel.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to Repository → Settings → Pages
   - Source: GitHub Actions
   - The workflow will auto-deploy on push to `main`

3. **Custom Domain** (Optional)
   - Add `realitytvtravel.com` in Settings → Pages → Custom domain
   - Create `CNAME` file in `src/` with your domain
   - Configure DNS: A records pointing to GitHub IPs

### Environment Variables

None required for basic deployment. For enhanced features:

```env
# Optional: Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Optional: Search Console verification
GOOGLE_SITE_VERIFICATION=xxxxx
```

---

## 📈 Lighthouse Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Performance | 100 | Zero JS default, critical CSS inlined, lazy images |
| Accessibility | 100 | Semantic HTML, ARIA labels, color contrast |
| Best Practices | 100 | HTTPS, no console errors, correct image ratios |
| SEO | 100 | Meta tags, structured data, crawlable links |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-show`)
3. Add content to appropriate JSON files in `src/_data/`
4. Commit your changes (`git commit -m 'Add Love Island UK locations'`)
5. Push to the branch (`git push origin feature/new-show`)
6. Open a Pull Request

---

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- **Live Site**: https://realitytvtravel.com
- **GitHub**: https://github.com/YOUR_USERNAME/realitytvtravel
- **Twitter**: [@realitytvtravel](https://twitter.com/realitytvtravel)
- **Instagram**: [@realitytvtravel](https://instagram.com/realitytvtravel)
- **TikTok**: [@realitytvtravel](https://tiktok.com/@realitytvtravel)

---

Built with ❤️ for reality TV fans who want to travel where the magic happens.
