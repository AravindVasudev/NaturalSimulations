const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const FRAMERATE = 60;
const NUMBALLS = 100;

let mouse = null;

window.addEventListener('load', () => {
    // Init Canvas & Context
    const canvas = document.getElementById('main');
    const ctx = canvas.getContext('2d');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    // Init Balls
    const balls = [];
    for (let i = 0; i < NUMBALLS; i++) {
        balls.push(new Ball(ctx, Math.randomRange(5, 8)));
    }

    // Update Mouse Vector
    mouse = new Vector(0, 0);

    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    canvas.addEventListener('mousemove', e => mouse.set(e.clientX - rect.left - root.scrollLeft, e.clientY - rect.top - root.scrollTop));

    // Draw Loop
    window.setInterval(() => draw(ctx, balls), 1000 / FRAMERATE);
});

function draw(ctx, Objects) {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    Objects.forEach(obj => {
        obj.update();
        obj.draw();
    });
}

class Ball {
    constructor(ctx, radius) {
        this.ctx = ctx;
        this.radius = radius;
        this.weight = radius;
        this.position = Vector.getRandomVector(WIDTH, HEIGHT);
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);

        Ball.maxPosition = new Vector(WIDTH, HEIGHT);
        Ball.maxMag = Ball.maxPosition.mag();
    }

    update() {
        this._accelerateTowardsMouse();

        this.velocity.add(this.acceleration);
        this.velocity.limit(20);
        if (Math.random() < 0.1) { // 10% probability of adding noise
            this.velocity.add(new Vector(Math.randomRange(-5, 5), Math.randomRange(-5, 5)));
        }

        this.position.add(this.velocity);

        this._boundaryCheck();
    }

    _accelerateTowardsMouse() {
        let dir = Vector.subtract(mouse, this.position);
        let closeness = (Ball.maxMag - dir.mag()) / Ball.maxMag;

        dir.normalize();
        dir.mult(closeness);

        this.acceleration = dir;
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
