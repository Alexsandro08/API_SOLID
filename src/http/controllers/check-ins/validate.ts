import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeValidateCheckInUseCase } from '@/services/factories/make-validate-check-in-use-case'

export async function validate (req: FastifyRequest, res: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid()
    })
    
    const { checkInId } = validateCheckInParamsSchema.parse(req.params)

    const validateCheckInUseCase = makeValidateCheckInUseCase()
        
    await validateCheckInUseCase.execute({
        userId: req.user.sub,
        checkInId
    })

    return res.status(204).send()
}