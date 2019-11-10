// Event listener for back button
document.getElementById("route-info-back-arrow").addEventListener( "click", function( event ) {

	window.location.href = './upcoming.html';
});

// Show popup event listeners
document.getElementById("activate-btn").addEventListener( "click", function( event ) {

	document.getElementById('popup-container').style.display = 'flex';
});

document.getElementById("popup-background").addEventListener( "click", function( event ) {

	document.getElementById('popup-container').style.display = 'none';
});

document.getElementById("accept-btn").addEventListener( "click", function( event ) {

	document.getElementById('popup-container').style.display = 'none';

});

getRouteInfo();


// Gets data saved from last page
function getRouteInfo() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-user1_specific.json';

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		// Starts page load after data is received
		pageLoad( data['data'][0] );

	}).catch( function ( error ) {

		console.log( error );
	});
}


// Inserts values from item_data into html elements on page and in popup
function pageLoad( item_data ) {

	document.getElementById('upcoming-title').innerHTML = item_data['route'];

	// Regex removes all spaces from string and splits on -
	var time = item_data['time'].replace(/\s/g, '').split('-');

	var date = new Date();
	var departure = time[0].split(':');

	var departure_hours		= parseInt( departure[0] );
	var departure_minutes 	= parseInt( departure[1] ) - parseInt( item_data['walk_time'] );

	//  Manualy checking if the values work as time strings without using a date object
	if ( departure_minutes < 0 ) 
	{
		departure_minutes += 60;
		departure_hours -= 1;
	}
	if ( departure_minutes.toString().length == 1 ) 
	{
		departure_minutes = '0' + departure_minutes;
	}

	// Inserts values from item_data into page html elements
	document.getElementById('time-title').innerHTML 	= '<b>' + time[0] + '</b> - ' + time[1];
	document.getElementById('line-nr').innerHTML 		= item_data['line'];
	document.getElementById('route-line').className 	+= ' ' + item_data['line_class'];
	document.getElementById('walk-time-title').innerHTML = '<b>' + item_data['walk_time'] + ' Minutes</b>';


	// Inserts values from item_data into popup elements
	document.getElementById('popup-time-title').innerHTML 	= '<b>' + time[0] + '</b> - ' + time[1];
	document.getElementById('popup-line-nr').innerHTML 		= item_data['line'];
	document.getElementById('popup-route-line').className 	+= ' ' + item_data['line_class'];
	// document.getElementById('popup-alarm-time').innerHTML 	= departure_hours + ':' + departure_minutes;

	var departure_time = new Date();

	departure_time.setHours(departure_hours);
	departure_time.setMinutes(departure_minutes);

	alarmTimer( departure_time );

	// If you are not gonna be able to make a departure color the walk time title red
	if ( date.getHours() >= parseInt( departure[0] ) && ( date.getMinutes() + parseInt( item_data['walk_time'] ) ) >= parseInt( departure[1] ) ) 
	{
		document.getElementById('walk-time-title').style.color = '#FF4A4A';
		// disable activate btn
		document.getElementById("activate-btn").disabled = true;
		document.getElementById("activate-btn").style.background = '#616161'		    
	}
}


function alarmTimer( departure_time ) {

	setInterval( function() {

		var date = new Date()

		var minutes = Math.floor((departure_time.getTime() - date.getTime()) % (1000 * 60 * 60) / (1000 * 60))
		var seconds = Math.floor((departure_time.getTime() - date.getTime()) % (1000 * 60) / 1000)

		// Updates timer html element
		document.getElementById("popup-countdown").innerHTML = minutes + ':' + seconds;

	}, 1000);

}
