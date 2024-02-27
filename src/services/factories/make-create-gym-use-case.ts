import { CreateGymUseCase } from '../create-gym'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

export function makeCreateGymUseCase(){
    const gymsInsRepository = new PrismaGymsRepository()
    const useCase = new CreateGymUseCase(gymsInsRepository)

    return useCase
}