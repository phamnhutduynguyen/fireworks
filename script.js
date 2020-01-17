const WIDTH = 1400;
const HEIGHT = 800;
const PARTICLE_SIZE = 7;
const PARTICLE_CHANGE_SIZE_SPEED = 0.1;
const PARTICLE_CHANGE_SPEED = 0.5;
const ACCELERATION = 0.12; //GIA TOC
const DOT_CHANGE_SIZE_SPEED = 0.2;
const DOT_CHANGE_ALPHA_SPEED = 0.07;

const PARTICLE_MIN_SPEED =10;
const NUMBER_PARTICLE_PER_BULLET = 20;

class particle{
    constructor(bullet, deg){
        this.bullet = bullet;
        this.ctx = bullet.ctx;
        this.deg = deg; //do
        //coordinate bullet
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.color = this.bullet.color;
        this.size = PARTICLE_SIZE;
        this.speed = Math.random() * 4 + PARTICLE_MIN_SPEED;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [];
        //    {x:10, y:10, alpha: 1, size: 10} : 2 toa do, do mo`, size
        
    }

    update(){
        this.speed -= PARTICLE_CHANGE_SPEED; 
        if(this.speed < 0){
            this.speed = 0;
        }

        //increase fall speed
        this.fallSpeed += ACCELERATION;

        this.speedX = this.speed * Math.cos(this.deg);
        this.speedY = this.speed * Math.sin(this.deg) + this.fallSpeed;

        //calculate position
        this.x += this.speedX;
        this.y += this.speedY;

        if(this.size > PARTICLE_CHANGE_SIZE_SPEED){
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }
        if(this.size >0){
            this.dots.push({
                x: this.x, y: this.y, alpha: 1, size: this.size
            });
        } 
        
        this.dots.forEach(dot =>{
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;
        });

        this.dots = this.dots.filter(dot =>{
            return dot.size > 0;
        });

        if(this.dots.length == 0){
            this.remove();
        }
    }

    remove(){
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }

    draw(){
        this.dots.forEach(dot => {
            this.ctx.fillStyle = 'rgba('+this.color+', '+dot.alpha+')'; //color: red;
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })       
    }
}

class bullet{
    constructor(fireworks){
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        //coordinate bullet
        this.x = Math.random() * WIDTH;
        this.y = Math.random() * HEIGHT/2;
        //random color (255,255,255, a);
        this.color = Math.floor(Math.random() * 255) + ',' + 
                    Math.floor(Math.random() * 255) + ',' + 
                    Math.floor(Math.random() * 255);
        this.particles = [];

        //create one particle
        let bulletDeg = Math.PI *2/NUMBER_PARTICLE_PER_BULLET;
        for(let i=0; i<NUMBER_PARTICLE_PER_BULLET; i++){
            let newParticle = new particle(this, i * bulletDeg);
            this.particles.push(newParticle);
        }
    }

    remove(){
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }

    update(){
        if(this.particles.length == 0){
            this.remove();
        }
        this.particles.forEach(particle => particle.update());
    }

    draw(){
        this.particles.forEach(particle => particle.draw());
    }
}

class fireworks{
    constructor(){
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        document.body.appendChild(this.canvas);

        this.bullets = [];

        setInterval(() => {
            //create new bullet
            let newBullet = new bullet(this); 
            this.bullets.push(newBullet);
        }, 500);
        

        this.loop();
    }

    loop(){
    //    console.log('loop');
        this.bullets.forEach(bullet => bullet.update());
        this.draw();
        setTimeout(() => this.loop(), 20);
    }

    clearScreen(){
        this.ctx.fillStyle = '#000000'; //color: black;
        this.ctx.fillRect(0,0, WIDTH, HEIGHT);
    }

    draw(){
        this.clearScreen();
        this.bullets.forEach(bullet => bullet.draw());
    }
}
var f = new fireworks();