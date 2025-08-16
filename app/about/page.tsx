import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TEST - About Page Updated',
  description: 'Testing if Vercel is deploying updates'
};

export default function AboutPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', background: 'red', color: 'white', fontSize: '48px' }}>
      <h1>TEST - THIS PAGE HAS BEEN UPDATED</h1>
      <p>If you can see this RED background, the deployment worked!</p>
      <p>Timestamp: {new Date().toISOString()}</p>
    </div>
  );
}