import { System } from "../lib"

export class Refresh extends System {
    constructor() {
        super("dirty")
    }

    _refresh(name, value) {
        const els = document.getElementsByName(name)
        els.forEach(el => {
            const suffix = el.getAttribute("data-suffix")
            const fixed = el.getAttribute("data-fixed")
            const val = fixed ? value.toFixed(fixed) : value
            const suf = suffix ? `&nbsp;${suffix}` : ""
            el.innerHTML = `${val}${suf}`
        });
    }

    update(_, entity) {
        const names = Object.keys(entity).filter(property => !property.startsWith("_"))
        names.forEach(name => {
            this._refresh(name, entity[name])
        });
        delete entity.dirty
    }
}

export default Refresh