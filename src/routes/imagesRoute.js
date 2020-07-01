import ImagesModel from '../models/images'

const imagesRoute = (app) => {

    app.route('/images/:id?')
        .get(async (req, res) => {
            const { id } = req.params
            const query = {};

            if (id) {
                query._id = id
            }

            try {
                const images = await ImagesModel.find(query)
                res.send({ images })
            } catch (error) {
                res.status(400).send({ error: 'Falha ao procurar imagem' })
            }
        })
        .post(async (req, res) => {

            try {
                const image = new ImagesModel(req.body)
                await image.save()

                res.status(201).send('Ok')
            } catch (error) {
                res.send(error)
            }
        })
}

module.exports = imagesRoute
