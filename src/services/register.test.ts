import { expect, describe, it, beforeEach} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersAlreadyExitsError } from './err/user-already-exists'

let usersRepository: InMemoryRepository
let sut: RegisterUseCase

describe('Register use case', ()=>{
    beforeEach(()=>{
        usersRepository = new InMemoryRepository()
        sut = new RegisterUseCase(usersRepository)
    })

    it('should be able to register', async ()=>{
        

        const { user } =  await sut.execute({
            name: 'Fulano Silva',
            email: 'fulano@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hase user password upon registration', async ()=>{


        const { user } =  await sut.execute({
            name: 'Fulano Silva',
            email: 'fulano@example.com',
            password: '123456'
        })

        const isPasswordCorrectlyHashed = await compare(
            '123456',
            user.password_hash
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('should not be able to register with same email twice', async ()=>{
     

        const email = 'fulano@example.com'

        await sut.execute({
            name: 'Fulano Silva',
            email: email,
            password: '123456'
        })

        await expect(()=>
            sut.execute({
                name: 'Fulano Silva',
                email: email,
                password: '123456'
            })

        ).rejects.toBeInstanceOf(UsersAlreadyExitsError)
    })
})