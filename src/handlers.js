import { Sprite } from "./lib"

export const launch = (obj) => {
    if (obj.player.torpedo) {
        obj.player.torpedo--
        obj.engine.addEntity({
            "x": obj.player.x,
            "y": obj.player.y,
            "heading": obj.player.heading,
            "speed": obj.player.speed + 2,
            "yield": 10,
            "sprite": new Sprite("/assets/torpedo.png", "--accent", 0.4)
        })
    } else {
        obj.player.msg = "SULU: Torpedo tubes are empty!"
    }
}

export const fire = (obj) => {
    if (obj.player.energy >= obj.player.phasar) {
        obj.player.energy -= obj.player.phasar
        obj.engine.addEntity({
            "x": obj.player.x,
            "y": obj.player.y,
            "heading": obj.player.heading,
            "speed": 5,
            "yield": 10,
            "sprite": new Sprite("/assets/phasar.png", "--accent", 0.2)
        })
    } else {
        obj.player.msg = "SCOTT: Insufficient energy for phasars!"
    }
}
