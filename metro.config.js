const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Ajout des extensions à gérer
config.resolver.sourceExts = [
  'js',
  'jsx',
  'json',
  'ts',
  'tsx',
  'cjs',
  'mjs'
];

// Configuration pour les assets
config.resolver.assetExts = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'wav',
  'mp3',
  'mp4',
  'webp',
  'ttf',
  'otf',
  'woff',
  'woff2'
];

// Configuration pour le cache
config.resetCache = false;
config.maxWorkers = 4;

// Configuration pour améliorer les performances
config.transformer.minifierConfig = {
  keep_classnames: true,
  keep_fnames: true,
  mangle: {
    keep_classnames: true,
    keep_fnames: true
  }
};

module.exports = config;
