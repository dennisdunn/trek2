import { System } from "./ecs";
import { deg2Radian } from './tools'

/**
 * Remove dead entities.
 */
export class Prune extends System {
    constructor(){
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
    }
    update(ts, entity) {
        if (entity.msg) {
            const el = document.createElement('div');
            el.append(`${ts.toFixed(1)} ${entity.msg}`);
            this.container.append(el);
            entity.msg = null;
        }
    }
}

export class Render extends System {
    constructor(canvas) {
        super({ x: 0, y: 0, icon: null });
        this.canvas = canvas;
    }

    init() {
        this._ctx = this.canvas.getContext('2d');
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth-32;
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
                this._ctx.fillText(entity.id, (-width / 2 )-text.width/8 , (-height / 2)-8);
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
                    entity.heading += entity.heading < 180 ? 180 : -180;
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