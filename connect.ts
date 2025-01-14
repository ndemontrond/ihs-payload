import fs from 'fs'

const caCert = fs.readFileSync(process.cwd(), 'ca.pem')
const connectionString = `postgres://username:password@hostname:port/database?sslmode=require&sslrootcert=ca.pem`
