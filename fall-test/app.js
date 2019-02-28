const N = 10;
const G = [0, 5];
const T = 10;
const BOX = [[0, screen.width], [0, screen.height]];

window.addEventListener('load', () => {
    let balls = [];
    for (let i = 0; i < N; i++) {
        balls.push(new Ball((Math.random() * screen.width) + 1 - 10, 0, 4));
    }
});

class Ball {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        
        this.ball = this.initBall();

        this.gravityLoopI = 1;
        this.gravityLoop = window.setInterval(() => {
            if (this.x < BOX[0][0] || this.x > BOX[0][1] || this.y < BOX[1][0] || this.y > BOX[1][1]) {
                return;
            }

            this.x += G[0] * this.gravityLoopI;
            this.y += G[1] * this.gravityLoopI;

            this.gravityLoopI += 0.02;
            this.displaceBall();
        }, T);
    }

    initBall() {
        let ball = document.createElement('div');
        
        ball.style.height = `${this.radius}vw`;
        ball.style.width = `${this.radius}vw`;
        ball.style.top = `${this.y}px`;
        ball.style.left = `${this.x}px`;
        ball.classList.add('ball');

        document.body.appendChild(ball);
        return ball;
    }

    displaceBall() {
        this.ball.style.top = `${this.y}px`;
        this.ball.style.left = `${this.x}px`;
    }
}