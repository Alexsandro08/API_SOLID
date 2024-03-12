import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/services/factories/make-get-user-metrics-use-case'

export async function metrics (req: FastifyRequest, res: FastifyReply) {
    
    const getUserMetricsUseCase = makeGetUserMetricsUseCase()
        
    const { checkInsCount } = await getUserMetricsUseCase.execute({
        userId: req.user.sub,
    })

    return res.status(201).send({
        checkInsCount
    })
}