'use client';

import { useState, useRef } from 'react';
import { createFullBackup, restoreFromBackup } from '@/lib/data';
import { useLanguage } from '@/lib/language';

export function DataManagement() {
  const { t } = useLanguage();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleRestoreBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setRestoreMessage('');

    try {
      const success = await restoreFromBackup(file);
      if (success) {
        setRestoreMessage('Backup restored successfully! Please refresh the page.');
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setRestoreMessage('Error restoring backup. Please check the file format.');
      }
    } catch (error) {
      setRestoreMessage('Error restoring backup. Please try again.');
    } finally {
      setIsRestoring(false);
      setTimeout(() => setRestoreMessage(''), 5000);
    }
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold mb-4">数据管理 / Data Management</h3>
      
      <div className="space-y-4">
        {/* Backup Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">创建备份 / Create Backup</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            下载完整的联赛数据备份文件，包含所有队伍、赛程和比赛结果。
          </p>
          <button
            onClick={handleCreateBackup}
            className="btn-gold"
          >
            📥 下载备份 / Download Backup
          </button>
        </div>

        {/* Restore Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">恢复备份 / Restore Backup</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            从备份文件恢复联赛数据。注意：这将覆盖当前所有数据！
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleRestoreBackup}
            disabled={isRestoring}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-league-accent file:text-white hover:file:bg-league-highlight disabled:opacity-50"
          />
          {isRestoring && (
            <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
              🔄 正在恢复备份... / Restoring backup...
            </div>
          )}
        </div>

        {/* Status Message */}
        {restoreMessage && (
          <div className={`p-3 rounded-lg text-sm ${
            restoreMessage.includes('successfully') 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {restoreMessage}
          </div>
        )}

        {/* Data Info */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">数据信息 / Data Information</h4>
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p>• 7 支队伍 / 7 Teams</p>
            <p>• 86 名球员 / 86 Players</p>
            <p>• 21 场比赛 / 21 Games</p>
            <p>• 数据大小约 150KB / Data size ~150KB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
