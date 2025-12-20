<template>
  <div class="nebula-container">
    <div class="stars-small"></div>
    <div class="stars-medium"></div>
    <div class="stars-large"></div>
    <div class="nebula-clouds"></div>
  </div>
</template>

<style scoped>
.nebula-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
  overflow: hidden;
}

@function box-shadow($stars) {
  $shadow: ();
  @for $i from 1 through $stars {
    $shadow: append($shadow, (random(2000) + 0px) (random(2000) + 0px) #fff, comma);
  }
  @return $shadow;
}

/* Since we can't use SASS directly without setup, we'll use a simpler CSS approach with radial gradients for stars or a few hardcoded ones, 
   OR better, use a simple JS to generate them to keep CSS clean. 
   Actually, let's stick to the CSS radial-gradient pattern for stars which is lightweight.
*/

.stars-small, .stars-medium, .stars-large {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
}

/* Using simple radial gradients to simulate stars */
.stars-small {
    width: 2px;
    height: 2px;
    background: white;
    box-shadow: 
        100px 200px #fff, 300px 400px #fff, 500px 100px #fff, 
        700px 600px #fff, 900px 300px #fff, 1100px 800px #fff,
        150px 850px #fff, 450px 250px #fff, 850px 550px #fff,
        50px 50px #fff, 250px 250px #fff, 450px 450px #fff,
        650px 650px #fff, 850px 850px #fff, 1050px 50px #fff,
        1250px 250px #fff, 1450px 450px #fff, 1650px 650px #fff,
        200px 100px #fff, 400px 300px #fff, 600px 500px #fff,
        800px 700px #fff, 1000px 900px #fff, 1200px 100px #fff,
        350px 150px #fff, 550px 350px #fff, 750px 550px #fff,
        950px 750px #fff, 1150px 950px #fff, 1350px 150px #fff,
        60vw 20vh #fff, 10vw 80vh #fff, 80vw 50vh #fff, 40vw 10vh #fff;
    animation: animStar 50s linear infinite;
    opacity: 0.5;
}

.stars-small::after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 2px;
    height: 2px;
    background: white;
    box-shadow: inherit;
}

.stars-medium {
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: 
        200px 500px #fff, 600px 100px #fff, 900px 800px #fff,
        1200px 300px #fff, 1500px 600px #fff, 100px 900px #fff,
        400px 400px #fff, 800px 200px #fff, 1300px 700px #fff,
        70vw 30vh #fff, 20vw 60vh #fff, 90vw 10vh #fff;
    animation: animStar 100s linear infinite;
    opacity: 0.7;
}

.stars-medium::after {
    content: " ";
    position: absolute;
    top: 2000px;
    width: 3px;
    height: 3px;
    background: transparent;
    box-shadow: inherit;
}

.nebula-clouds {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent; 
    background-image: 
        radial-gradient(circle at 20% 50%, rgba(76, 29, 149, 0.25) 0%, transparent 50%),
        radial-gradient(circle at 80% 30%, rgba(37, 99, 235, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 50% 80%, rgba(219, 39, 119, 0.15) 0%, transparent 50%);
    filter: blur(80px);
    z-index: 2;
    animation: pulse-nebula 20s ease-in-out infinite alternate;
}

@keyframes animStar {
    from { transform: translateY(0px); }
    to { transform: translateY(-2000px); }
}

@keyframes pulse-nebula {
    0% { opacity: 0.6; transform: scale(1); }
    100% { opacity: 0.9; transform: scale(1.1); }
}
</style>