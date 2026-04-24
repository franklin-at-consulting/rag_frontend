import React from 'react';

export type RetrievedDocument = {
  id?: string;
  document_name: string;
  document_url: string;
  thumbnail_url?: string;
  score?: number;
  paragraph?: string;
};

type DocumentsPanelProps = {
  documents: RetrievedDocument[];
};

const DocumentsPanel: React.FC<DocumentsPanelProps> = ({ documents }) => {
  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-4">
      <h4 className="text-sm font-semibold text-gray-600">Supporting Documents</h4>
      <ul className="space-y-3">
        {documents.map((doc, index) => (
          <li
            key={doc.id ?? `${doc.document_name}-${index}`}
            className="flex gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm"
          >
            {doc.thumbnail_url ? (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-white">
                <img
                  src={doc.thumbnail_url}
                  alt={doc.document_name}
                  loading="lazy"
                  className="h-auto w-auto max-h-20 max-w-20 object-contain"
                />
              </div>
            ) : null}
            <div className="space-y-1 text-sm">
              <div className="font-medium text-gray-800">{doc.document_name}</div>
              {typeof doc.score === 'number' ? (
                <div className="text-xs text-gray-500">Score: {doc.score.toFixed(4)}</div>
              ) : null}
              {doc.paragraph ? (
                <p className="text-gray-600">{doc.paragraph}</p>
              ) : null}
              <a
                href={doc.document_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                View document
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentsPanel;
