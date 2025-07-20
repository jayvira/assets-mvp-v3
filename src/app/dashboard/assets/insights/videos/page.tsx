export default function InsightsPage() {
  return (
    <div className="p-6">
      <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Insights</h1>
      <p className="body-text text-[var(--text-secondary)]">Analytics and performance insights for your assets.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Asset Usage</h3>
          <p className="text-3xl font-bold text-blue-600">2,847</p>
          <p className="text-sm text-gray-500">Total asset views this month</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Storage Used</h3>
          <p className="text-3xl font-bold text-green-600">1.2 GB</p>
          <p className="text-sm text-gray-500">Of 5 GB total storage</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Popular Assets</h3>
          <p className="text-3xl font-bold text-purple-600">24</p>
          <p className="text-sm text-gray-500">Assets with 100+ views</p>
        </div>
      </div>
    </div>
  );
} 