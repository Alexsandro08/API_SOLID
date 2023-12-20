export class UsersAlreadyExitsError extends Error {
    constructor(){
        super('E-mail already exists.')
    }
}