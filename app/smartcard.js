var SerialPort = require('serialport');
var Iconv  = require('iconv').Iconv;

var iconv = new Iconv('ISO-8859-11','UTF-8');

var port = new SerialPort('/dev/serial0', {
	baudRate: 115200,
	encoding: 'binary'
	}, function (err) {
		if (err) {
			return console.log('Error: ', err.message);
	}
	console.log('Serial port opened successfully');
});


var state = 0;
var buffer = new Buffer('');

port.on('data', function (raw) {
//  console.log('[', state, '] Raw:', raw);

	buffer = Buffer.concat([buffer, raw]);

	if (raw[raw.length-1] != 0x0d)  // Unfinished line -> return
		return

	if (state == 10){
		data = buffer;
	}else{
		if ((state == 5) || (state == 8) || (state == 9))
			data = iconv.convert(buffer).toString('utf8').trim();
		else
			data = buffer.toString('utf8').trim();
	}

	buffer = new Buffer('');
	console.log('[', state, '] Data:', data);

	switch (state){
		case 1:
			th_id = data;

			state = 2;
			port.write([0x39,0x0D]); // read sex
			port.drain();
			return;
		case 2:
			sex = (data == '1'? 'M':'F');
			state = 3;
			port.write([0x38,0x0D]); // read DOB
			port.drain();
			return;
		case 3:
			dob = data;
			state = 4;
			port.write([0x37,0x0D]); // read EN name
			port.drain();
			return;
		case 4:
			en_name = data;
			state = 5;
			port.write([0x34,0x0D]); // Issue place
			port.drain();
			return;
		case 5:
			issue_place = data;
			state = 6;
			port.write([0x35,0x0D]); // Code
			port.drain();
			return;
		case 6:
			code = data;
			state = 7;
			port.write([0x36,0x0D]); // Issue date
			port.drain();
			return;
		case 7:
			issue_date = data;
			state = 8;
			port.write([0x33,0x0D]); // TH Name
			port.drain();
			return;
		case 8:
			th_name = data;
			state = 9;
			port.write([0x32,0x0D]); // Address
			port.drain();
			return;
		case 9:
			address = data;
			state = 10;
			port.write([0x31,0x0D]); // Picture
			port.drain();
			return;
		case 10:
			picture_data = data.toString('base64');		
			// Received all data
			console.log(picture_data);

			state = 0;
			return;
	}

	if (data.trim()=='REMOVE'){
		console.log('Card removed');
		state = 0;
	}

	if (data.trim()=='ERROR'){
		console.log('Error: resetted');
		state = 0;
	}

	if (data.trim()=='READY'){
		console.log('Ready to read');
		state = 1;
		port.write([0x30,0x0D]); // read th_id
		port.drain();
	}

});

