/**
 * Map module: adds global 'map' export button in tasks.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Carto",

	/**
	 * Task button label.
	 */
	button: "carto.button",

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		if ( $( "#MMHK-rights.cartograph" ).text() != "write" ) {
			// not allowed; no need to go further
			return;
		}

		MMHK.Tasks.setupOndemand( this );
	},

	/**
	 * Provides feedback about the current progress.
	 */
	feedback: function(sent, total) {
		return "<tt>" + ( sent <= 0 ? "-" : sent ) + "</tt> / <tt>" + ( total <= 0 ? "-" : total ) + "</tt> " + $.i18n.get( "map.regions" );
	},

	/**
	 * Proceeds with map recovery.
	 * 
	 * @param publish
	 *            the method to call when an additional zone has been recovered
	 */
	run: function( callback ) {
		if ( confirm( $.i18n.get( "carto.launch" ) ) ) {
			$( "#mmhk-tasks .item.Carto" ).unbind( "click" ).css( "cursor", "wait" );
			this.queryRegions( 1, 1, callback );
		}
	},

	/**
	 * Generates the markup that describes the current progression.
	 * 
	 * @param batch {int}
	 *            the configured batch size
	 * @param x {int}
	 *            the x-coordinate of the last batch
	 * @param y {int}
	 *            the y-coordinate of the last batch
	 * @param [message] {String}
	 *            an optional message key explaining the current progression
	 */
	getProgressionMarkup: function( batch, x, y, message ) {
		var markup = "<div class=\"carto\">";

		markup += "<table><tbody>";
		for ( var i = 0; i < 280; i+=batch ) {
			markup += "<tr>";
			for ( var j = 0; j < 280; j+=batch ) {
				markup += "<td>";
				if ( y > i || ( y == i && x > j ) ) {
					markup += "X";
				} else {
					markup += "&nbsp;";
				}
				markup += "</td>";
			}
			markup += "</tr>";
		}
		markup += "</tbody></table>";

		if ( message != null ) {
			markup += "<span>" + message + "</span>";
		}

		markup += "</div>";

		return markup;
	},

	/**
	 * Issues a direct query that retrieves map data.
	 * 
	 * @param x {int}
	 *            the x-coordinate of the zone
	 * @param y {int}
	 *            the y-coordinate of the zone
	 * @param publish
	 *            the method to call when an additional zone has been recovered
	 */
	queryRegions: function( x, y, publish ) {
		var self = this;
		var world = HOMMK.elementPool.get( "WorldMap" ).values()[ 0 ].elementId;
		var batch = 70;

		publish( this.getProgressionMarkup( batch, x-1, y-1, $.i18n.get( "carto.get" ) ) );
		// query HOMMK's map with the current coordinates
		$.post(
			"http://mightandmagicheroeskingdoms.ubi.com/ajaxRequest/getContent",
			"json=" + JSON.stringify({
				elParamList: [ {
					elementType: "Region",
					ownerType: "WorldMap",
					ownerId: world,
					x: x,
					y: y,
					w: batch,
					h: batch
				} ]
			}),
			function( json ) {
				publish( self.getProgressionMarkup( batch, x-1, y-1, $.i18n.get( "carto.parse" ) ) );
				var data = {
					coords: {
						x1: x,
						y1: y,
						x2: x + batch,
						y2: y + batch
					},
					values: []
				};
				// extract cell data from reponse
				var regions = json.d[ "WorldMap" + world + "RegionList" ];
				for (var i = 0; i < regions.length; i++) {
					data.values.push( self.extractCellData( regions[ i ] ) );
				}
				if ( data.values.length > 0 ) {
					publish( self.getProgressionMarkup( batch, x-1, y-1, $.i18n.get( "carto.send" ) ) );

					// event-based communication with background script
					var evt = document.createEvent( "Event" );
					evt.initEvent( "carto:save", true, true );
					$( "#CartoMessageContent" ).one( "carto:done", function() {
						// setup next coordinates
						x += batch;
						if ( x >= 280 ) {
							x = 1;
							y += batch;
						}
						if ( y < 280 ) {
							// wait for some seconds before proceeding with the rest
							var timeout = Math.floor( Math.random() * 4001 ) + 4000;
							publish( self.getProgressionMarkup( batch, x-1, y-1, $.i18n.get( "carto.next", timeout ) ) );
							setTimeout(function( self, x, y, publish ) {
								self.queryRegions( x, y, publish );
							}, timeout, self, x, y, publish );
						} else {
							// all done
							publish( self.getProgressionMarkup( batch, x-1, y-1, $.i18n.get( "carto.done", timeout ) ) );
							$( "#mmhk-tasks .item.Carto" ).css( "cursor", "not-allowed" );
						}
					}).text( JSON.stringify( data ) )[0].dispatchEvent( evt );;
				}
			},
			"json"
		);
	},

	/**
	 * Extracts the cell settings from the corresponding HOMMK region object.
	 * 
	 * @param region {Object}
	 *            the region to extract data from
	 */
	extractCellData: function( region ) {
		var type = region.type;
		if ( type == "building" && region.rB ) {
			switch ( region.rB.tN ) {
			case "LEARNING_STONE":
				type = "dolmen";
				break;
			case "DWARVEN_TREASURY":
				type = "treasury";
				break;
			case "SPHINX":
				type = "sphinx";
				break;
			}
		}
		var cell = {
			id: region.id,
			x: region.x,
			y: region.y,
			city: region.cN,
			faction: region.fctN,
			grail: region.hG == 1,
			player: {
				id: region.pId,
				name: region.pN
			},
			type: type,
			cells: region.aRL
		};
		if (region._iaId) {
			cell.league = {
				id: region._iaId,
				name: region.iAN,
				color: region._iaCol
			};
		}

		return cell;
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
