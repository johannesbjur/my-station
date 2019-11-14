var startDateFrom = 0;

// Search input event listener for origin
document.getElementById("from-station").addEventListener( "input", function( event ) {

	var value = document.getElementById("from-station").value;
	var nowDateFrom = new Date();

	console.log(value)

	if ( value.length >= 3 && startDateFrom + 5000 < nowDateFrom.getTime() )
	{
		startDateFrom = new Date().getTime();

		searchStations( value, 'from' );
		
	}
	

}, false);

var startDateTo = 0;

// Search input event listener for destination
document.getElementById("to-station").addEventListener( "input", function( event ) {

	var value = document.getElementById("to-station").value;
	var nowDateTo = new Date();

	if ( value.length >= 3 && startDateTo + 5000 < nowDateTo.getTime() )
	{
		startDateTo = new Date().getTime();

		searchStations( value, 'to' );
	}

}, false);



// Event listener for search form
document.getElementById("index-form").addEventListener( "submit", function( event ) {

	event.preventDefault()

	var elements = document.getElementById("index-form").elements;
	var formData = {};


	// Loops through elements in form and saves values to formData
	for( var i = 0 ; i < elements.length; i++ )
	{
		if ( elements[i].value ) 
		{
			switch( elements[i].name )
			{
				case 'from-station': 
					formData['originName'] = elements[i].value;
					break;
				case 'from-station-id': 
					formData['originId'] = elements[i].value;
					break;
				case 'to-station': 
					formData['destName'] = elements[i].value;
					break;
				case 'to-station-id': 
					formData['destId'] = elements[i].value;
					break;
				case 'user-location-long':
					formData['userLong'] = elements[i].value;
					break;
				case 'user-location-lat':
					formData['userLat'] = elements[i].value;
					break;
				case 'from-station-long':
					formData['fromLong'] = elements[i].value;
					break;
				case 'from-station-lat':
					formData['fromLat'] = elements[i].value;
					break;
				case 'remember-checkbox':
					formData['remember'] = elements[i].checked;
					break;
				default:
					break;
			}
		}
	}


	postRouteDetails( formData );

}, false);


document.getElementById("icon-location").addEventListener( "click", function( event ) {

	getUserLocation();

}, false);




var auto_elements = document.getElementsByClassName('autocomplete');

for ( var i = 0; i < auto_elements.length; i++) 
{
	auto_elements[i].style.width 	= document.getElementById('from-input-container').offsetWidth + 'px';
	auto_elements[i].style.display 	= 'none';

}


getUserLocation();

// Gets user location
function getUserLocation() {

	navigator.geolocation.getCurrentPosition(
		function ( position ) {

			getNearbyStation( position.coords['latitude'], position.coords['longitude'] );
		}
	);
}

function selectAutoItem( item, input ) {

	console.log(item.children)

	if ( input === 'from' ) 
	{
		document.getElementById("from-station").value 		= item.children[0].innerHTML;
		document.getElementById("from-station-id").value 	= item.children[1].value;


		document.getElementById("from-station-lat").value 	= item.children[2].value;
		document.getElementById("from-station-long").value 	= item.children[3].value;

		document.getElementById("from-auto").style.display 	= 'none';
		document.getElementById("from-input-container").style.borderRadius = '20px';
	}
	else if ( input === 'to' ) 
	{
		document.getElementById("to-station").value 		= item.children[0].innerHTML;
		document.getElementById("to-station-id").value 	= item.children[1].value;

		document.getElementById("to-auto").style.display 	= 'none';
		document.getElementById("to-input-container").style.borderRadius = '20px';
	}
}


//  Search functions

