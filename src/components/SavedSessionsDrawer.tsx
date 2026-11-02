import React from 'react';
import { SavedStudentSession } from '../types/recommender';
import {
  FolderClock,
  CheckCircle2,
  Play,
  Trash2,
  X,
  Award,
  Calendar,
  Briefcase,
} from 'lucide-react';

interface SavedSessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: SavedStudentSession[];
  onSelectSession: (session: SavedStudentSession) => void;
  onDeleteSession: (id: string) => void;
}

export function SavedSessionsDrawer({
  isOpen,
  onClose,
  sessions,
  onSelectSession,
  onDeleteSession,
}: SavedSessionsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/75 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full sm:max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FolderClock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Riwayat Proyek Siswa</h3>
              <p className="text-xs text-slate-400">Proyek yang tersimpan di perangkat ini</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {sessions.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <FolderClock className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">Belum ada riwayat tersimpan</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Setelah Anda merekomendasikan proyek atau menandai langkah di jobsheet, Anda dapat menyimpannya untuk dilanjutkan nanti.
              </p>
            </div>
          ) : (
            sessions.map((sess) => {
              const projTitle = sess.activeProject?.title || `${sess.recommendedProjects.length} Rekomendasi Proyek`;
              const isDone = sess.isCompleted;

              return (
                <div
                  key={sess.id}
                  className="bg-slate-950/70 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        {sess.targetProfession}
                      </span>
                      <h4 className="font-bold text-sm text-white mt-1 leading-snug">
                        {projTitle}
                      </h4>
                    </div>
                    {isDone ? (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Selesai
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30">
                        Dalam Proses
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>
                      Sumber Daya: {sess.resources.tools.length} Alat, {sess.resources.materials.length} Bahan
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(sess.timestamp).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onDeleteSession(sess.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                    <button
                      onClick={() => {
                        onSelectSession(sess);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Play className="w-3 h-3" />
                      Buka Proyek
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-500">
          Data tersimpan secara lokal di browser Anda
        </div>
      </div>
    </div>
  );
}
