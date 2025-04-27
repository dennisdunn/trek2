/**
 * Entity-Component-System
 * 
 * An entity is a js Object while components are properties of the object.
 */

export class System {
    constructor(...keys) {
        this._requiredKeys = keys;
        // this._engine = null;
    }

    /** Run each tick before updating entities. */
    beforeupdate(timestamp, engine) { }

    /** Run for each entity */
    update(timstamp, entity) { }

    /** Run each tick after updating entities. */
    afterupdate(timestamp, engine) { }

    // todo: this needs to go somewhere else
    getStyle(property, selector = "body") {
        const el = document.querySelector(selector)
        return getComputedStyle(el).getPropertyValue(property)
    }
}

export class ECS {
    constructor() {
        this._systems = [];
        this._entities = [];
        this._running = false;
    }

    _canUpdate(requiredKeys, entity) {
        let retVal = true;
        const keys = Object.keys(entity);
        requiredKeys.forEach(requiredKey => {
            if (!keys.includes(requiredKey)) {
                retVal = false;
            }
        });
        return retVal;
    }

    _tick(timestamp) {
        if (this._running) {
            this._systems.forEach(system => {
                system.beforeupdate(timestamp, this);
                const entities = this._entities.filter(entity => this._canUpdate(system._requiredKeys, entity));
                entities.forEach(entity => {
                    system.update(timestamp, entity)
                });
                system.afterupdate(timestamp, this);
            });
            requestAnimationFrame(timestamp => this._tick(timestamp))
        }
    }

    /** Runtime control */

    start() {
        this._running = true;
        requestAnimationFrame(timestamp => this._tick(timestamp))
    }

    stop() {
        this._running = false;
    }

    toggle() {
        if (this._running) {
            this.stop()
        } else {
            this.start()
        }
    }

    /** Systems management */

    addSystem(system) {
        if (!this._systems.includes(system)) {
            this._systems.push(system)
            system._engine = this;
        }
    }

    removeSystem(system) {
        const idx = this._systems.indexOf(system)
        if (idx >= 0) {
            this._systems.splice(idx, 1)
        }
    }

    /** Entity management */

    addEntity(entity) {
        if (!this._entities.includes(entity)) {
            this._entities.push(entity)
        }
    }

    removeEntity(entity) {
        const idx = this._entities.indexOf(entity)
        if (idx >= 0) {
            this._entities.splice(idx, 1)
        }
    }
}
