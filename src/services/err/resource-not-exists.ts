export class ResourceNotExits extends Error {
    constructor(){
        super('Resource Not Found.')
    }
}