import Fastify from 'fastify';
import cors from '@fastify/cors';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import ShortUniqueId from 'short-unique-id';

const prisma = new PrismaClient({
    log: ['query'],
});

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });
    //esse logger faz com que vai soltando logs de td oq vai acontecendo na aplicação, erro, 
    //cada requisição, cada resposta..


    await fastify.register(cors, {
        origin: true
    });
    //no origin, ao subir a aplicação, normalmente fica o domínio hospedado do frontEnd


    //https://localhost:3333/
    fastify.get('/pools/count', async () => {
        // const pool = await prisma.pool.findMany({
        //     where: {
        //         code: {
        //             startsWith: 'A'
        //         }
        //     }
        // })

        const count = await prisma.pool.count();

        return { count }
    });

    fastify.get('/users/count', async () => {
        const count = await prisma.user.count();

        return { count }
    });

    fastify.get('/guesses/count', async () => {

        const count = await prisma.guess.count();

        return { count }
    });

    fastify.post('/pools', async (request, reply) => {
        const createPoolBody = z.object({
            title: z.string(),
        })
        //se aceitasse null, seria z.string().nullable

        try {
            const { title } = createPoolBody.parse(request.body);

            const generate = new ShortUniqueId({ length: 6 });
            const code = String(generate()).toUpperCase();

            await prisma.pool.create({
                data: {
                    title,
                    code
                }
            });

            return reply.status(201).send({ code });
        } catch(err) {
            return reply.status(500).send(err);
        }
    });

    await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ });
    //o host eh um ajuste pra funcionar na aplicação mobile
}       
    
bootstrap();         