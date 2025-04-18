import { System } from "../lib/ecs";
import {  randTween } from '../lib/tools'

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

export default Boundry