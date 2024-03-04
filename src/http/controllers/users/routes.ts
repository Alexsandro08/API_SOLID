import { FastifyInstance } from 'fastify'
import { register } from './register'
import { auhtenticate } from './authenticate'
import { profile } from './profile'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance){
    app.post('/users', register)
    app.post('/sessions', auhtenticate)

    app.get('/me', { onRequest: [verifyJWT] }, profile)
}