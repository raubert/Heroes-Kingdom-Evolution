/**
 * Ranks module: adds global 'ranks' export button in tasks.
 */
(function( $, MMHK, HOMMK ) {

// let's register this module
MMHK.modules.push({

	/**
	 * Module name.
	 */
	name: "Ranks",

	/**
	 * Task button labels.
	 */
	button: null,

	/**
	 * Communication message selector.
	 */
	message: "#RanksMessageContent",

	/**
	 * Event prefix.
	 */
	event: "ranks",

	/**
	 * Stores feedback information.
	 */
	domination: -1,
	wealth: -1,
	honor: -1,
	leagues: -1,

	/**
	 * Initializes the module.
	 */
	initialize: function() {
		if ( $( "#MMHK-rights" ).text() != "write" ) {
			// not allowed; no need to go further
			return;
		}

		this.button = [ $.i18n.get( "ranks.button" ), $.i18n.get( "ranks.stop" ) ];

		MMHK.Tasks.setupInterval( this );
	},

	/**
	 * Returns the number of entries so far, for the specified type.
	 * 
	 * @param type {String}
	 *            the type of data to get the count for
	 */
	getCount: function( type ) {
		return this[ type ] > 0 ? this[ type ] : "-";
	},

	/**
	 * Provides feedback about the current progress.
	 */
	feedback: function() {
		return "" +
			"<tt class=\"domination\">" + this.getCount( "domination" ) + "</tt> " + $.i18n.get( "ranks.domination" ) + "<br/>" +
			"<tt class=\"wealth\">" + this.getCount( "wealth" ) + "</tt> " + $.i18n.get( "ranks.wealth" ) + "<br/>" +
			"<tt class=\"honor\">" + this.getCount( "honor" ) + "</tt> " + $.i18n.get( "ranks.honor" ) + "<br/>" +
			"<tt class=\"leagues\">" + this.getCount( "leagues" ) + "</tt> " + $.i18n.get( "ranks.leagues" );
	},

	/**
	 * Starts processing.
	 */
	start: function() {
		// reset all feedback values
		this.domination = 0;
		this.wealth = 0;
		this.honor = 0;
		this.leagues = 0;
	},

	/**
	 * Processes the current pool and fills the given parameters accordingly.
	 * 
	 * @param data {Object}
	 *            the object containing the array of values to fill
	 * @param done {Array}
	 *            what has already been done until now
	 */
	process: function( data, done ) {
		// only use data from the pool
		allRankings = {
			domination: "RankingPlayerDomination",
			wealth: "RankingPlayerWealth",
			honor: "RankingPlayerHonor",
			leagues: "RankingAlliance"
		};

		for ( var type in allRankings ) {
			var rankings = HOMMK.elementPool.get( allRankings[ type ] );
			if ( rankings != null ) {
				// this sort of rankings has been loaded
				var rankings = rankings.values();
				for ( var i = 0; i < rankings.length; i++ ) {
					var ranking = rankings[ i ].content;
					// don't do rankings twice!
					if ( done[ type ] == undefined || done[ type ][ ranking.id ] == undefined ) {
						var rank = {
							id: ranking.id,
							name: ranking.name,
							points: ranking.score,
							rank: ranking.position,
							tears: ranking.cumulTear
						};
						if ( type == "leagues" ) {
							rank.members = ranking.members;
						} else {
							rank.league = {
								id: ranking.allianceId,
								name: ranking.allianceName
							};
						}
						data.values.push( rank );

						// mark this ranking type and ID
						if ( done[ type ] == undefined ) done[ type ] = [];
						done[ type ][ ranking.id ] = true;
					}
				}
				// if there's data for this type, then immediately return
				if ( data.values.length > 0 ) {
					data.type = type;
					this[ type ] += data.values.length;
					return;
				}
			}
		}
	},

	/**
	 * Stops processing.
	 */
	stop: function() {
		// invalidate all feedback values
		this.domination = -1;
		this.wealth = -1;
		this.honor = -1;
		this.leagues = -1;
	}

});

})( MMHK.jQuery, MMHK, MMHK.HOMMK );
