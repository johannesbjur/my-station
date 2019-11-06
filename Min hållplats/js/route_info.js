document.getElementById("route-info-back-arrow").addEventListener( "click", function( event ) {

	window.location.href = './upcoming.html';
});

getRouteInfo();

function getRouteInfo() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-user1_specific.json';

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		pageUpdate(data['data'][0])

	}).catch( function ( error ) {

		console.log( error );
	});

}

function pageUpdate( item_data ) {

	console.log(item_data)

	document.getElementById('upcoming-title').innerHTML = item_data['route'];

	var time = item_data['time'].replace(/\s/g, '').split('-');

	document.getElementById('time-title').innerHTML = '<b>' + time[0] + '</b> - ' + time[1];

	console.log()

	document.getElementById('line-nr').innerHTML = item_data['line'];

	document.getElementById('route-line').className += ' ' + item_data['line_class']
	

}