import { expect, describe, it, beforeEach, } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from '@/services/fetch-nearby-gyms'


let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch nearby Gyms use case', ()=>{
    beforeEach( async ()=>{
        gymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase (gymsRepository)
    })


    it('should be able to fetch nearby gyms', async ()=>{
        await gymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -7.1827456,
            longitude: -35.7302272

        })
       
        await gymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: - -7.0301955,
            longitude: -35.6187724
        })

        const { gyms } =  await sut.execute({
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym'}),
        ])
    })
})