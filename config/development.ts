const databaseName      = process.env.DB_NAME
const databaseUser      = process.env.DB_USER
const databasePassword      = process.env.DB_PASS

export default {
    secret: process.env.SECRET_TOKEN,
    connectionString: `mongodb+srv://${ databaseUser }:${ databasePassword }@cluster0.a4rqihe.mongodb.net/${ databaseName }?retryWrites=true&w=majority`,
    env: process.env.NODE_ENV
}