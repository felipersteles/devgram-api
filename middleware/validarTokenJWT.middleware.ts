import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg.type";
import jwt, { JwtPayload } from "jsonwebtoken";

//essa funcao dispara
export const validarTokenJWT =
  (handler: NextApiHandler) =>
  (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
      const { CHAVE_JWT } = process.env;
      if (!CHAVE_JWT)
        return res.status(500).json({ erro: "ENV chave JWT não informada." });

      if (!req || !req.headers)
        return res
          .status(401)
          .json({ erro: "Não foi possivel validar o token de acesso." });

      //options recupera informações do serviço
      if (req.method !== "OPTIONS") {
        const authorization = req.headers["auth-user"];
        if (!authorization)
          return res
            .status(401)
            .json({ erro: "Não foi possivel validar o authorization." });
        //console.log(authorization);

        const token = authorization.toString();
        if (!token) return res.status(401).json({ erro: "Problema no token" });

        const decoded = jwt.verify(token, CHAVE_JWT) as JwtPayload;
        if (!decoded)
          return res.status(401).json({ erro: "Problema no decoded" });
        //console.log(decoded)

        if (!req.query) req.query = {};

        req.query.userId = decoded._id;
      }
    } catch (e) {
        console.log(e);
        return res.status(401).json({erro: 'Nao foi possivel validar o token de acesso'});  
    }

    return handler(req, res);
  };
