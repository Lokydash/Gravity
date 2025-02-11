document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gravityCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Face-related emojis
    const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘", "😗", "😙", "😚", "😋", "😜", "😝", "😛", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "🥺", "😢", "😭", "😩", "😫", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕"];

    const balls = [];

    const gravityStrength = 0.2;
    const friction = 0.99;
    const bounce = 0.6;
    const repulsionForce = 0.05; // Less repulsion to keep them closer
    let gravityX = 0;
    let gravityY = 0;

    const emojiSize = 32; // Default emoji size

    let isDragging = false;
    let draggedBall = null;
    let offsetX = 0;
    let offsetY = 0;

    window.addEventListener('deviceorientation', function (event) {
        gravityX = event.gamma / 30;
        gravityY = event.beta / 30;
    });

    canvas.addEventListener('touchstart', function (event) {
        const touchX = event.touches[0].clientX;
        const touchY = event.touches[0].clientY;

        let touchedBall = null;
        balls.forEach(ball => {
            const dx = touchX - ball.x;
            const dy = touchY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < emojiSize / 2) {
                isDragging = true;
                draggedBall = ball;
                offsetX = touchX - ball.x;
                offsetY = touchY - ball.y;
                ball.dx = 0;
                ball.dy = 0;
            }
        });

        if (!isDragging) {
            createNewBall(touchX, touchY);
        }
    });

    canvas.addEventListener('touchmove', function (event) {
        if (isDragging && draggedBall) {
            const touchX = event.touches[0].clientX;
            const touchY = event.touches[0].clientY;
            draggedBall.x = touchX - offsetX;
            draggedBall.y = touchY - offsetY;
        }
    });

    canvas.addEventListener('touchend', function (event) {
        if (isDragging && draggedBall) {
            isDragging = false;
            draggedBall = null;
        }
    });

    function applyRepulsion(ballA, ballB) {
        const dx = ballB.x - ballA.x;
        const dy = ballB.y - ballA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const minDistance = emojiSize * 1.1; // Reduced spacing

        if (distance < minDistance) {
            const angle = Math.atan2(dy, dx);
            const force = (minDistance - distance) * repulsionForce;

            ballA.dx -= force * Math.cos(angle);
            ballA.dy -= force * Math.sin(angle);
            ballB.dx += force * Math.cos(angle);
            ballB.dy += force * Math.sin(angle);
        }
    }

    function createNewBall(x, y) {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        const newBall = {
            x: x,
            y: y,
            dx: 0,
            dy: 0,
            emoji: randomEmoji
        };
        balls.push(newBall);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach(ball => {
            if (!isDragging || draggedBall !== ball) {
                ball.dx += gravityX * gravityStrength;
                ball.dy += gravityY * gravityStrength;

                ball.dx *= friction;
                ball.dy *= friction;

                ball.x += ball.dx;
                ball.y += ball.dy;

                if (ball.x - emojiSize / 2 < 0) {
                    ball.x = emojiSize / 2;
                    ball.dx *= -bounce;
                }
                if (ball.x + emojiSize / 2 > canvas.width) {
                    ball.x = canvas.width - emojiSize / 2;
                    ball.dx *= -bounce;
                }
                if (ball.y - emojiSize / 2 < 0) {
                    ball.y = emojiSize / 2;
                    ball.dy *= -bounce;
                }
                if (ball.y + emojiSize / 2 > canvas.height) {
                    ball.y = canvas.height - emojiSize / 2;
                    ball.dy *= -bounce;
                }

                balls.forEach(otherBall => {
                    if (ball !== otherBall) {
                        applyRepulsion(ball, otherBall);
                    }
                });
            }

            ctx.font = `${emojiSize}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = "rgba(255, 255, 255, 0.5)";
            ctx.shadowBlur = 5;
            ctx.fillText(ball.emoji, ball.x, ball.y);
            ctx.shadowBlur = 0;
        });

        requestAnimationFrame(update);
    }

    update();
});