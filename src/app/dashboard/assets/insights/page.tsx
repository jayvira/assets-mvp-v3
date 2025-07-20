export default function InsightsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Insights</h1>
      <p className="text-[var(--text-secondary)]">Analytics and performance insights for your assets.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-default)]">
          <h3 className="title-text-bold mb-2 text-[var(--text-primary)]">Asset Usage</h3>
          <p className="text-3xl font-bold text-[var(--text-blue)]">2,847</p>
          <p className="body-text text-[var(--text-secondary)]">Total asset views this month</p>
        </div>
        
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-default)]">
          <h3 className="title-text-bold mb-2 text-[var(--text-primary)]">Storage Used</h3>
          <p className="text-3xl font-bold text-[var(--text-green)]">1.2 GB</p>
          <p className="body-text text-[var(--text-secondary)]">Of 5 GB total storage</p>
        </div>
        
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-default)]">
          <h3 className="title-text-bold mb-2 text-[var(--text-primary)]">Popular Assets</h3>
          <p className="text-3xl font-bold text-[var(--text-purple)]">24</p>
          <p className="body-text text-[var(--text-secondary)]">Assets with 100+ views</p>
        </div>
      </div>
    </div>
  );
} 