import { expect, describe, it, beforeEach} from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from '@/services/create-gym'


let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create gym use case', ()=>{
    beforeEach(()=>{
        gymsRepository = new InMemoryGymsRepository()
        sut = new CreateGymUseCase(gymsRepository)
    })

    it('should be able to create gym', async ()=>{

        const { gym } =  await sut.execute({
            title: 'TypeScript Gym',
            description: null,
            phone: null,
            latitude: -7.1827456,
            longitude: -35.7302272

        })

        expect(gym.id).toEqual(expect.any(String))
    })

})