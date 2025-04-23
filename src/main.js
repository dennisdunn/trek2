import { Message, Render, Physics, Boundry, Prune, Refresh, Collision, Ageout } from './systems';
import { ECS, mkIcon, bindHandler, randPos, randNav, p, randInt } from './lib';

const player = {
    dirty: true, // forces initial refresh
    energy: 3000,
    shield: 0,
    phasar: 0,
    torpedo: 10,
    heading: 0,
    speed: 0,
    x: 0,
    y: 0,
}


window.launch = () => {
    if (player.torpedo) {
        player.torpedo -= 1
        player.dirty = true
        // inject a torpedo entity
    } else {
        player.msg = "Torpedo tubes are empty!"
    }
}

window.fire = () => {
    if (player.energy >= player.phasar) {
        player.energy -= player.phasar
        player.dirty = true
        // inject a phasar entity
    } else {
        player.msg = "Insufficient energy for phasars!"
    }
}

window.phasar = (ctl) => {
    player.phasar = ctl.value
    player.dirty = true
}

window.shield = (ctl) => {
    player.shield = ctl.value
    player.dirty = true
}

window.impulse = (ctl) => {
    player.speed = ctl.value
    player.dirty = true
}

window.heading = (x) => {
    player.heading += x
    player.dirty = true
}

const engine = new ECS()

engine.systems.push(new Message("div.comms div.content"))
engine.systems.push(new Prune())
engine.systems.push(new Refresh())
engine.systems.push(new Render("div.sci canvas"))

// engine.systems.push(new Ageout())
// engine.systems.push(new Physics())
// engine.systems.push(new Collision())
// engine.systems.push(new Boundry(document.getElementById("plotter")))
// engine.systems.push(new Render(document.getElementById("plotter")))

// engine.entities.push({ id: 'NCC-1701', icon: mkIcon('/assets/starship.svg', 0.07, '#707'), boundry: 'wrap', ...randPos(600, 300), ...randNav(3, 360) });
// engine.entities.push({ id: 'Pegasus', icon: mkIcon('/assets/dock.svg', 0.1, '#070'), ...randPos(400, 150) });

// for (let x = 0; x < 10; x++) {
//   engine.entities.push({ id: `${klingons[x]}`, shield: randInt(100), energy: randInt(500), icon: mkIcon('/assets/klingon.svg', 0.05, '#700'), boundry: p(0.9) ? 'bounce' : 'wrap', ...randPos(600, 300), ...randNav(3, 360) })
// }

// const ncc1701 = engine.getById('NCC-1701');

// bindHandler('left', 'click', ncc1701, obj => obj.heading -= 5);
// bindHandler('right', 'click', ncc1701, obj => obj.heading += 5);
// bindHandler('fire', 'click', ncc1701, obj => engine.entities.unshift({ icon: mkIcon('/assets/phasar.svg', 0.03, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 5, yield: 10 }));
// bindHandler('torp', 'click', ncc1701, obj => engine.entities.unshift({ icon: mkIcon('/assets/torpedo.svg', 0.015, '#f07'), x: obj.x, y: obj.y, heading: obj.heading, speed: 4, yield: 50 }));
// bindHandler('speed', 'input', ncc1701, (obj, evt) => obj.speed = evt.target.value);
// bindHandler('shield', 'click', ncc1701, (obj, evt) => obj.shield = evt.target.checked);
// bindHandler('pause', 'click', engine, (obj, evt) => obj.toggle());


// ncc1701.msg = 'SPOCK: Captain on deck

engine.entities.push(player);
engine.entities.push({ msg: "SPOCK: Captain on deck.", dead: true })

engine.start()
