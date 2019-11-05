document.getElementById("upcoming-back-arrow").addEventListener( "click", function( event ) {

	window.location.href = './index.html';
});

getUserData();

function getUserData() {

	var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-min_hållplats_user1.json'

	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		getUpcoming( data['data'][0] );

	}).catch( function ( error ) {

		console.log( error );
	});

}


function getUpcoming ( userData ) {

	// var url = 'https://cors-anywhere.herokuapp.com/https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&originExtId=' + userData['orginId'] + '&destExtId=' + userData['destId'];
	var url = 'https://api.sl.se/api2/TravelplannerV3_1/trip.json?key=5a29ea3c0cf64b01ba02a0add5e4784a&originExtId=' + userData['orginId'] + '&destExtId=' + userData['destId'];



	console.log(userData);
	console.log(url);

/*
	fetch( url )
	.then( ( resp ) => resp.json() )
	.then( function ( data ) {

		console.log(data)


	}).catch( function ( error ) {

		console.log( error );
	});
	*/

}