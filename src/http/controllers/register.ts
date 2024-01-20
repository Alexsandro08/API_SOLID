import { UsersAlreadyExitsError } from '@/services/err/user-already-exists'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeRegisterUseCase } from '@/services/factories/make-register-use-case'

export async function register (req: FastifyRequest, res: FastifyReply) {
    
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
        const registerUseCase = makeRegisterUseCase()
        
        await registerUseCase.execute({
            name,
            email,
            password
        })

    } catch (err) {
        if(err instanceof UsersAlreadyExitsError){
            return res.status(409).send({ message: err.message })
        }

        throw err 
       
    }

    return res.status(201).send()
}