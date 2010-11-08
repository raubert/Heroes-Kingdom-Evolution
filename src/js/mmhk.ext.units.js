/**
 * Utilities: contains units definitions.
 */
(function() {

MMHK.units = {

	/**
	 * Finds the definition of a specified unit.
	 * 
	 * @param faction
	 *            the unit faction
	 * @param tier
	 *            the unit tier
	 * @return the selected unit
	 */
	get: function( faction, tier ) {
		return this[ faction ][ tier ];
	},

	/**
	 * Unit types: inf=0, cav=1, arc=2
	 */
	types: [ "INFANTRY", "CAVALRY", "SHOOTER" ],

	/**
	 * Academy units, based on tier.
	 */
	ACADEMY: {
		T1: {
			name: "gremlin",
			type: 2,
			power: 71
		},
		T1P: {
			name: "gremlin.master",
			type: 2,
			power: 86
		},
		T2: {
			name: "gargoyle.stone",
			type: 1,
			power: 120
		},
		T2P: {
			name: "gargoyle.obsidian",
			type: 1,
			power: 144
		},
		T3: {
			name: "golem.iron",
			type: 0,
			power: 272
		},
		T3P: {
			name: "golem.steel",
			type: 0,
			power: 327
		},
		T4: {
			name: "mage",
			type: 2,
			power: 674
		},
		T4P: {
			name: "archmage",
			type: 2,
			power: 809
		},
		T5: {
			name: "djinn",
			type: 1,
			power: 1317
		},
		T5P: {
			name: "djinn.sultan",
			type: 1,
			power: 1994
		},
		T6: {
			name: "rakshasa.rani",
			type: 0,
			power: 2242
		},
		T6P: {
			name: "rakshasa.raja",
			type: 0,
			power: 2950
		},
		T7: {
			name: "colossus",
			type: 2,
			power: 5850
		},
		T7P: {
			name: "titan",
			type: 2,
			power: 8190
		}
	},

	/**
	 * Haven units, based on tier.
	 */
	HAVEN: {
		T1: {
			name: "peasant",
			type: 0,
			power: 97
		},
		T1P: {
			name: "conscript",
			type: 0,
			power: 128
		},
		T2: {
			name: "archer",
			type: 2,
			power: 198
		},
		T2P: {
			name: "marksman",
			type: 2,
			power: 263
		},
		T3: {
			name: "footman",
			type: 0,
			power: 407
		},
		T3P: {
			name: "squire",
			type: 0,
			power: 488
		},
		T4: {
			name: "griffin",
			type: 1,
			power: 751
		},
		T4P: {
			name: "griffin.imperial",
			type: 1,
			power: 902
		},
		T5: {
			name: "priest",
			type: 2,
			power: 1747
		},
		T5P: {
			name: "inquisitor",
			type: 2,
			power: 2575
		},
		T6: {
			name: "cavalier",
			type: 1,
			power: 3188
		},
		T6P: {
			name: "paladin",
			type: 1,
			power: 4508
		},
		T7: {
			name: "angel",
			type: 0,
			power: 7150
		},
		T7P: {
			name: "archangel",
			type: 0,
			power: 10010
		},
		T8: {
			name: "balist",
			type: 2,
			power: 300
		},
		T8P: {
			name: "catapult",
			type: 2,
			power: 450
		}
	},

	/**
	 * Inferno units, based on tier.
	 */
	INFERNO: {
		T1: {
			name: "imp",
			type: 0,
			power: 71
		},
		T1P: {
			name: "familiar",
			type: 2,
			power: 86
		},
		T2: {
			name: "demon",
			type: 0,
			power: 163
		},
		T2P: {
			name: "overseer",
			type: 0,
			power: 196
		},
		T3: {
			name: "hound",
			type: 1,
			power: 370
		},
		T3P: {
			name: "cerberus",
			type: 1,
			power: 445
		},
		T4: {
			name: "succubus",
			type: 2,
			power: 918
		},
		T4P: {
			name: "mistress",
			type: 2,
			power: 1101
		},
		T5: {
			name: "charger",
			type: 1,
			power: 1795
		},
		T5P: {
			name: "nightmare",
			type: 1,
			power: 2668
		},
		T6: {
			name: "pit.fiend",
			type: 2,
			power: 2946
		},
		T6P: {
			name: "pit.lord",
			type: 2,
			power: 3816
		},
		T7: {
			name: "devil",
			type: 0,
			power: 6825
		},
		T7P: {
			name: "archdevil",
			type: 0,
			power: 9555
		}
	},

	/**
	 * Necropolis units, based on tier.
	 */
	NECROPOLIS: {
		T1: {
			name: "skeleton",
			type: 0,
			power: 87
		},
		T1P: {
			name: "skeleton.archer",
			type: 2,
			power: 70
		},
		T2: {
			name: "zombie",
			type: 0,
			power: 134
		},
		T2P: {
			name: "zombie.plague",
			type: 0,
			power: 160
		},
		T3: {
			name: "ghost",
			type: 1,
			power: 303
		},
		T3P: {
			name: "specter",
			type: 1,
			power: 364
		},
		T4: {
			name: "vampire",
			type: 0,
			power: 751
		},
		T4P: {
			name: "vampire.lord",
			type: 0,
			power: 902
		},
		T5: {
			name: "lich",
			type: 2,
			power: 1430
		},
		T5P: {
			name: "archlich",
			type: 2,
			power: 2144
		},
		T6: {
			name: "wight",
			type: 0,
			power: 2578
		},
		T6P: {
			name: "wraith",
			type: 0,
			power: 3365
		},
		T7: {
			name: "dragon.bone",
			type: 1,
			power: 5866
		},
		T7P: {
			name: "dragon.spectral",
			type: 1,
			power: 8213
		}
	},

	/**
	 * Sylvan units, based on tier.
	 */
	SYLVAN: {
		T1: {
			name: "pixie",
			type: 1,
			power: 88
		},
		T1P: {
			name: "sprite",
			type: 1,
			power: 106
		},
		T2: {
			name: "blade.silver",
			type: 0,
			power: 163
		},
		T2P: {
			name: "blade.war",
			type: 0,
			power: 196
		},
		T3: {
			name: "hunter",
			type: 2,
			power: 448
		},
		T3P: {
			name: "hunter.master",
			type: 2,
			power: 538
		},
		T4: {
			name: "druid",
			type: 2,
			power: 918
		},
		T4P: {
			name: "druid.elder",
			type: 2,
			power: 1101
		},
		T5: {
			name: "unicorn",
			type: 1,
			power: 1709
		},
		T5P: {
			name: "unicorn.silver",
			type: 1,
			power: 2541
		},
		T6: {
			name: "treant",
			type: 0,
			power: 2652
		},
		T6P: {
			name: "treant.ancient",
			type: 0,
			power: 3434
		},
		T7: {
			name: "dragon.green",
			type: 1,
			power: 6143
		},
		T7P: {
			name: "dragon.emerald",
			type: 1,
			power: 9077
		}
	}

};

})();
