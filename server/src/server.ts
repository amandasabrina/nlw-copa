import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';

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

    await fastify.listen({ port: 3333, /*host: '0.0.0.0'*/ });
    //o host eh um ajuste pra funcionar na aplicação mobile
}       
    
bootstrap();         