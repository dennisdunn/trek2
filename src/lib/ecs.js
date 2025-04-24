/**
 * Entity-Component-System
 * 
 * An entity is a js Object while components are properties of the object.
 */

export class System {
    constructor(...keys) {
        this._requiredKeys = keys;
        this._engine = null;
    }

    /** Run each tick before updating entities. */
    beforeupdate() { }

    /** Run for each entity */
    update(timstamp, entity) { }

    /** Run each tick after updating entities. */
    afterupdate() { }
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
                system.beforeupdate();
                this.getAllByKeys(system._requiredKeys).forEach(entity => {
                    system.update(timestamp, entity)
                });
                system.afterupdate();
            });
            requestAnimationFrame(timestamp => this._tick(timestamp))
        }
    }

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

    isRunning() {
        return this._running;
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

    getById(id) {
        return this._entities.find(entity => entity.id === id)
    }

    getBy(prop, value) {
        return this._entities.find(entity => entity[prop] === value)
    }

    getAllBy(prop, value) {
        return this._entities.filter(entity => entity[prop] === value)
    }

    getAllByKeys(requiredKeys) {
        return this._entities.filter(entity => this._canUpdate(requiredKeys, entity));
    }
}
