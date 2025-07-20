import React from 'react';

interface Site {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  status: 'live' | 'draft';
  lastModified: string;
  domain: string;
  plan: string;
  isPublished: boolean;
}

interface ProjectCardProps {
  site: Site;
  assetCount: number;
  previewImages: string[];
  onClick?: () => void;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  site, 
  assetCount, 
  previewImages, 
  onClick,
  className = '' 
}) => {
  return (
    <div 
      className={`bg-white border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex flex-col h-full ${className}`}
      onClick={onClick}
    >
      {/* Preview Grid */}
      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-3 gap-1 h-full p-1">
          {/* Large left image */}
          <div className="col-span-2 rounded overflow-hidden bg-gray-200">
            <img 
              src={previewImages[0]} 
              alt={`${site.name} preview`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.style.backgroundColor = '#f3f4f6';
              }}
            />
          </div>
          {/* Two smaller right images */}
          <div className="col-span-1 grid grid-rows-2 gap-1">
            <div className="rounded overflow-hidden bg-gray-200">
              <img 
                src={previewImages[1]} 
                alt={`${site.name} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.backgroundColor = '#f3f4f6';
                }}
              />
            </div>
            <div className="rounded overflow-hidden bg-gray-200">
              <img 
                src={previewImages[2]} 
                alt={`${site.name} preview`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement!.style.backgroundColor = '#f3f4f6';
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Text Information */}
      <div className="space-y-2 mt-4">
        <h4 className="font-semibold text-gray-900 text-base leading-tight">{site.name}</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{assetCount} assets · Updated {site.lastModified}</p>
      </div>
    </div>
  );
};

export default ProjectCard; 