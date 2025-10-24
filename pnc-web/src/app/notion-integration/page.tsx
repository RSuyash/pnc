// src/app/notion-integration/page.tsx
import NotionDataFetcher from '@/components/notion/NotionDataFetcher';

export default function NotionIntegrationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Notion Integration
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Connect and display data from your Notion workspace directly on your website
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">All Databases</h2>
            <NotionDataFetcher />
          </div>
        </div>
      </div>
    </div>
  );
}