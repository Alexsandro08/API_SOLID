import { expect, describe, it, beforeEach} from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfile } from '../services/get-user-profile'
import { ResourceNotExits } from '../services/err/resource-not-exists'


let usersRepository: InMemoryUsersRepository
let sut: GetUserProfile

describe('Get User Profile Use Case', ()=>{
    beforeEach(()=>{
        usersRepository = new InMemoryUsersRepository()
        sut = new GetUserProfile(usersRepository)
    })

    it('should be able to get user profile', async ()=>{
        const createdUser = await usersRepository.create({
            name: 'Alex Edu',
            email: 'fulano@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } =  await sut.execute({
            userId: createdUser.id
        })
        
        expect(user.id).toEqual(expect.any(String))
        expect(user.name).toEqual('Alex Edu')
    })

    it('should not be able to get user profile with wrong id', async ()=>{
        await expect(()=> sut.execute({
            userId: 'non-existing-id'
        })).rejects.toBeInstanceOf(ResourceNotExits)
    })

})