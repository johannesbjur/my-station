navigator.geolocation.getCurrentPosition(
	function ( position ) {

		getNearbyStation( position.coords['latitude'], position.coords['longitude'] );
	}
);


var startDateTo = 0;

document.getElementById("to-station").addEventListener( "input", function( event ) {

	var value = document.getElementById("to-station").value;
	var nowDateTo = new Date();

	if ( value.length >= 3 && startDateTo + 5000 < nowDateTo.getTime() )
	{
		startDateTo = new Date().getTime();

		searchStations( value, 'to' )	
		
	}
	

}, false);



var startDateFrom = 0;

document.getElementById("from-station").addEventListener( "input", function( event ) {

	var value = document.getElementById("from-station").value;
	var nowDateFrom = new Date();

	console.log(value)

	if ( value.length >= 3 && startDateFrom + 5000 < nowDateFrom.getTime() )
	{
		startDateFrom = new Date().getTime();

		searchStations( value, 'from' )	
		
	}
	

}, false);



document.getElementById("index-form").addEventListener( "submit", function( event ) {

	event.preventDefault()

	var elements = document.getElementById("index-form").elements;
	var formData = {};

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
				case 'user-location':
					formData['coords'] = elements[i].value;
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
			// hardcoded destination
			// TODO change to dropdowns
			document.getElementById("from-station").value 		= data['ResponseData'][0]['Name'];
			document.getElementById("from-station-id").value 	= data['ResponseData'][0]['SiteId'];
		}




	}).catch( function ( error ) {

		console.log(error);

	});

}

function getNearbyStation ( lat, long ) {

	var url = 'https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/nearbystopsv2.json?key=053b6cc6d33946c1898645b6cf0b551c&originCoordLat=' + lat + '&originCoordLong=' + long;

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {


		console.log('lat: ' + lat , 'long: ' + long )
		console.log( data['stopLocationOrCoordLocation'] )

		document.getElementById("from-station").value 		= data['stopLocationOrCoordLocation'][0]['StopLocation']['name'];
		document.getElementById("from-station-id").value 	= data['stopLocationOrCoordLocation'][0]['StopLocation']['mainMastExtId'];
		document.getElementById("user-location").value		= '&lat=' + lat + '&long=' + long;

		return data;

	}).catch( function ( error ) {

		console.log( error );

	});
}

function postRouteDetails( formData ) {

	console.log( formData );

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/sendform.aspx?xid=min_h%C3%A5llplats_user1&xmail=bjurstromerjohannes@gmail.com&originName=' 
	+ formData['originName'] + '&originId=' + formData['originId'] + '&destName=' + formData['destName'] + '&destId=' + formData['destId'] + '&coords=' + formData['coords'];

	console.log( url)

	fetch( url )
	.then( function ( resp ) {

		console.log(resp)

		window.location.href = './upcoming.html';


	}).catch( function ( error ) {

		console.log( error );
	});
}