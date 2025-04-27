import { Message, Render, Physics, Boundry, Prune, Refresh, Collision, Ageout } from './systems';
import { ECS, EntityBuilder, bindHandler, randInt, Sprite } from './lib';
import { launch, fire } from './handlers';

const engine = new ECS()

engine.addSystem(new Message(".comms .content"))
engine.addSystem(new Prune())
engine.addSystem(new Refresh())
engine.addSystem(new Physics())
engine.addSystem(new Boundry(".sci canvas"))
engine.addSystem(new Render(".sci canvas"))

engine.start()

const player = new EntityBuilder()
    .assign({
        name: "NCC-1701",
        energy: 3000,
        shield: 0,
        phasar: 0,
        torpedo: 10,
        heading: randInt(360),
        speed: randInt(5),
        boundry: "wrap",
        x: randInt(1024),
        y: randInt(1024),
        sprite: new Sprite("/assets/starship.png", "--accent"),
        dirty:true // force initial refresh
    })
    .build()

player.msg = "SPOCK: Captain on deck."
engine.addEntity(player);

bindHandler("#rs-btn", "click", player, obj => obj.heading -= 5)
bindHandler("#rd-btn", "click", player, obj => obj.heading += 5)
bindHandler("#impulse-btn", "input", player, (obj, evt) => obj.speed = Number.parseFloat(evt.target.value))
bindHandler("#phasar-btn", "input", player, (obj, evt) => obj.phasar = Number.parseFloat(evt.target.value))
bindHandler("#shield-btn", "input", player, (obj, evt) => obj.shield = Number.parseFloat(evt.target.value))
bindHandler("#fire-btn", "click", { player, engine }, fire)
bindHandler("#launch-btn", "click", { player, engine }, launch)
