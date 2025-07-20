export default function BrandGuidelinesPage() {
  return (
    <div className="p-6">
      <h1 className="title-text-bold mb-4 text-[var(--text-primary)]">Brand Guidelines</h1>
      <p className="body-text text-[var(--text-secondary)]">Manage your brand assets, logos, colors, and design system.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Logos</h3>
          <p className="text-3xl font-bold text-blue-600">12</p>
          <p className="text-sm text-gray-500">Logo variations and formats</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Color Palette</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">Brand colors and swatches</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Typography</h3>
          <p className="text-3xl font-bold text-purple-600">4</p>
          <p className="text-sm text-gray-500">Font families and styles</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Icons</h3>
          <p className="text-3xl font-bold text-orange-600">156</p>
          <p className="text-sm text-gray-500">Icon set and variations</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Templates</h3>
          <p className="text-3xl font-bold text-red-600">24</p>
          <p className="text-sm text-gray-500">Design templates and layouts</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-2">Photography</h3>
          <p className="text-3xl font-bold text-indigo-600">89</p>
          <p className="text-sm text-gray-500">Brand photography assets</p>
        </div>
      </div>
    </div>
  );
} 