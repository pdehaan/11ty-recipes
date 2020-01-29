module.exports = (eleventyConfig) => {
  return {
    dir: {
      input: "src",
      output: "www",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};
