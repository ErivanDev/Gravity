var arrow;
var planets = [] ;
var shoot;
var goku;
var count = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
	planets.push( new Planet(420, 400, 75, 200) );
	planets.push( new Planet(746, 234, 65, 900) );
	goku = loadImage("assets/goku.png");
	shoot = new Shooter();
}

function draw() {
	background(255);

	/* Check if a planet is out of bounds */
	// var bound = 5000;
	// var to_splice = [];
	// for (var i = 0; i < planets.length ; i++) {
	// 	if ((arrow.pos.x > bound) ||
	// 	    (arrow.pos.x < (0-bound)) ||
	// 	    (arrow.pos.y > bound) ||
	// 	    (arrow.pos.y < (0-bound))) {
	// 		append(to_splice, i);
	// 	}
	// }
	// for (var i = 0; i < to_splice.length ; i++) {
	// 	arrow.splice(to_splice[i], 1);
	// }

	/* Render planets */
	// for (var i = 0; i < planets.length ; i++) {
		// for (var j = 0; j < planets.length ; j++) {
		// 	if( i != j) {
		// 		planets[i].orbit(planets[j]);
		// 	}
		// }
	if(arrow != undefined){
		arrow.orbit(planets[0]);
		arrow.orbit(planets[1]);
		arrow.newton();
		arrow.draw();
	}
	// }
  
	/* Draw the sun */
	for (var i = 0; i < planets.length ; i++) {
		planets[i].draw();
	}
	
	/* Render shooter */
	shoot.update();
	shoot.draw();

	push();
	translate(420-100, 400-100);
	rotate(-PI/8);
	image(goku, 0, 0);
	pop();
}

function Shooter() {
	this.x1 = 0;
	this.y1 = 0;
	this.x2 = 0;
	this.y2 = 0;
	this.R = 0;
	this.G = 0;
	this.B = 0;
	this.force = 0;
	this.force_x = 0;
	this.force_y = 0;
	this.shooting=false;
	this.c_shooting=false;
	this.touchKey=false;

	this.update = function() {
		/* Mouse shooter */
		if((!this.shooting) && (mouseIsPressed) && (!this.c_shooting)) {
			this.shooting = true;
			this.x2 = 420 - 10;
			this.y2 = 400 - 90;
			this.R = floor(random(255));
			this.G = floor(random(255));
			this.B = floor(random(255));
		}

		if (this.shooting && mouseIsPressed) {
			var pos = createVector(mouseX-this.x2,mouseY-this.y2);
			var tan = atan(pos.y/pos.x)
			pos.x < 0 ? tan+= PI : pos.x > 0 && pos.y < 0 ? tan+=TWO_PI : tan = tan;
			var distance = dist(this.x2, this.y2, mouseX, mouseY) < 100 ? dist(this.x2, this.y2, mouseX, mouseY) : 100;
			this.x1 = this.x2 - cos(tan) * distance;
			this.y1 = this.y2 - sin(tan) * distance;
			this.force = int(dist(this.x1, this.y1, this.x2, this.y2))/10;
		}

		if (!mouseIsPressed && this.shooting) {
			var alpha = 0;
			var x_dir = 0;
			var y_dir = 0;

			if (this.force > 1) {
				if (this.x1 != this.x2) {
					alpha = atan(abs((this.y2 - this.y1)) / abs((this.x2 - this.x1)));
					this.force_x = this.force * cos(alpha);
					this.force_y = this.force * sin(alpha);
				} else {
					this.force_x = 0;
					this.force_y = this.force;
				}	

				if (this.x2 < this.x1) {
					if(this.y2 < this.y1) {
						x_dir = 1;
						y_dir = 1;
					} else {
						x_dir = 1;
						y_dir = -1;
					}
				} else {
					if(this.y2 < this.y1) {
						x_dir = -1;
						y_dir = 1;
					} else {
						x_dir = -1;
						y_dir = -1;
					}
				}
				arrow = new Arrows(this.x2, this.y2, (x_dir * this.force_x),(y_dir * this.force_y),this.R,this.G,this.B,10);
			}
			this.shooting = false;
		}
	}

	this.draw = function() {

			if ((this.shooting) || (this.c_shooting)) {
				/* Draw the line and the arraow */
				stroke(0);
				var pos = createVector(mouseX-this.x2,mouseY-this.y2);
				var tan = atan(pos.y/pos.x)
				pos.x < 0 ? tan+= PI : pos.x > 0 && pos.y < 0 ? tan+=TWO_PI : tan = tan;
				// line(this.x1-cos(tan)*5,this.y1-sin(tan)*5, this.x1+cos(tan)*5, this.y1+sin(tan)*5);
				triangle(this.x1-cos(tan)*5, this.y1-sin(tan)*5, 
						 this.x1-cos(tan + PI/2)*5, this.y1-sin(tan + PI/2)*5, 
						 this.x1+cos(tan + PI/2)*5, this.y1+sin(tan + PI/2)*5);

				line(this.x2-cos(tan)*30-cos(tan + PI/2)*5, this.y2-sin(tan)*30-sin(tan + PI/2)*5, 
					 this.x2-cos(tan)*30+cos(tan + PI/2)*5, this.y2-sin(tan)*30+sin(tan + PI/2)*5);

		        line(this.x2-cos(tan)*30, this.y2-sin(tan)*30, this.x1, this.y1);

				/* Draw the futur planet */
				noStroke();
				fill(this.R,this.G,this.B);
				ellipse(this.x2, this.y2, 20, 20);

			    push();
					fill(0);
			        translate( (this.x1+this.x2)/2, (this.y1+this.y2)/2 );
					if (this.x2 > this.x1) {
			        	rotate( atan2(this.y2-this.y1,this.x2-this.x1) );
					} else {
			        	rotate( atan2(this.y1-this.y2,this.x1-this.x2) );
					}
			        text(nfc(this.force,1,1), 0, -5);
			    pop();
			}
	}
}

