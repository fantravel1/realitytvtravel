module.exports = function(eleventyConfig) {
  // Number formatting filter (e.g., 1000 -> "1,000")
  eleventyConfig.addFilter("number", function(value) {
    if (value === undefined || value === null) return "";
    return Number(value).toLocaleString("en-US");
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
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
