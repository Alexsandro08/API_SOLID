import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { AuthenticateUseCase } from '@/services/authenticate'
import { InvalidCredentialsError } from '@/services/err/invalid-credentials-error'

export async function auhtenticate (req: FastifyRequest, res: FastifyReply) {
    
    const auhtenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = auhtenticateBodySchema.parse(req.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const authenticateUseCase = new AuthenticateUseCase(usersRepository)
        
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