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
      className={`bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-all duration-200 flex flex-col h-[240px] ${className}`}
      onClick={onClick}
    >
      {/* Preview Grid */}
      <div className="flex-1 overflow-hidden rounded-lg">
        <div className="flex gap-1 h-full">
          {/* Large left image */}
          <div className="flex-[2] overflow-hidden bg-gray-200">
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
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex-1 overflow-hidden bg-gray-200">
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
            <div className="flex-1 overflow-hidden bg-gray-200">
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
      <div className="p-2 mt-2 space-y-1">
        <h4 className="title-text-bold">{site.name}</h4>
        <p className="body-text text-[var(--text-secondary)]">{assetCount} assets · Updated {site.lastModified}</p>
      </div>
    </div>
  );
};

export default ProjectCard; 