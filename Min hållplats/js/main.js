
// var search = stationSearch( 'maria' )


navigator.geolocation.getCurrentPosition(
	function ( position ) {

		nearbyStationSearch( position.coords['latitude'], position.coords['longitude'] );
	}
);

var startDate = 0;


document.getElementById("to-station").addEventListener( "input", ( x ) => {

	var value = document.getElementById("to-station").value;
	var nowDate = new Date();

	if ( value.length >= 3 && startDate + 5000 < nowDate.getTime() )
	{
		startDate = new Date().getTime();

		stationSearch( value )	
		
	}
	

});



//  Search functions

function stationSearch ( searchstring ) {

	var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/typeahead.json?key=9f5d4ac3eab04ffc86d1e7a8fcf14e1a&searchstring=' + searchstring + '&stationsonly=1&maxresults=5';

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data['ResponseData'])

		return data['ResponseData'];


	}).catch( function ( error ) {

		console.log(error);

	});

}

function nearbyStationSearch ( lat, long ) {

	var url = 'https://cors-anywhere.herokuapp.com/http://api.sl.se/api2/nearbystopsv2.json?key=053b6cc6d33946c1898645b6cf0b551c&originCoordLat=' + lat + '&originCoordLong=' + long;

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log( data['stopLocationOrCoordLocation'] )

		document.getElementById("from-station").value = data['stopLocationOrCoordLocation'][0]['StopLocation']['name'];

		return data;

	}).catch( function ( error ) {

		console.log( error );

	});
}



function getUpcoming ( ) {

	var url = 'https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&originExtId=9294&destExtId=9297';

}

