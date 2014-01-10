var LEVELS = {
	1: {

		name: "Straight and slow",

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

		name: "Parabolic fall",

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

		name: "Hilly",

		initialize: function(c) {
			c.x = 50;
			c.y = 200;
		},

		play: function(c) {
			c.y += 5*Math.sin(c.x/36) + 1.5;
			c.x += 4;
		},

		done: function(c) {
			return c.x >= 800;
		}

	},

	4: {

		name: "Straight and fast",

		initialize: function(c) {
			c.x = 50;
			c.y = 150 - CIRCLE_RAD[current_difficulty];
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		play: function(c) {
			c.x += 8;
		},

		done: function(c) {
			return c.x >= 800;
		}

	},

	5: {

		name: "Free fall",

		initialize: function(c) {
			c.x = CANVAS_WIDTH / 2;
			c.y = CIRCLE_RAD[current_difficulty];
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		play: function(c) {
			c.y += 0.04*(c.y) + 1;
		},

		done: function(c) {
			return c.y >= 600;
		}

	},


	6: {

		name: "Pinball",

		initialize: function(c) {
			c.x = 100;
			c.y = 80;
			c.velocity = $V([0, 2.5]);
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		play: function(c) {
			var nv;
			if ( c.y % 100 === 0 ) {
				nv = $V([(c.velocity.x() > 0 ? -1 : 1) * 30, c.velocity.y()]);
			} else {
				nv = $V([c.velocity.x() * 0.97, c.velocity.y()]);
			}
			c.velocity = nv;
			c.x += nv.x();
			c.y += nv.y();
		},

		done: function(c) {
			return c.y >= 600;
		}

	}

};