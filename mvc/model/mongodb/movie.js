import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
const MONGODB_URI = process.env.MONGODB_URI
const uri = MONGODB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function connect () {
  try {
    await client.connect()

    const database = client.db('media')

    return database.collection('movies')
  } catch (error) {
    console.error('Error connecting to the database')

    console.error(error)

    await client.close()
  }
}

export class MovieModel {
  static async getAll ({ genre }) {
    const db = await connect()

    if (genre) {
      return db.find({
        genre: {
          $elemMatch: {
            $regex: genre,
            $options: 'i'
          }
        }
      }).toArray()
    }

    return db.find({}).toArray()
  }

  static async getById ({ id }) {
    const db = await connect()

    const objectId = new ObjectId(id)

    return db.findOne({ _id: objectId })
  }

  static async create ({ input }) {
    const db = await connect()

    const { insertedId } = await db.insertOne(input)

    return {
      id: insertedId,
      ...input
    }
  }

  static async delete ({ id }) {
    const db = await connect()

    const objectId = new ObjectId(id)

    const { deletedCount } = await db.deleteOne({ _id: objectId })

    return deletedCount > 0
  }

  static async update ({ id, input }) {
    const db = await connect()

    const objectId = new ObjectId(id)

    const { ok, value } = await db.findOneAndUpdate({ _id: objectId }, { $set: input }, { returnDocument: true })

    if (!ok) return false

    return value
  }
}
