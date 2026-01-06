import { useState, useEffect } from 'react';
import { csvApi } from '../../services/api';
import type { CSVContent } from '../../types';
import { confirmToast } from '../../utils/toast';

interface CSVViewerProps {
  fileId: number;
  onBack: () => void;
  onDelete?: (fileId: number) => void;
}

export const CSVViewer = ({ fileId, onBack, onDelete }: CSVViewerProps) => {
  const itemsPerPage = 20;

  const [content, setContent] = useState<CSVContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setIsLoading(true);
        const data = await csvApi.get(fileId, currentPage, itemsPerPage);
        setContent(data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load CSV content');
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [fileId, currentPage]);

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
          <h1 className="text-2xl font-bold text-gray-900">
            {content.filename}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {content.total_rows} rows • {content.headers.length} columns • Page{' '}
            {content.page} of {content.total_pages}
          </p>
        </div>
        {onDelete && (
          <button
            onClick={async () => {
              const confirmed = await confirmToast(
                'Are you sure you want to delete this file?'
              );
              if (confirmed) {
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

      {/* Pagination Controls */}
      {content.total_pages > 1 && (
        <div className="mt-4 flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={content.page === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(content.total_pages, prev + 1)
                )
              }
              disabled={content.page === content.total_pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(content.page - 1) * itemsPerPage + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(content.page * itemsPerPage, content.total_rows)}
                </span>{' '}
                of <span className="font-medium">{content.total_rows}</span>{' '}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={content.page === 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                {/* Page Numbers */}
                {(() => {
                  const pages: (number | string)[] = [];
                  const totalPages = content.total_pages;
                  const currentPage = content.page;

                  if (totalPages <= 7) {
                    // Show all pages if 7 or fewer
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);

                    if (currentPage <= 4) {
                      // Near the start: show 1, 2, 3, 4, 5, ..., last
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i);
                      }
                      if (totalPages > 6) {
                        pages.push('ellipsis');
                      }
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      // Near the end: show 1, ..., last-4, last-3, last-2, last-1, last
                      pages.push('ellipsis');
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // In the middle: show 1, ..., current-1, current, current+1, ..., last
                      pages.push('ellipsis');
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                        pages.push(i);
                      }
                      pages.push('ellipsis');
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, index) => {
                    if (page === 'ellipsis') {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300"
                        >
                          ...
                        </span>
                      );
                    }

                    const pageNum = page as number;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNum === currentPage
                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  });
                })()}
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(content.total_pages, prev + 1)
                    )
                  }
                  disabled={content.page === content.total_pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
