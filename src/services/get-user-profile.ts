import { UsersRepository } from '@/repositories/users-repository'
import { User } from '@prisma/client'
import { ResourceNotExits } from './err/resource-not-exists'


interface GetUserProfileUseCaseRequest{
    userId: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfile {
    constructor(
        private usersRepository: UsersRepository
    ){}

    async execute({
        userId
    }: GetUserProfileUseCaseRequest):Promise<GetUserProfileUseCaseResponse>{

        const user = await this.usersRepository.findById(userId)

        if(!user){
            throw new ResourceNotExits()
        }

        return { 
            user
        }
    }
}