// create utile function to calculte radians to dagrees
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}
// create utile function to calculte degrees to radians
function degToRad(deg) {
  return deg * (Math.PI / 180);
}
// Check if user use mobile device
function isMobileDevice() {
  // Check for touch support
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0;
  // Check if the user agent contains "Mobi"
  const isMobileUserAgent = window.navigator.userAgent
    .toLowerCase()
    .includes('mobi');

  return isTouchDevice || isMobileUserAgent;
}
// export functions
module.exports = {
  radToDeg,
  degToRad,
  isMobileDevice,
};
