const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development' // يعطل في وضع التطوير لتسهيل العمل
});

const nextConfig = withPWA({
  // إعداداتك الأصلية هنا
});

module.exports = nextConfig;