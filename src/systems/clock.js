import { System } from "../lib";

export class Clock extends System {
    constructor() {
        super("stardate")
    }

    update(timestamp, entity) {
        if (timestamp > entity._next) {
            entity.stardate += 0.1
            entity.missiondate -= 0.1
            entity._next = timestamp + 5000
        }
    }
}
