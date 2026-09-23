import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { Bell, X, CheckCheck, Trash2, Send, AlertTriangle, AlertCircle, CheckCircle, Info, ExternalLink } from 'lucide-react';

export default function NotificationDrawer() {
  const {
    isNotificationDrawerOpen,
    closeNotificationDrawer,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setActiveView,
    triggerWebhook,
    webhookLogs
  } = useProject();

  const [activeTab, setActiveTab] = useState('notifications'); // 'notifications' | 'webhooks'

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={closeNotificationDrawer} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-300">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-tight">Notification Center</h3>
                <p className="text-[11px] text-slate-400">Real-time alerts & webhook activity stream</p>
              </div>
            </div>
            <button
              onClick={closeNotificationDrawer}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-4 pt-2">
            <button
              onClick={() => setActiveTab('notifications')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Alerts & Notifications</span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white font-black rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('webhooks')}
              className={`pb-2 px-3 text-xs font-bold border-b-2 flex items-center space-x-1.5 transition-colors ${
                activeTab === 'webhooks'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>Slack/Teams Webhooks</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 font-bold rounded-full">
                LIVE
              </span>
            </button>
          </div>

          {/* Main Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {activeTab === 'notifications' ? (
              <>
                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">
                    {notifications.length} Total ({unreadCount} Unread)
                  </span>
                  <div className="flex items-center space-x-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center space-x-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Mark all read</span>
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearNotifications}
                        className="text-slate-400 hover:text-rose-600 font-semibold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear</span>
                      </button>
                    )}
                  </div>
                </div>

                {notifications.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                    <p className="font-semibold">No notifications right now</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">System alerts will appear here in real-time</p>
                  </div>
                ) : (
                  notifications.map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        notif.read
                          ? 'bg-white border-slate-100 opacity-75'
                          : 'bg-indigo-50/40 border-indigo-100 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {notif.type === 'risk' && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
                          {notif.type === 'alert' && <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />}
                          {notif.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />}
                          {notif.type === 'info' && <Info className="w-4 h-4 text-indigo-500 shrink-0" />}
                          <h4 className={`font-bold ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                            {notif.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1 pl-6 leading-relaxed text-[11px]">
                        {notif.message}
                      </p>
                      {notif.view && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveView(notif.view);
                            closeNotificationDrawer();
                          }}
                          className="mt-2 ml-6 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
                        >
                          <span>Open {notif.view} view</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </>
            ) : (
              /* Webhooks Tab */
              <div className="space-y-4">
                <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Slack & MS Teams Dispatcher</span>
                    <button
                      onClick={() => triggerWebhook('manual_test')}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-2.5 py-1 rounded-md flex items-center space-x-1 shadow-2xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Send Test Payload</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Kinetix dispatches structured JSON payloads to incoming webhooks when milestone events occur.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700">Dispatch Activity Log</h4>
                  {webhookLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">No webhooks sent yet</p>
                  ) : (
                    webhookLogs.map(log => (
                      <div key={log.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 font-mono">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-indigo-600 uppercase">{log.event}</span>
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                              {log.status} OK
                            </span>
                            <span className="text-slate-400">{log.timestamp}</span>
                          </div>
                        </div>
                        <pre className="text-[10px] bg-white p-2 rounded border border-slate-200 text-slate-700 overflow-x-auto">
                          {JSON.stringify(log.payload, null, 2)}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
