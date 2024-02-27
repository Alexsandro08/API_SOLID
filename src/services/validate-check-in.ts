import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotExits } from './err/resource-not-exists'
import dayjs from 'dayjs'
import { LateCheckInValidationError } from './err/late-check-in-validation-error'



interface ValidateCheckInUseCaseRequest{
    userId: string
    checkInId: string
}

interface ValidateCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidateCheckInUseCase {
    constructor(
       private checkInsRepository: CheckInsRepository,
    ){}

    async execute({
        checkInId
    }: ValidateCheckInUseCaseRequest):Promise<ValidateCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if(!checkIn){
            throw new ResourceNotExits()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes',
        )

        if(distanceInMinutesFromCheckInCreation > 20){
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return { 
            checkIn
        }
    }
}