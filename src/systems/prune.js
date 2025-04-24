import { System } from "../lib"

/**
 * Remove all entities that have a {dead:true} component.
 */
export class Prune extends System {
    constructor() {
        super("dead");
    }

    init(engine) {
        engine.entities = engine.entities.filter(entity => !entity.dead)
    }
}

export default Prune