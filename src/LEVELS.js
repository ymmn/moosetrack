var LEVELS = {
	1: {

		initialize: function(c) {
			c.x = 50;
			c.y = 100;
		},

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
			c.y = 100;
		},

		play: function(c) {
			c.y += c.y*0.015 + 0.1;
			c.x += 4;
		},

		done: function(c) {
			return c.y >= 500;
		}

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