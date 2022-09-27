
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import mongoose from 'mongoose';

export const conectMongoDB = (handler: NextApiHandler) => 
    async (req: NextApiRequest, res: NextApiResponse) => {
        //verifica se o banco esta conectado
        if (mongoose.connections[0].readyState) return handler(req, res);//pelo menos uma conexao
    
        //caso nao, obtem a variavel e conecta
        const { DB_CONECTION } = process.env
        if (!DB_CONECTION) return res.status(500).json({ erro: 'ENV de configuração do banco não informado!' })
        
        mongoose.connection.on('connected', () => console.log('Conectado ao mongoDB'))
        mongoose.connection.on('error', () => console.log('Conectado ao mongoDB'))

        //await so passa pra proxima linha dps que receber
        //o resultado da promessa
        await mongoose.connect(DB_CONECTION); //devolve uma promessa
        return handler(req, res); //segue para o endpoint
    }


    //após configuração tem que plugar o middleware