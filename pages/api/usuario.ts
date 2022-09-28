
import type { NextApiRequest, NextApiResponse } from "next";
import { validarTokenJWT } from "../../middleware/validarTokenJWT.middleware";

const usuarioEndPoint = (req: NextApiRequest, res: NextApiResponse) => {

    return res.status(200).json('Usuario autenticado com sucesso!')
}


export default validarTokenJWT(usuarioEndPoint);
