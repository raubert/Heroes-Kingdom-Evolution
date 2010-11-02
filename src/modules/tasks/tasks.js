/**
 * Map tools utilities.
 */
(function( $, MMHK ) {

MMHK.Tasks = {

	/**
	 * Adds the main map-tools container inside the page.
	 */
	addContainer: function() {
		$.addCss(
			"#mmhk-tasks.expanded { background-image:url('" + HOMMK.IMG_URL + "/gameFooter/ornament.png') }" +
			"#mmhk-tasks .item:hover { background-image:url('" + HOMMK.IMG_URL + "/gameFooter/hover.jpg') }" +
			"#mmhk-tasks .button div { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Label_Buttons.gif') }"
		);

		$("<div id=\"mmhk-tasks\">"
			+ "<div class=\"items\"></div>"
			+ "<div class=\"button\">"
				+ "<div class=\"left\"></div>"
				+ "<div class=\"text\">" + $.i18n.get( "tasks.title" ) + "</div>"
				+ "<div class=\"right\"></div>"
			+ "</div>"
		+ "</div>")
		.insertAfter( "#WorldMapContainer" )
		.find( '.button' )
			.toggle(function() {
				$( this ).parent().addClass( "expanded" );
			}, function() {
				$( this ).parent().removeClass( "expanded" );
			});
	},

	/**
	 * Adds an additional button inside the map-tool ones.
	 * 
	 * @param name {String}
	 *            the displayed name of the button
	 */
	addButton: function( name ) {
		return $( "<div class=\"item\">" + name + "</div>" ).appendTo( "#mmhk-tasks>.items" );
	},

	/**
	 * Sets a periodic task up.
	 * 
	 * @param module {Object}
	 *            the map module to be setup
	 */
	setupInterval: function( module ) {
		if ( $( "#mmhk-tasks").length == 0 ) {
			MMHK.Tasks.addContainer();
		}

		var id = null, done = {};

		this
		// action is triggered through a map-tools button
		.addButton( module.button[ 0 ] )
		// start/stop based on button clicks
		.toggle(function() {
			var self = $( this ), ok = 0, processing = 0, total = 0;
			// set the state and start execution
			self.addClass( "working" );
			$( "#mmhk-tasks>.button" ).addClass( "working" );
			module.start();
			var result = $( "<div class=\"result\">" + module.feedback( ok, total ) + "</div>" ).appendTo( self.text( module.button[ 1 ] ) );

			// event-based communication with background script
			$( module.message ).bind( module.event + ":done", function() {
				var data;
				try {
					data = JSON.parse( $( this ).text() );
				} catch ( e ) {
					data = {};
				} finally {
					$( this ).empty();
				}

				if ( data.status == "success" ) {
					ok += processing;
				}
				processing = 0;
				result.html( module.feedback( ok, total ) );
			});

			// the ID will be used to cancel the task
			id = setInterval(function() {
				if ( processing != 0 ) return; // still processing

				var data = [];
				module.process( data, done );
				if (data.length > 0) {
					// there's data: send it
					processing = data.length;
					total += processing;
					result.html( module.feedback( ok, total ) );

					// event-based communication with background script
					var evt = document.createEvent( "Event" );
					evt.initEvent( module.event + ":save", true, true );
					$( module.message )
						.text( JSON.stringify( data ) )
						[0].dispatchEvent( evt );
				}
			}, 2000);
			return false;
		}, function() {
			// cancel everything
			if (id != null) {
				clearInterval(id);
			}
			done = {};
			module.stop();
			// revert to default state
			$( module.message ).unbind( module.event + ":done" );
			$( this ).removeClass( "working" ).text( module.button[ 0 ] );
			if ( $( "#mmhk-tasks>.items>.working" ).length == 0 ) {
				$( "#mmhk-tasks>.button" ).removeClass( "working" );
			}
			return false;
		});
	}

};

})( MMHK.jQuery, MMHK );