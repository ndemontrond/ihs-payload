// import { promises as fs } from 'fs';
import fs from 'fs';
import path from 'path';



export default function handler(req, res) {
  try {
    const certPath = path.join('/tmp', 'cert.pem');

    // Option 1: Direct usage (if not Base64-encoded)
    if (!process.env.PG_SSL_CERT) {
        throw new Error("Environment variable PG_SSL_CERT is not defined.");
    }

    const certContent = process.env.PG_SSL_CERT.replace(/\\n/g, '\n');

    // Option 2: Decode Base64 content
    // const certContent = Buffer.from(process.env.CERT_PEM_BASE64, 'base64').toString('utf-8');

    // Write to /tmp
    fs.writeFileSync(certPath, certContent, 'utf8');
    res.status(200).json({ message: 'Certificate written to /tmp/cert.pem' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to write certificate' });
  }
}
