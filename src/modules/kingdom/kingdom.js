/**
 * Kingdom module: adds an additional menu to MMHK.
 */
(function( $, MMHK, HOMMK, MooTools, undefined ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Kingdom",

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		// add some dynamic CSS commands
		$.addCss(
			"#KingdomImage { background: url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') no-repeat -280px 0; width: 40px; height: 40px; }"
			+ "#KingdomFrame #KingdomClose { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') }"
			+ "#KingdomFrame #KingdomTabs div { background-image: url('" + HOMMK.IMG_URL + "/css_sprite/Frame_tab_ranking.jpg') }"
			+ "#KingdomFrame #KingdomTabs div.recap { background-image: url('" + HOMMK.IMG_URL + "/frame/ranking/rankingHeader_PVP_ALL.jpg') }"
			+ "#KingdomFrame #KingdomDataContainer { background-image: url('" + HOMMK.IMG_URL + "/background/metal.jpg') }"
			+ "#KingdomFrame .kingdom .data tbody td .city { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Region_Zoom1.gif') }"
			+ "#KingdomFrame #KingdomArmiesHeader { background-image:url('" + HOMMK.IMG_URL + "/frame/ranking/rankingHeader_DOMINATION_01.jpg') }"
			+ "#KingdomFrame #KingdomArmiesData .unit .ACADEMY { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_ACADEMY.gif') }"
			+ "#KingdomFrame #KingdomArmiesData .unit .HAVEN { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_HAVEN.gif') }"
			+ "#KingdomFrame #KingdomArmiesData .unit .INFERNO { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_INFERNO.gif') }"
			+ "#KingdomFrame #KingdomArmiesData .unit .NECROPOLIS { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_NECROPOLIS.gif') }"
			+ "#KingdomFrame #KingdomArmiesData .unit .SYLVAN { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_SYLVAN.gif') }"
			+ "#KingdomFrame #KingdomProductionHeader { background-image:url('" + HOMMK.IMG_URL + "/frame/ranking/rankingHeader_WEALTH_01.jpg') }"
			+ "#KingdomFrame #KingdomProductionHeader th div { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Ressources.gif') }"
			+ "#KingdomFrame #KingdomActionsHeader { background-image:url('" + HOMMK.IMG_URL + "/frame/ranking/rankingHeader_HONOR_01.jpg') }"
			+ "#KingdomFrame #KingdomActionsData .action .icon { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/TimeLineAction.gif') }"
			+ "#KingdomFrame #KingdomActionsData .goods span span { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Ressources.gif') }"
			+ "#KingdomFrame #KingdomRecapHeader { background-image:url('" + HOMMK.IMG_URL + "/frame/ranking/rankingHeader_PVP_ALL.jpg') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .heroclass { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/HeroClass.gif') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .ACADEMY { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Hero_ACADEMY.jpg') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .HAVEN { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Hero_HAVEN.jpg') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .INFERNO { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Hero_INFERNO.jpg') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .NECROPOLIS { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Hero_NECROPOLIS.jpg') }"
			+ "#KingdomFrame #KingdomRecapData .herorecap .SYLVAN { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Hero_SYLVAN.jpg') }"
			+ ".cluetip-default h3#cluetip-title { background-image:url('" + HOMMK.IMG_URL + "/frame/tooltips/npc/titleBg_00.gif') }"
			+ ".cluetip-default #cluetip-inner .unit .type { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_types.gif') }"
			+ ".cluetip-default #cluetip-inner .unit .goods { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Ressources.gif') }"
		);

		var self = this;

		// sneaky insertion into MMHK's interface
		$( "#SidebarTop tr:first" ).each( function() {
			// simulate MMHK's markup with their crappy classes
			$( "<td><div class=\"relativePosition Voffset3\" title=\"" + $.i18n.get( "kingdom" ) + "\"><div class=\"Hoffset0 Hoffset0R clickable\" id=\"KingdomImage\"></div><div class=\"clickable\" id=\"KingdomText\">" + $.i18n.get( "kingdom" ) + "</div></div></td>" )
				.find( ".clickable" )
					// replicate the behavior of the other options
					.hover( function() {
						$( this ).siblings().andSelf().addClass( "over" ).filter( "#KingdomImage" ).css( "background-position", "-280px -40px" );
					}, function() {
						$( this ).siblings().andSelf().removeClass( "over" ).filter( "#KingdomImage" ).css( "background-position", "-280px 0" );
					} )
					// display Kingdom's panel
					.click( function() {
						// hide other panels
						for ( var i = 0; i < HOMMK.displayedFrameList.length; i++ ) {
							HOMMK.displayedFrameList[ i ].hide();
						}
						$('#GameHider').css('opacity', 0.5).removeClass('hidden');
						// we're loading now
						$( "#GameHiderLoading" ).removeClass( "hidden" );
						// update the data
						self.updateAndShow();
						// frame loaded
						$('#GameHiderLoading').addClass('hidden');
						return false;
					} )
				.end()
			.appendTo( this )
			.siblings().children().click(function() {
				// auto-hide when the user clicks on another menu item
				$( "#GameHider" ).addClass( "hidden ");
				$( "#cluetip,#KingdomFrame" ).hide();
			});
		} );
	},

	/**
	 * Contains the ressources that will be displayed.
	 */
	resources: [
		{
			type: "g",
			tag: "gold",
			wealth: 1
		},
		{
			type: "rc",
			tag: "wood",
			wealth: 1000
		},
		{
			type: "rc",
			tag: "ore",
			wealth: 1000
		},
		{
			type: "rr",
			tag: "mercury",
			wealth: 2000
		},
		{
			type: "rr",
			tag: "crystal",
			wealth: 2000
		},
		{
			type: "rr",
			tag: "sulfur",
			wealth: 2000
		},
		{
			type: "rr",
			tag: "gem",
			wealth: 2000
		}
	],

	/**
	 * Content slider object.
	 */
	slider: null,

	/**
	 * Creates the main frame HTML markup, which is static and never changes.
	 */
	createFrameMarkup: function() {
		// header for armies
		var ahead = "<tr><th></th>";
		for ( var i = 1; i <= 7; i++ ) {
			ahead += "<th>T" + i + "</th>";
		}
		ahead += "<th class=\"siege\">" + $.i18n.get( "siege.units" ) + "</th>";
		ahead += "<th class=\"s\"></th></tr>";

		// header for production
		var phead = "<tr><th></th>";
		for ( var i = 0; i < this.resources.length; i++ ) {
			phead += "<th class=\"" + this.resources[ i ].type + "\"><div class=\"" + this.resources[ i ].tag + "\"></div></th>";
		}
		phead += "<th class=\"s\"></th></tr>";

		// header for recap
		var rhead = "<tr><th></th>";
		for ( var i = 1; i <= 6; i++ ) {
			rhead += "<th>" + "</th>";
		}
		rhead += "<th class=\"s\"></th></tr>";

		// simulate MMHK's markup with their crappy classes
		return "<div id=\"KingdomFrame\" class=\"largeFrame absolutePosition\">"
			+ "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"frameContainerTopBarContainer\">"
			+ "<tbody>"
				+ "<tr>"
					+ "<td class=\"size0 frameContainerTopLeft\"></td>"
					+ "<td class=\"size0 frameContainerTop\"></td>"
					+ "<td class=\"size0 frameContainerTopRight\">"
						+ "<div id=\"KingdomSave\" class=\"zIndex1 absolutePosition clickable\" title=\"" + $.i18n.get( "kingdom.save" ) + "\"></div>"
						+ "<div id=\"KingdomClose\" class=\"zIndex1 frameContainerCloseImage absolutePosition clickable\" title=\"" + $.i18n.get( "close" ) + "\"></div>"
					+ "</td>"
				+ "</tr>"
				+ "<tr>"
					+ "<td class=\"frameContainerMiddleLeft\"></td>"
					+ "<td class=\"beigeBg\">"
						+ "<div>"
							+ "<div class=\"center size11 white boldFont uppercase titleBar\">" + $.i18n.get( "kingdom" ) + "</span></div>"
							+ "<div id=\"KingdomTabs\">"
								+ "<div class=\"armies\"><a rel=\"KingdomArmies\">" + $.i18n.get( "armies" ) + "</a></div>"
								+ "<div class=\"production\"><a rel=\"KingdomProduction\">" + $.i18n.get( "resources" ) + "</a></div>"
								+ "<div class=\"actions\"><a rel=\"KingdomActions\">" + $.i18n.get( "actions" ) + "</a></div>"
								+ "<div class=\"recap\"><a rel=\"KingdomRecap\">" + $.i18n.get( "recap" ) + "</a></div>"
							+ "</div>"
							+ "<div class=\"kingdom\">"
								+ "<div class=\"header\">"
									+ "<div id=\"KingdomArmiesHeader\">"
										+ "<table><thead>" + ahead + "</thead></table>"
									+ "</div>"
									+ "<div id=\"KingdomProductionHeader\">"
										+ "<table><thead>" + phead + "</thead></table>"
									+ "</div>"
									+ "<div id=\"KingdomActionsHeader\">"
										+ "<table><thead><tr><th></th><th class=\"a\"></th><th class=\"d\">" + $.i18n.get( "description" ) + "</th><th class=\"t\">" + $.i18n.get( "start" ) + "</th><th class=\"t\">" + $.i18n.get( "end" ) + "</th><th class=\"s\"></th></tr></thead></table>"
									+ "</div>"
									+ "<div id=\"KingdomRecapHeader\">"
										+ "<table><thead>" + rhead + "</thead></table>"
									+ "</div>"
								+ "</div>"
							+ "<table class=\"data\"><tr>"
							+ "<td><div id=\"KingdomDataContainer\">"
								+ "<div id=\"KingdomArmiesData\">"
									+ "<table><tbody></tbody></table>"
								+ "</div>"
								+ "<div id=\"KingdomProductionData\" class=\"data\">"
									+ "<table><tbody></tbody></table>"
								+ "</div>"
								+ "<div id=\"KingdomActionsData\" class=\"data\">"
									+ "<table><tbody></tbody></table>"
								+ "</div>"
								+ "<div id=\"KingdomRecapData\">"
									+ "<table><tbody></tbody></table>"
								+ "</div>"
							+ "</div></td>"
							+ "<td id=\"KingdomDataContainerSlider\"></td>"
							+ "<td class=\"sideBarBorderRight\"></td>"
							+ "</tr></table>"
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
			+ "</table>"
		+ "</div>";
	},

	/**
	 * Setups the available actions on the main frame; this has to be applied *after* DOM injection.
	 */
	setupFrameActions: function() {
		var self = this;

		// close simply hides the panel
		$( "#KingdomClose" ).click(function() {
			$( "#GameHider" ).addClass( "hidden ");
			$( "#cluetip,#KingdomFrame" ).hide();
		});

		// tab selection; corresponding header and data selection could be way smarter than what they are
		$( "#KingdomTabs>div" ).click(function() {
			// unselects everything
			$( "#KingdomTabs" ).children().removeClass( "selected" );
			$( "#cluetip,#KingdomArmiesHeader,#KingdomProductionHeader,#KingdomActionsHeader,#KingdomRecapHeader" ).hide();
			$( "#KingdomArmiesData,#KingdomProductionData,#KingdomActionsData,#KingdomRecapData" ).children().hide();

			// select the new tab and display its contents
			var selected = $( this ).addClass( "selected" ).children( "a" ).attr( "rel" );
			$( "#" + selected + "Header" ).show();
			$( "#" + selected + "Data" ).children().show();

			// reset the slider dimensions
			$( "#KingdomDataContainer" ).attr( "scrollTop", "0" );
			self.updateSlider();
			return false;
		});
	},

	/**
	 * Updates the slider size and resets its position.
	 */
	updateSlider: function() {
		if ( this.slider != null ) {
			this.slider.updateDimensions();
			this.slider.toPosition( 0 );
		}
	},

	/**
	 * Creates the shell in which units stats are gathered.
	 * 
	 * @param units
	 *            the units object to fill
	 * @param tier
	 *            the unit tier
	 * @param type
	 *            the unit type
	 * @param unit
	 *            the unit object
	 */
	createUnitShell: function( units, tier, type, unit ) {
		// units are ordered by tier
		if ( units[ tier ] == undefined ) {
			units[ tier ] = {};
		}
		units = units[ tier ];
		// and then by type
		if ( units[ type ] == undefined ) {
			units[ type ] = {
				name: unit.unitEntityName,
				type: unit.unitEntityType,
				tier: unit.tier,
				faction: unit.factionEntityTagName,
				power: unit.unitEntityPower || unit.power,
				reserve: 0,
				production: 0,
				maxProduction: 0,
				quantity: 0
			};
			for ( var i = 0; i < this.resources.length; i++ ) {
				units[ type ][ this.resources[ i ].tag ] = 0;
			}
		}
	},

	/**
	 * Extracts some data about a specific unit stack.
	 * 
	 * @param unit	the unit data
	 * @param units	the units object to fill
	 */
	extractUnitStackData: function( unit, units ) {
		var type = unit.unitEntityTagName;
		this.createUnitShell( units, unit.tier, type, unit );
		units[ unit.tier ][ type ].quantity += unit.quantity;
	},

	/**
	 * Extracts some data about a specific recrutable unit stack.
	 * 
	 * @param unit	the unit data
	 * @param units	the units object to fill
	 */
	extractUnitRecruitData: function( unit, units ) {
		var type = "UNIT_" + unit.factionEntityTagName + "_" + unit.tier;
		this.createUnitShell( units, unit.tier, type, unit );
		for ( var i = 0; i < this.resources.length; i++ ) {
			units[ unit.tier ][ type ][ this.resources[ i ].tag ] = unit[ this.resources[ i ].tag + "Cost" ];
		}
		units[ unit.tier ][ type ].reserve += unit.avail;
		units[ unit.tier ][ type ].production += unit.income;
		units[ unit.tier ][ type ].maxProduction += unit.baseIncome;
	},

	/**
	 * Extracts the armies data from HOMMK's pool.
	 */
	extractArmiesData: function() {
		var data = [];

		// for each city, create a dedicated container
		var cities = HOMMK.elementPool.get( "RegionCity" ).values();
		for ( var i = 0; i < cities.length; i++ ) {
			var city = cities[ i ].content;
			var current = {
				id: city.id,
				name: city.cityName,
				faction: city.factionEntityTagName,
				x: city.x,
				y: city.y,
				maintenance: city.maintenanceGoldCost,
				units: {},
				recruits: false
			};

			// for each attached unit stack
			for ( var s = 0; s < city.attachedUnitStackList.length; s++ ) {
				this.extractUnitStackData( city.attachedUnitStackList[ s ], current.units );
			}

			// for each stack attached to each hero in the city
			for ( var h = 0; h < city.attachedHeroList.length; h++ ) {
				var hero = city.attachedHeroList[ h ];
				for ( var s = 0; s < hero.attachedUnitStackList.length; s++ ) {
					this.extractUnitStackData( hero.attachedUnitStackList[ s ], current.units );
				}
			}
			data.push( current );
		}

		// for each recruitable unit available
		var recruits = HOMMK.elementPool.get( "RecruitableUnit" );
		if ( recruits != undefined ) {
			recruits = recruits.values();
			for ( var i = 0; i < recruits.length; i++ ) {
				var current = null;
				var cityid = recruits[i].content.id.split( "_" )[0];
				for ( var j = 0; j < data.length; j++ ) {
					if ( data[ j ].id == cityid ) {
						current = data[ j ];
						break;
					}
				}
				if ( current != null ) {
					current.recruits = true;
					this.extractUnitRecruitData( recruits[ i ].content, current.units );
					this.extractUnitRecruitData( recruits[ i ].content.upgraded, current.units );
				}
			}
		}

		return data;
	},

	/**
	 * Creates the shell in which units stats are gathered.
	 * 
	 * @param total
	 *            the total object to fill
	 * @param id
	 *            the unit id
	 * @param tag
	 *            the unit tag
	 * @param unit
	 *            the unit object
	 */
	createUnitTotalShell: function( total, id, tag, unit ) {
		if ( total.count == undefined ) {
			total.count = 0;
			total.power = 0;
		}
		// total is ordered per ID
		if ( total[ id ] == undefined ) {
			total[ id ] = {};
		}
		total = total[ id ];
		// and then per unit tag
		if ( total[ tag ] == undefined ) {
			total[ tag ] = {
				name: unit.name,
				type: unit.type,
				faction: unit.faction,
				tier: unit.tier,
				power: unit.power,
				reserve: 0,
				production: 0,
				reserve: 0,
				production: 0,
				maxProduction: 0,
				quantity: 0
			};
			for ( var i = 0; i < this.resources.length; i++ ) {
				total[ tag ][ this.resources[ i ].tag ] = 0;
			}
		}
	},

	/**
	 * Creates the markup corresponding to a single unit stack.
	 * 
	 * @param unit
	 *            the unit object
	 * @param info
	 *            the stack information
	 * @param recruit
	 *            when not set, it means this unit has not been recruited yet 
	 */
	createUnitMarkup: function( unit, info, recruited ) {
		var tooltip = "<tt>[" + unit.tier.replace( "P", "+" ) + "]</tt>" + unit.name + "|";
		tooltip += "<div class=\"unit\">";
		tooltip += "<p>" + $.i18n.get( "unit.type", "<span class=\"type " + unit.type + "\"></span>" ) + "</p>";
		tooltip += "<p>" + $.i18n.get( "unit.power", "<b>" + $.formatNumber( unit.power ) + "</b>" ) + "</p>";
		tooltip += "<p>" + $.i18n.get( "unit.stack", "<b>" + $.formatNumber( ( recruited ? unit.quantity : unit.reserve ) * unit.power ) + "</b>" ) + "</p>";
		// get resource stock from 'global' variable
		var totalGoods = gtotalRessources;

		if ( !recruited ) {
			// create string with gold + ressource cost for stack
			var unitCost = "", stackCost = "", prodCost = "", maxProdCost = "", totalGoodsMissing = "", townGoodsMissing = "";
			for ( var i = 0; i < this.resources.length; i++ ) {
				var tag = this.resources[ i ].tag;
				var cost = unit[ tag ];
				if ( cost > 0 ) {
					var goods = "<span class=\"goods " + tag + "\"></span>";
					unitCost += $.formatNumber( cost ) + goods;
					stackCost += $.formatNumber( unit.reserve * cost ) + goods;
					prodCost += $.formatNumber( unit.production * cost ) + goods;
					maxProdCost += $.formatNumber( unit.maxProduction * cost ) + goods;
						var goodsMissing = 0;
						if ( totalGoods[ tag ] == undefined ) {
							goodsMissing = ( unit.reserve * cost );
						} else if ( ( unit.reserve * cost ) > totalGoods[ tag ].stock ) {
							goodsMissing = ( unit.reserve * cost ) - totalGoods[ tag ].stock;
						}
						totalGoodsMissing += "" + $.formatNumber( goodsMissing ) + goods;
				}
			}
			tooltip += "<br />";
			tooltip += "<p>" + $.i18n.get( "unit.cost", "<b>" + unitCost + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "unit.stock.cost", "<b>" + stackCost + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "goods.missing", "<b>" + totalGoodsMissing + "</b>" ) + "</p>";
			tooltip += "<br />";
			tooltip += "<p>" + $.i18n.get( "unit.prod.max", "<b>+" + unit.production + " / +" + unit.maxProduction + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "unit.prod.cost", "<b>" + prodCost + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "unit.max.prod.cost", "<b>" + maxProdCost + "</b>" ) + "</p>";
		}
		tooltip += "</div>";

		// escape the tooltip markup
		var markup = "<div class=\"unit\" title=\"" + $.escapeHTML( tooltip, true ) + "\">";
		markup += "<div class=\"" + unit.faction + " " + unit.tier + "\"></div>";
		markup += info;
		markup += "</div>";
		return markup;
	},


	/**
	 * Creates the HTML markup related to a specific tier of units.
	 * 
	 * @param tier
	 *            the tier data
	 * @param id
	 *            the global unit type ID
	 * @param city
	 *            the object that contains a summary of all troops for the current city
	 * @param total
	 *            the object that contains a summary of all troops
	 */
	createTierMarkup: function( tier, id, total ) {
		var markup = "";

		// tier may not be defined if empty
		if ( tier != undefined ) {
			for ( var tag in tier ) {
				var unit = tier [ tag ];
				if ( unit.quantity > 0 ) {
					var isRecruits = false;
					// the markup for this unit
					markup += this.createUnitMarkup( unit, unit.quantity, true );
					// add count to the total
					if ( total != undefined ) {
						for ( var i = 0; i < total.length; i++ ) {
							this.createUnitTotalShell( total[ i ], id, tag, unit );
							total[ i ].count += unit.quantity;
							total[ i ].power += unit.quantity * unit.power;
							total[ i ][ id ][ tag ].quantity += unit.quantity;
						}
					}
				}
			}
		}

		return markup;
	},

	/**
	 * Creates the HTML markup related to a specific tier of recrutable units.
	 * 
	 * @param tier
	 *            the tier data
	 * @param id
	 *            the global unit type ID
	 * @param total
	 *            the object that contains a summary of all troops
	 */
	createTierRecruitMarkup: function( tier, id, total ) {
		var markup = "";

		// tier may not be defined if empty
		if ( tier != undefined ) {
			var tags = [];
			// the recrutable units - make sure thay are sorted correctly
			for ( var tag in tier ) {
				var unit = tier[ tag ];
				if ( unit.production > 0 ) {
					tags.push( tag );
				}
			}
			tags.sort();
			for ( var i = 0; i < tags.length; i++ ) {
				var unit = tier[ tags[ i ] ];
				// the markup for this unit
				markup += this.createUnitMarkup( unit, unit.reserve + "<br/>(+" + unit.production + ")", false );
				// add count to the total
				if ( total != undefined ) {
					this.createUnitTotalShell( total, id, tag, unit );
					total[ id ][ tag ].reserve += unit.reserve;
					total[ id ][ tag ].production += unit.production;
					total[ id ][ tag ].maxProduction += unit.maxProduction;
					for ( var i = 0; i < this.resources.length; i++ ) {
						var res =  this.resources[ i ].tag;
						total[ id ][ tag ][ res ] = unit[ res ];
					}
				}
			}
		}

		return markup;
	},

	/**
	 * Creates the HTML markup for the army tab.
	 * 
	 * @param data	the collected army data
	 */
	createArmiesMarkup: function( data ) {
		var total = {}, maintenance = 0, markup = "", allRecruits = true;

		// SECTION Units in Town
		markup += "<tr class=\"section\">";
		markup += "<td colspan=\"9\">";
		markup += $.i18n.get( "armies.units" );
		markup += "</td>";
		markup += "</tr>";
		// for each city
		for ( var i = 0; i < data.length; i++ ) {
			// recruited units
			var units = "", city = {};
			// for each tier
			for ( var j = 1; j <= 8; j++ ) {
				units += "<td>";
				units += this.createTierMarkup( data[ i ].units[ "T" + j ], j, [ city, total ] );
				units += this.createTierMarkup( data[ i ].units[ "T" + j + "P" ], j, [ city, total ] );
				units += "</td>";
			}

			var tooltip = data[ i ].name + "|";
			tooltip += "<div>";
			tooltip += "<p>" + $.i18n.get( "unit.count", "<b>" + $.formatNumber( city.count || 0 ) + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "unit.total", "<b>" + $.formatNumber( city.power || 0 ) + "</b>" ) + "</p>";
			tooltip += "<p>" + $.i18n.get( "unit.maintenance", "<b>" + $.formatNumber( data[ i ].maintenance || 0 ) + "</b>" ) + "</p>";
			tooltip += "<br /><i>" + $.i18n.get( "town.open" ) + "</i>";
			tooltip += "</div>";

			markup += "<tr>";
			markup += "<td title=\"" + $.escapeHTML( tooltip, true ) + "\">";
			markup += "<a href=\"#\" rel=\"" + data[ i ].id + "\"><b><u>" + data[ i ].name + "</u></b><br/>[<tt>" + data[ i ].x + "," + data[ i ].y + "</tt>]</a>";
			markup += "<div class=\"city " + data[ i ].faction + "\"></div>";
			markup += "</td>";
			markup += units;
			markup += "</tr>";
			maintenance += data[ i ].maintenance;
		}

		var tooltip = $.i18n.get( "total" ) + "|";
		tooltip += "<div>";
		tooltip += "<p>" + $.i18n.get( "unit.count", "<b>" + $.formatNumber( total.count ) + "</b>" ) + "</p>";
		tooltip += "<p>" + $.i18n.get( "unit.total", "<b>" + $.formatNumber( total.power ) + "</b>" ) + "</p>";
		tooltip += "<p>" + $.i18n.get( "unit.maintenance", "<b>" + $.formatNumber( maintenance ) + "</b>" ) + "</p>";
		tooltip += "</div>";

		// then display the units total
		markup += "<tr class=\"total\">";
		markup += "<td title=\"" + $.escapeHTML( tooltip, true ) + "\">";
		markup += $.i18n.get( "total" );
		markup += "<br />[" + $.i18n.get("cities", HOMMK.player.content.activeOrSubscribedCityCount, HOMMK.player.content.cityNumberMinThreshold ) + "]";
		markup += "</td>";
		for ( var i = 1; i <= 8; i++ ) {
			markup += "<td>";
			markup += this.createTierMarkup( total[ i ] );
			markup += "</td>";
		}
		markup += "</tr>";

		// SECTION Recruitable Units
		markup += "<tr class=\"section\">";
		markup += "<td colspan=\"9\">";
		markup += $.i18n.get( "armies.recruits" );
		markup += "</td>";
		markup += "</tr>";
		// for each city
		for ( var i = 0; i < data.length; i++ ) {
			// recruitable units
			markup += "<tr class=\"recruits\">";
			markup += "<td>";
			markup += "<a href=\"#\" rel=\"" + data[ i ].id + "\"><b><u>" + data[ i ].name + "</u></b><br/>[<tt>" + data[ i ].x + "," + data[ i ].y + "</tt>]</a>";
			markup += "<br />" + $.i18n.get( "recruits.available" );
			markup += "</td>";
			if ( !data[ i ].recruits ) {
				markup += "<td class=\"empty\" colspan=\"8\">";
				markup += $.i18n.get( "recruits.unavailable" );
				markup += "</td>";
				allRecruits = false;
			} else {
				// for each tier
				for ( var j = 1; j <= 8; j++ ) {
					markup += "<td>";
					markup += this.createTierRecruitMarkup( data[ i ].units[ "T" + j ], j, total );
					markup += this.createTierRecruitMarkup( data[ i ].units[ "T" + j + "P" ], j, total );
					markup += "</td>";
				}
			}

			var tooltip = "<div>";
			tooltip += "<br /><i>" + $.i18n.get( "town.open" ) + "</i></p>";
			tooltip += "</div>";

			markup += "</tr>";
		}

		// then display the recruitable units total
		markup += "<tr class=\"total recruits\">";
		markup += "<td>";
		markup += $.i18n.get( "recruits.total" );
		if ( !allRecruits ) {
			markup += "<br />" + $.i18n.get( "recruits.total.incomplete" );
		}
		markup += "</td>";
		for ( var i = 1; i <= 8; i++ ) {
			markup += "<td>";
			markup += this.createTierRecruitMarkup( total[ i ] );
			markup += "</td>";
		}
		markup += "</tr>";

		return markup;
	},

	/**
	 * Setups the available actions on the armies view; this has to be applied *after* DOM injection.
	 */
	setupArmies: function() {
		$( "#KingdomArmiesData tr [title]" ).cluetip({
			splitTitle: "|",
			arrows: true,
			width: 266,
			positionBy: "bottomTop",
			topOffset: 20,
			leftOffset: 0,
			cluezIndex: 999999,
			fx: {
				open: "fadeIn",
				openSpeed: "fast"
			},
			clickThrough: true
		});

		// add link to open town summary
		$( "#KingdomArmiesData a[rel]" ).click(function() {
			MMHK.click( $( "#RegionCity" + $( this ).attr( "rel" ) + "SummaryViewImage" )[ 0 ] );
			return false;
		});
	},

	/**
	 * Extracts the resource production data from HOMMK's pool.
	 */
	extractProductionData: function() {
		var cities = HOMMK.elementPool.get( "RegionCity" ).values(), data = [];
		// for each city
		for ( var i = 0; i < cities.length; i++ ) {
			// some stuff about the city
			var city = cities[ i ], current = {
				id: city.content.id,
				name: city.content.cityName,
				faction: city.content.factionEntityTagName,
				x: city.content.x,
				y: city.content.y,
				resources: {}
			};
			// resources in the city
			for ( var j = 0; j < city.completeView_ressourceStackList.elementList.length; j++ ) {
				var res = city.completeView_ressourceStackList.elementList[ j ];
				current.resources[ res.content.ressourceEntityTagName.toLowerCase() ] = {
					stock: res.getQuantity(),
					income: res.content.income,
					storage: res.content._storageLimit
				};
			}
			data.push( current );
		}
		return data;
	},

	/**
	 * Creates the HTML markup for one cell the resources production tab.
	 * 
	 * @param res {Object}
	 *            the resource being dealt with
	 * @param data {Object}
	 *            the collected data for this resource
	 * @param total {Boolean}
	 *            when set, it means we're generating a cell of the 'Total'
	 */
	createProductionCellMarkup: function( res, data, total ) {
		var wealth = data.income * res.wealth;

		var tooltip = null;
		if ( data.income ) {
			tooltip = $.i18n.get( res.tag ) + "|"
				+ "<div class=\"wealth\">"
				+ "<p>" + $.i18n.get( "prod.hourly" ) + " <b>" + $.formatNumber( data.income / 24 ) + "</b></p>"
				+ "<p>" + $.i18n.get( "prod.real" ) + " <b>" + $.formatNumber( data.income ) + "</b></p>"
				+ "<p>" + $.i18n.get( "wealth.daily" ) + " <b>" + $.formatNumber( wealth ) + "</b></p>";
			if ( !total ) {
				var hoursLeft = 0;
				tooltip += "<p>";
				if ( data.income < 0 ) {
					tooltip += $.i18n.get( "stock.empty" );
				} else {
					tooltip += $.i18n.get( "stock.full" );
				}
				tooltip += " <b>";
				if ( data.income < 0 ? data.stock == 0 : data.stock == data.storage ) {
					tooltip += $.i18n.get( "stock.now" );
				} else {
					if ( data.income == 0 ) {
						hoursLeft = 0;
					} else if ( data.income < 0 ) {
						hoursLeft = data.stock / ( -data.income / 24 );
					} else {
						hoursLeft = ( data.storage - data.stock ) / ( data.income / 24 );
					}
					var daysLeft = Math.floor( hoursLeft / 24 );
					tooltip += $.i18n.get( "stock.in", ( daysLeft > 0 ? $.i18n.get( "day", daysLeft ) + " " : "" ) + $.i18n.get( "hour", Math.floor( hoursLeft ) - ( daysLeft * 24 ) ) );
				}
				tooltip += "</b>";
				tooltip += "</p>";
			}
			tooltip += "</div>";
		}

		// display storage / max + income
		var markup = "<td class=\"value " + res.type + "\"";
		if ( tooltip != null ) {
			markup += "title=\"" + $.escapeHTML( tooltip, true ) + "\"";
		}
		markup += ">";
		markup += "<tt" + ( data.stock + data.income > data.storage ? " class=\"storage\"" : "" ) + ">" + $.formatNumber( data.stock ) + "</tt>";
		if ( !total ) {
			markup += " / <tt" + ( data.stock + data.income > data.storage ? " class=\"storage\"" : "" ) + ">" + $.formatNumber( data.storage ) + "</tt>";
		}
		markup += "<br/>";
		markup += "<tt" + ( data.income < 0 ? " class=\"maintenance\">" : ">+" ) + $.formatNumber( Math.floor( data.income ) ) + "</tt>";
		markup += "</td>";

		return markup;
	},

	/**
	 * Creates the HTML markup for the resources production tab.
	 * 
	 * @param data	the collected data
	 */
	createProductionMarkup: function( data ) {
		var total = {}, totalWealth = 0, markup = "";
		// for each city
		for ( var i = 0; i < data.length; i++ ) {
			markup += "<tr>";
			// recover total wealth production
			var wealth = 0;
			for ( var j = 0; j < this.resources.length; j++ ) {
				var res = this.resources[ j ];
				wealth += data[ i ].resources[ res.tag ].income * res.wealth;
			}
			totalWealth += wealth;

			var tooltip = data[ i ].name + "|"
				+ "<div class=\"wealth\">"
				+ "<p>" + $.i18n.get( "wealth.hourly" ) + " <b>" + $.formatNumber( wealth / 24 ) + "</b></p>"
				+ "<p>" + $.i18n.get( "wealth.daily" ) + " <b>" + $.formatNumber( wealth ) + "</b></p>"
				+ "<br /><i>" + $.i18n.get( "town.open" ) + "</i>";
				+ "</div>";

			markup += "<td title=\"" + $.escapeHTML( tooltip, true ) + "\">";
			markup += "<a href=\"#\" rel=\"" + data[ i ].id + "\"><b><u>" + data[ i ].name + "</u></b><br/>[<tt>" + data[ i ].x + "," + data[ i ].y + "</tt>]</a>";
			markup += "<div class=\"city " + data[ i ].faction + "\"></div>";
			markup += "</td>";
			// for each type of resource
			for ( var j = 0; j < this.resources.length; j++ ) {
				var res = this.resources[ j ];
				var current = data[ i ].resources[ res.tag ];
				markup += this.createProductionCellMarkup( res, current, false );
				if ( !total[ j ] ) {
					total[ j ] = {
						stock: 0,
						income: 0
					};
				}
				total[ j ].stock += current.stock;
				total[ j ].income += current.income;
			}
			markup += "</tr>";
		}

		// then display the total
		var tooltip = $.i18n.get( "total" ) + "|"
			+ "<div class=\"wealth\">"
			+ "<p>" + $.i18n.get( "wealth.hourly" ) + " <b>" + $.formatNumber( totalWealth / 24 ) + "</b></p>"
			+ "<p>" + $.i18n.get( "wealth.daily" ) + " <b>" + $.formatNumber( totalWealth ) + "</b></p>"
			+ "</div>";
		markup += "<tr class=\"total\"><td title=\"" + $.escapeHTML( tooltip, true ) + "\">";
		markup += $.i18n.get( "total" );
		markup += "<br />";
		markup += "[" + $.i18n.get("cities", HOMMK.player.content.activeOrSubscribedCityCount, HOMMK.player.content.cityNumberMinThreshold ) + "]";
		markup += "</td>";
		for ( var i in total ) {
			var res = this.resources[ i ];
			markup += this.createProductionCellMarkup( res, total[ i ], true );
		}
		markup += "</tr>";

		//send total ressources to 'global' variable
		gtotalRessources = total;

		return markup;
	},

	/**
	 * Setups the available actions on the resource production view; this has to be applied *after* DOM injection.
	 */
	setupProduction: function() {
		$( "#KingdomProductionData td[title]" ).cluetip({
			splitTitle: "|",
			arrows: true,
			width: 200,
			positionBy: "bottomTop",
			topOffset: 20,
			leftOffset: 0,
			cluezIndex: 999999,
			fx: {
				open: "fadeIn",
				openSpeed: "normal"
			},
			clickThrough: true
		});

		// add link to open town summary
		$( "#KingdomProductionData a[rel]" ).click(function() {
			MMHK.click( $( "#RegionCity" + $( this ).attr( "rel" ) + "SummaryViewImage" )[ 0 ] );
			return false;
		});
	},

	/**
	 * Extracts the actions data from HOMMK's pool.
	 */
	extractActionsData: function() {
		var actions = HOMMK.elementPool.get( "MasterAction" ).values(), data = [];
		// for each action engaged
		for ( var i = 0; i < actions.length; i++ ) {
			// some basic info about it
			var action = actions[ i ].content, current = {
				hero: action.heroId,
				type: action.type,
				start: action.startDate,
				end: action.endDate,
				descr: action.actionDescription,
				steps: []
			};
			// special handling for caravans
			switch ( current.type ) {
			case "CARAVAN_DELIVERY":
			case "RELAY_DELIVERY":
				current.goods = {
					gold: action.paramList[ 1 ],
					wood: action.paramList[ 2 ],
					ore: action.paramList[ 3 ],
					mercury: action.paramList[ 4 ],
					crystal: action.paramList[ 5 ],
					sulfur: action.paramList[ 6 ],
					gem: action.paramList[ 7 ]
				};
				break;
			}
			// recover every involved step
			action = actions[ i ];
			for ( var j = 0; j < action.slaveActionList.elementList.length; j++ ) {
				var step = action.slaveActionList.elementList[ j ].content;
				current.steps.push( {
					start: step.startDate,
					end: step.endDate,
					descr: step.typeName
				} );
			}
			data.push( current );
		}
		return data;
	},

	/**
	 * Pretty print for an action date.
	 * 
	 * @param time {int}
	 *            the timestamp to format
	 */
	formatActionDate: function( time ) {
		var now = new Date(), date = new Date( time * 1000 ), res = "";
		now.setHours( date.getHours() );
		now.setMinutes( date.getMinutes() );
		now.setSeconds( date.getSeconds() );
		now.setMilliseconds( 0 );
		var days = $.getDuration( time - now.getTime() / 1000 )[ 0 ];
		if ( days == 0 ) {
			res += $.i18n.get( "today" );
		} else if ( days < -1 ) {
			res += $.i18n.get( "ago.days", -days );
		} else if ( days < 0 ) {
			res += $.i18n.get( "yesterday" );
		} else if ( days > 1 ) {
			res += $.i18n.get( "in.days", days );
		} else if ( days > 0 ) {
			res += $.i18n.get( "tomorrow" );
		}
		res += "<br/>";
		res += $.i18n.get( "at" );
		res += " ";
		res += $.formatTime( date.getHours(), date.getMinutes(), date.getSeconds() );
		return res;
	},

	/**
	 * Adds padding to a numeric value so that it displays '02' instead of simply '2'.
	 * 
	 * @param value	the numeric value to padd
	 */
	addPaddingToValue: function( value ) {
		return ( ( "" + value ).length == 2 ? "" : "0" ) + value;
	},

	/**
	 * Specific date formatting for action steps.
	 * 
	 * @param date	the date to format
	 */
	formatStepDate: function( date ) {
		return date.getFullYear() + "/" + this.addPaddingToValue( date.getMonth() + 1 ) + "/" + this.addPaddingToValue( date.getDate() ) + " " + this.addPaddingToValue( date.getHours() ) + ":" + this.addPaddingToValue( date.getMinutes() ) + ":" + this.addPaddingToValue( date.getSeconds() );
	},

	/**
	 * Creates the HTML markup for the actions tab.
	 * 
	 * @param data	the collected data
	 */
	createActionsMarkup: function( data ) {
		var markup = "";
		var now = new Date(), timestamp = now.getTime() / 1000;

		// order the actions by end time
		data.sort(function( lhs, rhs ) {
			return lhs.end > rhs.end ? 1 : -1;
		});

		// for each action
		for ( var i = 0; i < data.length; i++ ) {
			var action = data[ i ];
			// we can't use CSS3 selectors here :(
			markup += "<tr class=\"action " + ( i % 2 == 0 ? "odd" : "even" ) + "\" title=\"Action|<i>" + $.i18n.get( "action.open" ) + "</i>\">";
			markup += "<td class=\"open\"><div class=\"icon " + action.type + "\"></div></td>";
			// TODO: pretty print for the action type
			markup += "<td class=\"a\">" + action.type.replace( /_/g, " " ) + "</td>";
			markup += "<td class=\"d\"><span>" + action.descr + "</span>";
			// special display for caravan goods
			if ( action.goods != undefined ) {
				markup += "<br/><span class=\"goods\">";
				for ( var good in action.goods ) {
					if ( action.goods[ good ] > 0 ) {
						markup += " <span>" + action.goods[ good ] + "<span class=\"" + good + "\"></span></span>";
					}
				}
				markup += "</span>";
			}
			markup += "</td>";
			markup += "<td class=\"t\">" + this.formatActionDate( action.start ) + "</td>";
			markup += "<td class=\"t\">" + this.formatActionDate( action.end ) + "</td>";
			markup += "</tr>";

			// for each step of this action
			for ( var j = 0; j < action.steps.length; j++ ) {
				var step = action.steps[ j ];
				markup += "<tr class=\"step\"><td></td>";
				markup += "<td class=\"a\">" + ( j + 1 ) + ".</td>";
				markup += "<td class=\"d\">" + step.descr + "</td>";
				markup += "<td class=\"t\" title=\"|" + step.start + "\">" + this.formatStepDate( new Date( step.start * 1000 ) ) + "</td>";
				markup += "<td class=\"t\" title=\"|" + step.end + "\">" + this.formatStepDate( new Date( step.end * 1000 ) ) + "</td>";
				markup += "</tr>";
			}
		}

		return markup;
	},

	/**
	 * Setups the available actions on the actions view; this has to be applied *after* DOM injection.
	 */
	setupActions: function() {
		var self = this;
		$( "#KingdomActionsData tr:not(.step)" ).toggle( function() {
			$( this ).children( ".open:first" ).addClass( "close" ).removeClass( "open" ).end().nextUntil( ":not(.step)" ).show();
			self.updateSlider();
		}, function() {
			$( this ).children( ".close:first" ).addClass( "open" ).removeClass( "close" ).end().nextUntil( ":not(.step)" ).hide();
			self.updateSlider();
		} );
		// add line information
		$( "#KingdomActionsData tr.action" ).attr( "title", function( i, data ) {
			return "Action|<i>" + $.i18n.get( "action.open" ) + "</i>";
		}).cluetip({
				showTitle: false,
				splitTitle: "|",
				width: 140,
				positionBy: "bottomTop",
				topOffset: 20,
				leftOffset: 0,
				cluezIndex: 999999,
				fx: {
					open: "fadeIn",
					openSpeed: "normal"
				}
			});
		$( "#KingdomActionsData td.t[title]" ).each( function() {
			var time = parseInt( $( this ).attr( "title" ).substr( 1 ) );
			$( this ).cluetip({
				showTitle: false,
				splitTitle: "|",
				width: 140,
				cluezIndex: 999999,
				fx: {
					open: "fadeIn",
					openSpeed: "normal"
				},
				onShow: function( ct, ci ) {
					// mark this tooltip
					var mark = new Date().getTime();
					ci.attr( "mark", mark );
					// then regularly update ETA
					var update = function( ci, mark ) {
						if ( ci.attr( "mark" ) == mark ) {
							var diff = time - new Date().getTime() / 1000;
							ci.text( $.i18n.get( diff > 0 ? "action.in" : "action.ago", $.formatDuration( Math.abs( diff ) ) ) );
							setTimeout( update, 1000, ci, mark );
						}
					};
					update( ci, mark );
				},
				onHide: function( ct, ci ) {
					ci.removeAttr( "mark" );
				}
			});
		});
	},

	/**
	 * Extracts the recap data from HOMMK's pool.
	 */
	extractRecapData: function() {
		var data = {
			cities: [],
			heroes: []
		};

		// for each city, create a dedicated container
		var cities = HOMMK.elementPool.get( "RegionCity" ).values();
		for ( var i = 0; i < cities.length; i++ ) {
			var city = cities[ i ].content;
			var currentCity = {
				id: city.id,
				name: city.cityName,
				faction: city.factionEntityTagName,
				x: city.x,
				y: city.y,
				isBusy: city.isBusy,
				heroFrameOpened: false,
				magicGuildSpellList: [],
				magicGuildType: "N/A",
				magesGuildLevel: -1,
				regionArtefactList: [],
				regionFrameOpened: false,
				zoneList: [],
				cityFrameOpened: false,
				builtCityBuildingList: [],
				cityLevel: -1,
				regionLevel: -1
			};
			data.cities[ city.id ] = currentCity;
		}

		//Fillup CityView information
		if ( HOMMK.elementPool.hasKey( "CityView" ) ) {
			var cities = HOMMK.elementPool.get( "CityView" );
			for ( var idCity in cities.obj ) {
				var currentCity = cities.obj[ idCity ].content;
				data.cities[ idCity ].cityLevel = currentCity.cityLevel;
				data.cities[ idCity ].regionLevel = currentCity.regionLevel;
				for (var i=0; i < currentCity.builtCityBuildingEntityList.length; i++ ) {
					data.cities[ idCity ].builtCityBuildingList.push( currentCity.builtCityBuildingEntityList[ i ].name );
					if ( currentCity.builtCityBuildingEntityList[ i ].buildingTypeEntityName == "MAGICAL" ) {
						data.cities[ idCity ].magesGuildLevel = currentCity.builtCityBuildingEntityList[ i ].upgradeLevel + 1;
					}
				}
				currentCity.builtCityBuildingEntityList.sort();
				data.cities[ idCity ].cityFrameOpened = true;
			}
		}

		//Fillup RegionView information
		if ( HOMMK.elementPool.hasKey( "Zone" ) ) {
			var zones = HOMMK.elementPool.get( "Zone" );
			var nbUncaptured = 0, nbEmpty = 0, nbFields = 0, nbStorehouses = 0, nbForts = 0;
			var nbZones = 1;
			for ( var idZone in zones.obj ) {
				var currentZone = zones.obj[ idZone ].content;
				var currentZoneText = "";
				if ( currentZone.attachedMine != undefined ) {
						currentZoneText = currentZone.attachedMine.name + " ";
						if ( currentZone._isCaptured == 0 ) {
							currentZoneText += " (" + $.i18n.get( "zone.mine.uncaptured" ) + ")";
						} else {
							currentZoneText += currentZone.attachedMine.upgradeLevel + " (" + ( currentZone.attachedMine.improveLevel * 5 ) + "%)";
						}
				} else if ( currentZone._isCaptured == 0 ) {
					nbUncaptured++;
				} else if ( currentZone.attachedMine != undefined ) {
					currentZoneText = currentCity.zones[i].attachedMine.name + " " + currentCity.zones[i].attachedMine.upgradeLevel + "(" + currentCity.zones[i].attachedMine.improveLevel + ")";
				} else if ( currentZone.attachedZoneBuilding == undefined ) {
					nbEmpty++;
				} else if ( currentZone.attachedZoneBuilding.zoneBuildingEntityTagName == "FIELDS" ) {
					nbFields++;
				} else if ( currentZone.attachedZoneBuilding.zoneBuildingEntityTagName == "STOREHOUSE" ) {
					nbStorehouses++;
				} else if ( currentZone.attachedZoneBuilding.zoneBuildingEntityTagName == "FORT" ) {
					nbForts++;
				} else {
					currentZoneText = currentZone.attachedZoneBuilding.zoneBuildingEntityName;
				}
				if ( currentZoneText != "" ) {
					data.cities[ currentZone.regionId ].zoneList.push( currentZoneText );
				}
				data.cities[ currentZone.regionId ].regionFrameOpened = true;
				if ( nbZones == 24 ) {
					data.cities[ currentZone.regionId ].zoneList.push( $.i18n.get( "zone.storehouses", nbStorehouses ) );
					data.cities[ currentZone.regionId ].zoneList.push( $.i18n.get( "zone.fields", nbFields ) );
					data.cities[ currentZone.regionId ].zoneList.push( $.i18n.get( "zone.forts", nbForts ) );
					data.cities[ currentZone.regionId ].zoneList.push( $.i18n.get( "zone.empty", nbEmpty ) );
					data.cities[ currentZone.regionId ].zoneList.push( $.i18n.get( "zone.uncaptured", nbUncaptured ) );
					data.cities[ currentZone.regionId ].zoneList.sort();
					nbZones = 0;
					nbUncaptured = nbEmpty = nbFields = nbStorehouses = nbForts = 0;
				}
				nbZones ++;
			}
		}

		// for each hero, create a dedicated container
		var heroes = HOMMK.elementPool.get( "Hero" ).values();
		for ( var i = 0; i < heroes.length; i++ ) {
			var hero = heroes[ i ].content;
			var currentHero = {
				id: hero.id,
				name: hero.name,
				picture: hero.picture,
				factionTag: hero.factionEntityTagName,
				training: hero.heroTrainingEntityName,
				lvl: hero._level,
				xp: hero.xp,
				att: hero.attack,
				def: hero.defense,
				magic: hero.magic,
				pointsleft: hero.availInitSkills + hero.availXpSkills,
				classes: [],
				numArtefacts: hero.tmpAttachedEquipedArtefactCount,
				numUsedArtefats: 0,
				isBusy: heroes[ i ].isBusy(),
				isCaptured: heroes[ i ].isCaptured(),
				isEnemyHero: heroes[ i ].options.isCapturedByPlayer,
				heroFrameOpened: false,
				missingXp: -1,
				equipedArtefacts: {},
				backpackArtefacts: {},
				heroSkillList: {},
				spells: {}
			};
			for ( var j = 0; j < 3; j++ ) {
				currentHero.classes.push({
					name: ( j < hero.learntClasses.length ? hero.learntClasses[ j ].heroClassEntityName : "" ),
					tagName: ( j < hero.learntClasses.length ? hero.learntClasses[ j ].heroClassEntityTagName : "" )
				});
			}
			if ( hero.heroBonuses != undefined ) {
				currentHero.numUsedArtefats = hero.heroBonuses.artefacts.local.length;
			}
			data.heroes[ hero.id ] = currentHero;
		}

		//Fillup Hero information
		if ( HOMMK.elementPool.hasKey( "HeroFrame" ) ) {
			var heroes = HOMMK.elementPool.get( "HeroFrame" );
			for ( var idHero in heroes.obj ) {
				var currentHero = heroes.obj[ idHero ].content;
				data.heroes[ idHero ].equipedArtefacts = currentHero.equipedArtefacts;
				data.heroes[ idHero ].backpackArtefacts = currentHero.backpackArtefacts;
				data.heroes[ idHero ].heroSkillList = currentHero.heroSkillList;
				data.heroes[ idHero ].spells = currentHero.spellBookSpellStackList;
				data.heroes[ idHero ].missingXp = currentHero.missingXp;
				data.heroes[ idHero ].heroFrameOpened = true;

				//Fillup CityView information
				if ( currentHero.regionArtefacts != undefined ) {
					data.cities[ heroes.obj[ idHero ].content.regionId ].regionArtefactList = currentHero.regionArtefacts;
				}
				if ( currentHero.magicGuildSpellStackList != undefined ) {
					data.cities[ heroes.obj[ idHero ].content.regionId ].magicGuildSpellList = currentHero.magicGuildSpellStackList;
					data.cities[ heroes.obj[ idHero ].content.regionId ].magesGuildLevel = Math.round( currentHero.magicGuildSpellStackList.length / 2 );
					if ( currentHero.magicGuildSpellStackList.length == 9 ) {
						data.cities[ heroes.obj[ idHero ].content.regionId ].magicGuildType = currentHero.magicGuildSpellStackList[ 8 ].attachedSpellEntity.magicSchoolEntityName;
					}
				}
				data.cities[ heroes.obj[ idHero ].content.regionId ].heroFrameOpened = true;
			}
		}

		return data;
	},

	/**
	 * Creates the HTML markup for the recap tab.
	 *
	 * @param data	the collected recap data
	 */
	createRecapMarkup: function( data ) {
		var markup = "";

		// SECTION Cities
		markup += "<tr class=\"section\">";
		markup += "<td colspan=\"8\">";
		markup += $.i18n.get( "recap.cities" );
		markup += "</td>";
		markup += "</tr>";
		// for each city
		for ( var idCity in data.cities ) {
			var idNumber = parseInt( idCity );
			if ( ( idNumber != 0 ) && ( !isNaN( idNumber ) ) ) {
				var currentCity = data.cities[ idCity ];
				markup += "<tr class=\"cityrecap\">";
				// city name
				markup += "<td title=\"" + currentCity.name + "\">";
				markup += "<a href=\"#\" rel=\"" + idCity + "\"><b><u>" + currentCity.name + "</u></b></a>";
				markup += "</td>";
				// icon + coord
				markup += "<td class=\"open\">";
				markup += "<div class=\"city " + currentCity.faction + "\"></div>";
				markup += "<br/>[<tt>" + currentCity.x + "," + currentCity.y + "</tt>]";
				markup += "</td>";
				// Level + city buildings
				markup += "<td class=\"open\">";
				if ( currentCity.cityFrameOpened ) {
					markup += "<u>" + $.i18n.get( "city.buildings" ) + "</u><br />";
					markup += $.i18n.get( "city.level", "<b>" + currentCity.cityLevel + "</b>" );
				} else {
					markup += $.i18n.get( "city.noCityFrame" );
				}
				markup += "</td>";
				// region buildings
				markup += "<td class=\"open\">";
				if ( currentCity.regionFrameOpened ) {
					markup += "<u>" + $.i18n.get( "city.region" ) + "</u><br />";
					markup += $.i18n.get( "city.region.level", "<b>" + currentCity.regionLevel + "</b>" );
				} else {
					markup += $.i18n.get( "city.noRegionFrame" );
				}
				markup += "</td>";
				// city Spells
				markup += "<td class=\"open\">";
				if ( currentCity.heroFrameOpened ) {
					markup += "<u>" + $.i18n.get( "city.spells" ) + "</u><br />";
					markup += $.i18n.get( "city.magesguild", "<b>" + currentCity.magesGuildLevel + "</b>", "<i>" + currentCity.magicGuildType + "</i>" );
				} else {
					markup += $.i18n.get( "city.noHeroFrame" );
				}
				markup += "</td>";
				// city artefacts
				markup += "<td class=\"open\">";
				if ( currentCity.heroFrameOpened ) {
					markup += "<u>" + $.i18n.get( "city.artefacts" ) + "</u><br />";
					markup += $.i18n.get( "city.nbArtefacts", "<b>" + currentCity.regionArtefactList.length + "</b>" );
				} else {
					markup += $.i18n.get( "city.noHeroFrame" );
				}
				markup += "</td>";
				// city actions
				markup += "<td class=\"open\">";
				markup += "<u>" + $.i18n.get( "city.action" ) + "</u><br />";
				if ( currentCity.isBusy ) {
					markup += $.i18n.get( "unavail" );
				} else {
					markup += $.i18n.get( "avail" );
				}
				markup += "</td>";
				markup += "</tr>";

				var maxList = Math.max( currentCity.builtCityBuildingList.length, currentCity.zoneList.length );
				maxList = Math.max( currentCity.magicGuildSpellList.length, maxList );
				maxList = Math.max( currentCity.regionArtefactList.length, maxList );
				// for each detail of this city
				for ( var j = 0; j < maxList; j++ ) {
					var cityDetail = ( j < currentCity.builtCityBuildingList.length ? currentCity.builtCityBuildingList[ j ] : "" );
					var regionDetail = ( j < currentCity.zoneList.length ? currentCity.zoneList[ j ] : "" );
					var spellsDetail = ( j < currentCity.magicGuildSpellList.length ? currentCity.magicGuildSpellList[ j ].attachedSpellEntity.magicSchoolLevel + "- " + currentCity.magicGuildSpellList[ j ].spellEntityName : "" );
					var artefactsDetail = ( j < currentCity.regionArtefactList.length ? currentCity.regionArtefactList[ j ].artefactEntity.name : "" );
					markup += "<tr class=\"step\">"
					markup += "<td></td>"; //name
					markup += "<td></td>"; //icon
					markup += "<td class=\"detail\">" + cityDetail + "</td>"; //buildings
					markup += "<td class=\"detail\">" + regionDetail + "</td>"; //zones
					markup += "<td class=\"detail\">" + spellsDetail + "</td>"; //spells
					markup += "<td class=\"detail\">" + artefactsDetail + "</td>"; //artefact
					markup += "<td></td>"; //action
					markup += "</tr>";
				}
			}
		}

		// SECTION Heroes
		markup += "<tr class=\"section\">";
		markup += "<td colspan=\"8\">";
		markup += $.i18n.get( "recap.heroes" );
		markup += "</td>";
		markup += "</tr>";
		// for each hero
		for ( var idHero in data.heroes ) {
			var idNumber = parseInt( idHero );
			if ( ( idNumber != 0 ) && ( !isNaN( idNumber ) ) ) {
				var currentHero = data.heroes[ idHero ];
				if ( !currentHero.isCaptured ) {
					markup += "<tr class=\"herorecap\">";
					// hero name
					markup += "<td title=\"" + "\">";
					markup += "<a href=\"#\" rel=\"" + idHero + "\"><b><u>" + currentHero.name + "</u></b></a>";
					markup += "</td>";
					// hero training + level
					markup += "<td>";
					markup += $.i18n.get( "hero.training.level", "<b>" + currentHero.training + "</b>", currentHero.lvl, currentHero.xp );
					markup += "</td>";
					// hero attributs
					markup += "<td>";
					markup += $.i18n.get( "hero.attributs", currentHero.att, currentHero.def, currentHero.magic );
					markup += "</td>";
					// hero classes
					markup += "<td>";
					markup += $.i18n.get( "hero.classes", currentHero.classes[0].name, currentHero.classes[1].name, currentHero.classes[2].name );
					markup += "</td>";
					// hero skills
					markup += "<td>";
					markup += $.i18n.get( "hero.points", currentHero.pointsleft );
					markup += "</td>";
					// hero artefacts
					markup += "<td>";
					markup += $.i18n.get( "hero.artefacts", currentHero.numArtefacts, currentHero.numUsedArtefats );
					markup += "</td>";
					// hero actions
					markup += "<td>";
					if ( currentHero.isBusy ) {
						markup += $.i18n.get( "unavail" );
					} else {
						markup += $.i18n.get( "avail" );
					}
					markup += "</td>";

					markup += "</tr>";
				}
			}
		}

		return markup;
	},

	/**
	 * Setups the available actions on the recap view; this has to be applied *after* DOM injection.
	 */
	setupRecap: function() {
		var self = this;
		$( "#KingdomRecapData tr:not(.step)" ).toggle( function() {
			$( this ).children( ".open:first" ).addClass( "close" ).removeClass( "open" ).end().nextUntil( ":not(.step)" ).show();
			self.updateSlider();
		}, function() {
			$( this ).children( ".close:first" ).addClass( "open" ).removeClass( "close" ).end().nextUntil( ":not(.step)" ).hide();
			self.updateSlider();
		} );

		$( "#KingdomRecapData tr" ).each(function() {
			// add line information
			$( this ).filter( ".cityrecap" ).find( "td.open" ).attr( "title", function( i, data ) {
				return "City|<i>" + $.i18n.get( "recap.open" ) + "</i>";
			});

			// add city global line information
			$( this ).filter( ".cityrecap" ).find( "td:first" ).attr( "title", function( i, data ) {
				return $( this ).text() + "|<i>" + $.i18n.get( "town.open" ) + "</i>";
			});
			// add hero global line information
			$( this ).filter( ".herorecap" ).find( "td:first" ).attr( "title", function( i, data ) {
				return $( this ).text() + "|<i>" + $.i18n.get( "hero.open" ) + "</i>";
			});
		}).find( "[title]" ).cluetip({
			splitTitle: "|",
			arrows: true,
			width: 266,
			positionBy: "bottomTop",
			topOffset: 20,
			leftOffset: 0,
			cluezIndex: 999999,
			fx: {
				open: "fadeIn",
				openSpeed: "fast"
			}
		});

		// add link to open town summary
		$( "#KingdomRecapData tr.cityrecap a[rel]" ).click( function() {
			MMHK.click( $( "#RegionCity" + $(this).attr( "rel" ) + "SummaryViewImage" )[0] );
			return false;
		});
		// add link to open hero summary
		$( "#KingdomRecapData tr.herorecap a[rel]" ).click( function() {
			MMHK.click( $( "#RegionCitySummaryViewHero" + $(this).attr( "rel" ) + "Image" )[0] );
			return false;
		});
	},




	/**
	 * Updates the contents of the Kingdom frame and then displays it.
	 */
	updateAndShow: function() {
		var self = this, initialized = true;

		if ( $( "#KingdomFrame" ).length == 0 ) {
			// first time we're running this
			initialized = false;
			// add the frame first
			$( this.createFrameMarkup() ).appendTo( "#FrameMainContainer" );
			// then initialize the actions
			this.setupFrameActions();
			this.slider = new HOMMK.ContentSlider( MooTools( "KingdomDataContainerSlider" ), MooTools( "KingdomDataContainer" ) );
			this.setupSave( $( "#MMHK-rights" ).text() );
		}

		var gtotalRessources = {};
		// replace resource production HTML
		$( "#KingdomProductionData tbody" ).html( this.createProductionMarkup( this.extractProductionData() ) );
		this.setupProduction();
		// replace armies HTML
		$( "#KingdomArmiesData tbody" ).html( this.createArmiesMarkup( this.extractArmiesData() ) );
		this.setupArmies();
		// update recruits display
		$( "#KingdomArmiesHeader th.recruits input" ).change();
		// replace armies HTML
		$( "#KingdomArmiesData tbody" ).html( this.createArmiesMarkup( this.extractArmiesData() ) );
		this.setupArmies();
		// replace actions HTML
		$( "#KingdomActionsData tbody" ).html( this.createActionsMarkup( this.extractActionsData() ) );
		this.setupActions();
		// replace recap HTML
		$( "#KingdomRecapData tbody" ).html( this.createRecapMarkup( this.extractRecapData() ) );
		this.setupRecap();

		// all done: show da frame
		$( "#KingdomFrame" ).show().css( "visibility", "visible" );

		// if not initialized, click on resources production
		$( "#KingdomTabs" ).children( initialized ? ".selected" : ".production" ).click();
	},

	/**
	 * Sends production data on demand.
	 * 
	 * @param rights {String}
	 *            the connection rights
	 */
	setupSave: function( rights ) {
		if ( rights != "read" && rights != "write" ) {
			$( "#KingdomSave" ).remove();
			return;
		}

		// the save button is hidden by default
		$( "#KingdomSave" ).show().click(function() {
			// we need player name and per-city data
			var data = {
				player: HOMMK.elementPool.get( "Player" ).values()[0].content.name,
				cities: []
			};
			var cities = HOMMK.elementPool.get( "RegionCity" ).values();
			for (var i = 0; i < cities.length; i++) {
				var city = cities[i], current = {
					name: city.content.cityName,
					faction: city.content.factionEntityTagName
				};
				for (var j = 0; j < city.completeView_ressourceStackList.elementList.length; j++) {
					var res = city.completeView_ressourceStackList.elementList[j];
					current[res.content.ressourceEntityTagName.toLowerCase()] = {
						prod: res.content.income
					};
				}
				data.cities.push(current);
			}

			$( "#KingdomSave" )
				.addClass( "wait" )
				.removeClass( "error" )
				.attr( "title", $.i18n.get( "kingdom.saving" ) );

			// event-based communication with background script
			var evt = document.createEvent( "Event" );
			evt.initEvent( "kingdom:save", true, true );
			$( "#KingdomMessageContent" )
				.text( JSON.stringify( data ) )
				[0].dispatchEvent( evt );
		});

		// event-based communication with background script
		$( "#KingdomMessageContent" ).bind( "kingdom:done", function() {
			var data;
			try {
				data = JSON.parse( $( this ).text() );
			} catch ( e ) {
				data = {};
			} finally {
				$( this ).empty();
			}

			// give some feedback to the user
			if ( data.status == "success" ) {
				$( "#KingdomSave" ).removeClass( "wait" ).attr( "title", $.i18n.get( "kingdom.save" ) );
			} else {
				$( "#KingdomSave" ).addClass( "error" ).removeClass( "wait" ).attr( "title", status || $.i18n.get( "kingdom.error" ) );
				setTimeout(function() {
					$( "#KingdomSave" ).animate({
						opacity: 0
					}, "slow", function() {
						$( this ).removeClass( "error" ).attr( "title", $.i18n.get( "kingdom.save" ) ).animate({
							opacity: 1
						});
					});
				}, 5000);
			}
		});
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK, window.$ );
