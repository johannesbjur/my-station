document.getElementById("upcoming-back-arrow").addEventListener( "click", function( event ) {

	window.location.href = './index.html';
});

getUserData();

function getUserData() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-min_hållplats_user1.json'

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		var originName = data['data'][0]['originName'].replace(/ *\([^)]*\) */g, "");
		var destName = data['data'][0]['destName'].replace(/ *\([^)]*\) */g, "");
		var title = originName + ' - ' + destName;

		document.getElementById('upcoming-title').innerHTML = title;

		getUpcoming( data['data'][0] );

	}).catch( function ( error ) {

		console.log( error );
	});

}


function getUpcoming ( userData ) {

	// TODO better check
	if ( ( userData['originId'] || userData['destId'] ) == 'undefined') 
	{
		window.location.href = './index.html';
	}

	var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&originExtId=' + userData['originId'] + '&destExtId=' + userData['destId'];

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data)

		for( var i = 0 ; i < data['Trip'].length; i++ )
		{
			drawUpcomingItem( data['Trip'][i] );
		}
		

	}).catch( function ( error ) {

		console.log( error );
	});
}

function drawUpcomingItem( trip ) {

	var trip = trip['LegList']['Leg'][0]

	var line_style = '';

	if ( trip['Product']['name'].includes('grön') )
	{
		line_style = 'style="background-color: #43CC23; !important"';
	}
	else if ( trip['Product']['name'].includes('röd') )
	{
		line_style = 'style="background-color: #FF4A4A; !important"';
	}

	console.log(trip)

	var upcoming_item = 
		'<div class="route-item">\
			<div class="route-icon-container">\
				<img class="route-icon" src="./img/route_icon.svg">\
			</div>\
			<div class="route-time">\
				<p><b>' + trip['Origin']['time'].substring(0, 5) + '</b> - ' + trip['Destination']['time'].substring(0, 5) + '</p>\
				<div class="route-line" ' + line_style + '>\
					<p>' + trip['Product']['line'] + '</p>\
				</div>\
			</div>\
			<div class="forward-arrow-container">\
				<img class="forward-arrow" src="./img/forward_arrow.svg">\
			</div>\
		</div>';


	document.getElementById('route-item-container').innerHTML += upcoming_item;








}