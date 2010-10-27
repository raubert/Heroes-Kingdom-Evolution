/**
 * Kingdom module: adds an additional menu to MMHK.
 */
(function( $ ) {

/**
 * Helper to access HOMMK.
 */
var HOMMK = MMHK.HOMMK;

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Kingdom",

	/**
	 * Initializes the module
	 */
	initialize: function() {
		// add some dynamic CSS commands
		$.addCss(
			"#KingdomImage { background: url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') no-repeat -280px 0; width: 40px; height: 40px; }"
			+ "#KingdomFrame #KingdomClose { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/SideBar_Shortcuts.gif') }"
			+ "#KingdomFrame #KingdomTabs div { background-image: url('" + HOMMK.IMG_URL + "/css_sprite/Frame_tab_ranking.jpg') }"
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
			+ "#KingdomFrame #KingdomProductionHeader th div { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Ressources.gif') }"
			+ "#KingdomFrame #KingdomActionsData .action .icon { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/TimeLineAction.gif') }"
			+ "#KingdomFrame #KingdomActionsData .goods span span { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/Ressources.gif') }"
			+ ".cluetip-default h3#cluetip-title { background-image:url('" + HOMMK.IMG_URL + "/frame/tooltips/npc/titleBg_00.gif') }"
			+ ".cluetip-default #cluetip-inner .unit .type { background-image:url('" + HOMMK.IMG_URL + "/css_sprite/UnitStack_types.gif') }"
		);

		var self = this;
		// sneaky insertion into MMHK's interface
		$( "#SidebarTop tr:first" ).each( function() {
			// simulate MMHK's markup with their crappy classes
			$( "<td><div class=\"relativePosition Voffset3\" title=\"Angarak's KINGDOM v" + MMHK.version + "\"><div class=\"Hoffset0 Hoffset0R clickable\" id=\"KingdomImage\"></div><div class=\"clickable\" id=\"KingdomText\">Kingdom</div></div></td>" )
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
	 * Creates the main frame HTML markup, which is static and never changes.
	 */
	createFrameMarkup: function() {
		// header for armies
		var ahead = "<tr><th></th>";
		for ( var i = 1; i <= 7; i++ ) {
			ahead += "<th>T" + i + "</th>";
		}
		ahead += "<th>" + $.i18n.get( "siege.units" ) + "</th>";
		ahead += "<th class=\"s\"></th></tr>";

		// header for production
		var phead = "<tr><th></th>";
		for (var i = 0; i < this.resources.length; i++) {
			phead += "<th class=\"" + this.resources[ i ].type + "\"><div class=\"" + this.resources[ i ].tag + "\"></div></th>";
		}
		phead += "<th class=\"s\"></th></tr>";

		// simulate MMHK's markup with their crappy classes
		return "<div id=\"KingdomFrame\" class=\"largeFrame absolutePosition\">"
			+ "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" class=\"frameContainerTopBarContainer\">"
			+ "<tbody>"
				+ "<tr>"
					+ "<td class=\"size0 frameContainerTopLeft\"></td>"
					+ "<td class=\"size0 frameContainerTop\"></td>"
					+ "<td class=\"size0 frameContainerTopRight\">"
						+ "<div id=\"KingdomClose\" class=\"zIndex1 frameContainerCloseImage absolutePosition clickable\" title=\"" + $.i18n.get( "close" ) + "\"></div>"
					+ "</td>"
				+ "</tr>"
				+ "<tr>"
					+ "<td class=\"frameContainerMiddleLeft\"></td>"
					+ "<td class=\"beigeBg\">"
						+ "<div>"
							+ "<div class=\"center size11 white boldFont titleBar\">Angarak's KINGDOM <span class=\"version\">v" + MMHK.version + "</span></div>"
							+ "<div id=\"KingdomTabs\">"
								+ "<div class=\"armies\"><a rel=\"KingdomArmies\">" + $.i18n.get( "armies" ) + "</a></div>"
								+ "<div class=\"production\"><a rel=\"KingdomProduction\">" + $.i18n.get( "resources" ) + "</a></div>"
								+ "<div class=\"actions\"><a rel=\"KingdomActions\">" + $.i18n.get( "actions" ) + "</a></div>"
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
		$( "#KingdomTabs>div" ).click( function() {
			// unselects everything
			$( "#KingdomTabs" ).children().removeClass( "selected" );
			$( "#KingdomArmiesHeader,#KingdomProductionHeader,#KingdomActionsHeader" ).hide();
			$( "#KingdomArmiesData,#KingdomProductionData,#KingdomActionsData" ).children().hide();

			// select the new tab and display its contents
			var selected = $( this ).addClass( "selected" ).children( "a" ).attr( "rel" );
			$( "#" + selected + "Header" ).show();
			$( "#" + selected + "Data" ).children().show();

			// reset the slider dimensions
			$( "#KingdomDataContainer" ).attr( "scrollTop", "0" );
			self.updateSlider();
			return false;
		} );
	},

	/**
	 * Oooo... that's dirty!
	 * 
	 * Hack to get the slider working.
	 */
	updateSlider: function() {
		setTimeout( "var s = $( \"KingdomDataContainerSlider\" ).slider; s && s.updateDimensions()", 0 );
	},

	/**
	 * Extracts some data about a specific unit stack.
	 * 
	 * @param unit	the unit data
	 * @param units	the units object to fill
	 */
	extractUnitStackData: function( unit, units ) {
		var tier = unit.tier;
		var type = unit.unitEntityTagName;
		// units are ordered by tier
		if ( units[ tier ] == undefined ) {
			units[ tier ]	= {};
		}
		units = units [ tier ];
		// and then by type
		if ( units[ type ] == undefined ) {
			units[ type ] = {
				name: unit.unitEntityName,
				type: unit.unitEntityType,
				tier: unit.tier,
				faction: unit.factionEntityTagName,
				power: unit.power,
				reserve: 0,
				production: 0,
				quantity: 0
			};
		}
		units[ type ].quantity += unit.quantity;
	},

	/**
	 * Extracts some data about a specific recrutable unit stack.
	 * 
	 * @param unit	the unit data
	 * @param units	the units object to fill
	 */
	extractUnitRecruitData: function( unit, units ) {
		var tier = unit.tier;
		var type = "UNIT_" + unit.factionEntityTagName + "_" + unit.tier;
		// units are ordered by tier
		if ( units[ tier ] == undefined ) {
			units[ tier ]	= {};
		}
		var units = units [ tier ];
		// and then by type
		if ( units[ type ] == undefined ) {
			units[ type ] = {
				name: unit.unitEntityName,
				type: unit.type,
				tier: unit.tier,
				faction: unit.factionEntityTagName,
				power: unit.power,
				reserve: 0,
				production: 0,
				quantity: 0
			};
		}
		units[ type ].reserve += unit.avail;
		units[ type ].production += unit.income;

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
			data.push({
				id: city.id,
				name: city.cityName,
				faction: city.factionEntityTagName,
				x: city.x,
				y: city.y,
				recruitmessage: $.i18n.get( "no.recruits.message", city.cityName ),
				maintenance: city.maintenanceGoldCost,
				units: {}
			});
		}

		// for each stack available
		var stacks = HOMMK.elementPool.get( "UnitStack" ).values();
		for ( var i = 0; i < stacks.length; i++ ) {
			if (stacks[ i ].parentRegionCity) {
				var city = stacks[ i ].parentRegionCity.content, current = null;
				for ( var j = 0; j < data.length; j++ ) {
					if ( data[ j ].id == city.id ) {
						current = data[ j ];
						break;
					}
				}
				if ( current != null ) {
					this.extractUnitStackData( stacks[ i ].content, current.units );
				}
			}
		}

		// for each recrutable unit available
		var recruits = HOMMK.elementPool.get( "RecruitableUnit" );
		if ( recruits ) {
			recruits = recruits.values();
			for ( var i = 0; i < recruits.length; i++ ) {
				var current = null;
				for ( var j = 0; j < data.length; j++ ) {
					var cityid = recruits[i].content.id.split( "_" )[0];
					if ( data[ j ].id == cityid ) {
						current = data[ j ];
						break;
					}
				}
				if ( current != null ) {
					data [ j ].recruitmessage = '';
					this.extractUnitRecruitData( recruits[ i ].content, current.units );
					this.extractUnitRecruitData( recruits[ i ].content.upgraded, current.units );
				}
			}
		}

		return data;
	},

	/**
	 * Creates the HTML markup related to a specific tier of units.
	 * 
	 * @param tier	the tier data
	 * @param id	the global unit type ID
	 * @param total	the object that contains a summary of all troops
	 */
	createTierMarkup: function( tier, id, total ) {
		var markup = "";

		// tier may not be defined if empty
		if ( tier != undefined ) {
			for ( var tag in tier ) {
				var unit = tier [ tag ];
				if (unit.quantity > 0) {
					// the markup for this unit
					markup += "<div class=\"unit\"><div class=\"" + unit.faction + " " + unit.tier + "\"></div>" + unit.quantity + "</div>";
					// add count to the total
					if ( total != undefined ) {
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
								quantity: 0
							};
						}
						total[ tag ].quantity += unit.quantity;
					}
				}
			}
		}

		return markup;
	},

	/**
	 * Creates the HTML markup related to a specific tier of recrutable units.
	 * 
	 * @param tier	the tier data
	 * @param id	the global unit type ID
	 * @param total	the object that contains a summary of all troops
	 */
	createTierRecruitMarkup: function( tier, id, total ) {
		var markup = "";

		// tier may not be defined if empty
		if ( tier != undefined ) {
			//the recrutable units
			for ( var tag in tier ) {
				var unit = tier [ tag ];
				if (unit.production > 0) {
					//calculate total power of units and format the result
					var totalpower = unit.power*unit.reserve+'';
					var rgx = /(\d+)(\d{3})/;
					while (rgx.test(totalpower)) {
						totalpower = totalpower.replace(rgx, '$1' + ' ' + '$2');
					}
					// the markup for this unit
					markup += "<div class=\"unit\" title=\"" + unit.name + " (Puissance: "+totalpower+")\"><div class=\"" + unit.faction + " " + tag.split( "_" )[2] + "\"></div>" + unit.reserve + "&nbsp(+" + unit.production + ")</div>";
					// add count to the total
					if ( total != undefined ) {
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
								quantity: 0
							};
						}
						total[ tag ].reserve += unit.reserve;
						total[ tag ].production += unit.production;
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
		var total = {}, maintenance = 0, markup = "", recruitscomplet = 1;

		// for each city
		for ( var i = 0; i < data.length; i++ ) {
			// recruted units
			markup += "<tr>";
			markup += "<td title=\"" + data[ i ].maintenance + "\">";
			markup += "<a href=\"#\" rel=\"" + data[ i ].id + "\">" + data[ i ].name + "<br/>[<tt>" + data[ i ].x + "," + data[ i ].y + "</tt>]</a>";
			markup += "<div class=\"city " + data[ i ].faction + "\"></div>";
			markup += "</td>";
			// for each tier
			for ( var j = 1; j <= 8; j++ ) {
				markup += "<td>";
				markup += this.createTierMarkup( data[ i ].units[ "T" + j ], j, total );
				markup += this.createTierMarkup( data[ i ].units[ "T" + j + "P" ], j, total );
				markup += "</td>";
			}
			markup += "</tr>";
			maintenance += data[ i ].maintenance;

			// recrutable units
			markup += "<tr>";
			if (data[i].recruitmessage) {
				markup += "<td colspan='9'>";
				markup += data[i].recruitmessage;
				markup += "</td>";
				recruitscomplet = 0;
			} else {
				markup += "<td>";
				markup += $.i18n.get( "recruitable.header" );
				markup += "</td>";
				// for each tier
				for ( var j = 1; j <= 8; j++ ) {
					markup += "<td>";
					markup += this.createTierRecruitMarkup( data[ i ].units[ "T" + j ], j, total );
					markup += this.createTierRecruitMarkup( data[ i ].units[ "T" + j + "P" ], j, total );
					markup += "</td>";
				}
			}
			markup += "</tr>";

		}

		// then display the units total
		markup += "<tr class=\"total\">";
		markup += "<td title=\"" + maintenance + "\">";
		markup += $.i18n.get( "total" );
		markup += "<br />[" + HOMMK.player.content.activeOrSubscribedCityCount + "/" + HOMMK.player.content.cityNumberMinThreshold + " " + $.i18n.get("cities") + "]";
		markup += "</td>";
		for ( var i = 1; i <= 8; i++ ) {
			markup += "<td>";
			markup += this.createTierMarkup( total[ i ] );
			markup += "</td>";
		}
		markup += "</tr>";

		// then display the recrutable units total
		markup += "<tr class=\"total\">";
		markup += "<td>";
		markup += $.i18n.get( "total.recruitable" );
		if (!recruitscomplet)
			markup += $.i18n.get( "total.incomplete" );
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
		$( "#KingdomArmiesData tr" ).each(function() {
			var cityCount = 0, cityPower = 0;
			$( this ).find( ".unit" ).attr( "title", function() {
				var metadata = $( this ).children().get( 0 ).className.split( " " );
				var stats = MMHK.units.get( metadata[ 0 ], metadata[ 1 ] );
				var quantity = parseInt( $( this ).text() );
				var stackPower = stats.power * quantity;
				// add to line total
				cityCount += quantity;
				cityPower += stackPower;
				return "<tt>[" + metadata[ 1 ].replace( "P", "+" ) + "]</tt>" + $.i18n.get( stats.name ) + "|"
					+ "<div class=\"unit\">"
					+ "<p>" + $.i18n.get( "unit.type", "<span class=\"type " + MMHK.units.types[ stats.type ] + "\"></span>" ) + "</p>"
					+ "<p>" + $.i18n.get( "unit.power", "<b>" + $.formatNumber( stats.power ) + "</b>" ) + "</p>"
					+ "<p>" + $.i18n.get( "unit.stack", "<b>" + $.formatNumber( stackPower ) + "</b>" ) + "</p>";
					+ "</div>";
			});
			// add global line information
			$( this ).find( "td:first" ).attr( "title", function( i, data ) {
				return $( this ).text().split( "[" )[ 0 ] + "|"
					+ "<div class=\"unit\">"
					+ "<p>" + $.i18n.get( "unit.count", "<b>" + $.formatNumber( cityCount ) + "</b>" ) + "</p>"
					+ "<p>" + $.i18n.get( "unit.total", "<b>" + $.formatNumber( cityPower ) + "</b>" ) + "</p>"
					+ "<p>" + $.i18n.get( "unit.cost", "<b>" + $.formatNumber( data ) + "</b>" ) + "</p>"
					+ "</div>";
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
				openSpeed: "normal"
			}
		});
		$( "#KingdomArmiesData a[rel]" ).click(function() {
			MMHK.click( $( "#RegionCity" + $(this).attr( "rel" ) + "SummaryViewImage" )[0] );
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
			markup += "<td title=\"" + wealth + "\">";
			markup += "<a href=\"#\" rel=\"" + data[ i ].id + "\">" + data[ i ].name + "<br/>[<tt>" + data[ i ].x + "," + data[ i ].y + "</tt>]</a>";
			markup += "<div class=\"city " + data[ i ].faction + "\"></div>";
			markup += "</td>";
			// for each type of resource
			for ( var j = 0; j < this.resources.length; j++ ) {
				var res = this.resources[ j ];
				var current = data[ i ].resources[ res.tag ];
				var wealth = current.income * res.wealth;
				if ( !total[ res.tag ] ) total[ res.tag ] = { stock: 0, income: 0, wealth: 0 };
				total[ res.tag ].stock += current.stock;
				total[ res.tag ].income += current.income;
				total[ res.tag ].wealth += wealth;
				// display storage / max + income
				markup += "<td class=\"value " + res.type + "\"";
				if ( current.income ) {
					markup += "title=\"" + res.tag + ":" + current.income + ":" + wealth + ":" + current.stock + ":" + current.storage + "\"";
				}
				markup += ">";
				markup += "<tt" + ( current.stock + current.income > current.storage ? " class=\"storage\"" : "" ) + ">" + $.formatNumber( current.stock ) + "</tt> / ";
				markup += "<tt" + ( current.stock + current.income > current.storage ? " class=\"storage\"" : "" ) + ">" + $.formatNumber( current.storage ) + "</tt><br/>";
				markup += "<tt" + ( current.income < 0 ? " class=\"maintenance\">" : ">+" ) + $.formatNumber( Math.floor( current.income ) ) + "</tt>";
				markup += "</td>";
			}
			markup += "</tr>";
		}

		// then display the total
		markup += "<tr class=\"total\"><td title=\"" + totalWealth + "\">Total</td>";
		for ( var tag in total ) {
			var current = total[ tag ];
			markup += "<td class=\"value\"";
			if ( total[ tag ].income > 0 ) {
				markup += "title=\"" + tag + ":" + current.income + ":" + current.wealth + ":0:0\"";
			}
			markup += "<tt>" + $.formatNumber( current.stock ) + "</tt><br/>";
			markup += "<tt" + ( current.income < 0 ? " class=\"maintenance\">" : ">+" ) + $.formatNumber( Math.floor( current.income ) ) + "</tt>";
			markup += "</td>";
		}
		markup += "</tr>";

		return markup;
	},

	/**
	 * Setups the available actions on the resource production view; this has to be applied *after* DOM injection.
	 */
	setupProduction: function() {
		var self = this;
		$( "#KingdomProductionData td[title]" ).attr( "title", function( i, data ) {
			if ( $( this ).hasClass( "value" ) ) {
				// default cell for a specific type of resource
				data = data.split( ":" );
				var income = parseFloat( data[ 1 ] );
				var hoursleft = 0;
				if (!income)
					hoursleft = 0.01;
				else if (income < 0)
					hoursleft = parseFloat( data[ 3 ] ) * 24 / income;
				else
					hoursleft = ( parseFloat( data[ 4 ] ) - parseFloat( data[ 3 ] ) ) * 24 / income;
				var markup = $.i18n.get( data[ 0 ] ) + "|"
					+ "<div class=\"wealth\">"
					+ "<p>" + $.i18n.get( "prod.hourly" ) + " <b>" + $.formatNumber( income / 24 ) + "</b></p>"
					+ "<p>" + $.i18n.get( "prod.real" ) + " <b>" + $.formatNumber( income ) + "</b></p>"
					+ "<p>" + $.i18n.get( "wealth.daily" ) + " <b>" + $.formatNumber( parseFloat( data[ 2 ] ) ) + "</b></p>";
				if ( parseFloat( data[ 4 ] ) > 0 )
					markup += "<p>" + ( income < 0 ? $.i18n.get( "stock.empty" ) : $.i18n.get( "stock.full" ) ) + " <b>" + $.i18n.get( "day", Math.floor( hoursleft / 24 ) ) + " " + $.i18n.get( "hour", Math.floor(hoursleft) - ( Math.floor( hoursleft / 24 ) * 24 ) ) + "</b></p>";
				markup += "</div>";
				return markup;
			} else {
				// summary on a line
				var income = parseFloat( data );
				return $( this ).text().split( "[" )[ 0 ] + "|"
					+ "<div class=\"wealth\">"
					+ "<p>" + $.i18n.get( "wealth.hourly" ) + " <b>" + $.formatNumber( income / 24 ) + "</b></p>"
					+ "<p>" + $.i18n.get( "wealth.daily" ) + " <b>" + $.formatNumber( income ) + "</b></p>"
					+ "</div>";
			}
		}).cluetip({
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
			}
		});
		$( "#KingdomProductionData a[rel]" ).click(function() {
			MMHK.click( $( "#RegionCity" + $(this).attr( "rel" ) + "SummaryViewImage" )[0] );
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
			if ( current.type == "CARAVAN_DELIVERY" ) {
				current.goods = {
					gold: action.paramList[ 1 ],
					wood: action.paramList[ 2 ],
					ore: action.paramList[ 3 ],
					mercury: action.paramList[ 4 ],
					crystal: action.paramList[ 5 ],
					sulfur: action.paramList[ 7 ],
					gem: action.paramList[ 6 ]
				};
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
			markup += "<tr class=\"action " + ( i % 2 == 0 ? "odd" : "even" ) + "\"><td class=\"open\"><div class=\"icon " + action.type + "\"></div></td>";
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
		$( "#KingdomActionsData td.t[title]" ).each(function() {
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
			self.setupFrameActions();
			// Oooo... that's dirty!
			setTimeout( "$( \"KingdomDataContainerSlider\" ).slider = new HOMMK.ContentSlider( $( \"KingdomDataContainerSlider\" ), $( \"KingdomDataContainer\" ) );", 0 );
		}

		// replace armies HTML
		$( "#KingdomArmiesData tbody" ).html( this.createArmiesMarkup( this.extractArmiesData() ) ).find( "tr:first" ).children().each( function( i ) {
				$( "#KingdomArmiesHeader th:eq(" + i + ")" ).width( $( this ).outerWidth() - 2 );
		} );
		this.setupArmies();
		// replace resource production HTML
		$( "#KingdomProductionData tbody" ).html( this.createProductionMarkup( this.extractProductionData() ) );
		this.setupProduction();
		// replace actions HTML
		$( "#KingdomActionsData tbody" ).html( this.createActionsMarkup( this.extractActionsData() ) );
		this.setupActions();

		// all done: show da frame
		$( "#KingdomFrame" ).show().css( "visibility", "visible" );

		// if not initialized, click on resources production
		MMHK.click( $( "#KingdomTabs" ).children( initialized ? ".selected" : ".production" )[0] );
	}

});

})( MMHK.jQuery );
