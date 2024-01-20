import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { auhtenticate } from './controllers/authenticate'

export async function appRouter(app: FastifyInstance){
    app.post('/users', register)
    app.post('/sessions', auhtenticate)
}