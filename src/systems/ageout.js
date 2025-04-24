import { System } from "../lib"

/**
 * Remove an entity if the current time > entity.ttl.
 */
export class Ageout extends System {
    constructor() {
        super("ttl")
    }

    update(t, entity) {
        if (t >= entity.ttl) {
            this._engine.removeEntity(entity)
        }
    }
}

export default Ageout