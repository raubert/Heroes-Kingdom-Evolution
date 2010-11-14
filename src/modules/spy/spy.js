/**
 * Spy module: adds spy export button.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Spy",

	/**
	 * Initializes the module
	 */
	initialize: function(rights) {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; no need to go further
			return;
		}

		// icon has to be added in scouting reports
		MMHK.hijack( HOMMK.ScoutingResultDetailedMessage.prototype, "addToDOM", this.addExportIcon, this );

		// event-based communication with background script
		$( "#SpyMessageContent" ).bind( "spy:done", this.showExportResult );
	},

	/**
	 * Adds the icon that will trigger the spy report export.
	 * 
	 * @param obj {Object}
	 *            the spy report object
	 */
	addExportIcon: function( obj ) {
		var self = this;
		$("<div></div>", {
			id: obj.elementType + obj.elementId + "Export",
			title: $.i18n.get( "spy.title" )
		})
			.addClass( "spy" )
			.css( "background-image", "url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif')" )
			.click(function() {
				if ( !$( this ).hasClass( "working" ) && !$( this ).hasClass( "done" ) ) {
					// process if not already working
					var data = self.process( obj );
					if ( data ) {
						$( this ).empty().addClass( "working" );
						// event-based communication with background script
						var evt = document.createEvent( "Event" );
						evt.initEvent( "spy:save", true, true );
						$( "#SpyMessageContent" )
							.attr( "rel", "#" + obj.elementType + obj.elementId + "Export" )
							.text( JSON.stringify( data ) )
							[0].dispatchEvent( evt );
					}
				}
			})
			.insertAfter( "#" + obj.elementType + obj.elementId + "Comments" )
			.parent()
				.css( "position", "relative" );
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

		var icon = $( message.attr( "rel" ) ).removeClass( "working" );
		message.removeAttr( "rel" );
		if ( data.status == "success" ) {
			icon.addClass( "done" ).attr( "title", $.i18n.get( "spy.saved" ) ).append( "<div class=\"okay\"></div>" );
		} else {
			icon.append( "<div class=\"error\"></div>" ).children( ".error" ).attr( "title", $.i18n.get( "spy.city" ) );
		}
	},

	/**
	 * What needs to be cleaned up in the spy report markup.
	 */
	cleanup: [
		{ pattern: / stackPosition="[^"]+"/gi, replace: "" },
		{ pattern: / (unitstack)?id="[^"]+"/gi, replace: "" },
		{ pattern: / ownertype="[^"]+"/gi, replace: "" },
		{ pattern: / hero /gi, replace: "" },
		{ pattern: /class=""/gi, replace: "" },
		{ pattern: /class="heroLevel hidden"/gi, replace: "class=\"heroLevel\"" },
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
		// we only support some report types
		var type = obj.elementType, report = obj.content;
		switch( type ) {
		case "TroopScoutingResultDetailedMessage":
			type = "troops";
			break;
		case "CityScoutingResultDetailedMessage":
			type = "city";
			break;
		case "RegionScoutingResultDetailedMessage":
			type = "region";
			break;
		default:
			type = null;
			break;
		}

		// don't export non-standalone reports
		if ( type != null && report.contentJSON && !report.linked_messageId ) {
			var spy = {
				id: report.id,
				city: {
					id: report.contentJSON.targetedRegionId,
					name: report.contentJSON.cityName
				},
				type: type,
				time: report.creationDate,
				heroes: []
			};

			// add and cleanup the markup field
			spy.markup = $( "<div><div>" + obj.mainElement.innerHTML + "</div></div>" )
				.find( "div[id=" + obj.elementType + obj.elementId + "Export]:first" )
					.remove()
				.end()
				.find( "div[id=" + obj.elementType + obj.elementId + "TargetInfos]:first" )
					.next()
						.remove()
					.end()
					.remove()
				.end()
				.html();
			for ( var i = 0; i < this.cleanup.length; i++ ) {
				spy.markup = spy.markup.replace( this.cleanup[ i ].pattern, this.cleanup[ i ].replace );
			}

			// add heroes data, if available
			if ( !report.contentJSON.heroList ) {
				heroes = null;
			} else {
				for ( var i = 0; i < report.contentJSON.heroList.length; i++ ) {
					var hero = report.contentJSON.heroList[ i ], classes = [], artefacts = {};
					// hero classes (but not skills)
					if ( !hero.heroClassList ) {
						classes = null;
					} else {
						for ( var j = 0; j < hero.heroClassList.length; j++ ) {
							classes.push( hero.heroClassList[ j ].heroClassEntityTagName );
						}
					}
					// hero artefacts
					if ( !hero.artefactList ) {
						artefacts = null;
					} else {
						for ( var j = 0; j < hero.artefactList.length; j++ ) {
							var artefact = hero.artefactList[ j ].artefactEntity;
							artefacts[ artefact.bodyPart.toLowerCase() ] = artefact.tagName;
						}
					}
					spy.heroes.push({
						id: hero.id,
						faction: hero.factionEntityTagName,
						picture: hero.picture,
						name: hero.name,
						type: hero.heroTrainingEntityTagName,
						level: hero._level,
						attack: hero.attack,
						defense: hero.defense,
						magic: hero.magic,
						classes: classes,
						artefacts: artefacts
					});
				}
			}
			return spy;
		}
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
