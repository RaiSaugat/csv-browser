import { useState, useEffect } from 'react';
import { csvApi } from '../../services/api';
import { useCSVUpdates } from '../../hooks/useWebSocket';
import { useAuth } from '../../context/AuthContext';
import type { CSVFile } from '../../types';
import { CSVViewer } from './CSVViewer';
import { CSVUpload } from './CSVUpload';

export const CSVList = () => {
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const data = await csvApi.list();
      setFiles(data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to load CSV files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // Listen for real-time updates
  useCSVUpdates(() => {
    loadFiles();
  });

  const handleDelete = async (fileId: number) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await csvApi.delete(fileId);
      await loadFiles();
      if (selectedFileId === fileId) {
        setSelectedFileId(null);
      }
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to delete file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (selectedFileId) {
    return (
      <CSVViewer
        fileId={selectedFileId}
        onBack={() => setSelectedFileId(null)}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">CSV Files</h1>
        {isAdmin && <CSVUpload onUpload={loadFiles} />}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="text-gray-600">Loading CSV files...</div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-600">No CSV files available</div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {files.map((file) => (
              <li key={file.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => setSelectedFileId(file.id)}
                    >
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-indigo-600 truncate">
                          {file.filename}
                        </p>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {formatFileSize(file.size)}
                          </p>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                            Uploaded: {formatDate(file.uploaded_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedFileId(file.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        View
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
