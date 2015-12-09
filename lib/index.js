var canvas = document.getElementById('gunner');
var context = canvas.getContext('2d');



requestAnimationFrame(function gameLoop(){
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillRect(canvas.width / 2, canvas.height / 2,50,50)

  requestAnimationFrame(gameLoop)
})
