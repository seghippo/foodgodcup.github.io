'use client';

import { useState, useRef } from 'react';
import { createFullBackup, restoreFromBackup, exportMatchResults, exportSchedule, uploadDataToShared, downloadLatestData, restoreFromSharedFile, getLastSyncInfo, syncToCloud, syncFromCloud, getCloudSyncInfo } from '@/lib/data';
import { useLanguage } from '@/lib/language';

interface DataManagementProps {
  captainName?: string;
}

export function DataManagement({ captainName }: DataManagementProps) {
  const { t } = useLanguage();
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [syncInfo, setSyncInfo] = useState(getLastSyncInfo());
  const [cloudSyncInfo, setCloudSyncInfo] = useState(getCloudSyncInfo());
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sharedFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadData = () => {
    try {
      uploadDataToShared();
      setSyncMessage('Data uploaded successfully! Other devices can now sync.');
      setSyncInfo(getLastSyncInfo());
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      setSyncMessage('Error uploading data. Please try again.');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const handleDownloadData = () => {
    try {
      const success = downloadLatestData();
      if (success) {
        setSyncMessage('Data synced successfully! Please refresh the page.');
        setSyncInfo(getLastSyncInfo());
      } else {
        setSyncMessage('No shared data found to sync.');
      }
      setTimeout(() => setSyncMessage(''), 3000);
    } catch (error) {
      setSyncMessage('Error syncing data. Please try again.');
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const handleRestoreSharedFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setSyncMessage('');

    try {
      const success = await restoreFromSharedFile(file);
      if (success) {
        setSyncMessage('Shared data restored successfully! Please refresh the page.');
        setSyncInfo(getLastSyncInfo());
        // Clear the file input
        if (sharedFileInputRef.current) {
          sharedFileInputRef.current.value = '';
        }
      } else {
        setSyncMessage('Error restoring shared data. Please check the file format.');
      }
    } catch (error) {
      setSyncMessage('Error restoring shared data. Please try again.');
    } finally {
      setIsRestoring(false);
      setTimeout(() => setSyncMessage(''), 5000);
    }
  };

  const handleSyncToCloud = async () => {
    setIsSyncing(true);
    setSyncMessage('');

    try {
      const success = await syncToCloud(captainName);
      if (success) {
        const message = captainName 
          ? `Data synced to cloud for captain ${captainName}! Other devices can now sync.`
          : 'Data synced to cloud successfully! Other devices can now sync.';
        setSyncMessage(message);
        setCloudSyncInfo(getCloudSyncInfo());
      } else {
        setSyncMessage('Error syncing to cloud. Please try again.');
      }
    } catch (error) {
      setSyncMessage('Error syncing to cloud. Please try again.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 3000);
    }
  };

  const handleSyncFromCloud = async () => {
    setIsSyncing(true);
    setSyncMessage('');

    try {
      const success = await syncFromCloud(captainName);
      if (success) {
        const message = captainName 
          ? `Data synced from cloud for captain ${captainName}! Please refresh the page.`
          : 'Data synced from cloud successfully! Please refresh the page.';
        setSyncMessage(message);
        setCloudSyncInfo(getCloudSyncInfo());
      } else {
        setSyncMessage('No data found on cloud to sync.');
      }
    } catch (error) {
      setSyncMessage('Error syncing from cloud. Please try again.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncMessage(''), 3000);
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
          </div>
        </div>

        {/* Data Sync Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">数据同步 / Data Sync</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            在不同设备间同步数据，解决设备依赖问题。
          </p>
          
          {/* Sync Status */}
          {syncInfo.hasSharedData && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <p className="text-blue-800 dark:text-blue-200">
                📊 共享数据可用 / Shared data available
              </p>
              <p className="text-blue-600 dark:text-blue-300 text-xs">
                上次上传: {new Date(syncInfo.lastUpload!).toLocaleString()} | 
                游戏: {syncInfo.dataCount?.games} | 
                结果: {syncInfo.dataCount?.results}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={handleUploadData}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
            >
              📤 上传数据 / Upload Data
            </button>
            <button
              onClick={handleDownloadData}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors text-sm"
            >
              📥 下载数据 / Download Data
            </button>
          </div>
          
          {/* File-based sync */}
          <div className="mt-3">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
              或通过文件同步 / Or sync via file:
            </p>
            <input
              ref={sharedFileInputRef}
              type="file"
              accept=".json"
              onChange={handleRestoreSharedFile}
              disabled={isRestoring}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-600 file:text-white hover:file:bg-purple-700 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Cloud Sync Section */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
          <h4 className="font-medium mb-2">云端同步 / Cloud Sync</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            通过云端存储实现跨设备数据同步，无需手动传输文件。
          </p>
          
          {/* Cloud Sync Status */}
          {cloudSyncInfo.hasData && (
            <div className="mb-3 p-2 bg-green-50 dark:bg-green-900/20 rounded text-sm">
              <p className="text-green-800 dark:text-green-200">
                ☁️ 云端数据可用 / Cloud data available
              </p>
              <p className="text-green-600 dark:text-green-300 text-xs">
                上次同步: {new Date(cloudSyncInfo.lastSync!).toLocaleString()} | 
                游戏: {cloudSyncInfo.dataCount?.games} | 
                结果: {cloudSyncInfo.dataCount?.results}
              </p>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSyncToCloud}
              disabled={isSyncing}
              className="px-4 py-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isSyncing ? '同步中...' : '☁️ 同步到云端 / Sync to Cloud'}
            </button>
            <button
              onClick={handleSyncFromCloud}
              disabled={isSyncing}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              {isSyncing ? '同步中...' : '📥 从云端同步 / Sync from Cloud'}
            </button>
          </div>
          
          <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs">
            <p className="text-blue-800 dark:text-blue-200">
              💡 提示: 先在移动设备上&ldquo;同步到云端&rdquo;，然后在电脑上&ldquo;从云端同步&rdquo;
            </p>
          </div>
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

        {/* Status Messages */}
        {(restoreMessage || syncMessage) && (
          <div className={`p-3 rounded-lg text-sm ${
            (restoreMessage.includes('successfully') || syncMessage.includes('successfully')) 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {restoreMessage || syncMessage}
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
