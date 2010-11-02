HANDLERS[ "spy" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "spy.php", {
			data: JSON.stringify( data )
		}, callback );
	}

};