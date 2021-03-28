const image = new Image();
image.src='resources/card2.png';
image.addEventListener('load', function(){
    const canvas = document.getElementById('welcome_bg');
    const ctx = canvas.getContext('2d');
    canvas.width = 522;
    canvas.height = 353;

    let particlesArray = [];
    const numberOfParticles = 5000;
    const detail = 1;

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let grid = [];
    for (let y = 0; y < canvas.height; y += detail){
        let row = [];
        for (let x = 0; x < canvas.width; x += detail){
            const red = pixels.data[(y * 4 * pixels.width) + (x * 4)]
            const green = pixels.data[(y * 4 * pixels.width) + (x * 4 + 1)]
            const blue = pixels.data[(y * 4 * pixels.width) + (x * 4 + 2)]
            const color = 'rgb(' + red +',' + green + ',' + blue + ')';
            const brightness = calculateBrightness(red, green, blue)/100;
            const cell = [
                cellColor = color,
                cellBrightness = brightness,
            ];
            row.push(cell);
        }
        grid.push(row);
    }
    console.log(grid);
    class Particle {
        constructor(){
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            //this.prevX = this.x;
            this.speed = 0;
            this.velocity = Math.random() * 0.4;
            this.size = Math.random() * 2 + 0.5;
            this.position1 = Math.floor(this.y / detail);
            this.position2 = Math.floor(this.x / detail);
            this.angle = 0;
        }
        update () {
            this.position1 = Math.floor(this.y / detail);
            this.position2 = Math.floor(this.x / detail);
            if (grid[this.position1]){
                if (grid[this.position1][this.position2]){
                    this.speed = grid[this.position1][this.position2][1];
                }
            }
            this.angle += this.speed/20;
            let movement = (2.5 - this.speed) + this.velocity;
            this.y -= movement + Math.cos(this.angle) * 2;
            this.x += Math.cos(this.angle) * 2;
            if (this.y <= 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
            //console.log(this.x += movement)
        }
        draw(){
            ctx.beginPath();
            ctx.fillStyle = 'black';
            if (this.y > canvas.height - this.size * 6) ctx.globalAlpha = 0;
            if (grid[this.position1]){
                if (grid[this.position1][this.position2]){
                    ctx.fillStyle = grid[this.position1][this.position2][0];
                }

            } else {
                ctx.fillStyle = 'white';
            }
            ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
            ctx.fill();

        }
    }

    function init(){
        for (let i = 0; i < numberOfParticles; i++){
            particlesArray.push(new Particle());
        }
    }
    init();

    function animate () {
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            ctx.globalAlpha = particlesArray[i].speed * 0.3;
            particlesArray[i].draw();
        }
        requestAnimationFrame( animate );
    }
    animate();

    function calculateBrightness(red, green, blue){
        return Math.sqrt(
            (red * red) * 0.299 +
            (green * green) * 0.587 +
            (blue * blue) * 0.114
        );
    }

});