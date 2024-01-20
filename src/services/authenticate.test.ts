import { expect, describe, it} from 'vitest'
import { InMemoryRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './err/invalid-credentials-error'


describe('Authenticate use case', ()=>{

    it('should be able to authenticate', async ()=>{
        const usersRepository = new InMemoryRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'Alex Edu',
            email: 'fulano@example.com',
            password_hash: await hash('123456', 6)
        })

        const { user } =  await sut.execute({
            email: 'fulano@example.com',
            password: '123456'
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async ()=>{
        const usersRepository = new InMemoryRepository()
        const sut = new AuthenticateUseCase(usersRepository)
        
        expect(()=> sut.execute({
            email: 'fulano@example.com',
            password: '123456'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)

    })

    it('should not be able to authenticate with wrong password', async ()=>{
        const usersRepository = new InMemoryRepository()
        const sut = new AuthenticateUseCase(usersRepository)

        await usersRepository.create({
            name: 'Alex Edu',
            email: 'fulano@example.com',
            password_hash: await hash('123456', 6)
        })
        
        expect(()=> sut.execute({
            email: 'fulano@example.com',
            password: '654321'
        })).rejects.toBeInstanceOf(InvalidCredentialsError)

    })
 
})