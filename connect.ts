import fs from 'fs'
import path from 'path'

// Combine the current working directory and the relative path to 'ca.pem'
const caCertPath = path.join(process.cwd(), 'ca.pem')

// Read the certificate file
const caCert = fs.readFileSync(caCertPath)

console.log('Resolved path:', caCertPath)
