document.getElementById("route-info-back-arrow").addEventListener( "click", function( event ) {

	window.location.href = './upcoming.html';
});



document.getElementById("activate-btn").addEventListener( "click", function( event ) {

	document.getElementById('popup-container').style.display = 'flex';
});

document.getElementById("popup-background").addEventListener( "click", function( event ) {

	document.getElementById('popup-container').style.display = 'none';
});



getRouteInfo();

function getRouteInfo() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-user1_specific.json';

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		pageLoad( data['data'][0] );

	}).catch( function ( error ) {

		console.log( error );
	});

}

function pageLoad( item_data ) {

	document.getElementById('upcoming-title').innerHTML = item_data['route'];

	var time = item_data['time'].replace(/\s/g, '').split('-');

	document.getElementById('time-title').innerHTML 	= '<b>' + time[0] + '</b> - ' + time[1];
	document.getElementById('line-nr').innerHTML 		= item_data['line'];
	document.getElementById('route-line').className 	+= ' ' + item_data['line_class'];
	document.getElementById('walk-time-title').innerHTML = '<b>' + item_data['walk_time'] + ' Minutes</b>';



	var date = new Date();
	var departure = time[0].split(':');

	// If you are not gonna be able to make a departure color the walk time title red
	if ( date.getHours() >= parseInt( departure[0] ) && ( date.getMinutes() + parseInt( item_data['walk_time'] ) ) >= parseInt( departure[1] ) ) 
	{
		document.getElementById('walk-time-title').style.color = '#FF4A4A';
	}
}



