import { useState, useRef } from 'react';
import { csvApi } from '../../services/api';

interface CSVUploadProps {
  onUpload: () => void;
}

export const CSVUpload = ({ onUpload }: CSVUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please select a CSV file');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      await csvApi.upload(file);
      onUpload();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        className="hidden"
        id="csv-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="csv-upload"
        className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
          isUploading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
        }`}
      >
        {isUploading ? 'Uploading...' : 'Upload CSV'}
      </label>
      {error && (
        <div className="mt-2 text-sm text-red-600">{error}</div>
      )}
    </div>
  );
};
