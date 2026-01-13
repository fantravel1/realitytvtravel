const CleanCSS = require("clean-css");
const { minify } = require("terser");
const { DateTime } = require("luxon");

module.exports = function(eleventyConfig) {
  // Ignore README.md from processing
  eleventyConfig.ignores.add("README.md");

  // Number formatting filter (e.g., 1000 -> "1,000")
  eleventyConfig.addFilter("number", function(value) {
    if (value === undefined || value === null) return "";
    return Number(value).toLocaleString("en-US");
  });

  // Limit filter for arrays
  eleventyConfig.addFilter("limit", function(arr, count) {
    if (!Array.isArray(arr)) return arr;
    return arr.slice(0, count);
  });

  // Date filter
  eleventyConfig.addFilter("date", function(dateObj, format) {
    if (dateObj === "now") {
      dateObj = new Date();
    }
    // Handle PHP-style format codes
    if (format === "Y") {
      return DateTime.fromJSDate(dateObj).toFormat("yyyy");
    }
    return DateTime.fromJSDate(dateObj).toFormat(format);
  });

  // CSS minification filter
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  // JS minification filter
  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function(code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      callback(null, code);
    }
  });

  // Copy robots.txt to output
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Copy CNAME for GitHub Pages custom domain
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
