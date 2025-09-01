import { processExcelData, getStateSlug } from '@/lib/data-processor';
import { notFound } from 'next/navigation';

interface StatePageProps {
  params: Promise<{ state: string }>;
}

export default async function StatePage({ params }: StatePageProps) {
  const resolvedParams = await params;
  const data = processExcelData();
  
  const stateName = data.statesList.find(state => 
    getStateSlug(state) === resolvedParams.state
  );

  if (!stateName) {
    notFound();
  }

  const stores = data.storesByState[stateName] || [];
  const cities = data.citiesByState[stateName] || [];

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2rem', color: '#2563eb', marginBottom: '1rem' }}>
        🎯 {stateName} Consignment Stores
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
        ✅ This is the STATE-SPECIFIC page for {stateName}
      </p>
      <div style={{ background: '#f3f4f6', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2>Statistics:</h2>
        <ul>
          <li>📍 State: {stateName}</li>
          <li>🏪 Total Stores: {stores.length}</li>
          <li>🌆 Total Cities: {cities.length}</li>
          <li>🔗 URL Parameter: {resolvedParams.state}</li>
        </ul>
      </div>
      <div style={{ background: '#fef2f2', padding: '1rem', borderRadius: '8px', border: '2px solid #ef4444' }}>
        <h3>🚨 DEBUGGING INFO</h3>
        <p><strong>If you can see this, the state page routing is working correctly!</strong></p>
        <p>This page should only appear when visiting: {resolvedParams.state}.consignmentstores.site</p>
        <p>Expected H1: "{stateName} Consignment Stores"</p>
      </div>
    </div>
  );
}