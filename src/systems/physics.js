import { System } from "../lib"

export class Physics extends System {
    constructor() {
        super("x", "y", "speed", "heading")
    }
    update(_, entity) {
        if (entity.speed > 0) {
            entity.x += entity.speed * Math.cos((Math.PI / 180) * (entity.heading - 90));
            entity.y += entity.speed * Math.sin((Math.PI / 180) * (entity.heading - 90));
        }
    }
}

export default Physics