// Event listener for back button
document.getElementById("upcoming-back-arrow").addEventListener( "click", function( event ) {

	console.log("back")


	// Clear user data before redirect
	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=min_h%C3%A5llplats_user1&xmail=bjurstromerjohannes@gmail.com&remember=0';

	fetch( url )
	.then( function ( resp ) {

		console.log( resp )

		window.location.href = './index.html';


	}).catch( function ( error ) {

		console.log( error );
	});

});

getUserData();


// Gets user data from server then calls getUpcoming()
function getUserData() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-min_hållplats_user1.json';

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data)

		// Fixes route title with regex
		// Removes all between '(' and ')'
		var originName = data['data'][0]['originName'].replace(/ *\([^)]*\) */g, "");
		var destName = data['data'][0]['destName'].replace(/ *\([^)]*\) */g, "");
		var title = originName + ' - ' + destName;

		document.getElementById('upcoming-title').innerHTML = title;

		getUpcoming( data['data'][0] );


		// Refresh upcoming every minute
		setInterval( function() {

			console.log('update')

			getUpcoming( data['data'][0] );

		}, 60000);

	}).catch( function ( error ) {

		console.log( error );
	});

}

// Gets upcoming routes with user data from index.html as user1
function getUpcoming ( user_data ) {

	if ( ( user_data['originId'] || user_data['destId'] ) == 'undefined') 
	{
		window.location.href = './index.html';
	}

	if ( ( user_data['userLong'] || user_data['userLat'] ) == 'undefined' ) 
	{
		// Trip API request without coordinates
		var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&originExtId=' 
		+ user_data['originId'] + '&destExtId=' + user_data['destId'];
	}
	else
	{
		// Trip API request with coordinates
		var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&destId='
		+ user_data['destId'] + '&originCoordLat=' + user_data['userLat'] + '&originCoordLong=' + user_data['userLong'] + '&originWalk=1&via=vald&viaId=' + user_data['originId'];
	}

	var km = distance( user_data['userLat'], user_data['userLong'], user_data['fromLat'], user_data['fromLong'] );
	var walk_time =  Math.round( (720 * km)  / 60);

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		document.getElementById('route-item-container').innerHTML = '';

		// Loops through route item data and draws route items
		for( var i = 0 ; i < data['Trip'].length; i++ )
		{
			drawUpcomingItem( data['Trip'][i], i, walk_time );
		}
		
		// Changes background height depending on upcoming-card div
		document.getElementById('gradient').style.height = document.getElementById('upcoming-card').offsetHeight + 'px';

	}).catch( function ( error ) {

		console.log( error );
	});
}


// Draws an upcoming route item
function drawUpcomingItem( trip, key, walk_time ) {

	var route = '';
	// var walk_time = 0;
	var line_class = '';

	for ( var i = 0 ; i < trip['LegList']['Leg'].length; i++ ) 
	{
		if ( trip['LegList']['Leg'][i]['type'] !== 'WALK' ) 
		{
			route = trip['LegList']['Leg'][i]
		}
	}

	// Checks what color the subway line has and saves css class
	if ( route['Product']['name'].includes('grön') )
	{
		line_class = 'route-line-green';
	}
	else if ( route['Product']['name'].includes('röd') )
	{
		line_class = 'route-line-red';
	}

	// Html string for upcoming route item
	var upcoming_item =
		'<div id="route-item-' + key + '" class="route-item" onclick="routeItemClick(this)">\
			<div class="route-icon-container">\
				<img class="route-icon" src="./img/route_icon.svg">\
			</div>\
			<div class="route-time">\
				<p class="route-time-p"><b>' + route['Origin']['time'].substring(0, 5) + '</b> - ' + route['Destination']['time'].substring(0, 5) + '</p>\
				<div class="route-line ' + line_class + '">\
					<p>' + route['Product']['line'] + '</p>\
				</div>\
			</div>\
			<div class="forward-arrow-container">\
				<img class="forward-arrow" src="./img/forward_arrow.svg">\
			</div>\
			<input id="walk-time-' + key + '" type="hidden" value="' + walk_time + '">\
		</div>';

	// Adds upcoming route item string to html element
	document.getElementById('route-item-container').innerHTML += upcoming_item;
	

}

// Saves values from specific route item and redirects 
function routeItemClick( element ) {

	console.log(element)

	// Gets values from hmtl elements and removes spaces and everything between < and >
	var item_time 	= element.children[1].children[0].innerHTML.trim().replace(/<.*?>/g, '');;
	var line 		= element.children[1].children[1].innerHTML.trim().replace(/<.*?>/g, '');
	var line_class 	= element.children[1].children[1].className.split(' ')[1];
	var walk_time 	= element.children[3].value;

	var route = document.getElementById('upcoming-title').innerHTML;

	// Saves values to server then relocates
	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=user1_specific&xmail=bjurstromerjohannes@gmail.com&route='
	+ route + '&time=' + item_time + '&line=' + line + '&line_class=' + line_class + '&walk_time=' + walk_time;

	fetch( url )
	.then( function ( data ) {		

		window.location.href = './route_info.html';

	}).catch( function ( error ) {

		console.log( error );
	});

}



// Calculates distance between 2 sets of coordinates
// Returns in kilometers
function distance( lat1, lon1, lat2, lon2 ) {

    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var radlon1 = Math.PI * lon1/180
    var radlon2 = Math.PI * lon2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515

    return dist * 1.609344
}