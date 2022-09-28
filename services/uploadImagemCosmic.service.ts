
import multer from 'multer';
import cosmicjs from 'cosmicjs';

const { CHAVE_GRAVACAO_PUBLICACAO, CHAVE_GRAVACAO_AVATAR, BUCKET_PUBLICACAO, BUCKET_AVATAR } = process.env;

const Cosmic = cosmicjs();

const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATAR,
    write_key: CHAVE_GRAVACAO_AVATAR
})
const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACAO,
    write_key: CHAVE_GRAVACAO_PUBLICACAO
})

const storage = multer.memoryStorage(); //usar o storage em memora
const upload = multer({ storage: storage });

//serviço propriamente dito
const uploadImagemCosmic = async (req: any) => {
    if (req?.file?.originalname) {
        //se chegou um arquivo
        const media_object = {
            originalname: req.file.originalname,
            buffer: req.file.buffer //array de bites
        }

        //pegar do endpoint
        if (req.url && req.url.includes('publicacao')) return await bucketPublicacoes.addMedia({ media: media_object });
        else return await bucketAvatares.addMedia({ media: media_object });
    }
}

export { upload, uploadImagemCosmic };