/**
 * Entity-Component-System
 */

export class System {
    constructor(template) {
        this.requiredKeys = Object.keys(template || {});
    }

    /** Run each tick before updating entities. */
    init(engine) { }

    /** Run for each entity */
    update(timstamp, entity) { }
}

export class ECS {
    constructor() {
        this.systems = [];
        this.entities = [];
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

    start() {
        this._running = true;
        requestAnimationFrame(timestamp => this.update(timestamp))
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

    getById(id) {
        return this.entities.find(entity => entity.id === id)
    }

    getBy(prop, value) {
        return this.entities.find(entity => entity[prop] === value)
    }

    getAllBy(prop, value) {
        return this.entities.filter(entity => entity[prop] === value)
    }

    getAllByKeys(requiredKeys) {
        return this.entities.filter(entity => this._canUpdate(requiredKeys, entity));
    }

    update(timestamp) {
        if (this._running) {
            this.systems.forEach(system => {
                system.init(this);
                this.getAllByKeys(system.requiredKeys).forEach(entity => {
                    system.update(timestamp, entity)
                });
            });
            requestAnimationFrame(timestamp => this.update(timestamp))
        }
    }
}

const instance = new ECS();
export default instance;