function searchStations ( searchstring, input ) {

	var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=9f5d4ac3eab04ffc86d1e7a8fcf14e1a&searchstring=' + searchstring + '&stationsonly=1&maxresults=3';


	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data['ResponseData'])

		if ( input == 'to' ) 
		{
			// Clear and add styles to auto complete div
			document.getElementById('to-auto').innerHTML = '';
			document.getElementById('to-input-container').style.borderRadius  = '20px 20px 0 0';
			document.getElementById('to-auto').style.display = 'block';

			console.log ( data['ResponseData'])

			for ( var i = 0; i < data['ResponseData'].length; i++ ) 
			{
				var last_style = '';
				if ( i == data['ResponseData'].length - 1 ) 
				{
					last_style = 'style="border-radius: 0 0 20px 20px;"'
				}
				

				// Writes autocomplete items
				document.getElementById('to-auto').innerHTML += 
					'<div class="auto-item" ' + last_style + ' onclick="selectAutoItem(this, \'to\')">\
						<p>' + data['ResponseData'][i]['Name'] + '</p>\
						<input id="auto-item-id-' + i + '" type="hidden" name="auto-item-id-' + i + '" value="' + data['ResponseData'][i]['SiteId'] + '">\
					</div>';
			}

		}
		else if ( input == 'from' ) 
		{
			console.log(data['ResponseData'])

			// saves from stations coordinates 
			document.getElementById('from-station-long').value = data['ResponseData'][0]['X'].slice(0, 2) + '.' + data['ResponseData'][0]['X'].slice(2);
			document.getElementById('from-station-lat').value = data['ResponseData'][0]['Y'].slice(0, 2) + '.' + data['ResponseData'][0]['Y'].slice(2);

			// Clear and add styles to auto complete div
			document.getElementById('from-auto').innerHTML = '';
			document.getElementById('from-input-container').style.borderRadius  = '20px 20px 0 0';
			document.getElementById('from-auto').style.display = 'block';

			for ( var i = 0; i < data['ResponseData'].length; i++ ) 
			{
				var last_style = '';
				if ( i == data['ResponseData'].length - 1 ) 
				{
					last_style = 'style="border-radius: 0 0 20px 20px;"'
				}
				

				// Writes autocomplete items
				document.getElementById('from-auto').innerHTML += 
					'<div class="auto-item" ' + last_style + ' onclick="selectAutoItem(this, \'from\')">\
						<p>' + data['ResponseData'][i]['Name'] + '</p>\
						<input id="auto-item-id-' + i + '" type="hidden" name="auto-item-id-' + i + '" value="' + data['ResponseData'][i]['SiteId'] + '">\
						<input id="auto-item-lat-' + i + '" name="auto-item-lat-' + i + '" type="hidden" value="' + data['ResponseData'][i]['Y'].slice(0, 2) + '.' + data['ResponseData'][0]['Y'].slice(2) + '">\
						<input id="auto-item-long-' + i + '" name="auto-item-long-' + i + '" type="hidden" value="' + data['ResponseData'][i]['X'].slice(0, 2) + '.' + data['ResponseData'][0]['X'].slice(2) + '">\
					</div>';
			}
		}

	}).catch( function ( error ) {

		console.log(error);

	});

}


// Gets nearby stations from trafiklab api
function getNearbyStation ( lat, long ) {

	var url = 'https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/nearbystopsv2.json?key=053b6cc6d33946c1898645b6cf0b551c&originCoordLat=' + lat + '&originCoordLong=' + long;

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {


		console.log('lat: ' + lat , 'long: ' + long )
		console.log( data['stopLocationOrCoordLocation'] )

		document.getElementById("from-station").value 			= data['stopLocationOrCoordLocation'][0]['StopLocation']['name'];
		document.getElementById("from-station-id").value 		= data['stopLocationOrCoordLocation'][0]['StopLocation']['mainMastExtId'];
		document.getElementById("user-location-lat").value		= lat;
		document.getElementById("user-location-long").value		= long;

		document.getElementById("from-station-long").value	= data['stopLocationOrCoordLocation'][0]['StopLocation']['lon'];
		document.getElementById("from-station-lat").value	= data['stopLocationOrCoordLocation'][0]['StopLocation']['lat'];

		

	}).catch( function ( error ) {

		console.log( error );

	});
}


// Posts form data to server
function postRouteDetails( formData ) {

	console.log( formData );

	if ( formData['remember'] ) 
	{
		formData['remember'] = 1;
	}
	else
	{
		formData['remember'] = 0;
	}

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=min_h%C3%A5llplats_user1&xmail=bjurstromerjohannes@gmail.com' 
	+ '&originName=' + formData['originName'] + '&originId=' + formData['originId'] + '&destName=' + formData['destName'] + '&destId=' + formData['destId'] 
	+ '&userLat=' + formData['userLat']+ '&userLong=' + formData['userLong'] + '&fromLat=' + formData['fromLat'] + '&fromLong=' + formData['fromLong'] + '&remember=' + formData['remember'];

	console.log( url)

	fetch( url )
	.then( function ( resp ) {

		console.log(resp)

		window.location.href = './upcoming.html';


	}).catch( function ( error ) {

		console.log( error );
	});
}


