const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FRAMERATE = 60;
const NUMBALLS = 100;

// World
let gravity = null;
let water = null;

window.addEventListener('load', () => {
    // Init Canvas & Context
    const canvas = document.getElementById('main');
    const ctx = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Init World
    gravity = new Vector(0, 0.2);
    water = new Water(ctx, 0, HEIGHT / 2, WIDTH, HEIGHT / 2, 0.5);

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

    water.draw();

    objects.forEach(obj => {
        obj.update();
        obj.draw();
    });
}

class Water {
    constructor(ctx, x, y, w, h, c) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    }

    doesContain(ball) {
        return ball.position.x > this.x && ball.position.y > this.y && ball.position.x < this.x + this.w && ball.position.y < this.y + this.h;
    }

    calculateDrag(ball) {
        let speed = ball.velocity.mag()
        let dragMagnitude = this.c * speed * speed;

        var dragForce = ball.velocity.get();
        dragForce.mult(-1);

        dragForce.normalize();
        dragForce.mult(dragMagnitude);
        return dragForce;
    }

    draw() {
        this.ctx.fillStyle = 'blue';
        this.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Ball {
    constructor(ctx, radius) {
        this.ctx = ctx;
        this.radius = radius;
        this.mass = radius;
        this.position = Vector.getRandomVector(WIDTH, 0);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        Ball.maxPosition = new Vector(WIDTH, HEIGHT);
        Ball.maxMag = Ball.maxPosition.mag();
    }

    update() {
        gravity.mult(this.mass);
        this.applyForce(gravity);

        if (water.doesContain(this)) {
            this.applyForce(water.calculateDrag(this));
        }

        this.velocity.add(this.acceleration);
        this.velocity.limit(20);
        this.position.add(this.velocity);

        this._boundaryCheck();
        this.acceleration.mult(0); // reset acceleration
        gravity.div(this.mass); // reset gravity
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
        } else if (this.position.y + this.radius > HEIGHT) {
            this.velocity.y *= -1;
            this.position.y = HEIGHT - this.radius;
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

    get() {
        return new Vector(this.x, this.y);
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
