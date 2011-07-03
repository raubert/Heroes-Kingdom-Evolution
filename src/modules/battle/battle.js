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
         * a few constants
         */
	BATTLE_RESULT_TOP_VICTORY: 'BattleResultTopVictory.jpg',
	BATTLE_RESULT_TOP_DEFEAT: 'BattleResultTopDefeat.jpg',
	ATTRIBUTES: [ 'VictoryOrDefeatWord', 'Hero', 'BasePower', 'XpGained', 'XpGainedList', 'BarrageFire', 
	              'UnitStackList', 'RaisedUnitStackList', 'ResurrectedUnitStackList',
	              'UnitEntityName', 'UnitStackQuantity', 'UnitStackRouted', 'Wins', 'UnitStackUnitTypeBonus' ],

	/**
	 * Initializes the module
	 */
	initialize: function(rights) {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; we default to forum export
			MMHK.hijack( HOMMK.BattleResultDetailedMessage.prototype, "addToDOM", this.addForumIcon, this );
			
			// simulate MMHK's markup with their crappy classes
			$( "<div/>", {
				id: "BattleForumExport"
			})
			.addClass( "largeFrame absolutePosition" )
			.append("<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"frameContainerTopBarContainer\">"
				+ "<tbody>"
					+ "<tr>"
						+ "<td class=\"size0 frameContainerTopLeft\"></td>"
						+ "<td class=\"size0 frameContainerTop\"></td>"
						+ "<td class=\"size0 frameContainerTopRight\">"
							+ "<div id=\"BattleForumExportClose\" class=\"zIndex1 frameContainerCloseImage absolutePosition clickable\" title=\"" + $.i18n.get( "close" ) + "\"></div>"
						+ "</td>"
					+ "</tr>"
					+ "<tr>"
						+ "<td class=\"frameContainerMiddleLeft\"></td>"
						+ "<td class=\"beigeBg\">"
							+ "<div class=\"center size11 white boldFont uppercase titleBar\">" + $.i18n.get( "battle.forum" ) + "</div>"
							+ "<div id=\"BattleForumExportDataContainer\">"
								+ "<textarea id=\"BattleForumExportData\" cols=\"80\" rows=\"25\"></textarea>"
							+ "</div>"
						+ "</td>"
						+ "<td class=\"frameContainerMiddleRight\"></td>"
					+ "</tr>"
					+ "<tr>"
						+ "<td class=\"size0 frameContainerBottomLeft\"></td>"
						+ "<td class=\"size0 frameContainerBottom\"></td>"
						+ "<td class=\"size0 frameContainerBottomRight\"></td>"
					+ "</tr>"
				+ "</tbody>"
				+ "</table>" )
			.hide()
			.appendTo( "#FrameMainContainer" );
			
			// setup the "close" button
			$.addCss( "#BattleForumExportClose { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') }" );
			$( "#BattleForumExportClose" ).click(function() {
				$( "#BattleForumExport" ).hide();
			});
			
			// create the template
			var forumType = $( "#ForumType" ).html();
			var template = $( "#battle_" + forumType + "_txt" ).html();
			$( "#BattleForumExportData" ).setTemplate( template );
			$( "#BattleForumExportData" ).setParam( "i18n", $.i18n );
		}
		else {
			// icon has to be added in scouting reports
			MMHK.hijack( HOMMK.BattleResultDetailedMessage.prototype, "addToDOM", this.addExportIcon, this );

			// event-based communication with background script
			$( "#BattleMessageContent" ).bind( "battle:done", this.showExportResult );
		}
		MMHK.hijack( HOMMK.BattleRound.prototype, "addToDOM", this.addPowerBonus, this );
	},

	/**
	 * Compute the hero's bonus for this round
	 * 
	 * @param round {Object}
	 *              the round necessary
	 * @param type 'attacker' or 'defender'
	 */
	computeBonus: function( round, type ) {
		var totalBonus = round[ type + "TotalBonus" ] ? round[ type + "TotalBonus" ] : 0;
		var typeBonus = round[ type + "UnitStackUnitTypeBonus" ] ? round[ type + "UnitStackUnitTypeBonus" ] : 0;
		if( totalBonus > typeBonus ) {
			var bonus = totalBonus - typeBonus;
			return "+" + Math.round( 1000*bonus/round[ type + 'UnitStackPower' ] )/10 + "%";
		}
		return false;
	},
	
	/**
	 * Displays the hero's bonus on each battle round
	 *
	 * @param obj {Object}
	 *            the battle round report object
	 */
	addPowerBonus: function( obj ) {
		// get the full battle report object
		var id = obj.elementId.substring( 0, obj.elementId.indexOf('_') );
		var battle = HOMMK.elementPool.get( "BattleResultDetailedMessage" ).get( id );
		
		var attackBonus = false, defenseBonus = false;
		
		// determine the attack and defense bonus
		var attackBonus = this.computeBonus( obj.content, 'attacker' );
		var defenseBonus = this.computeBonus( obj.content, 'defender' );

		// display it all
		function displayBonus( type, bonus ) {
			var before = $( "#"+obj.elementType + obj.elementId + type + "QuantityBefore" );	
			var div = $("<div></div>", {
				id: obj.elementType + obj.elementId + type + "Bonus",
				style: "font-size:12px;"
			})
			.html( bonus );
			div.prependTo( before.parent() );
			before.css( "display", "inline" )
				.remove()
				.prependTo( div );			
		}
		if ( battle.content.type == HOMMK.MESSAGE_TYPE_BATTLE_RESULT_DEFENDER ) {
			if( attackBonus ) displayBonus( "Enemy", attackBonus );
			if( defenseBonus ) displayBonus( "Ally", defenseBonus );
		}
		else {
			if( attackBonus ) displayBonus( "Ally", attackBonus );
			if( defenseBonus ) displayBonus( "Enemy", defenseBonus );
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
	 * Extract the spell data into an object coherent across the various spell types
	 * 
	 * @param round
	 *           the round number
	 * @param spell
	 *           the spell object
	 */
	parseSpell: function( round, spell ) {
		if( spell ) {
			var result = new Object();
			result.round = round;
			result.name = spell.spellEntityName;
			result.power = 0;
			for ( var e in spell.effectList ) {
				var effect = spell.effectList[e];
				if ( $.isArray( effect ) ) {
					if ( effect[2] == "damage" ) {
						result.power -= MMHK.units.get(effect[1]).power * effect[3];
					} else if (effect[2] == "summoning") {
						result.power += MMHK.units.get(effect[1]).power * effect[3];
					} else if (effect[2] == "resurrection") {
						result.power += MMHK.units.get(effect[1]).power * effect[3];
					} else if (effect[2] == "attackBonus") {
						result.power += effect[3];
					} else if (effect[2] == "defenseBonus") {
						result.power += effect[3];
					} else if (effect[2] == "powerBonus") {
						result.power += MMHK.units.get(effect[1]).power * effect[3];
					}
				}
			}
			return result;
		}
	},
	
	/**
	 * Extract the barrage fire data into an object coherent across the various spells
	 * 
	 * @param name
	 *          the name used to describe the barrage fire
	 * @param power
	 *          the firepower
	 */
	parseBarrageFire: function(name, spell) {
		var result = new Object();
		result.name = name;
		result.power = 0;
		for ( var e in spell.effect) {
			var effect = spell.effect[e];
			if ($.isArray( effect ))
				result.power -= MMHK.units.get(effect[0]).power * effect[1];
		}
		return result;
	},
	
	/**
	 * Copy the attributes of one object to another, eventually changing the prefix
	 * 
	 * @param source {Object}
	 *               the source object
	 * @param target {Object}
	 *               the target object
	 * @param sourcePrefix 
	 *               the attribute prefix for the source object
	 * @param targetPrefix
	 *               the attribute prefix for the destination object
	 */
	copyAttributes: function( source, target, sourcePrefix, targetPrefix ) {
		for ( var attr in this.ATTRIBUTES) {
			if( typeof this.ATTRIBUTES[attr] === "string" ) {
				target[targetPrefix + this.ATTRIBUTES[attr]] = source[sourcePrefix + this.ATTRIBUTES[attr]];
			}
		}
		return target;
	},
	
	/**
	 * Adds the icon that will format the report for forums.
	 * 
	 * @param msg {Object}
	 *            the spy report object
	 */
	addForumIcon: function( msg ) {
		var self = this;
		this.addIcon( msg, "battle.forum", function() {
			var result = new Object();
			
			// extract the date of the battle
			if( msg.content.contentJSON.message ) {
				// message has been forwarded: date is unknown
				result.date = "";
			}
			else {
				var when = new Date( msg.content.creationDate * 1000 );
				result.date = $.i18n.toDateString(when) + '\n' + $.i18n.toTimeString(when);
			}
			
			var ally;
			var enemy;
			if (msg.content.type == "BATTLE_RESULT_ATTACKER") {
				ally = 'attacker';
				enemy = 'defender';
				allySpell = 'AttackerSpell';
				enemySpell = 'DefenderSpell';
				result.allyPosition = $.i18n.get('battle.attacker');
				result.enemyPosition = $.i18n.get('battle.defender');
			} else {
				ally = 'defender';
				enemy = 'attacker';
				allySpell = 'DefenderSpell';
				enemySpell = 'AttackerSpell';
				result.allyPosition = $.i18n.get('battle.defender');
				result.enemyPosition = $.i18n.get('battle.attacker');
			}
			
			// affect all battle attributes to the ally or the enemy
			result = self.copyAttributes( msg.content.contentJSON, result, ally, 'ally' );
			result = self.copyAttributes( msg.content.contentJSON, result, enemy, 'enemy' );
			
			// special cases if several heroes were defending
			if (!result.enemyHero)
				result.enemyHero = msg.enemyMaxLevelHero;
			if (!result.allyXpGained && result.allyXpGainedList) {
				result.allyXpGained = 0;
				result.allyXpGainedList.each( function(x) {
					result.allyXpGained += x.xpGained;
				} );
			}
			if (!result.enemyXpGained && result.enemyXpGainedList) {
				result.enemyXpGained = 0;
				result.enemyXpGainedList.each( function(x) {
					result.enemyXpGained += x.xpGained;
				} );
			}
			if (result.allyWins) {
				result.battleResultHeader = self.BATTLE_RESULT_TOP_VICTORY;
				result.battleResultClass = "Victory";
			} else {
				result.battleResultHeader = self.BATTLE_RESULT_TOP_DEFEAT;
				result.battleResultClass = "Defeat";
			}
			result.word = result.allyVictoryOrDefeatWord;
			result.enemyPlayerName = msg.content.contentJSON.enemyPlayerName;
			result.lootRessourceQuantity = msg.content.contentJSON.lootRessourceQuantity;
			result.lootRessourceEntityTagName = msg.content.contentJSON.lootRessourceEntityTagName;
			
			// inventory the legacy abilities and other pre-fight events
			result.allySpells = new Array();
			result.enemySpells = new Array();
			if (msg.content.contentJSON[ally + 'BarrageFire'])
				result.allySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.barrage.fire' ), msg.content.contentJSON[ally + 'BarrageFire'] ) );
			if (msg.content.contentJSON[enemy + 'BarrageFire'])
				result.enemySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.barrage.fire' ), msg.content.contentJSON[enemy + 'BarrageFire'] ) );
			if (msg.content.contentJSON[ally + 'RegionBuildingComponentBarrageFire'])
				result.allySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.balista.fire' ), msg.content.contentJSON[ally + 'RegionBuildingComponentBarrageFire'] ) );
			if (msg.content.contentJSON[enemy + 'RegionBuildingComponentBarrageFire'])
				result.enemySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.balista.fire' ), msg.content.contentJSON[enemy + 'RegionBuildingComponentBarrageFire'] ) );
			if (msg.content.contentJSON[ally + 'CatapultsBarrageFire'])
				result.allySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.tactical.bombing' ),
						msg.content.contentJSON[ally + 'CatapultsBarrageFire'] ) );
			if (msg.content.contentJSON[enemy + 'CatapultsBarrageFire'])
				result.enemySpells.push( self.parseBarrageFire( $.i18n.get( 'battle.tactical.bombing' ),
						msg.content.contentJSON[enemy + 'CatapultsBarrageFire'] ) );
			if (msg.content.contentJSON[ally + 'MagicResistance'])
				result.allySpells.push( {
					name: $.i18n.get( 'battle.magic.resistance' ),
					power: msg.content.contentJSON[ally + 'MagicResistance'].effect + "%"
				} );
			if (msg.content.contentJSON[ally + 'RegionBuildingComponentMagicResistance'])
				result.allySpells.push( {
					name: $.i18n.get( 'battle.magic.resistance' ),
					power: msg.content.contentJSON[ally + 'RegionBuildingComponentMagicResistance'].effect + "%"
				} );
			if (msg.content.contentJSON[enemy + 'MagicResistance'])
				result.enemySpells.push( {
					name: $.i18n.get( 'battle.magic.resistance' ),
					power: msg.content.contentJSON[enemy + 'MagicResistance'].effect + "%"
				} );
			if (msg.content.contentJSON[enemy + 'RegionBuildingComponentMagicResistance'])
				result.enemySpells.push( {
					name: $.i18n.get( 'battle.magic.resistance' ),
					power: msg.content.contentJSON[enemy + 'RegionBuildingComponentMagicResistance'].effect + "%"
				} );
			if (msg.content.contentJSON[ally + 'MoralEffect'])
				result.allySpells.push( {
					name: $.i18n.get( 'battle.moral.high' ),
					power: msg.content.contentJSON[ally + 'MoralEffect'].effect + "%"
				} );
			if (msg.content.contentJSON[enemy + 'MoralEffect'])
				result.enemySpells.push( {
					name: $.i18n.get( 'battle.moral.high' ),
					power: msg.content.contentJSON[enemy + 'MoralEffect'].effect + "%"
				} );

			// inventory the spells and hero bonus used during the fight
			result.roundList = new Array();
			for ( var r in msg.content.contentJSON.roundList) {
				var round = msg.content.contentJSON.roundList[r];
				if( typeof round === 'object' ) {
					var targetRound = {
						id: round.id,	
						allyBonus: self.computeBonus( round, ally ),
						enemyBonus: self.computeBonus( round, enemy ),
						allyAfterSpell: self.parseSpell( round.id, round[ 'afterRound' + allySpell ] ),
						allyBeforeSpell: self.parseSpell( round.id, round[ 'beforeRound' + allySpell ] ),
						enemyAterSpell: self.parseSpell( round.id, round[ 'afterRound' + enemySpell ] ),
						enemyBeforeSpell: self.parseSpell( round.id, round[ 'beforeRound' + enemySpell ] )
					};
					// the game does not provide "defenderWins"
					if (!round.attackerWins) {
						round.defenderWins = true;
					}
					targetRound = self.copyAttributes( round, targetRound, ally, 'ally' );
					targetRound = self.copyAttributes( round, targetRound, enemy, 'enemy' );
					if ( targetRound.allyAfterSpell ) {
						result.allySpells.push( targetRound.allyAfterSpell );
					}
					if ( targetRound.allyBeforeSpell ) {
						result.allySpells.push( targetRound.allyBeforeSpell );
					}
					if ( targetRound.enemyAterSpell ){
						result.enemySpells.push( targetRound.enemyAterSpell );
					}
					if (targetRound.enemyBeforeSpell) {
						result.enemySpells.push( targetRound.enemyBeforeSpell );
					}
					result.roundList.push( targetRound );
				}
			}
			
			// display it!
			$( "#BattleForumExportData" ).processTemplate( result );
			$( "#BattleForumExport" ).show();
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
