import { PrismaClient } from '@/generated/prisma';

const dbClient = new PrismaClient();

export default dbClient;
