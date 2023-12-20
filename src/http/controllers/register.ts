import { UsersAlreadyExitsError } from '@/services/err/user-already-exists'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUseCase } from '@/services/register'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register (req: FastifyRequest, res: FastifyReply) {
    
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password } = registerBodySchema.parse(req.body)

    try {
        const usersRepository = new PrismaUsersRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)
        
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