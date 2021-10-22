import { prismaClient } from '../prisma';

class GetLast3MessagesService {

  async execute() {

    const messages = await prismaClient.message.findMany({
      take: 3,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
      }
    });

    return messages;
  }
}

export { GetLast3MessagesService };