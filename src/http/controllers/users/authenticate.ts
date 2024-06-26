import { FastifyReply, FastifyRequest } from 'fastify'
import { InvalidCredentialsError } from '@/services/err/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/services/factories/make-authenticate-use-case'
import { z } from 'zod'

export async function auhtenticate (req: FastifyRequest, res: FastifyReply) {
    
    const auhtenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = auhtenticateBodySchema.parse(req.body)

    try {
        const authenticateUseCase = makeAuthenticateUseCase()
        
        const { user } = await authenticateUseCase.execute({
            email,
            password
        })

        const token = await res.jwtSign(
            {
                role: user.role
            }, {
                sign: {
                    sub: user.id
                }
            }) 

        const refreshToken = await res.jwtSign(
            {
                role: user.role
            }, {
                sign: {
                    sub: user.id,
                    expiresIn: '7d'
                }
            }) 
        
        return res
            .setCookie('refreshToken', refreshToken, {
                path: '/',
                secure: true,
                sameSite: true,
                httpOnly: true
            })
            .status(200).send({
                token
            }) 

    } catch (err) {
        if(err instanceof InvalidCredentialsError){
            return res.status(400).send({ message: err.message })
        }

        throw err 
    }

    
}