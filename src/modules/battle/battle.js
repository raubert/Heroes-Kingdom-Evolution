/**
 * Battle module: adds battle export button.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Battle",

	/**
	 * Initializes the module
	 */
	initialize: function(rights) {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; we default to forum export
			MMHK.hijack( HOMMK.BattleResultDetailedMessage.prototype, "addToDOM", this.addForumIcon, this );
		}
		else {
			// icon has to be added in scouting reports
			MMHK.hijack( HOMMK.BattleResultDetailedMessage.prototype, "addToDOM", this.addExportIcon, this );

			// event-based communication with background script
			$( "#BattleMessageContent" ).bind( "battle:done", this.showExportResult );
		}
	},

	/**
	 * Adds the icon that will trigger the specified callback.
	 * 
	 * @param obj {Object}
	 *            the spy report object
	 * @param label {Object}
	 *            the label to place on the icon
	 * @param onclick {Object}
	 *            the callback when the icon is clicked
	 */
	addIcon: function( obj, label, onclick ) {
		$("<div></div>", {
			id: obj.elementType + obj.elementId + "Export"
		})
			.addClass( "battle ui-corner-all" )
			.click( onclick )
			.append( "<div class=\"left\"></div><div class=\"text\">" + $.i18n.get( label ) + "</div><div class=\"right\"></div>" )
				.children()
					.filter( '.left' )
						.css( "background-image", "url('" + HOMMK.IMG_URL + "/portal/btnLatestNewsBase.gif')" )
					.end()
					.filter( '.text' )
						.css( "background-image", "url('" + HOMMK.IMG_URL + "/portal/cartoucheBg.gif')" )
					.end()
					.filter( '.right' )
						.css( "background-image", "url('" + HOMMK.IMG_URL + "/portal/cartoucheEnd.gif')" )
					.end()
				.end()
			.appendTo( "#" + obj.elementType + obj.elementId + "Body" );
	},

	/**
	 * Adds the icon that will trigger the spy report export.
	 * 
	 * @param obj {Object}
	 *            the spy report object
	 */
	addExportIcon: function( obj ) {
		var self = this;
		this.addIcon( obj, "battle.export", function() {
			if ( !$( this ).hasClass( "working" ) && !$( this ).hasClass( "done" ) ) {
				// process if not already working
				var data = self.process( obj );
				if ( data ) {
					$( this ).addClass( "working" );
					// event-based communication with background script
					var evt = document.createEvent( "Event" );
					evt.initEvent( "battle:save", true, true );
					$( "#BattleMessageContent" )
						.attr( "rel", "#" + obj.elementType + obj.elementId + "Export" )
						.text( JSON.stringify( data ) )
						[0].dispatchEvent( evt );
				}
			}
		});
	},

	/**
	 * Adds the icon that will format the report for forums.
	 * 
	 * @param obj {Object}
	 *            the spy report object
	 */
	addForumIcon: function( obj ) {
		var self = this;
		this.addIcon( obj, "battle.forum", function() {
			alert("pikaboo!");
		});
	},

	/**
	 * Gives some feedback to the user.
	 */
	showExportResult: function() {
		var message = $( this ), data;
		try {
			data = JSON.parse( message.text() );
		} catch ( e ) {
			data = {};
		} finally {
			message.empty();
		}

		var button = $( message.attr( "rel" ) ).removeClass( "working" );
		message.removeAttr( "rel" );
		if ( data.status == "success" ) {
			button.addClass( "done" ).attr( "title", $.i18n.get( "battle.saved" ) ).append( "<div class=\"okay\"></div>" );
		} else {
			button.append( "<div class=\"error\"></div>" ).children( ".error" ).attr( "title", $.i18n.get( "battle.fail" ) );
		}
	},

	/**
	 * What needs to be cleaned up in the spy report markup.
	 */
	cleanup: [
		{ pattern: / (unitstack)?id="[^"]+"/gi, replace: "" },
		{ pattern: /class=""/gi, replace: "" },
		{ pattern: /http:\/\/static5.cdn.ubi.com\/u\/HOMMK\/mightandmagicheroeskingdoms.ubi.com\/[0-9\.\-]+-MTR\/img\//gi, replace: "img/mmhk/" }
	],

	/**
	 * Processes the given spy report object.
	 * 
	 * @param obj {Object}
	 *            the spy report object
	 * @return {Object} the data to send
	 */
	process: function( obj ) {
		var report = obj.content, content = report.contentJSON;

		if ( content ) {
			var battle = {
				date: report.creationDate
			};
			if ( report.type == "BATTLE_RESULT_ATTACKER" ) {
				battle.attacker = {
					id: report.exp_playerId,
					name: report.exp_playerName
				};
				battle.defender = {
					name: content.enemyPlayerName
				};
			} else if ( report.type == "BATTLE_RESULT_DEFENDER" ) {
				battle.attacker = {
					name: content.enemyPlayerName
				};
				battle.defender = {
					id: report.exp_playerId,
					name: report.exp_playerName
				};
			} else {
				// not supported
				return null;
			}

			// only export fields that make sense
			var elts = $( obj.mainElement.innerHTML )
				.find( ".hidden" ).remove().end()
				.find( "#" + obj.elementType + obj.elementId + "SummaryViewContainer,#" + obj.elementType + obj.elementId + "CompleteDetailedView" );
			// add and cleanup the markup field
			battle.markup = "<div>" + elts.eq( 0 ).html() + elts.eq( 1 ).html() + "</div>";
			for ( var i = 0; i < this.cleanup.length; i++ ) {
				battle.markup = battle.markup.replace( this.cleanup[ i ].pattern, this.cleanup[ i ].replace );
			}

			return battle;
		}
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
