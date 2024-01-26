import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from '../services/check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in use case', ()=>{
    beforeEach(()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        gymsRepository =  new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInsRepository, gymsRepository)

        gymsRepository.items.push({
            id: 'gym-01',
            title: 'TypeScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-7.1827456),
            longitude: new Decimal(-35.7302272)
        })

        vi.useFakeTimers()
    })

    afterEach(()=>{
        vi.useRealTimers()
    })

    it('should be able to check in', async ()=>{
       
        const { checkIn } =  await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })

        console.log(checkIn.created_at)

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it('should not be able to check in twice in the same day', async ()=>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })

        await expect(sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })).rejects.toBeInstanceOf(Error)        
    })

    it('should be able to check in twice but in different days', async ()=>{
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })
        
        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({
            userId: 'user-01',
            gymId: 'gym-01',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })

        expect(checkIn.id).toEqual(expect.any(String))

    })

    it('should not be able to check in on distant gym', async ()=>{

        gymsRepository.items.push({
            id: 'gym-2',
            title: 'TypeScript Gym',
            description: '',
            phone: '',
            latitude: new Decimal(-6.886557),
            longitude: new Decimal(-36.0077791)
        })
    

        await expect(()=> sut.execute({
            userId: 'user-01',
            gymId: 'gym-02',
            userLatitude: -7.1827456,
            userLongitude: -35.7302272
        })).rejects.toBeInstanceOf(Error)
    })
})