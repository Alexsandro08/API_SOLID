import { FastifyInstance } from 'fastify'
import { register } from './register'
import { auhtenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { refresh } from './refresh'

export async function usersRoutes(app: FastifyInstance){
    app.post('/users', register)
    app.post('/sessions', auhtenticate)

    app.patch('/token/refresh', refresh)

    app.get('/me', { onRequest: [verifyJWT] }, profile)
}