import './style.css'
import ECS from './ecs';
import { Logger, Renderer, Mover } from './systems';
import { mkIcon, bindHandler, randInt } from './tools';

ECS.systems.push(new Logger(document.getElementById("msgcontainer")));
ECS.systems.push(new Renderer(document.getElementById("plotter")));
ECS.systems.push(new Mover())

const ncc1701 = {
  msg: null,
  x: randInt(300),
  y: randInt(300),
  speed: 1,
  heading: randInt(360),
  icon: mkIcon('/assets/starship.svg', 0.07, '#007'),
  scale: 0.07
};

ECS.entities.push(ncc1701);
ECS.entities.push({
  x: randInt(300),
  y: randInt(300),
  icon: mkIcon('/assets/dock.svg', 0.1, '#070')
});

for (let x = 0; x < 10; x++) {
  ECS.entities.push({
    x: randInt(300),
    y: randInt(300),
    speed: Math.random() * 2,
    heading: randInt(360),
    icon: mkIcon('/assets/klingon.svg', 0.05, '#700')
  })
}


bindHandler('left', 'click', ncc1701, obj => obj.heading -= 5);
bindHandler('right', 'click', ncc1701, obj => obj.heading += 5);
bindHandler('speed', 'input', ncc1701, (obj, evt) => obj.speed = evt.target.value);

ECS.start();