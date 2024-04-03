import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roletoVerify: 'ADMIN' | 'MEMBER' ) {
    return async (req: FastifyRequest, res: FastifyReply) => {
        const { role } = req.user

        if(role !== roletoVerify){
            return res.status(401).send({ message: 'Unauthorized.' })
        }
    }  
}
