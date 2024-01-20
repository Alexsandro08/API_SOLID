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
        
        await authenticateUseCase.execute({
            email,
            password
        })

    } catch (err) {
        if(err instanceof InvalidCredentialsError){
            return res.status(400).send({ message: err.message })
        }

        throw err 
       
    }

    return res.status(200).send()
}