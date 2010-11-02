HANDLERS[ "kingdom" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "google.php", {
			player: data.player,
			data: JSON.stringify( data.cities )
		}, callback );
	}

};