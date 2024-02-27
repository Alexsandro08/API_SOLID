import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, findManyNearbyParms } from '../gyms-repository'
import { prisma } from '@/lib/prisma'

export class PrismaGymsRepository implements GymsRepository {

    async findById(id: string) {
        const gyms = await prisma.gym.findUnique({
            where: {
                id,
            }
        })

        return gyms
    }

    async findManyNearby({ latitude, longitude }: findManyNearbyParms){
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * FROM gyms
            WHERE (6371 * acos( cos(radians(${latitude})) * cos( radians( latitude )) * cos( radians( longitude ) - radians(${longitude})) + sin(radians(${latitude})) * sin( radians( latitude )))) <= 10
        `
     
        return gyms
    }

    async create(data: Prisma.GymCreateInput){
        const gyms = await prisma.gym.create({
            data,
        })

        return gyms
    }

    async searchMany(query: string, page: number) {
        const gyms = await prisma.gym.findMany({
            where: {
                title: {
                    contains: query
                }
            },
            take: 20,
            skip: (page -1) * 20
        })
        
        return gyms
    }
           
}
