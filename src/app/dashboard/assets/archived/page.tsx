export default function ArchivedPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">Archived assets</h1>
      <p className="text-[var(--text-secondary)]">View and manage your archived assets.</p>
      
      <div className="mt-6">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg border border-[var(--border-default)]">
          <h3 className="title-text-bold mb-2 text-[var(--text-primary)]">Archived Assets</h3>
          <p className="text-3xl font-bold text-[var(--text-blue)]">0</p>
          <p className="body-text text-[var(--text-secondary)]">No archived assets found</p>
        </div>
      </div>
    </div>
  );
} 