'use strict';

const sharp = require('sharp');

async function optimizeAssets() {
  await Promise.all([
    sharp('assets/images/logo.png')
      .resize({ width: 512 })
      .webp({ lossless: true, effort: 6 })
      .toFile('assets/images/logo-512.webp'),
    sharp('assets/images/logo_negative.png')
      .resize({ width: 512 })
      .webp({ lossless: true, effort: 6 })
      .toFile('assets/images/logo-negative-512.webp'),
    sharp('assets/images/circuit_integration.webp')
      .resize({ width: 640, height: 640, fit: 'cover' })
      .webp({ quality: 55, alphaQuality: 70, effort: 6 })
      .toFile('assets/images/circuit-integration-640.webp'),
    sharp('assets/images/electrode_team.webp')
      .resize({ width: 560 })
      .webp({ quality: 74, effort: 6 })
      .toFile('assets/images/electrode-team-560.webp'),
    sharp('assets/images/electrode_team.webp')
      .resize({ width: 768 })
      .webp({ quality: 74, effort: 6 })
      .toFile('assets/images/electrode-team-768.webp'),
  ]);
}

optimizeAssets().catch((error) => {
  console.error(error);
  process.exit(1);
});
