import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/services/factories/make-search-gyms-use-case'

export async function search (req: FastifyRequest, res: FastifyReply) {
    
    const searchGymsQuerySchema = z.object({
        query: z.string(),
        page: z.coerce.number().min(1).default(1)
    })

    const { query, page } = searchGymsQuerySchema.parse(req.query)

    const searchGymsUseCase = makeSearchGymsUseCase()
        
    const { gyms } = await searchGymsUseCase.execute({
        query,
        page
    })

    return res.status(201).send({
        gyms
    })
}