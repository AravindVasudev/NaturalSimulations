const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FRAMERATE = 60;
const NUMBALLS = 100;

// World Forces
let gravity = null;
let wind = null;

window.addEventListener('load', () => {
    // Init Canvas & Context
    const canvas = document.getElementById('main');
    const ctx = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Init World Forces
    gravity = new Vector(0, 2);
    wind = new Vector(0.8, 0);

    // Init Balls
    const balls = [];
    for (let i = 0; i < NUMBALLS; i++) {
        balls.push(new Ball(ctx, Math.randomRange(5, 20)));
    }

    // Draw Loop
    window.setInterval(() => draw(ctx, balls), 1000 / FRAMERATE);
});

function draw(ctx, objects) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    if (Math.random() < 0.01) { // Randomly reverse wind
        wind.mult(-1);
    }

    ctx.fillStyle = "white";
    ctx.fillText("WIND: " + (wind.x < 0 ? "◀" : "▶"), 10, 10); // Print Wind Direction

    objects.forEach(obj => {
        obj.update();
        obj.draw();
    });
}

class Ball {
    constructor(ctx, radius) {
        this.ctx = ctx;
        this.radius = radius;
        this.mass = radius;
        this.position = Vector.getRandomVector(WIDTH, HEIGHT);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        Ball.maxPosition = new Vector(WIDTH, HEIGHT);
        Ball.maxMag = Ball.maxPosition.mag();
    }

    update() {
        this.applyForce(gravity);
        this.applyForce(wind);

        this.velocity.add(this.acceleration);
        this.velocity.limit(20);
        this.position.add(this.velocity);

        this._boundaryCheck();
        this.acceleration.mult(0); // reset acceleration
    }

    applyForce(force) {
        this.acceleration.add(Vector.div(force, this.mass));
    }

    _boundaryCheck() {
        if (this.position.x < 0) {
            this.velocity.x *= -1;
            this.position.x = 0;
        } else if (this.position.x > WIDTH) {
            this.velocity.x *= -1;
            this.position.x = WIDTH;
        } else if (this.position.y < 0) {
            this.velocity.y *= -1;
            this.position.y = 0;
        } else if (this.position.y > HEIGHT) {
            this.velocity.y *= -1;
            this.position.y = HEIGHT;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);

        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();

        this.ctx.lineWidth = this.radius / 8;
        this.ctx.strokeStyle = '#FFFFE0';
        this.ctx.stroke();
    }
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    subtract(v) {
        this.x -= v.x;
        this.y -= v.y;
    }

    mult(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    div(scalar) {
        this.x /= scalar;
        this.y /= scalar;
    }

    static div(vector, scalar) {
        return new Vector(vector.x / scalar, vector.y / scalar);
    }

    normalize() {
        this.div(this.mag());
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static getRandomVector(xMax, yMax) {
        return new Vector (Math.randomRange(0, xMax), Math.randomRange(0, yMax));
    }
}

Math.__proto__.randomRange = (min, max) => (Math.random() * (max - min) + min);
