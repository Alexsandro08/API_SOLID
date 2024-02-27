import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { auhtenticate } from './controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRouter(app: FastifyInstance){
    app.post('/users', register)
    app.post('/sessions', auhtenticate)

    app.get('/me', { onRequest: [verifyJWT] }, profile)
}