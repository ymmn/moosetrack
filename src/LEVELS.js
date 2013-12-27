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

	}
};