import mongoose from 'mongoose'

export default callback => {
  // connect to a database if needed, then pass it to `callback`:
  mongoose.connect(process.env.MONGO_LOCAL)
  callback()
}
