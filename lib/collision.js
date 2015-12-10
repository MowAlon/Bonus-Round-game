var colliding = function(bulletUp, bulletDown) {
  return !(bulletUp === bulletDown ||
          bulletUp.y > (bulletDown.y + bulletDown.height))
}
