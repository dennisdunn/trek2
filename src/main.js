import './style.css'
import ECS from './ecs';
import { Logger, Plotter, Mover } from './systems';

ECS.systems.push(new Logger(document.getElementById("msgcontainer")));
ECS.systems.push(new Plotter(document.getElementById("plotter")));
ECS.systems.push(new Mover())

const entity = { msg: null, x: 10, y: 20, speed: 0, heading: 90, icon: '/favicon.ico' };
ECS.entities.push(entity);

const left = () => {
  entity.heading -= 5;
}
const right = () => {
  entity.heading += 5;
}
const speed = evt => {
  entity.speed = evt.target.value;
}

document.getElementById("left").addEventListener('click', left);
document.getElementById("right").addEventListener('click', right);
document.getElementById("speed").addEventListener('input', speed);
document.addEventListener('keydown', (evt) => {
  switch (evt.key) {
    case ',':
      left();
      break;
    case '.':
      right();
      break;
  }
});


ECS.start();