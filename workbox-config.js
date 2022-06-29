module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{png,ico,otf,css,ttf,svg,html,jpg,json,txt,js}'],
  swDest: 'public/sw.js',
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/]
};
