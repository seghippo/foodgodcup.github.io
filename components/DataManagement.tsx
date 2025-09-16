'use client';

import { useState } from 'react';
import { createFullBackup, exportMatchResults, exportSchedule, exportAllData } from '@/lib/data';
import { useLanguage } from '@/lib/language';

interface DataManagementProps {
  captainName?: string;
}

export function DataManagement({ captainName }: DataManagementProps) {
  const { t } = useLanguage();
  const [restoreMessage, setRestoreMessage] = useState('');

  const handleCreateBackup = () => {
    try {
      createFullBackup();
      setRestoreMessage('Backup created successfully!');
      setTimeout(() => setRestoreMessage(''), 3000);
    } catch (error) {
      setRestoreMessage('Error creating backup. Please try again.');
      setTimeout(() => setRestoreMessage(''), 3000);
    }
  };

  const handleExportMatchResults = () => {
    try {
      exportMatchResults();
      setRestoreMessage('Match results exported successfully!');
      setTimeout(() => setRestoreMessage(''), 3000);
    } catch (error) {
      setRestoreMessage('Error exporting match results. Please try again.');
      setTimeout(() => setRestoreMessage(''), 3000);
    }
  };

  const handleExportSchedule = () => {
    try {
      exportSchedule();
      setRestoreMessage('Schedule exported successfully!');
      setTimeout(() => setRestoreMessage(''), 3000);
    } catch (error) {
      setRestoreMessage('Error exporting schedule. Please try again.');
      setTimeout(() => setRestoreMessage(''), 3000);
    }
  };

  const handleExportAllData = () => {
    try {
      exportAllData();
      setRestoreMessage('All data exported successfully!');
      setTimeout(() => setRestoreMessage(''), 3000);
    } catch (error) {
      setRestoreMessage('Error exporting all data. Please try again.');
      setTimeout(() => setRestoreMessage(''), 3000);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">数据管理 / Data Management</h3>
      
      <div className="space-y-4">
        {/* Export Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">导出数据 / Export Data</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            导出特定类型的数据文件，便于分析和备份。
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreateBackup}
              className="btn-gold"
            >
              📥 完整备份 / Full Backup
            </button>
            <button
              onClick={handleExportMatchResults}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              🏆 比赛结果 / Match Results
            </button>
            <button
              onClick={handleExportSchedule}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              📅 赛程安排 / Schedule
            </button>
            <button
              onClick={handleExportAllData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              📦 全部数据 / All Data
            </button>
          </div>
        </div>

        {/* Status Messages */}
        {restoreMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            restoreMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {restoreMessage}
          </div>
        )}
      </div>
    </div>
  );
}
