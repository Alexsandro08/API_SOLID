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

        const tokken = await res.jwtSign({}, {
            sign: {
                sub: user.id
            }
        }) 
        
        return res.status(200).send({
            tokken
        })

    } catch (err) {
        if(err instanceof InvalidCredentialsError){
            return res.status(400).send({ message: err.message })
        }

        throw err 
    }

    
}