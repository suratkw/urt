var i2c = require('i2c-bus'),
  i2cBus = i2c.openSync(1),
  oled = require('oled-i2c-bus');
  
var pngtolcd = require('png-to-lcd');
var font = require('oled-font-5x7');

var opts = {
  width: 128,
  height: 64,
  address: 0x3C
};
 
var oled = new oled(i2cBus, opts);
  
var exports = module.exports = {};
 


exports.showLogo = function(){
	pngtolcd(__dirname+'/mi_logo.png', false, function(err, bitmap) {
		oled.buffer = bitmap;
		oled.update();
	});
}

exports.showPicture = function(filename){
	pngtolcd(__dirname+'/'+filename, false, function(err, bitmap) {
		oled.buffer = bitmap;
		oled.update();
	});
}


exports.showMessage = function(txt,size=1){
	oled.setCursor(1, 1);
	oled.writeString(font, size, txt, 1, true, 2);	
}

exports.clear = function(){
	oled.clearDisplay();
}