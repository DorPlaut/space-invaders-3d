// create utile function to calculte radians to dagrees
function radToDeg(rad) {
  return rad * (180 / Math.PI);
}
// create utile function to calculte degrees to radians
function degToRad(deg) {
  return deg * (Math.PI / 180);
}
// export functions
module.exports = {
  radToDeg,
  degToRad,
};
