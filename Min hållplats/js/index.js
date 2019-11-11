// Gets user location
navigator.geolocation.getCurrentPosition(
	function ( position ) {

		getNearbyStation( position.coords['latitude'], position.coords['longitude'] );
	}
);


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

	for( var i = 0 ; i < elements.length; i++ )
	{

		console.log(elements[i].name)
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
				default:
					break;
			}
		}
	}


	postRouteDetails( formData );

}, false);


//  Search functions

function searchStations ( searchstring, input ) {

	var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=9f5d4ac3eab04ffc86d1e7a8fcf14e1a&searchstring=' + searchstring + '&stationsonly=1&maxresults=5';



	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data['ResponseData'])

		if ( input == 'to' ) 
		{
			// hardcoded destination
			// TODO change to dropdowns
			document.getElementById("to-station").value 	= data['ResponseData'][0]['Name'];
			document.getElementById("to-station-id").value 	= data['ResponseData'][0]['SiteId'];
		}
		else if ( input == 'from' ) 
		{

			// saves from stations coordinates 
			document.getElementById('from-station-long').value = data['ResponseData'][0]['X'].slice(0, 2) + '.' + data['ResponseData'][0]['X'].slice(2);
			document.getElementById('from-station-lat').value = data['ResponseData'][0]['Y'].slice(0, 2) + '.' + data['ResponseData'][0]['Y'].slice(2);

			// hardcoded destination
			// TODO change to dropdowns
			document.getElementById("from-station").value 		= data['ResponseData'][0]['Name'];
			document.getElementById("from-station-id").value 	= data['ResponseData'][0]['SiteId'];
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

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=min_h%C3%A5llplats_user1&xmail=bjurstromerjohannes@gmail.com' 
	+ '&originName=' + formData['originName'] + '&originId=' + formData['originId'] + '&destName=' + formData['destName'] + '&destId=' + formData['destId'] 
	+ '&userLat=' + formData['userLat']+ '&userLong=' + formData['userLong'] + '&fromLat=' + formData['fromLat'] + '&fromLong=' + formData['fromLong'];

	console.log( url)

	fetch( url )
	.then( function ( resp ) {

		console.log(resp)

		window.location.href = './upcoming.html';


	}).catch( function ( error ) {

		console.log( error );
	});
}


