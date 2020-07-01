import Express from 'express'
import bodyParser from 'body-parser'

import database from './config/database'
import userRoute from './routes/userRoute'
import imagesRoute from './routes/imagesRoute'

import ImagesModel from './models/images'

const app = Express()
const port = 3000

const rp = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')

const options = {
    url: 'https://www.uol.com.br/carros/',
    transform: function (body){
        return cheerio.load(body)
    }
}

app.use(bodyParser.urlencoded({ extended: false }))
app.set('json spaces', 2);

userRoute(app)
imagesRoute(app)

app.get('/', (req, res) => res.send('Olá mundo pelo Express!'))

database.connect().then(() => {
    app.listen(port, () => console.log('Api rodando na porta 3000'))
})

function processarDados(dados){
    console.log(JSON.stringify(dados))

    try {
        const imagesModel = new ImagesModel(JSON.stringify(dados))
        imagesModel.save()

    } catch (error){
        console.log('Error:' + error)
    }
  }

  var download = function(uri, filename, callback){
    rp.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      rp(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  }

  function fileName(uri){
      let s = "./images/";
      s += uri.substring(uri.lastIndexOf("/")+1,uri.length);
      if(s.indexOf('?') > 0){
          s = "";
      }
    return s;
  }

rp(options)
    .then(($) => {

        const images = []

        $('.thumbnail-standard-wrapper').each(function() {
            //console.log($(this).find('.thumb-layer').find('img').attr('data-src'));
            //console.log($(this).find('.thumb-title').text().trim());
            const sUrl = $(this).find('.thumb-layer').find('img').attr('data-src')

            if(sUrl.indexOf('?') < 0) {
                const image = {
                    url: $(this).find('.thumb-layer').find('img').attr('data-src'),
                    description: $(this).find('.thumb-title').text().trim()
                }
    
                download(image.url, fileName(image.url), function() { console.log('Downloaded') })
    
                images.push(image)    
            }
        }),
        $('.thumbnails-wrapper').each(function() {
            //console.log($(this).find('.thumb-layer').find('img').attr('data-src'));
            // console.log($(this).find('.thumb-title').text().trim());
            const sUrl1 = $(this).find('.thumb-layer').find('img').attr('data-src')

            if(sUrl1.indexOf('?') < 0) {
                const image1 = {
                    url: $(this).find('.thumb-layer').find('img').attr('data-src'),
                    description: $(this).find('.thumb-title').text().trim()
                }
    
                download(image1.url, fileName(image1.url), function() { console.log('Downloaded') })
    
                images.push(image1)
            }
        })

        processarDados(images)
    })

    .catch((err) => {
        console.log('Error:' + err);
    })
