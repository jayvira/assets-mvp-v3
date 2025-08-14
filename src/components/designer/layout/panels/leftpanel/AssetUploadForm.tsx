import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/spring-ui/button';
import { UploadIcon, CloseDefaultIcon } from '@/icons';

interface AssetUploadFormProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

const AssetUploadForm: React.FC<AssetUploadFormProps> = ({ onUploadSuccess, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      console.log('Files selected:', files.map(f => ({ name: f.name, size: f.size })));
      setSelectedFiles(files);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    console.log('Drop event:', event.dataTransfer.files);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const files = Array.from(event.dataTransfer.files);
      console.log('Files dropped:', files.map(f => ({ name: f.name, size: f.size })));
      setSelectedFiles(files);
    }
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }

    console.log('Uploading files:', selectedFiles.map(f => ({ 
      name: f.name, 
      size: f.size,
      type: f.type
    })));

    // Simulate upload process
    setTimeout(() => {
      alert(`${selectedFiles.length} file(s) uploaded successfully! (Simulated)`);
      setSelectedFiles([]);
      onUploadSuccess(); // Notify parent of success
      onClose();
    }, 1500);
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upload Assets</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <CloseDefaultIcon size={16} />
        </Button>
      </div>

      <div
        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 text-center transition-colors ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-[var(--border-default)] bg-[var(--background-secondary)]'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <UploadIcon size={32} className="mb-4 text-[var(--text-secondary)]" />
        <p className="text-[var(--text-primary)] mb-2">Drag & drop your files here, or</p>
        <div className="flex gap-2">
          <input 
            type="file" 
            id="file-upload"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload" className="cursor-pointer text-[var(--primary)] hover:underline">
            Browse files
          </label>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          You can select multiple files or drag entire folders
        </p>
        {selectedFiles.length > 0 && (
          <div className="mt-4 w-full">
            <p className="text-sm text-[var(--text-secondary)] mb-2">
              Selected {selectedFiles.length} file(s):
            </p>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between text-sm bg-[var(--background-primary)] p-2 rounded">
                  <span className="text-[var(--text-primary)] truncate flex-1" title={file.name}>
                    {file.name}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)] ml-2">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                  <button 
                    onClick={() => removeFile(index)} 
                    className="ml-2 text-red-500 hover:text-red-700 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button 
              onClick={clearSelectedFiles} 
              className="mt-2 text-sm text-red-500 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={selectedFiles.length === 0}
        className="mt-4 w-full"
      >
        Upload {selectedFiles.length > 0 ? `${selectedFiles.length} Asset${selectedFiles.length > 1 ? 's' : ''}` : 'Asset'}
      </Button>
    </div>
  );
};

export default AssetUploadForm; 