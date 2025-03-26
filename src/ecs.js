/**
 * Entity-Component-System
 */

export class System {
    constructor(template, updater) {
        this.propNames = Object.keys(template);
        this.update = updater;
    }
    
    _canUpdate(entity) {
        const keys = Object.keys(entity);
        this.propNames.forEach(propName => {
            if (!keys.includes(propName)) {
                return false;
            }
        });
        return true;
    }

    _tick(timestamp, entity) {
        if (this._canUpdate(entity)) {
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
            this.systems.forEach(system => {
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