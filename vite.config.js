import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default {
  server: {
    host: '0.0.0.0',  // Listen on all interfaces, not just localhost
    allowedHosts: [
      'cepd-ai.com',
      'ec2-54-91-190-165.compute-1.amazonaws.com',  // Allow this specific host
      'localhost',  // Keep localhost for local testing
      '127.0.0.1',  // Optional: Explicitly allow loopback
      '54.91.190.165'  // Optional: Allow public IP directly
    ]
  }
}

