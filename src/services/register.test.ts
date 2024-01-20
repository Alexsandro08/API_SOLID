import { expect, describe, it} from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UsersAlreadyExitsError } from './err/user-already-exists'

describe('Register use case', ()=>{

    it('should be able to register', async ()=>{
        const usersRepository = new InMemoryRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } =  await registerUseCase.execute({
            name: 'Fulano Silva',
            email: 'fulano@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should hase user password upon registration', async ()=>{
        const usersRepository = new InMemoryRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const { user } =  await registerUseCase.execute({
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
        const usersRepository = new InMemoryRepository()
        const registerUseCase = new RegisterUseCase(usersRepository)

        const email = 'fulano@example.com'

        await registerUseCase.execute({
            name: 'Fulano Silva',
            email: email,
            password: '123456'
        })

        await expect(()=>
            registerUseCase.execute({
                name: 'Fulano Silva',
                email: email,
                password: '123456'
            })

        ).rejects.toBeInstanceOf(UsersAlreadyExitsError)
    })
})