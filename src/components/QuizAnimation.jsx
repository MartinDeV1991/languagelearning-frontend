import React, { useEffect, useRef } from 'react';


const QuizAnimation = (props) => {
    const canvasRef = useRef(null);

    let number = props.currentQuestionIndex;
    let totalNumber = Math.min(props.questions.length, 10);

    useEffect(() => {

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.style.left = window.innerWidth / 2 + "px"
        canvas.style.top = window.innerHeight / 8 + "px"
        canvas.width = window.innerWidth / 2;
        canvas.height = window.innerHeight / 2;

        class Particle {
            constructor(effect, x, y, color) {
                this.effect = effect;
                this.x = Math.random() * this.effect.width;
                this.y = Math.random() * this.effect.height;
                this.originX = Math.floor(x);
                this.originY = Math.floor(y);
                this.size = this.effect.gap;
                this.color = color;
                this.ease = 0.1;
                this.force = 0;
                this.angle = 0;
                this.done = false;
            }
            draw(context) {
                context.fillStyle = this.color;
                context.fillRect(this.x, this.y, this.size, this.size);
            }
            update() {
                if (this.originX < effect.width * (number - 1) / totalNumber) {
                    this.x = this.originX;
                    this.y = this.originY;
                } else if (this.originX < effect.width * number / totalNumber) {
                    this.x += (this.originX - this.x) * this.ease;
                    this.y += (this.originY - this.y) * this.ease;
                }
                this.check();
            }

            check() {
                if (this.originX < effect.width * number / totalNumber) {
                    if (Math.abs(this.x - this.originX) < 0.1) {
                        this.done = true;
                    }
                }
            }
        }

        class Effect {
            constructor(width, height) {
                this.width = width;
                this.height = height;
                this.particlesArray = [];
                this.image = document.getElementById('image1');
                this.centerX = this.width * 0.5;
                this.centerY = this.height * 0.5;
                this.x = this.centerX - this.image.width * 0.5;
                this.y = this.centerY - this.image.height * 0.5;
                this.gap = 3;
                this.done = true;
                this.totalParticlesCount = 0;
                this.doneParticlesCount = 0;
            }
            init(context) {
                context.drawImage(this.image, this.x, this.y);
                const pixels = context.getImageData(0, 0, this.width, this.height).data;
                for (let y = 0; y < this.height; y += this.gap) {
                    for (let x = 0; x < this.width; x += this.gap) {
                        const index = (y * this.width + x) * 4;
                        const red = pixels[index];
                        const green = pixels[index + 1];
                        const blue = pixels[index + 2];
                        const alpha = pixels[index + 3];
                        const color = 'rgb(' + red + ',' + green + ',' + blue + ')';

                        if (alpha > 0) {
                            this.particlesArray.push(new Particle(this, x, y, color));
                        }
                    }
                }
            }
            draw(context) {
                // context.drawImage(this.image, this.x, this.y);
                this.particlesArray.forEach(particle => particle.draw(context));

            }
            update() {
                this.particlesArray.forEach(particle => particle.update());

                this.totalParticlesCount = this.particlesArray.filter(particle => particle.originX < this.width * (number / totalNumber) &&
                    particle.originX > this.width * ((number - 1) / totalNumber)).length;

                this.doneParticlesCount = this.particlesArray.filter(particle => particle.done &&
                    (particle.originX < this.width * (number / totalNumber)) && particle.originX > this.width * ((number - 1) / totalNumber)).length;

                console.log('Total particle count:', this.totalParticlesCount);
                console.log('Number of particles with done set to true:', this.doneParticlesCount);
            }
        }

        const effect = new Effect(canvas.width, canvas.height);
        effect.init(ctx);

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            effect.draw(ctx);
            effect.update();
            const percentage = effect.doneParticlesCount / effect.totalParticlesCount
            if (percentage < 0.95 * (number / totalNumber)) {
                requestAnimationFrame(animate);
            }
        }
        animate();

    }, [number])

    return (
        <div>
            <canvas id="canvas1" ref={canvasRef} style={{ position: 'absolute' }}></canvas>
            <img id="image1" style={{ display: 'none' }}
                src="data:image/png;base64, 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
                "></img>
        </div>
    )
}

export default QuizAnimation
