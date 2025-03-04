import {PrismaClient} from '@prisma/client'

declare global {
    //@ts-ignore
    var prisma: PrismaClient | undefined
}

export const client = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = client