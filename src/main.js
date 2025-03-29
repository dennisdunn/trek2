import './style.css'
import ECS from './ecs';
import { Logger, Render, Physics, Boundry, Prune } from './systems';
import { mkIcon, bindHandler, randPos, randNav, p } from './tools';

ECS.systems.push(new Logger(document.getElementById("msgcontainer")));
ECS.systems.push(new Prune(document.getElementById("msgcontainer")));
ECS.systems.push(new Physics())
ECS.systems.push(new Boundry(document.getElementById("plotter")));
ECS.systems.push(new Render(document.getElementById("plotter")));

ECS.entities.push({ id: 'NCC-1701', icon: mkIcon('/assets/starship.svg', 0.07, '#007'), boundry: 'wrap', ...randPos(600, 300), ...randNav(3, 360) });

ECS.entities.push({id:'Pegasus', icon: mkIcon('/assets/dock.svg', 0.1, '#070'), ...randPos(400, 150) });

for (let x = 0; x < 10; x++) {
  ECS.entities.push({ id: `K${x}`, icon: mkIcon('/assets/klingon.svg', 0.05, '#700'), boundry: p(0.5) ? 'bounce' : 'wrap', ...randPos(600, 300), ...randNav(3, 360) })
}

const ncc1701 = ECS.getById('NCC-1701');

bindHandler('left', 'click', ncc1701, obj => obj.heading -= 5);
bindHandler('right', 'click', ncc1701, obj => obj.heading += 5);
bindHandler('fire', 'click', ncc1701, obj => ECS.entities.unshift({ icon: mkIcon('/assets/phasar.svg', 0.03, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 3 }));
bindHandler('torp', 'click', ncc1701, obj => ECS.entities.unshift({ icon: mkIcon('/assets/torpedo.svg', 0.015, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 3 }));
bindHandler('speed', 'input', ncc1701, (obj, evt) => obj.speed = evt.target.value);
bindHandler('shield', 'click', ncc1701, (obj, evt) => obj.shield = evt.target.checked);

ECS.start();