import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from '@/services/validate-check-in'
import { ResourceNotExits } from '@/services/err/resource-not-exists'


let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in use case', ()=>{
    beforeEach( async ()=>{
        checkInsRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInsRepository)

        vi.useFakeTimers()
    })

    afterEach(()=>{
        vi.useRealTimers()
    })

    it('should be able to validate the check in', async ()=>{
        const createCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createCheckIn.id,
            userId: ''
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate an inexistent check in', async ()=>{
        await expect (()=> sut.execute({
            checkInId: 'inextistent-id',
            userId: ''
        })).rejects.toBeInstanceOf(ResourceNotExits)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async ()=>{
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createCheckIn = await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: 'user-01'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(()=> sut.execute({
            checkInId: createCheckIn.id,
            userId: ''
        })).rejects.toBeInstanceOf(Error)
    })
})