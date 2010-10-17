/**
 * Utilities: contains locale definition.
 */
(function( $ ) {

$.extend({

	i18n: {

		language: "en",
	
		resources: {},

		initialize: function( lang ) {
			var choices = [ lang, lang.split( "_" )[ 0 ], "en" ];
			for ( var i = 0; i < choices.length; i++ ) {
				if ( this.resources[ choices[ i ] ] != undefined ) {
					this.language = choices[ i ];
					break;
				}
			}
		},

		get: function( key ) {
			var s = this.resources[ this.language ][ key ];
			if ( !s ) return key;

			for ( var i = 1; i < arguments.length; i++ ) {
				s = s.replace( "{" + i + "}", arguments[ i ] );
			}
			return s;
		}

	}

});

})( MMHK.jQuery );
