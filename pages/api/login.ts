
import type { NextApiRequest, NextApiResponse } from 'next';
import { conectMongoDB } from '../../middleware/conectMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg.type';

const endpointLogin = (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    //login é um post
    if (req.method === 'POST') {
        const { login, senha } = req.body
        
        if (login === 'exemplo@admin.com' && senha === 'exemplo123') {
            return res.status(200).json({msg: 'Usuário autenticado com sucesso :)'})
        }

        return res.status(405).json({erro: 'Usuário ou senha não encontrado!'});
    }

    //console.log(req.method)
    return res.status(405).json({erro: 'Método informado não é válido :/'})
}

//primeiro passa no middleware dps no endpoint
export default conectMongoDB(endpointLogin);