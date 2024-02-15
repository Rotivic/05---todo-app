import { v4 as uuid } from 'uuid';

export class Todo {

    /**
     * Creación de una nueva instancia de tarea
     * @param {String} description Descripción de la tarea
     */
    constructor( description ){
        this.id = uuid();
        this.description = description;
        this.done = false;
        this.createdAt = new Date();
    }

}