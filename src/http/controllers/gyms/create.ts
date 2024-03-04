import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeCreateGymUseCase } from '@/services/factories/make-create-gym-use-case'

export async function create (req: FastifyRequest, res: FastifyReply) {
    
    const createBodySchema = z.object({
        title: z.string(),
        description: z.string().nullable(),
        phone: z.string().nullable(),
        latitude: z.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        longitude: z.number().refine(value => {
            return Math.abs(value) <= 180
        })
    })

    const { title, description, phone, latitude, longitude } = createBodySchema.parse(req.body)

    const createGymUseCase = makeCreateGymUseCase()
        
    await createGymUseCase.execute({
        title,
        description,
        phone,
        latitude,
        longitude
    })

    return res.status(201).send()
}