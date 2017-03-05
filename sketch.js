var obstacles = [];
var p;

function setup() {
	createCanvas(400, 400);
	obstacles.push(new Circle(random(80) - 40, random(80) - 40, random(50) + 50));
	obstacles.push(new Circle(530 - random(30), 140 + random(30), 200));
	obstacles.push(new Circle(40, 390 - random(10), 80 + random(10)));
	p = new Population(500);
	//frameRate(5);
}

function draw() {
	background(51);
	
	for(var i = 0; i < 3; i++){
		
		obstacles[i].show(1);
		
	}
	
	//p.show(); // show all circles in generation
	p.mate();
}

function Circle(x, y, r){
	
	this.position = createVector(x, y);
	this.radius = r;
	
	this.show = function(full){
		
		if( ! full) noFill(); else fill(255, 0, 0, 100);
		stroke(255, 100);
		strokeWeight(1);
		ellipse(this.position.x, this.position.y, this.radius * 2);
		
	}
	
	this.emboss = function(){
		noFill();
		stroke(0, 255, 0);
		strokeWeight(1);
		ellipse(this.position.x, this.position.y, this.radius * 2);
	}
	
	this.fitness = function(){
		
		var f = this.radius;
		
		for(var i = 0; i < 3; i++){
			if(this.intersects(obstacles[i])){
				f *= -1;
				break;
			}
		}
		
		if(this.position.x > width || this.position.y > height || this.position.x < 0 || this.position.y < 0) f -= 50;
		
		if(f > p.best) f *= 2;
		
		return floor(map(f, -200, 200, 0, 100));
		
	}
	
	this.intersects = function(circle){
		
		return dist(this.position.x, this.position.y, circle.position.x, circle.position.y) < this.radius + circle.radius;
		
	}
	
}

function Population(num){
	
	this.total = num;
	this.prev = "";
	this.repetition = 0;
	this.circles = [];
	this.pool = [];
	this.best = 0;
	this.gene = 0;
	var c;
	
	for(var i = 0; i < this.total; i++){
		
		c = new Circle(random(400), random(400), random(200));
		this.circles.push(c);
		
	}
	
	this.show = function(){
	
		for(var i = 0; i < this.total; i++){
			this.circles[i].show();
		}
	
	}
	
	this.mate = function(){
		
		this.gene++;
		var f, index;
		var children = [];
		this.pool = [];
		var maxx = 0;
		for(var i = 0; i < this.total; i++){
			f = this.circles[i].fitness();
			if(f > maxx) {maxx = f; index = i;}
			for(var m = 0; m < f; m++){
				this.pool.push(this.circles[i]);	
			}	
		}
		
		var best  = this.circles[index];
		this.best = maxx;
		best.emboss();
		var text = round(best.position.x, 2) + ", " + round(best.position.y) + "(" + round(best.radius) + ")";
		if(text == this.prev){
			this.repetition++;
			if(this.repetition > 10) noLoop();
		}else{
			this.prev = text;
			this.repetition = 0;
		}
		document.getElementById("result").innerHTML = text + " Generation: " + this.gene;
		
		for(var i = 0; i < this.total; i++){
			var p1 = floor(random(this.pool.length));
			var p2 = floor(random(this.pool.length));
			var c1 = this.pool[p1];
			var c2 = this.pool[p2];
			var x = random() < 0.5 ? c1.position.x : c2.position.x;
			var y = random() < 0.5 ? c1.position.y : c2.position.y;
			var r = max(c1.radius, c2.radius);
			if(random() < 0.1) x += random(10) - 5;
			if(random() < 0.1) y += random(10) - 5;
			if(random() < 0.1) r += random(10) - 5;
			var c = new Circle(x, y, r);
			children.push(c);
		}
		
		this.circles = [];
		arrayCopy(children, this.circles);
	
	}
	
}