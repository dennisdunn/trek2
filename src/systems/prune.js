import { System } from "../lib"

/**
 * Remove all entities that have a {dead:true} component.
 */
export class Prune extends System {
    constructor() {
        super("dead");
    }

    update(_, entity) {
        if (entity.dead) {
            this._engine.removeEntity(entity)
        }
    }
}

export default Prune