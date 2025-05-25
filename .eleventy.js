const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const I18nPlugin = require('eleventy-plugin-i18n');

module.exports = function(eleventyConfig) {
  // Define languages and default language
  const languages = [
    { code: 'en', label: 'English', direction: 'ltr' },
    { code: 'de', label: 'Deutsch', direction: 'ltr' },
    { code: 'fr', label: 'Français', direction: 'ltr' },
    { code: 'ar', label: 'العربية', direction: 'rtl' }
  ];
  const defaultLanguageCode = 'en';

  // Add global data for languages and default language
  eleventyConfig.addGlobalData("languages", languages);
  eleventyConfig.addGlobalData("defaultLanguageCode", defaultLanguageCode);

  // Add a dummy locale_url filter to test the subtask's proposed switcher
  eleventyConfig.addFilter("locale_url", function (path, locale) {
    // This is a dummy filter. A real one would transform 'path' to its 'locale' version.
    // For testing, we'll just prepend the locale.
    if (path === undefined || locale === undefined) {
      return "#undefined-path-or-locale";
    }
    let newPath = `/${locale}${path.startsWith('/') ? '' : '/'}${path}`;
    // Remove double slashes if path was /
    if (path === '/') {
        newPath = `/${locale}/`;
    }
    return newPath;
  });

  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight);
  // eleventy-plugin-i18n v0.1.3 is primarily for string translation using dictionaries.
  // It does not use defaultLanguage, languages, or pathTransform options.
  // These are handled by custom Eleventy configuration or other plugins.
  eleventyConfig.addPlugin(I18nPlugin, {
    // translations: {}, // Define your actual translations here if using the i18n filter
    // fallbackLocales: { '*': defaultLanguageCode }
  });
  
  // The addTransform('pathTransform', ...) was removed as it was incorrectly implemented and not needed.
  // URL localization is handled by directory structure and permalinks.
  
  // To enable merging of tags
  eleventyConfig.setDataDeepMerge(true);

  // Copy these static files to _site folder
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/manifest.json'); // This should probably be moved into language dirs or handled with i18n

  // To create excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_alias: 'post_excerpt',
    excerpt_separator: '<!-- excerpt -->'
  })

  // To create a filter to determine duration of post
  eleventyConfig.addFilter('readTime', (value) => {
    const content = value
    const textOnly = content.replace(/(<([^>]+)>)/gi, '')
    const readingSpeedPerMin = 450
    return Math.max(1, Math.floor(textOnly.length / readingSpeedPerMin))
  })

  // Enable us to iterate over all the tags, excluding posts and all
  eleventyConfig.addCollection('tagList', collection => {
    const tagsSet = new Set()
    collection.getAll().forEach(item => {
      if (!item.data.tags) return
      item.data.tags
        .filter(tag => !['posts', 'all'].includes(tag))
        .forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  })

  const md = markdownIt({ html: true, linkify: true })
  md.use(markdownItAnchor, { 
    level: [1, 2], 
    permalink: markdownItAnchor.permalink.headerLink({ 
      safariReaderFix: true,
      class: 'header-anchor',
    })
  })
  eleventyConfig.setLibrary('md', md)

  // asset_img shortcode
  eleventyConfig.addLiquidShortcode('asset_img', (filename, alt) => {
    return `<img class="my-4" src="/assets/img/posts/${filename}" alt="${alt}" />`
  })

  return {
    dir: {
      input: 'src'
    }
  }
}
