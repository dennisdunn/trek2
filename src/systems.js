import { System } from "./ecs";
import { deg2Radian, randInt, randTween } from './tools'

/**
 * Remove all entities that have a {dead:true} component.
 */
export class Prune extends System {
    constructor() {
        super();
    }

    init(engine) {
        engine.entities = engine.entities.filter(entity => !entity.dead)
    }
}

/**
 * Add messages to the comms panel.
 */
export class Logger extends System {
    constructor(el) {
        super({ msg: null });
        this.container = el;
        this._msgs = []
    }
    _createLine(text) {
        const el = document.createElement('div');
        el.innerText = text;
        return el;
    }
    update(ts, entity) {
        if (entity.msg) {
            this._msgs.unshift(entity.msg)
            entity.msg = null;
            const msgs = this._msgs.map(this._createLine)
            this.container.replaceChildren(...msgs)
        }
    }
}

export class Render extends System {
    constructor(canvas) {
        super({ x: 0, y: 0, icon: null });
        this.canvas = canvas;
    }

    init(_) {
        this._ctx = this.canvas.getContext('2d');
        const parent = this.canvas.parentElement; // handle resizing the window
        this.canvas.width = parent.clientWidth - 32; // minus the parent padding
        this._ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    update(_, entity) {
        if (entity.icon) {
            const { width, height } = entity.icon;
            this._ctx.save();
            this._ctx.translate(entity.x, entity.y);
            this._ctx.rotate(deg2Radian(entity.heading));
            this._ctx.drawImage(entity.icon, -width / 2, -height / 2, width, height);
            if (entity.id) {
                this._ctx.rotate(deg2Radian(-entity.heading));
                this._ctx.font = '12px Arial'
                const text = this._ctx.measureText(entity.id);
                this._ctx.fillText(entity.id, (-width / 2) - text.width / 8, (-height / 2) - 8);
            }
            this._ctx.restore();
        }
    }
}

export class Boundry extends System {
    constructor(canvas) {
        super({ x: 0, y: 0 });
        this.canvas = canvas;
    }

    _outOfBounds(entity) {
        return entity.x < 0 || entity.y < 0 || entity.x > this.canvas.width || entity.y > this.canvas.height;
    }

    _getDirection(heading) {
        return heading > 45 && heading <= 135
            ? 'e'
            : heading > 135 && heading <= 225
                ? 's'
                : heading > 225 && heading <= 315
                    ? 'w'
                    : 'n'
    }

    /** clamp x,y to the canvas */
    _clamp(entity) {
        if (entity.x < 0) {
            entity.x = 0
        } else if (entity.x > this.canvas.width) {
            entity.x = this.canvas.width
        }
        if (entity.y < 0) {
            entity.y = 0
        } else if (entity.y > this.canvas.height) {
            entity.y = this.canvas.height
        }
    }

    update(_, entity) {
        if (this._outOfBounds(entity)) {
            switch (entity.boundry) {
                case 'wrap':
                case 'torus':
                    entity.x = entity.x < 0 ? this.canvas.width - entity.icon.width : entity.x;
                    entity.x = entity.x > this.canvas.width + entity.icon.width ? 0 : entity.x;
                    entity.y = entity.y < 0 ? this.canvas.height : entity.y;
                    entity.y = entity.y > this.canvas.height + entity.icon.height ? 0 : entity.y;
                    break;
                case 'bounce':
                    switch (this._getDirection(entity.heading)) {
                        case 'n':
                            entity.heading = randTween(45, 315)
                            break;
                        case 'e':
                            entity.heading = randTween(135, 405) % 360
                            break;
                        case 's':
                            entity.heading = randTween(225, 495) % 360
                            break
                        case 'w':
                            entity.heading = randTween(315, 585) % 360
                            break;
                    }
                    this._clamp(entity)
                    break;
                default:
                    entity.dead = true;
                    break;
            }
        }
    }
}

export class Physics extends System {
    constructor() {
        super({ x: 0, y: 0, speed: 0, heading: 0 })
    }
    update(_, entity) {
        if (entity.speed > 0) {
            entity.x += entity.speed * Math.cos((Math.PI / 180) * (entity.heading - 90));
            entity.y += entity.speed * Math.sin((Math.PI / 180) * (entity.heading - 90));
        }
    }
}

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

/**
 * Remove an entity if the current time > entity.ttl.
 */
export class Ageout extends System {
    constructor() {
        super({ ttl: 0 })
    }

    update(t, entity) {
        if (t >= entity.ttl) {
            entity.dead = true
        }
    }
}