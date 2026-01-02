import { useState, useEffect } from 'react';
import { csvApi } from '../../services/api';
import type { CSVContent } from '../../types';

interface CSVViewerProps {
  fileId: number;
  onBack: () => void;
  onDelete?: (fileId: number) => void;
}

export const CSVViewer = ({ fileId, onBack, onDelete }: CSVViewerProps) => {
  const [content, setContent] = useState<CSVContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await csvApi.get(fileId);
        setContent(data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load CSV content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [fileId]);

  if (isLoading) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <div className="text-gray-600">Loading CSV content...</div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Failed to load CSV content'}
        </div>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mb-2"
          >
            ← Back to List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{content.filename}</h1>
          <p className="text-sm text-gray-600 mt-1">
            {content.total_rows} rows • {content.headers.length} columns
          </p>
        </div>
        {onDelete && (
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this file?')) {
                onDelete(fileId);
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Delete File
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {content.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {content.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {content.headers.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[header] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
