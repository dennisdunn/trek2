import './style.css'
import ECS from './ecs';
import { Logger, Render, Physics, Boundry, Prune, Collision } from './systems';
import { mkIcon, bindHandler, randPos, randNav, p, randInt } from './tools';

const klingons = [
  "IKS Buruk",
  "IKS Ch'Tang",
  "IKS Che'Ta'",
  "IKS Hegh'ta",
  "IKS Ki'tang",
  "IKS Korinar",
  "IKS M'Char",
  "IKS Malpara",
  "IKS Ning'tao",
  "IKS Orantho",
  "IKS Pagh",
  "IKS Rotarran",
  "IKS Slivin",
  "IKS Vorn",
  "IKS Y'tem"
]

ECS.systems.push(new Logger(document.getElementById("msgcontainer")));
ECS.systems.push(new Prune(document.getElementById("msgcontainer")));
ECS.systems.push(new Physics())
ECS.systems.push(new Collision())
ECS.systems.push(new Boundry(document.getElementById("plotter")));
ECS.systems.push(new Render(document.getElementById("plotter")));

ECS.entities.push({ id: 'NCC-1701', icon: mkIcon('/assets/starship.svg', 0.07, '#007'), boundry: 'wrap', ...randPos(600, 300), ...randNav(3, 360) });
ECS.entities.push({ id: 'Pegasus', icon: mkIcon('/assets/dock.svg', 0.1, '#070'), ...randPos(400, 150) });

for (let x = 0; x < 10; x++) {
  ECS.entities.push({ id: `${klingons[x]}`, shield: randInt(100), energy: randInt(500), icon: mkIcon('/assets/klingon.svg', 0.05, '#700'), boundry: p(0.5) ? 'rand' : 'wrap', ...randPos(600, 300), ...randNav(3, 360) })
}

const ncc1701 = ECS.getById('NCC-1701');

bindHandler('left', 'click', ncc1701, obj => obj.heading -= 5);
bindHandler('right', 'click', ncc1701, obj => obj.heading += 5);
bindHandler('fire', 'click', ncc1701, obj => ECS.entities.unshift({ icon: mkIcon('/assets/phasar.svg', 0.03, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 5, yield: 10 }));
bindHandler('torp', 'click', ncc1701, obj => ECS.entities.unshift({ icon: mkIcon('/assets/torpedo.svg', 0.015, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 4, yield: 50 }));
bindHandler('speed', 'input', ncc1701, (obj, evt) => obj.speed = evt.target.value);
bindHandler('shield', 'click', ncc1701, (obj, evt) => obj.shield = evt.target.checked);
bindHandler('pause', 'click', ECS, (obj, evt) => obj.toggle());

ECS.start();

ncc1701.msg = 'SPOCK: Captain on deck.'
