import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Header } from './components/Header';
import UploadDocument from './components/UploadDocument';
import AssistantChatShell from './components/AssistantChatShell';
import { apiUrl } from './config';

type JobNotification = {
  job_id: string;
  status: string;
  message?: string;
  filename?: string;
};

const App: React.FC = () => {
  const [role, setRole] = useState<string>('');
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [notifications, setNotifications] = useState<JobNotification[]>([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = sessionStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(apiUrl('/check-session'), {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 401) {
        alert('Your session has expired. Redirecting to login...');
        sessionStorage.removeItem('isAuthenticated');
        sessionStorage.removeItem('role');
        navigate('/');
        return;
      }

      const data = await response.json();
      if (Array.isArray(data.jobs)) {
        setNotifications(data.jobs);
        setHasNewNotifications(data.jobs.length > 0);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSession();
    const interval = window.setInterval(fetchSession, 60_000);
    return () => window.clearInterval(interval);
  }, [fetchSession]);

  const toggleUploadPopup = () => {
    setShowUploadPopup((prev) => !prev);
    document.body.style.overflow = 'auto';
  };

  const handleNotificationsSeen = async (jobIds: string[]) => {
    if (jobIds.length === 0) {
      return;
    }

    try {
      const response = await fetch(apiUrl('/jobs/ack'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_ids: jobIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge jobs');
      }

      setNotifications((prev) => prev.filter((job) => !jobIds.includes(job.job_id)));
      setHasNewNotifications(false);
    } catch (error) {
      console.error('Error acknowledging jobs:', error);
    }
  };

  return (
    <div className="app flex h-screen flex-col overflow-hidden">
      <Header
        role={role}
        notifications={notifications}
        hasNotifications={hasNewNotifications}
        onNotificationsSeen={handleNotificationsSeen}
      />

      <div className="mb-4 flex w-full flex-grow space-x-4 overflow-hidden rounded-xl pb-1">
        <aside className="w-1/4 rounded-xl bg-gray-50 p-4 shadow-md">
          <h2 className="mb-6 text-lg">Sources</h2>
          <hr className="mb-4 border-t-2 border-gray-300" />
          {role === 'admin' ? (
            <button
              onClick={toggleUploadPopup}
              className="center-button hover:bg-gray-200 hover:shadow-md flex items-center p-2"
              type="button"
            >
              <PlusCircleIcon className="mr-1 h-5 w-5" />
              Upload File
            </button>
          ) : null}
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden rounded-xl bg-gray-50 p-4 shadow-md">
          <h2 className="mb-6 text-lg">Conversation</h2>
          <hr className="mb-4 border-t-2 border-gray-300" />
          <div className="flex flex-1 flex-col overflow-hidden">
            <AssistantChatShell />
          </div>
        </main>

        <aside className="w-1/4 rounded-xl bg-gray-50 p-4 shadow-md">
          <h2 className="mb-6 text-lg">Options</h2>
          <hr className="mb-4 border-t-2 border-gray-300" />
          <div />
        </aside>
      </div>

      {showUploadPopup ? <UploadDocument onClose={toggleUploadPopup} /> : null}
    </div>
  );
};

export default App;
