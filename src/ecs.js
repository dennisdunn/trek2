/**
 * Entity-Component-System
 */

export class System {
    constructor(template) {
        this.propNames = Object.keys(template);
    }

    /** Run each tick before updating entities. */
    init() { }

    _canUpdate(entity) {
        let retVal = true;
        const keys = Object.keys(entity);
        this.propNames.forEach(propName => {
            if (!keys.includes(propName)) {
                retVal = false;
            }
        });
        return retVal;
    }

    _tick(timestamp, entity) {
        if (this.update && this._canUpdate(entity)) {
            this.update(timestamp, entity);
        }
    }
}

export class ECS {
    constructor() {
        this.systems = [];
        this.entities = [];
        this._running = false;
    }
    start() {
        this._running = true;
        requestAnimationFrame(timestamp => this._tick(timestamp))
    }

    stop() {
        this._running = false;
    }

    isRunning() {
        return this._running;
    }

    _tick(timestamp) {
        if (this._running) {
            this.entities = this.entities.filter(entity => !entity.dead) // prune
            this.systems.forEach(system => {
                system.init();
                this.entities.forEach(entity => {
                    system._tick(timestamp, entity)
                });
            });
            requestAnimationFrame(timestamp => this._tick(timestamp))
        }
    }
}

const instance = new ECS();
export default instance;