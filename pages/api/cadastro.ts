import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg.type";
import type { CadastroRequisicao } from "../../types/CadastroRequisicao.type";
import { UsuarioModel } from "../../models/UsuarioModel";
import md5 from "md5";

import { conectMongoDB } from "../../middleware/conectMongoDB.middleware";
import {
  upload,
  uploadImagemCosmic,
} from "../../services/uploadImagemCosmic.service";
import nc from "next-connect";

const handler = nc()
  .use(upload.single("file"))
  .post(
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
      try {
        const usuario = req.body as CadastroRequisicao; //só preenche o nome email e senha

        //validação
        if (!usuario.nome || usuario.nome.length < 2)
          return res.status(400).json({ erro: "Nome inválido" });

        //o certo seria usar um regex
        //regexp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (
          !usuario.nome ||
          usuario.email.length < 5 ||
          !usuario.email.includes("@") ||
          !usuario.email.includes(".")
        )
          return res.status(400).json({ erro: "Email inválido" });

        //regexp (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/)
        //             (?=.*\d)               deve conter ao menos um dígito
        //   (?=.*[a-z])            deve conter ao menos uma letra minúscula
        //   (?=.*[A-Z])            deve conter ao menos uma letra maiúscula
        //   (?=.*[$*&@#])          deve conter ao menos um caractere especial
        //   [0-9a-zA-Z$*&@#]{8,}   deve conter ao menos 8 dos caracteres mencionados
        if (!usuario.senha || usuario.senha.length < 4)
          return res.status(400).json({ erro: "Senha inválida" });

        ///validao se ja existe o mesmo email
        const usuariosComMesmoEmail = await UsuarioModel.find({
          email: usuario.email,
        });
        if (usuariosComMesmoEmail && usuariosComMesmoEmail.length > 0)
          return res.status(400).json({ erro: "Email ja existe >:(" });

        const image = await uploadImagemCosmic(req);

        //criptografar senha usando md5
        //nao é seguro mas é somente para fins didaticos
        const usuarioASerSalvo = {
          nome: usuario.nome,
          email: usuario.email,
          senha: md5(usuario.senha),
          avatar: image?.media?.url
        };

        await UsuarioModel.create(usuarioASerSalvo);
        return res.status(200).json({ msg: "Cadastro efetivado :)" });
      } catch (e: any) {
        //console.log(e);
        return res.status(500).json({ erro: e.toString() });
      }
    }
  );

export const config = {
  api: {
    bodyParser: false,
  },
};

export default conectMongoDB(handler);
