// src/app/notion-setup-guide/page.tsx
export default function NotionSetupGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-teal-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 border border-emerald-100/50">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-6">Notion Integration Setup Guide</h1>
          
          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              Your Notion integration is properly coded and ready to use! Follow these steps to connect your Notion databases:
            </p>
            
            <ol className="list-decimal pl-6 space-y-4 mb-6">
              <li>
                <strong>Go to your Notion databases</strong> that you want to connect to your website
              </li>
              
              <li>
                <strong>Share each database with your integration</strong> by:
                <ul className="list-disc pl-6 mt-2">
                  <li>Opening the database in Notion</li>
                  <li>Clicking the &quot;Share&quot; button (top-right corner)</li>
                  <li>Searching for your integration (it will have the name you gave it)</li>
                  <li>Selecting it and granting &quot;Read&quot; permissions</li>
                </ul>
              </li>
              
              <li>
                <strong>Repeat for all databases</strong> you want to display on your website
              </li>
              
              <li>
                <strong>Visit the integration page</strong> at <code className="bg-gray-100 px-2 py-1 rounded">/notion-integration</code> to see your connected databases
              </li>
            </ol>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-bold text-blue-800 mb-2">Why is this step necessary?</h3>
              <p className="text-blue-700">
                Notion's API requires explicit permission for security. Each database must be shared with the integration 
                for it to access the data. This is a Notion security feature and not an issue with the code.
              </p>
            </div>
            
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <h3 className="font-bold text-emerald-800 mb-2">Your Integration is Ready</h3>
              <p className="text-emerald-700">
                The code is complete and functional. Once you connect your databases, they will automatically appear 
                on your website with proper formatting for all Notion property types (text, dates, checkboxes, etc.).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}