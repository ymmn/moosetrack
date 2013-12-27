var LEVELS = {
	1: {
		play: function(c) {
			c.x += 1;
		},

		done: function(c) {
			return c.x === 200;
		}
	}
};