$(function() {

    var imgUrl = "resources/cards/testgif.gif"
    var card = document.getElementById("reflexcard");
    updateReflection(100, 0)


    window.addEventListener("mousemove", (event) => {
        let mouseX = event.clientX
        let mouseY = event.clientY
        let halfWidth = window.innerWidth / 2
        let halfHeight = window.innerHeight / 2
        let xdeg = (mouseX - halfWidth) / halfWidth;
        let ydeg = -(mouseY - halfHeight) / halfHeight;
        updateReflection(ydeg * 180, xdeg * 100)
        card.style.transform = `rotateX(${ydeg * 10}deg) rotateY(${xdeg * 10}deg)`;
    })

    window.ondevicemotion = function (event) {
        var accelerationX = event.accelerationIncludingGravity.x;
        var accelerationY = event.accelerationIncludingGravity.y;
        var accelerationZ = event.accelerationIncludingGravity.z;
        // console.log(`${accelerationX},${accelerationY},${accelerationZ}`)
        let xdeg = accelerationX / 10;
        let ydeg = accelerationY / 10;
        updateReflection(ydeg * 180, xdeg * 100)
        card.style.transform = `rotateX(${ydeg * 20}deg) rotateY(${xdeg * 20}deg)`;
    }


    function updateReflection(degree, percentage) {
        card.style.background = `linear-gradient(${degree}deg, rgba(63,63,63,0) 0%,rgba(63,63,63,0.2) ${percentage}%,rgba(63,63,63,0) 100%), url('${imgUrl}')`
        card.style.backgroundSize = "cover"
    }

});