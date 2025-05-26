'use client';

import { useState, useEffect } from 'react';
import { JobSubmission } from '@/types/job';
import { getJobs, saveJobsToStorage, loadJobsFromStorage } from '@/utils/jobManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStorageChange: () => void;
}

export type StorageType = 'localStorage' | 'sessionStorage' | 'memory';

export default function SettingsModal({ isOpen, onClose, onStorageChange }: SettingsModalProps) {
  const [storageType, setStorageType] = useState<StorageType>('localStorage');
  const [autoBackup, setAutoBackup] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStorageType = localStorage.getItem('mcjs-storage-type') as StorageType || 'localStorage';
      const savedAutoBackup = localStorage.getItem('mcjs-auto-backup') === 'true';
      setStorageType(savedStorageType);
      setAutoBackup(savedAutoBackup);
    }
  }, [isOpen]);

  const handleStorageTypeChange = (newType: StorageType) => {
    const currentJobs = getJobs();
    
    // Save current settings
    localStorage.setItem('mcjs-storage-type', newType);
    localStorage.setItem('mcjs-auto-backup', autoBackup.toString());
    
    // Migrate data if needed
    if (currentJobs.length > 0) {
      // Always keep a backup in localStorage
      localStorage.setItem('mcjs-backup-jobs', JSON.stringify(currentJobs));
      
      // Clear current storage
      if (storageType === 'sessionStorage') {
        sessionStorage.removeItem('material-calculation-jobs');
      }
      
      setStorageType(newType);
      onStorageChange();
    } else {
      setStorageType(newType);
    }
  };

  const handleExportData = () => {
    const jobs = getJobs();
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `material-calculation-jobs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jobs = JSON.parse(e.target?.result as string) as JobSubmission[];
        
        // Validate the data structure
        if (Array.isArray(jobs) && jobs.every(job => job.id && job.title)) {
          // Convert date strings back to Date objects
          const processedJobs = jobs.map(job => ({
            ...job,
            submittedAt: new Date(job.submittedAt)
          }));
          
          if (window.confirm(`Import ${jobs.length} jobs? This will replace current data.`)) {
            // Save to current storage type
            saveJobsToStorage(processedJobs);
            onStorageChange();
            alert('Data imported successfully!');
          }
        } else {
          alert('Invalid file format. Please select a valid jobs export file.');
        }
      } catch (error) {
        alert('Error reading file. Please check the file format.');
      }
    };
    reader.readAsText(file);
    
    // Reset input
    event.target.value = '';
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all job data? This action cannot be undone.')) {
      // Clear from all storage types
      localStorage.removeItem('material-calculation-jobs');
      sessionStorage.removeItem('material-calculation-jobs');
      localStorage.removeItem('mcjs-backup-jobs');
      
      onStorageChange();
      alert('All data cleared successfully!');
    }
  };

  const handleRestoreBackup = () => {
    const backup = localStorage.getItem('mcjs-backup-jobs');
    if (backup) {
      try {
        const jobs = JSON.parse(backup) as JobSubmission[];
        const processedJobs = jobs.map(job => ({
          ...job,
          submittedAt: new Date(job.submittedAt)
        }));
        
        if (window.confirm(`Restore ${jobs.length} jobs from backup? This will replace current data.`)) {
          saveJobsToStorage(processedJobs);
          onStorageChange();
          alert('Backup restored successfully!');
        }
      } catch (error) {
        alert('Error restoring backup data.');
      }
    } else {
      alert('No backup data found.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">系统设置</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Storage Type Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">📦 数据存储设置</h3>
            
            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="storageType"
                  value="localStorage"
                  checked={storageType === 'localStorage'}
                  onChange={(e) => handleStorageTypeChange(e.target.value as StorageType)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">LocalStorage (推荐)</div>
                  <div className="text-xs text-gray-500">数据永久保存在浏览器中，关闭浏览器后仍然存在</div>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="storageType"
                  value="sessionStorage"
                  checked={storageType === 'sessionStorage'}
                  onChange={(e) => handleStorageTypeChange(e.target.value as StorageType)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">SessionStorage</div>
                  <div className="text-xs text-gray-500">数据仅在当前浏览器会话中保存，关闭标签页后清除</div>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="storageType"
                  value="memory"
                  checked={storageType === 'memory'}
                  onChange={(e) => handleStorageTypeChange(e.target.value as StorageType)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">内存存储</div>
                  <div className="text-xs text-gray-500">数据仅在页面刷新前保存，刷新页面后清除</div>
                </div>
              </label>
            </div>
          </div>

          {/* Auto Backup Setting */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">🔄 自动备份</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoBackup}
                onChange={(e) => {
                  setAutoBackup(e.target.checked);
                  localStorage.setItem('mcjs-auto-backup', e.target.checked.toString());
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-900">自动备份到LocalStorage</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">即使使用其他存储方式，也在LocalStorage中保留备份</p>
          </div>

          {/* Data Management */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">📂 数据管理</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center justify-center px-4 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                导出数据
              </button>

              <label className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors cursor-pointer">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                导入数据
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleRestoreBackup}
                className="flex items-center justify-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-md hover:bg-yellow-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                恢复备份
              </button>

              <button
                onClick={handleClearData}
                className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                清除数据
              </button>
            </div>
          </div>

          {/* Advanced Settings */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <svg 
                className={`w-4 h-4 mr-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              高级设置
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="text-xs text-gray-600">
                  <div><strong>当前存储类型:</strong> {storageType}</div>
                  <div><strong>当前任务数量:</strong> {getJobs().length}</div>
                  <div><strong>自动备份:</strong> {autoBackup ? '开启' : '关闭'}</div>
                  <div><strong>存储键名:</strong> material-calculation-jobs</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
