const {Image} = require('./motel.model')

const handleCreateImages = async (images, motel_id) => {
    const imgs = []
    for(let i = 0; i < images.length; i ++) {
        const data = {...images[i], motel: motel_id}
        const img = await new Image(data).save()
        imgs.push(img)
        if(i === images.length - 1) {
            return imgs
        }
    }
}

module.exports = {
    handleCreateImages
}