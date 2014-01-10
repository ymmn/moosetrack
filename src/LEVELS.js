var LEVELS = {
	1: {

		name: "Straight'n'slow",

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

		name: "Straight'n'fast",

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

	},

	8: {

		name: "Bouncy",

		initialize: function(c) {
			c.x = 100;
			c.y = 80;
			c.velocity = 2.5;
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		play: function(c) {
			var nv = c.velocity + 2;
			c.x += 6;
			c.y += nv;
			c.velocity = nv;
			if( c.y >= 500 ) {
				c.velocity *= -0.9;
				c.y = 500;
			}
		},

		done: function(c) {
			return c.x >= 900;
		}

	},

	9: {

		name: "Earthquake",

		initialize: function(c) {
			c.x = CANVAS_WIDTH / 2;
			c.y = CANVAS_HEIGHT / 2;
			c.dirrr = 1;
			c.counter = 0;
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

		no_preview: true,

		play: function(c) {
			var bounds = 150;
			var sinceLast = c.counter - c.lastBounce;
			if( c.x > (CANVAS_WIDTH/2 + bounds) || 
				c.x < (CANVAS_WIDTH/2 - bounds) ||
				(Math.random() < 0.15 && sinceLast > 3)  ) {
				c.dirrr *= -1;
				c.lastBounce = c.counter;
			}
			c.x += 15 * c.dirrr;
			c.y += 0.5;
			c.counter += 1;
		},

		done: function(c) {
			return c.counter >= 130;
		}

	},

	7: {

		name: "Roller Coaster",

		initialize: function(c) {
			c.x = 100;
			c.y = 200;
			c.initx = 100;
			c.inity = 80;
			c.velocity = $V([0, 2.5]);
			c.down = true;
			c.statee = -1;
		},

		terrain: [
			$V([0, 150]),
			$V([CANVAS_WIDTH, 150])
		],

//y = +- sqrt(r^2 - x^2)
		play: function(c) {

			var CLIMBING = -1,
				FALLING = -2,
				FLATTEN = -3,
				LOOP1 = -4,
				STRAIGHT = -5,
				LOOP2 = -6;

			/* first loop */
			var loop1start = 500;
			var loop1rad = 150;
			var loopspeed = 8;
			/* second loop */
			var loop2start = 750;
			var loop2rad = 100;
			var loopspeed2 = 8;

			var goLoop = function(rad, centerX, loopspeed, ondone){
				var rad2 = rad * rad;
				var xx = c.x - centerX;
				xx = xx * xx;
				if( c.loop == 1 ) {
					c.x += loopspeed;
					c.y = c.inity + Math.sqrt(rad2 - xx);
					if( c.x >= centerX + rad ) c.loop = 2;
				} else if(c.loop == 2) {
					c.x -= loopspeed;
					c.y = c.inity - Math.sqrt(rad2 - xx);
					if( c.x <= centerX - rad ) c.loop = 3;
				} else {
					c.x += loopspeed;
					c.y = c.inity + Math.sqrt(rad2 - xx);
					if( c.x >= centerX ) ondone();
				}
			};

			/* climbing up */
			if(c.statee == CLIMBING){
				c.x += 2;
				c.y -= 2;
				if( c.y === 50 ) c.statee = FALLING;
			} else if(c.statee == FALLING ) {
				c.x += 3;
				c.y += 0.05*c.y + 2;
				if( c.y >= 500 ) {
					c.statee = FLATTEN;
					c.velocity = $V([2, 0.02*c.y + 2])
				}
			} else if(c.statee == FLATTEN) {
				var nv = $V([2, c.velocity.y() * 0.8]);
				c.x += 12;
				c.y += nv.y();
				c.velocity = nv;
				if( c.x >= loop1start ) {
					c.loop = 1;
					c.statee = LOOP1;
					c.inity = c.y - loop1rad;
				} 
			} else if (c.statee == LOOP1) {
				goLoop(loop1rad, loop1start, loopspeed,
					function(){
						c.statee = STRAIGHT;
					}
				);
			} else if (c.statee == STRAIGHT) {
				c.x += 12;
				if(c.x >= loop2start ) {
					c.loop = 1;
					c.statee = LOOP2;
					c.inity = c.y - loop2rad;
				}
			} else if (c.statee == LOOP2) {
				goLoop(loop2rad, loop2start, loopspeed2,
					function(){
						c.done = true;
					}
				);
			}

		},

		done: function(c) {
			return c.done;
		}

	}

};