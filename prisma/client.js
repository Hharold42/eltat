import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

global.prisma = prisma;

export default prisma;
