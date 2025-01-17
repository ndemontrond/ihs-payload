// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'

import sharp from 'sharp' // sharp-import
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'
import { readFileSync } from 'fs'
import fs from 'fs'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Embed the Aiven CA certificate
const ca = `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUfqD80FnRgruvyy0i1XfIKpCgKA0wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMzFiYTU0MDctNGUyNi00YzMzLWJjZjctNjY5YjAxZjE2
MmZjIFByb2plY3QgQ0EwHhcNMjQwOTIyMTIzNTExWhcNMzQwOTIwMTIzNTExWjA6
MTgwNgYDVQQDDC8zMWJhNTQwNy00ZTI2LTRjMzMtYmNmNy02NjliMDFmMTYyZmMg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAK36XW6r
u65mc7h0KpaDu1iLuvjvRoB6+P1cYlruFIen24aDiR2S4UMleB7hiN7bQ3qVYqPG
IKAG6O0YeTwmNp31bHJ1nfMXf3oJEM3Mlqh9JqsVrdO+orIeGS5a66wkELL44ar6
IziVxC3Dm/TG0w/xGI7MZOo2FUkREe50W/qMfpyEVHOPjgYeHe3tNzEhmGYXM3k7
mx/vV6h2XY1nvmv/zHvOl1991pm6tTqq7aYyAHhoo4dXFPang9uklHGbR353nCfk
bJxgFRHV+u7Kk6043QKFtOre72KcgodDzgPTgHLIXfVY/OqhWOi+HkHAwdx7crGn
DwyrIGU1FoNFnyX8l9moX+lQUOZpXy5gGlZOVsnLo/VM4sVlwZx5410R9MtArPKW
N3dXuEQq2kzWUt9mxEfrAlfZ2NYnUMtzJ/dnZ+gHm0qdn+H2ylXKDAPxr5aJhPfi
+shwhW2pAxD/vTt8o7jCD6OsoI6UtryJCPMuhvVvJIle4a1qsvTDIbm1EQIDAQAB
oz8wPTAdBgNVHQ4EFgQUZQ1VcMgyzXaVh7aGC3xabjaPlYQwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBAAzv1QBK9POChPzZ
e5kSqRz03fBaHhZ3fJyVUfBkZOEjgEkDD2PBMc2xTgoFG+1LsiCfEPrZaPkVztdO
Zh4tf1WGoHfMKL/tPZwePn7Zfq5LrpE8I7KyrTUO5s0/d8caEDRe/0RDsgi/Iwob
onR2yFZvLNWdytXY2Yv9D2+K1nnTgu/GIXRTIzyqh8DeNEuM7VcOmC2exq/MHT+h
64d8GZMqbyW7qwyrfD4/haGNmwQCPAVfwIkIIR1gvL7pAwwjbqYMLJgbiKX/Hbt4
2MOsR5Nv73n2IrAP8o3BsjmvgIQdIj9L42n5fI1ew1uMcKKOiYnnJSTnkk8lzm+/
z4rNrEhbOkIhydce25kPrnY9ckTyruhQB708yb1D97ML5q6VTJDvcUCL7833DnxY
vyW/O9LBQW+LSVtII0jciCBnFNA+jQo9caA/iuGF1or5hwMOmLNLw4jfqPYB6V5/
KvjbNGvKnYZMZXhhU38UwbazrRnozDqXe+JBFAkxI2N7wyzOkA==
-----END CERTIFICATE-----`

// Add debugging
const certPath = path.join(process.cwd(), 'ca.pem')
console.log('Attempting to read certificate from:', certPath)

let cert
try {
  cert = readFileSync(certPath).toString()
  console.log('Certificate loaded successfully')
} catch (error) {
  console.error('Failed to read certificate:', error)
  throw error
}

// Parse the connection string to get the host
const connectionString = process.env.DATABASE_URI || ''
const hostMatch = connectionString.match(/@([^:]+)/)
const host = hostMatch ? hostMatch[1] : ''
console.log('Connecting to host:', host)

console.log('SSL Config:', {
  ca: cert ? 'Loaded' : 'Not loaded',
  servername: host,
})

export default buildConfig({
  admin: {
    components: {
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeLogin` statement on line 15.
      beforeLogin: ['@/components/BeforeLogin'],
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import `BeforeDashboard` statement on line 15.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,

  // db: postgresAdapter({
  //   pool: {
  //     connectionString: process.env.DATABASE_URI || '',
  //   },
  // }),

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      ssl: {
        rejectUnauthorized: true,
        // sslrootcert: ca, // Use embedded CA certificate
        ca: fs.readFileSync(certPath).toString(),
      },
    },
  }),

  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins: [
    ...plugins,
    // storage-adapter-placeholder
  ],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
