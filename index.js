var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var card = require('./app/smartcard.js');
var screen = require('./app/oled.js');
require('./app/rfid.js')

app.use(express.static('html/'));

var states = {};
var states_timer;

function reset(){
	states.state = 'reset';
}

function broadcast_states(){
	
}


io.on('connection', function(socket){
	console.log('a user connected');
	broadcast_states();

	socket.on('disconnect', function(){
		console.log('user disconnected');
	});

	//  clearInterval(states_timer);
	//  states_timer = setInterval(broadcast_states,1000);

	//--------------------------------------------------  
	socket.on('start_req', function(){
		states.state = 'wait_smartcard';
		screen.showPicture('insert_smartcard.png');
		broadcast_states();
	}); 

	socket.on('contact_req', function(data){
		console.log(data);
		states.state = 'wait_ldap';
		
		broadcast_states();
	}); 



	//--------------------------------------------------    
	card.on("insert",function(data){
		console.log(data);
		if (states.state == 'wait_smartcard'){			
			screen.clear();
			screen.showMessage(data.en_name,2);

			states.state = 'got_smartcard';
			states.card_data = data;
			broadcast_states();
		}
	});

  
  
});





card.on("remove",function(){
	screen.showLogo();
});

screen.showPicture('staff.png');
//screen.showPicture('place_rfid.png');
//screen.showPicture('insert_smartcard.png');
//screen.showLogo();


http.listen(8081, function(){
  console.log('listening on *:8081');
  //new_game();
  reset();
});
