
var url = 'https://cors-anywhere.herokuapp.com/http://primat.se/services/data/bjurstromerjohannes@gmail.com-min_hållplats_user1.json';

fetch( url )
.then( ( resp ) => resp.json() )
.then( function ( data ) {

	if ( (data['data'][0]['remember'] == '1' || data['data'][0]['remember'] == 1) && ( data['data'][0]['originId'] || data['data'][0]['destId'] ) !== 'undefined' ) 
	{
		window.location.href = './upcoming.html';
	}
});