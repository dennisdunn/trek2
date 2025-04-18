import { System } from "../lib"

const collides = (a, b) => {
    const distance = Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    return distance <= 20
}

/** 
 * Torpedo/phasar collisions
 */
export class Collision extends System {
    constructor() {
        super({ x: 0, x: 0, shield: 0, energy: 0 })
        this._weapons = []
    }
    init(engine) {
        this._weapons = engine.getAllByKeys(['yield'])
    }
    update(_, entity) {
        if (!this._weapons.includes(entity)) {
            this._weapons.forEach(weapon => {
                if (collides(weapon, entity)) {
                    weapon.dead = true
                    if (entity.shield > 0) {
                        const boom = 0.5 * weapon.yield
                        entity.shield -= boom
                        // entity.msg = `SULU: ${boom} hit on ${entity.id}`
                    } else {
                        entity.energy -= weapon.yield
                        // entity.msg = `SULU: ${weapon.yield} hit on ${entity.id}`
                    }
                    if (entity.energy <= 0) {
                        entity.msg = `SULU: ${entity.id} has been destroyed.`
                        entity.dead = true
                    }
                }
            });
        }
    }
}

export default Collision