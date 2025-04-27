export class Entity {

    set(property, value) {
        this[property] = value
        this.dirty = true
        return this
    }

    get(property) {
        return this[property]
    }
}

/** Registers properties with setters that set the dirty flag of the entity. */
export class EntityBuilder {
    constructor() {
        this.entity = new Entity()
    }

    register(...properties) {
        properties.forEach(property => {
            if (!property.startsWith("_")) {
                Object.defineProperty(this.entity, property, {
                    set: function (value) {
                        this[`_${property}`] = value
                        this.dirty = true
                        return this
                    },
                    get: function () {
                        return this[`_${property}`]
                    },
                    enumerable: true
                })
            }
        });
        return this
    }

    set(property, value) {
        this.register(property)
        this.entity.set(property, value)
        return this
    }

    assign(object) {
        const keys = Object.keys(object)
        this.register(...keys)
        Object.assign(this.entity, object)
        return this
    }

    build() {
        return this.entity
    }
}

export default Entity
