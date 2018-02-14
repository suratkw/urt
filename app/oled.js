var oled = require('oled-js-pi');
 
var opts = {
  width: 128,
  height: 64,
  address: 0x3D
};
 
var oled = new oled(opts);

oled.drawPixel([
    [128, 1, 1],
    [128, 32, 1],
    [128, 16, 1],
    [64, 16, 1]
]);