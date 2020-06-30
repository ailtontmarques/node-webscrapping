const rp = require('request-promise')
const cheerio = require('cheerio')

const options = {
    url: 'https://www.uol.com.br/carros/',
    transform: function (body){
        return cheerio.load(body)
    }
}

function processarDados(dados){
    //salva no banco de dados
    console.log(JSON.stringify(dados))
  }

rp(options)
    .then(($) => {

        const images = []

        $('.thumbnail-standard-wrapper').each(function() {
            //console.log($(this).find('.thumb-layer').find('img').attr('data-src'));
            //console.log($(this).find('.thumb-title').text().trim());
            const image = {
                url: $(this).find('.thumb-layer').find('img').attr('data-src'),
                description: $(this).find('.thumb-title').text().trim()
            }

            images.push(image)
        }),
        $('.thumbnails-wrapper').each(function() {
            //console.log($(this).find('.thumb-layer').find('img').attr('data-src'));
            // console.log($(this).find('.thumb-title').text().trim());
            const image1 = {
                url: $(this).find('.thumb-layer').find('img').attr('data-src'),
                description: $(this).find('.thumb-title').text().trim()
            }

            images.push(image1)
        })

        processarDados(images)
    })

    .catch((err) => {
        console.log('Error:' + err);
    })