HANDLERS[ "battle" ] = function( action, data, callback ) {

	if ( action == "save" ) {
		sendData( "battle.php", {
			data: JSON.stringify( data )
		}, callback );
	}

};