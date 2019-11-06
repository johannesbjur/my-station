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

		for( var i = 0 ; i < data['Trip'].length; i++ )
		{
			drawUpcomingItem( data['Trip'][i], i );
		}
		
		document.getElementById('gradient').style.height = document.getElementById('upcoming-card').offsetHeight + 'px';

	}).catch( function ( error ) {

		console.log( error );
	});
}

function drawUpcomingItem( trip, key ) {

	var trip = trip['LegList']['Leg'][0]

	var line_class = '';

	if ( trip['Product']['name'].includes('grön') )
	{
		line_class = 'route-line-green';
	}
	else if ( trip['Product']['name'].includes('röd') )
	{
		line_class = 'route-line-red';
	}

	var upcoming_item =
		'<div id="route-item-' + key + '" class="route-item" onclick="routeItemClick(this)">\
			<div class="route-icon-container">\
				<img class="route-icon" src="./img/route_icon.svg">\
			</div>\
			<div class="route-time">\
				<p class="route-time-p"><b>' + trip['Origin']['time'].substring(0, 5) + '</b> - ' + trip['Destination']['time'].substring(0, 5) + '</p>\
				<div class="route-line ' + line_class + '">\
					<p>' + trip['Product']['line'] + '</p>\
				</div>\
			</div>\
			<div class="forward-arrow-container">\
				<img class="forward-arrow" src="./img/forward_arrow.svg">\
			</div>\
		</div>';

	document.getElementById('route-item-container').innerHTML += upcoming_item;
}


function routeItemClick( element ) {


	// Gets time from hmtl element and removes spaces and everything between < and >
	var item_time = element.children[1].children[0].innerHTML.trim().replace(/<.*?>/g, '');;

	var line = element.children[1].children[1].innerHTML.trim().replace(/<.*?>/g, '');
	var line_class = element.children[1].children[1].className.split(' ')[1];

	var route = document.getElementById('upcoming-title').innerHTML;

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=user1_specific&xmail=bjurstromerjohannes@gmail.com&route='
	+ route + '&time=' + item_time + '&line=' + line + '&line_class=' + line_class;

	fetch( url )
	.then( function ( data ) {

		window.location.href = './route_info.html';

	}).catch( function ( error ) {

		console.log( error );
	});

}