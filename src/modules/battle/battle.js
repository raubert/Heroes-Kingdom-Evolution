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
	ATTRIBUTES: [ 'Hero', 'BasePower', 'XpGained', 'XpGainedList', 'BarrageFire', 'UnitStackList', 'RaisedUnitStackList',
			'ResurrectedUnitStackList' ],

	/**
	 * Initializes the module
	 */
	initialize: function(rights) {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; we default to forum export
			MMHK.hijack( HOMMK.BattleResultDetailedMessage.prototype, "addToDOM", this.addForumIcon, this );
			var classes = "largeFrame absolutePosition zIndex10000 metal borderBrown2";
			$( "#FrameMainContainer" ).append(
				"<div id='BattleForumExport' style='padding:10px;' class='" + classes
				+ " hidden'><div class='underline clickable' onclick='this.parentNode.className=\"" + classes
				+ " hidden\";'>Fermer</div><textarea id='BattleForumExportData' cols='80' rows='25'></textarea></div>" );
			var forumType = $( "#ForumType" ).html();
			var template = $( "#battle_" + forumType + "_txt" ).html();
			$( "#BattleForumExportData" ).setTemplate( template );
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

	getCreature: function( code ) {
		var infos = code.split( "_" );
		return MMHK.units.get( infos[1], infos[2] );
	},

	parseSpell: function( round, spell ) {
		var result = new Object();
		result.round = round;
		result.name = spell.spellEntityName;
		result.power = 0;
		for ( var e in spell.effectList ) {
			var effect = spell.effectList[e];
			if ( $.isArray( effect ) ) {
				if ( effect[2] == "damage" ) {
					result.power -= this.getCreature(effect[1]).power * effect[3];
				} else if (effect[2] == "summoning") {
					result.power += this.getCreature(effect[1]).power * effect[3];
				} else if (effect[2] == "resurrection") {
					result.power += this.getCreature(effect[1]).power * effect[3];
				} else if (effect[2] == "attackBonus") {
					result.power += effect[3];
				} else if (effect[2] == "defenseBonus") {
					result.power += effect[3];
				} else if (effect[2] == "powerBonus") {
					result.power += effect[3];
				}
			}
		}
		return result;
	},
	parseBarrageFire: function(name, spell) {
		var result = new Object();
		result.name = name;
		result.power = 0;
		for ( var e in spell.effect) {
			var effect = spell.effect[e];
			if ($.isArray( effect ))
				result.power -= this.getCreature(effect[0]).power * effect[1];
		}
		return result;
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
			var when = new Date( msg.content.creationDate * 1000 );
			var result = new Object();
			result.date = when.getDate() + '/' + (when.getMonth() + 1) + '\n' + when.getHours() + ':' + when.getMinutes();
			if (msg.content.type == "BATTLE_RESULT_ATTACKER" && msg.content.contentJSON.attackerWins
					|| msg.content.type == "BATTLE_RESULT_DEFENDER" && msg.content.contentJSON.defenderWins) {
				result.battleResultHeader = self.BATTLE_RESULT_TOP_VICTORY;
				result.battleResultClass = "Victory";
			} else {
				result.battleResultHeader = self.BATTLE_RESULT_TOP_DEFEAT;
				result.battleResultClass = "Defeat";
			}
			var ally;
			var enemy;
			if (msg.content.type == "BATTLE_RESULT_ATTACKER") {
				result.word = msg.content.contentJSON.attackerVictoryOrDefeatWord;
				ally = 'attacker';
				enemy = 'defender';
				allySpell = 'AttackerSpell';
				enemySpell = 'DefenderSpell';
				result.allyPosition = 'Attaquant';
				result.enemyPosition = 'Défenseur';
			} else {
				result.word = msg.content.contentJSON.defenderVictoryOrDefeatWord;
				ally = 'defender';
				enemy = 'attacker';
				allySpell = 'DefenderSpell';
				enemySpell = 'AttackerSpell';
				result.allyPosition = 'Défenseur';
				result.enemyPosition = 'Attaquant';
			}
			for ( var attr in self.ATTRIBUTES) {
				if( typeof attr === "string" ) {
					result['ally' + self.ATTRIBUTES[attr]] = msg.content.contentJSON[ally + self.ATTRIBUTES[attr]];
					result['enemy' + self.ATTRIBUTES[attr]] = msg.content.contentJSON[enemy + self.ATTRIBUTES[attr]];
				}
			}
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
			result.enemyPlayerName = msg.content.contentJSON.enemyPlayerName;
			result.lootRessourceQuantity = msg.content.contentJSON.lootRessourceQuantity;
			result.lootRessourceEntityTagName = msg.content.contentJSON.lootRessourceEntityTagName;
			result.allySpells = new Array();
			result.enemySpells = new Array();
			if (msg.content.contentJSON[ally + 'BarrageFire'])
				result.allySpells.push( self.parseBarrageFire( "Tir de barrage", msg.content.contentJSON[ally + 'BarrageFire'] ) );
			if (msg.content.contentJSON[enemy + 'BarrageFire'])
				result.enemySpells.push( self.parseBarrageFire( "Tir de barrage", msg.content.contentJSON[enemy + 'BarrageFire'] ) );
			if (msg.content.contentJSON[ally + 'CatapultsBarrageFire'])
				result.allySpells.push( self.parseBarrageFire( "Bombardement tactique",
						msg.content.contentJSON[ally + 'CatapultsBarrageFire'] ) );
			if (msg.content.contentJSON[enemy + 'CatapultsBarrageFire'])
				result.enemySpells.push( self.parseBarrageFire( "Bombardement tactique",
						msg.content.contentJSON[enemy + 'CatapultsBarrageFire'] ) );
			if (msg.content.contentJSON[ally + 'MagicResistance'])
				result.allySpells.push( {
					name: "Resistance magique",
					power: msg.content.contentJSON[ally + 'MagicResistance'].effect + "%"
				} );
			if (msg.content.contentJSON[enemy + 'MagicResistance'])
				result.enemySpells.push( {
					name: "Resistance magique",
					power: msg.content.contentJSON[enemy + 'MagicResistance'].effect + "%"
				} );
	
			for ( var r in msg.content.contentJSON.roundList) {
				var round = msg.content.contentJSON.roundList[r];
				var afterAllySpell = round['afterRound' + allySpell];
				if (afterAllySpell)
					result.allySpells.push( self.parseSpell( round.id, afterAllySpell ) );
				var beforeAllySpell = round['beforeRound' + allySpell];
				if (beforeAllySpell)
					result.allySpells.push( self.parseSpell( round.id, beforeAllySpell ) );
				var afterEnemySpell = round['afterRound' + enemySpell];
				if (afterEnemySpell)
					result.enemySpells.push( self.parseSpell( round.id, afterEnemySpell ) );
				var beforeEnemySpell = round['beforeRound' + enemySpell];
				if (beforeEnemySpell)
					result.enemySpells.push( self.parseSpell( round.id, beforeEnemySpell ) );
			}
			$( "#BattleForumExportData" ).processTemplate( result );
			$( "#BattleForumExport" ).removeClass( "hidden" );
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
