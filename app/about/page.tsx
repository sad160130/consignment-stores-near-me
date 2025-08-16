import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Dynamically import the client component with SSR disabled to avoid hydration issues
const AboutClient = dynamic(() => import('./AboutClient'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
      </div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'About Us - Connecting Communities Through Consignment',
  description: 'Learn about our mission to make second-hand shopping accessible, trustworthy, and exciting. Discover how we\'re building the most comprehensive guide to consignment stores nationwide.',
  keywords: 'about consignment stores, sustainable shopping, second hand stores, thrift directory, consignment community, pre-loved fashion, circular economy',
  alternates: {
    canonical: 'https://www.consignmentstores.site/about/'
  },
  openGraph: {
    title: 'About ConsignmentStores.site - Our Story & Mission',
    description: 'Connecting communities, one treasure at a time. Learn about our journey to make second-hand the first choice.',
    type: 'website',
    url: 'https://www.consignmentstores.site/about/',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1628103134375-4c07c7324c4e?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Consignment store interior'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About ConsignmentStores.site',
    description: 'Your trusted guide to discovering local consignment treasures',
    images: ['https://images.unsplash.com/photo-1628103134375-4c07c7324c4e?q=80&w=1200&auto=format&fit=crop']
  }
};

export default function AboutPage() {
  return <AboutClient />;
}