let container = document.getElementById('container');
let hidden = document.getElementById('hidden');
let touch = document.getElementById('touch');
const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

window.addEventListener('load', e => {
    let height = hidden.clientHeight;
    console.log(height)
    container.style.transform = `translateY(-${height}px)`
})

let ongoingTouches = []
let minY = touch.clientHeight;
let maxY = hidden.clientHeight;
let curY = minY;
let direction = 0;

// Start Touch EVENT
touch.addEventListener('touchstart', e => {
    e.preventDefault();
    let touches = e.changedTouches;
    for (var i = 0; i < touches.length; i++) {
        // What occurs on the touch beginning
        ongoingTouches.push(copyTouch(touches[i]))
    }
}, false)

// Move Touch EVENT 
touch.addEventListener('touchmove', e => {
    e.preventDefault();
    let touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        let touch = touches[i]
        let id = touch.identifier;
        // Check that the touch is valid
        if (ongoingTouches.some(tch => tch.identifier === id)) {

            // Calculate Destination
            let move = touch.pageY - minY;
            let destY = minY + move;

            // If destination is valid
            if ((destY > minY) && (destY < maxY)) {
                //console.log(`move: ${move}\ncurY : ${curY}\nminY : ${minY}\nmaxY : ${maxY}`)
                container.style.transform = `translateY(${move - maxY}px)`
                if (destY > curY) {
                    direction = 1;
                } else {
                    direction = -1;
                }
                curY = destY;
            }

        } else {
            console.log('unverified move')
        }
    }
}, false)

// End Touch EVENT
touch.addEventListener('touchend', e => {
    e.preventDefault();
    let touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
        let touch = touches[i]
        let id = touch.identifier;
        if (ongoingTouches.some(tch => tch.identifier === id)) {
            let duration = 1000 * (- Math.abs((curY - minY) / (maxY - minY) - 0.5) + 0.5)
        
            let options = {
                duration: duration,
                easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)'       
            }
        
            let reasonUp = (curY <= maxY * 0.3) 
            || (curY <= maxY * 0.8 && direction === -1)

            if (reasonUp) {
                let keyframes = {transform: `translateY(-${maxY}px)`};
                animateTo(container, keyframes, options);
            } else  {
                let keyframes = {transform: `translateY(-${minY}px)`};
                animateTo(container, keyframes, options);
            }
            ongoingTouches.splice(copyTouch(touch), 1)
        }
    }
}, false)

// Cancel Touch EVENT
touch.addEventListener('touchcancel', e => {

}, false)

function copyTouch({ identifier, pageX, pageY }) {
    return { identifier, pageX, pageY };
}

function animateTo(element, keyframes, options) {
    const anim = element.animate(
        keyframes,
        { ...options, fill: 'both'},
    );
    anim.addEventListener('finish', () => {
        anim.commitStyles();
        anim.cancel();
    });
    return anim
}

// Space out where nav would be on z-index 1 
document.getElementById('nav-space').style.height = `${touch.clientHeight}px`;