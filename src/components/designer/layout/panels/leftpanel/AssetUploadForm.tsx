import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Button } from '@/components/spring-ui/button';
import { UploadIcon, CloseDefaultIcon } from '@/icons';

interface AssetUploadFormProps {
  onUploadSuccess: () => void;
  onClose: () => void;
}

const AssetUploadForm: React.FC<AssetUploadFormProps> = ({ onUploadSuccess, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  }, []);

  const handleDrop = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
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
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    // In a real application, you would send this file to a server
    console.log('Uploading file:', selectedFile.name);

    // Simulate upload process
    setTimeout(() => {
      alert(`File "${selectedFile.name}" uploaded successfully! (Simulated)`);
      setSelectedFile(null);
      onUploadSuccess(); // Notify parent of success
      onClose();
    }, 1500);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Upload Asset</h2>
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
        <p className="text-[var(--text-primary)] mb-2">Drag & drop your file here, or</p>
        <input 
          type="file" 
          id="file-upload"
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="cursor-pointer text-[var(--primary)] hover:underline">
          Browse files
        </label>
        {selectedFile && (
          <p className="mt-4 text-sm text-[var(--text-secondary)]">
            Selected: <span className="font-medium text-[var(--text-primary)]">{selectedFile.name}</span>
            <button onClick={clearSelectedFile} className="ml-2 text-red-500 hover:text-red-700">x</button>
          </p>
        )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!selectedFile}
        className="mt-4 w-full"
      >
        Upload Asset
      </Button>
    </div>
  );
};

export default AssetUploadForm; 