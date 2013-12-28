var LEVELS = {
	1: {

		initialize: function(c) {
			c.x = 50;
			c.y = 150 - CIRCLE_RAD[current_difficulty];
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		play: function(c) {
			c.x += 3;
		},

		done: function(c) {
			return c.x >= 400;
		}

	}, 

	2: {

		initialize: function(c) {
			c.x = 50;
			c.y = 150 - CIRCLE_RAD[current_difficulty];
		},

		terrain: [
			$V([0, 150]),
			$V([200, 150]),
			$V([200, 500]),
			$V([CANVAS_WIDTH, 500])
		],

		play: function(c) {
			c.x += 5;
			if( c.x > 200 ) {
				c.y += c.y*0.01 + 0.01;
			}
		},

		done: function(c) {
			return c.y >= (500 - CIRCLE_RAD[current_difficulty]);
		},

		quote: "I've never lost a game of Chicken"

	},

	3: {

		initialize: function(c) {
			c.x = 50;
			c.y = 200;
		},

		play: function(c) {
			c.y += 4*Math.sin(c.x/36) + 1;
			c.x += 3;
		},

		done: function(c) {
			return c.x >= 800;
		}

	}
};