function Planet(x,y,r,m) {
	this.pos = createVector(0, 0);
	this.pos.x = x;
	this.pos.y = y;
	this.radius = r; //30
	this.mass = m; //1000

	this.draw = function() {
		fill(0);
		ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2); 
	}
}

function Arrows(x,y,accx,accy,R,G,B,radius) {
	this.radius = radius || 10;
	this.traj = [];
	this.count = 0;
	this.R = R || 0;
	this.G = G || 0;
	this.B = B || 0;
	this.pos = createVector(x, y);
	this.vel = createVector(0, 0);
	this.acc = createVector(accx, accy);
	this.mass = 10;
	this.Gravity = 1;

	this.draw = function() {
		/* Draw planet */
		push();
		noStroke();
		fill(this.R,this.G,this.B,250);
		translate(this.pos.x, this.pos.y);
		rotate(this.vel.heading());
		ellipse(0, 0, this.radius*2, this.radius*2); 
		// rect(0, -2.5, 10, 5); 
		pop();

		/* Draw trajectory */
		if (255 == this.count ) {
			for (var i = 0; i < this.count-1; i++) {
				this.traj[i] = this.traj[i+1];
			}
			this.traj[this.count-1] = createVector(this.pos.x,this.pos.y);
		} else {
			this.traj[this.count] = createVector(this.pos.x,this.pos.y);
			this.count++;
		}
		for (var i =0; i < this.traj.length; i++) {
			fill(this.R,this.G,this.B);//,i);
			noStroke();
			ellipse(this.traj[i].x, this.traj[i].y, 10, 10);
		}
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.newton = function () {
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.orbit = function(body) {
		var gravity_force = 0; 
		var gravity_force_x = 0; 
		var gravity_force_y = 0; 
		var x_dir = 0;
		var y_dir = 0;
		var alpha =  0;

		/* Gravitational force */
		var g_dist = dist(this.pos.x,this.pos.y,body.pos.x,body.pos.y)
		gravity_force = ((this.Gravity * this.mass * body.mass)/(sq(g_dist)));
		if (body.pos.x != this.pos.x) {
			alpha = atan(abs((body.pos.y - this.pos.y)) / abs((body.pos.x - this.pos.x)));
			gravity_force_x = gravity_force * cos(alpha);
			gravity_force_y = gravity_force * sin(alpha);
		} else {
			gravity_force_x = 0;
			gravity_force_y = gravity_force;
		}	

		/* Gravitational force direction */
		if (this.pos.x < body.pos.x) {
			if(this.pos.y < body.pos.y) {
				x_dir = 1;
				y_dir = 1;
			} else {
				x_dir = 1;
				y_dir = -1;
			}
		} else {
			if(this.pos.y < body.pos.y) {
				x_dir = -1;
				y_dir = 1;
			} else {
				x_dir = -1;
				y_dir = -1;
			}
		}

		/* Apply gravitational force */
		this.applyForce(createVector((x_dir * gravity_force_x), (y_dir * gravity_force_y)));
	}

}
