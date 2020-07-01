import Mongoose from 'mongoose'

const schema = new Mongoose.Schema({
    url: String,
    description: String
    },
    {
        timestamps: { createdAt: true, updatedAt: true },
        toJSON: { 
            virtuals: true,
            transform(doc, ret) {
                ret.id = ret._id
                delete ret._id
            }
    },
    versionKey: false, 
})

const ImagesModel = Mongoose.model('Images', schema)

export default ImagesModel