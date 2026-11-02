import React, { useState, useEffect } from 'react';
import {
  AvailableResources,
  RecommendedProject,
  SavedStudentSession,
  SavedProjectIdea,
} from './types/recommender';
import {
  recommendProjectsForStudent,
  POPULAR_VOCATION_FIELDS,
} from './utils/projectRecommender';
import { Navbar } from './components/Navbar';
import { ProfessionStep } from './components/ProfessionStep';
import { ResourcesStep } from './components/ResourcesStep';
import { RecommendationsStep } from './components/RecommendationsStep';
import { InteractiveJobsheetModal } from './components/InteractiveJobsheetModal';
import { SavedSessionsDrawer } from './components/SavedSessionsDrawer';
import { VocationBankView } from './components/VocationBankView';
import { AiProjectGeneratorModal } from './components/AiProjectGeneratorModal';
import {
  Sparkles,
  Briefcase,
  Wrench,
  Package,
  Layers,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Copy,
  Check,
  Clock,
  Award,
  Play,
  Lightbulb,
  Edit3,
  Calendar,
  Database,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  fetchUserFirestoreIdeas,
  saveUserFirestoreIdea,
  deleteUserFirestoreIdea,
  fetchUserFirestoreSessions,
  saveUserFirestoreSession,
  deleteUserFirestoreSession,
} from './firebase';
import {
  checkServerDatabaseStatus,
  fetchServerIdeas,
  saveServerIdea,
  deleteServerIdea,
  fetchServerSessions,
  saveServerSession,
  deleteServerSession,
  DatabaseStatus,
} from './services/databaseService';

export default function App() {
  // Current step in generator: 1 = Profession, 2 = Resources, 3 = Recommendations
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Active top navigation view: 'generator' | 'saved' | 'vocations' | 'inventory'
  const [activeView, setActiveView] = useState<'generator' | 'saved' | 'vocations' | 'inventory'>('generator');

  // Input State: Targeted Profession
  const [targetProfession, setTargetProfession] = useState<string>(() => {
    return localStorage.getItem('vocation_target_profession') || 'Teknik Sepeda Motor & Otomotif (TBSM / TKRO)';
  });

  // Input State: Available Resources (Tools and Materials around the student)
  const [availableResources, setAvailableResources] = useState<AvailableResources>(() => {
    try {
      const saved = localStorage.getItem('vocation_available_resources');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      tools: ['Obeng Plus & Minus', 'Tang Kombinasi', 'Sikat Kawat Kecil / Ampelas Halus'],
      materials: ['Busi Bekas Sepeda Motor', 'Kain Lap / Majun', 'Baut & Mur'],
    };
  });

  // Generated recommendations
  const [recommendedProjects, setRecommendedProjects] = useState<RecommendedProject[]>([]);

  // Active interactive jobsheet modal
  const [activeModalProject, setActiveModalProject] = useState<RecommendedProject | null>(null);

  // Saved student sessions in localStorage
  const [savedSessions, setSavedSessions] = useState<SavedStudentSession[]>(() => {
    try {
      const saved = localStorage.getItem('vocation_saved_sessions');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Saved project ideas in localStorage
  const [savedProjectIdeas, setSavedProjectIdeas] = useState<SavedProjectIdea[]>(() => {
    try {
      const saved = localStorage.getItem('vocation_saved_project_ideas');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Active sub-tab inside Saved View: 'ideas' | 'jobsheets'
  const [savedSubTab, setSavedSubTab] = useState<'ideas' | 'jobsheets'>('ideas');

  // Inline note editing state
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  // Drawer & modal status
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Authentication State: Google Account
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  // Server Database Status
  const [dbStatus, setDbStatus] = useState<DatabaseStatus | null>(null);
  const [isSyncingDb, setIsSyncingDb] = useState(false);

  // Sync inputs to localStorage
  useEffect(() => {
    localStorage.setItem('vocation_target_profession', targetProfession);
  }, [targetProfession]);

  useEffect(() => {
    localStorage.setItem('vocation_available_resources', JSON.stringify(availableResources));
  }, [availableResources]);

  useEffect(() => {
    localStorage.setItem('vocation_saved_sessions', JSON.stringify(savedSessions));
  }, [savedSessions]);

  useEffect(() => {
    localStorage.setItem('vocation_saved_project_ideas', JSON.stringify(savedProjectIdeas));
  }, [savedProjectIdeas]);

  // Listener Autentikasi Akun Google & Sinkronisasi Cloud Firestore Pengguna
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        try {
          const [cloudIdeas, cloudSessions] = await Promise.all([
            fetchUserFirestoreIdeas(user.uid),
            fetchUserFirestoreSessions(user.uid),
          ]);

          if (cloudIdeas && cloudIdeas.length > 0) {
            setSavedProjectIdeas((prev) => {
              const merged = [...prev];
              cloudIdeas.forEach((cIdea) => {
                const exists = merged.some(
                  (m) => m.id === cIdea.id || m.project?.id === cIdea.project?.id
                );
                if (!exists) merged.push(cIdea);
              });
              return merged;
            });
          }

          if (cloudSessions && cloudSessions.length > 0) {
            setSavedSessions((prev) => {
              const merged = [...prev];
              cloudSessions.forEach((cSession) => {
                const exists = merged.some(
                  (m) =>
                    m.id === cSession.id ||
                    (m.activeProject?.id &&
                      cSession.activeProject?.id &&
                      m.activeProject.id === cSession.activeProject.id)
                );
                if (!exists) merged.push(cSession);
              });
              return merged;
            });
          }
        } catch (err) {
          console.warn('Gagal memuat data pengguna dari Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sinkronisasi data awal dengan Server Database Gratis saat pertama dibuka
  useEffect(() => {
    let isMounted = true;

    async function loadServerData() {
      setIsSyncingDb(true);
      try {
        const [status, serverIdeas, serverSessions] = await Promise.all([
          checkServerDatabaseStatus(),
          fetchServerIdeas(),
          fetchServerSessions(),
        ]);

        if (!isMounted) return;
        setDbStatus(status);

        // Gabungkan ide proyek dari server database ke state lokal jika belum ada
        if (serverIdeas && serverIdeas.length > 0) {
          setSavedProjectIdeas((localIdeas) => {
            const merged = [...localIdeas];
            serverIdeas.forEach((sIdea) => {
              const exists = merged.some(
                (m) => m.id === sIdea.id || m.project?.id === sIdea.project?.id
              );
              if (!exists) {
                merged.push(sIdea);
              }
            });
            return merged;
          });
        }

        // Gabungkan sesi lembar kerja dari server database ke state lokal jika belum ada
        if (serverSessions && serverSessions.length > 0) {
          setSavedSessions((localSessions) => {
            const merged = [...localSessions];
            serverSessions.forEach((sSession) => {
              const exists = merged.some(
                (m) =>
                  m.id === sSession.id ||
                  (m.activeProject?.id &&
                    sSession.activeProject?.id &&
                    m.activeProject.id === sSession.activeProject.id)
              );
              if (!exists) {
                merged.push(sSession);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.warn('Gagal sinkronisasi data awal dengan server database:', err);
      } finally {
        if (isMounted) setIsSyncingDb(false);
      }
    }

    loadServerData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Recalculate recommendations whenever profession or resources change
  useEffect(() => {
    if (targetProfession) {
      const recs = recommendProjectsForStudent(targetProfession, availableResources);
      setRecommendedProjects(recs);
    }
  }, [targetProfession, availableResources]);

  // Login dengan Google
  const handleSignInWithGoogle = async () => {
    setIsAuthLoading(true);
    try {
      const user = await signInWithGoogle();
      showToast(
        `Selamat datang, ${user.displayName || user.email}! Token akun Google aktif.`
      );
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        showToast('Gagal masuk dengan Google. Silakan coba kembali.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Logout akun Google
  const handleSignOut = async () => {
    try {
      await signOutUser();
      showToast('Berhasil keluar dari akun Google.');
    } catch (err) {
      showToast('Gagal keluar.');
    }
  };

  // Handle saving a session (disimpan ke localStorage, Server Database Gratis, & Firestore Akun Pengguna)
  const handleSaveActiveSession = (
    notes: string,
    completedStepIndices: number[],
    updatedProject?: RecommendedProject
  ) => {
    const projToSave = updatedProject || activeModalProject;
    if (!projToSave) return;

    if (updatedProject) {
      setActiveModalProject(updatedProject);
      setRecommendedProjects((prev) =>
        prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
      );
    }

    const newSession: SavedStudentSession = {
      id: `session-${Date.now()}`,
      studentName: currentUser?.displayName || 'Siswa SMK Vokasi',
      schoolName: 'SMKN 4 Kendari',
      targetProfession,
      resources: availableResources,
      recommendedProjects,
      activeProject: projToSave,
      completedStepIndices,
      projectNotes: notes,
      isCompleted: completedStepIndices.length === projToSave.steps.length,
      timestamp: new Date().toISOString(),
    };

    setSavedSessions((prev) => [
      newSession,
      ...prev.filter((s) => s.activeProject?.id !== projToSave.id),
    ]);

    // Simpan ke Server Database Gratis secara otomatis
    saveServerSession(newSession).catch((err) =>
      console.warn('Gagal menyimpan sesi ke server database:', err)
    );

    // Simpan ke Cloud Firestore akun Google pengguna jika sedang login
    if (currentUser) {
      saveUserFirestoreSession(currentUser.uid, newSession).catch((err) =>
        console.warn('Gagal menyimpan sesi ke Firestore akun pengguna:', err)
      );
    }
  };

  const handleUpdateActiveProject = (updatedProject: RecommendedProject) => {
    setActiveModalProject(updatedProject);
    setRecommendedProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
    setSavedProjectIdeas((prev) =>
      prev.map((item) =>
        item.project.id === updatedProject.id ? { ...item, project: updatedProject } : item
      )
    );
  };

  const handleDeleteSession = (id: string) => {
    setSavedSessions((prev) => prev.filter((s) => s.id !== id));
    // Hapus dari Server Database Gratis
    deleteServerSession(id).catch((err) =>
      console.warn('Gagal menghapus sesi dari server database:', err)
    );
    // Hapus dari Cloud Firestore pengguna jika login
    if (currentUser) {
      deleteUserFirestoreSession(currentUser.uid, id).catch((err) =>
        console.warn('Gagal menghapus sesi dari Firestore akun pengguna:', err)
      );
    }
    showToast('Lembar kerja praktik telah dihapus dari database.');
  };

  const handleRestoreSession = (session: SavedStudentSession) => {
    setTargetProfession(session.targetProfession);
    setAvailableResources(session.resources);
    if (session.activeProject) {
      setActiveModalProject(session.activeProject);
    }
    setCurrentStep(3);
    setActiveView('generator');
  };

  const handleResetSession = () => {
    setTargetProfession('');
    setAvailableResources({ tools: [], materials: [] });
    setCurrentStep(1);
    setActiveView('generator');
  };

  const handleAddAiProject = (newProject: RecommendedProject) => {
    setRecommendedProjects((prev) => [newProject, ...prev]);
  };

  // Handle saving a project idea (either newly generated by AI or bookmarked)
  const handleSaveProjectIdea = (project: RecommendedProject, note?: string) => {
    const isAi =
      project.id.startsWith('sim-gemini') ||
      project.id.startsWith('sim-ai') ||
      project.title.includes('AI Gemini');

    setSavedProjectIdeas((prev) => {
      const existingIdx = prev.findIndex((item) => item.project.id === project.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        const updatedIdea = {
          ...updated[existingIdx],
          notes: note !== undefined ? note : updated[existingIdx].notes,
          savedAt: new Date().toISOString(),
        };
        updated[existingIdx] = updatedIdea;
        // Update di server database
        saveServerIdea(updatedIdea).catch((err) =>
          console.warn('Gagal update ide di server database:', err)
        );
        // Update di Cloud Firestore akun pengguna jika login
        if (currentUser) {
          saveUserFirestoreIdea(currentUser.uid, updatedIdea).catch((err) =>
            console.warn('Gagal update ide ke Firestore akun pengguna:', err)
          );
        }
        return updated;
      }

      const newIdea: SavedProjectIdea = {
        id: `idea-${project.id}-${Date.now()}`,
        project,
        savedAt: new Date().toISOString(),
        notes: note || '',
        isAiGenerated: isAi,
      };

      // Simpan ke Server Database Gratis
      saveServerIdea(newIdea).catch((err) =>
        console.warn('Gagal menyimpan ide ke server database:', err)
      );

      // Simpan ke Cloud Firestore akun pengguna jika login
      if (currentUser) {
        saveUserFirestoreIdea(currentUser.uid, newIdea).catch((err) =>
          console.warn('Gagal menyimpan ide ke Firestore akun pengguna:', err)
        );
      }

      return [newIdea, ...prev];
    });

    const cleanTitle = project.title.replace(/^[✨\s\[\]A-Za-z]+\]?\s*/, '');
    showToast(`Ide proyek "${cleanTitle}" berhasil disimpan ke akun & database!`);
  };

  const handleRemoveProjectIdea = (projectIdOrIdeaId: string) => {
    setSavedProjectIdeas((prev) =>
      prev.filter((item) => item.id !== projectIdOrIdeaId && item.project.id !== projectIdOrIdeaId)
    );
    // Hapus dari Server Database Gratis
    deleteServerIdea(projectIdOrIdeaId).catch((err) =>
      console.warn('Gagal menghapus ide dari server database:', err)
    );
    // Hapus dari Firestore akun pengguna jika login
    if (currentUser) {
      deleteUserFirestoreIdea(currentUser.uid, projectIdOrIdeaId).catch((err) =>
        console.warn('Gagal menghapus ide dari Firestore akun pengguna:', err)
      );
    }
    showToast('Ide proyek telah dihapus dari database.');
  };

  const isProjectIdeaSaved = (projectId: string) => {
    return savedProjectIdeas.some((item) => item.project.id === projectId);
  };

  const handleUpdateIdeaNote = (ideaId: string, newNote: string) => {
    let targetIdea: SavedProjectIdea | undefined;
    setSavedProjectIdeas((prev) =>
      prev.map((item) => {
        if (item.id === ideaId) {
          targetIdea = { ...item, notes: newNote };
          return targetIdea;
        }
        return item;
      })
    );
    if (targetIdea) {
      saveServerIdea(targetIdea).catch((err) =>
        console.warn('Gagal update catatan di server database:', err)
      );
      if (currentUser) {
        saveUserFirestoreIdea(currentUser.uid, targetIdea).catch((err) =>
          console.warn('Gagal update catatan di Firestore pengguna:', err)
        );
      }
    }
    setEditingIdeaId(null);
    showToast('Catatan proyek berhasil diperbarui dan disimpan ke server & akun.');
  };

  const handleCopyIdeaSummary = (idea: SavedProjectIdea) => {
    const cleanTitle = idea.project.title.replace(/^[✨\s\[\]A-Za-z]+\]?\s*/, '');
    const summary = `📌 RANCANGAN PROYEK VOKASI: ${cleanTitle}
Profesi Target: ${idea.project.targetProfession}
Tingkat Kesulitan: ${idea.project.difficulty} | Waktu: ${idea.project.estimatedHours}
Kesiapan Sumber Daya: ${idea.project.readinessPercentage}%

ALASAN REPRESENTASI:
${idea.project.representationRationale}

ALAT YANG DIGUNAKAN:
${idea.project.toolsUsed.map((t) => `- ${t.name}`).join('\n')}

BAHAN BAKU:
${idea.project.materialsUsed.map((m) => `- ${m.name}`).join('\n')}

OUTPUT SISWA:
${idea.project.deliverable}
${idea.notes ? `\nCATATAN SISWA:\n${idea.notes}` : ''}`;

    navigator.clipboard.writeText(summary);
    showToast('Ringkasan ide proyek berhasil disalin ke clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden w-full">
      {/* Top Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        savedIdeasCount={savedProjectIdeas.length}
        savedSessionsCount={savedSessions.length}
        onResetSession={handleResetSession}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        currentUser={currentUser}
        onSignInWithGoogle={handleSignInWithGoogle}
        onSignOut={handleSignOut}
        isAuthLoading={isAuthLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {activeView === 'generator' && (
          <div className="space-y-6">
            {/* Step Wizard Indicator */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 sm:p-5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between max-w-3xl mx-auto relative px-1 sm:px-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-800 -translate-y-1/2 z-0 hidden sm:block">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300"
                    style={{
                      width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
                    }}
                  ></div>
                </div>

                {/* Step 1 */}
                <button
                  onClick={() => setCurrentStep(1)}
                  className={`relative z-10 flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:py-1.5 rounded-xl text-left transition-all min-h-[44px] ${
                    currentStep === 1
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                      : currentStep > 1
                      ? 'bg-slate-800 text-emerald-400 font-semibold hover:bg-slate-750'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                  aria-label="Langkah 1: Profesi Siswa"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950/60 flex items-center justify-center text-xs font-bold shrink-0">
                    {currentStep > 1 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : '1'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] block opacity-70 uppercase tracking-wider">Langkah 1</span>
                    <span className="text-xs">Profesi Siswa</span>
                  </div>
                </button>

                {/* Step 2 */}
                <button
                  onClick={() => {
                    if (targetProfession) setCurrentStep(2);
                  }}
                  disabled={!targetProfession}
                  className={`relative z-10 flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:py-1.5 rounded-xl text-left transition-all min-h-[44px] ${
                    currentStep === 2
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                      : currentStep > 2
                      ? 'bg-slate-800 text-emerald-400 font-semibold hover:bg-slate-750'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                  aria-label="Langkah 2: Rekomendasi Alat & Bahan AI"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950/60 flex items-center justify-center text-xs font-bold shrink-0">
                    {currentStep > 2 ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : '2'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] block opacity-70 uppercase tracking-wider">Langkah 2</span>
                    <span className="text-xs">Rekomendasi Alat & Bahan AI</span>
                  </div>
                </button>

                {/* Step 3 */}
                <button
                  onClick={() => {
                    if (targetProfession) setCurrentStep(3);
                  }}
                  disabled={!targetProfession}
                  className={`relative z-10 flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:py-1.5 rounded-xl text-left transition-all min-h-[44px] ${
                    currentStep === 3
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400'
                      : 'bg-slate-900 text-slate-500'
                  }`}
                  aria-label="Langkah 3: Purwarupa & Jobsheet"
                >
                  <div className="w-7 h-7 rounded-lg bg-slate-950/60 flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] block opacity-70 uppercase tracking-wider">Langkah 3</span>
                    <span className="text-xs">Purwarupa & Jobsheet</span>
                  </div>
                </button>
              </div>

              {/* Mobile Step Status Label */}
              <div className="sm:hidden pt-1 border-t border-slate-800/80 text-center">
                <span className="text-[11px] font-medium text-slate-400">
                  {currentStep === 1 && '📍 Langkah 1: Tentukan Profesi / Kejuruan Siswa'}
                  {currentStep === 2 && '⚡ Langkah 2: Rekomendasi Alat & Bahan Purwarupa AI'}
                  {currentStep === 3 && '🚀 Langkah 3: Simulasi Proyek & Panduan Jobsheet'}
                </span>
              </div>
            </div>

            {/* Step Contents */}
            {currentStep === 1 && (
              <ProfessionStep
                selectedProfession={targetProfession}
                onSelectProfession={(prof) => {
                  setTargetProfession(prof);
                  setCurrentStep(2);
                }}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <ResourcesStep
                selectedProfession={targetProfession}
                resources={availableResources}
                onChangeResources={setAvailableResources}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <RecommendationsStep
                selectedProfession={targetProfession}
                resources={availableResources}
                projects={recommendedProjects}
                onOpenSimulation={(proj) => setActiveModalProject(proj)}
                onBackToResources={() => setCurrentStep(2)}
                onBackToProfession={() => setCurrentStep(1)}
                onAddAiProject={handleAddAiProject}
                onOpenAiModal={() => setIsAiModalOpen(true)}
                onSaveProjectIdea={handleSaveProjectIdea}
                onRemoveProjectIdea={handleRemoveProjectIdea}
                isProjectSaved={isProjectIdeaSaved}
              />
            )}
          </div>
        )}

        {/* View: Riwayat & Ide Tersimpan */}
        {activeView === 'saved' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header Ringkasan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                    <Bookmark className="w-3.5 h-3.5" /> Koleksi & Riwayat Praktik Siswa
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <Database className="w-3 h-3" />
                    <span>Server Database: Aktif (Hosting Gratis)</span>
                  </div>
                  {currentUser ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/40 text-[11px] font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      <span>Token Google: {currentUser.displayName || currentUser.email}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleSignInWithGoogle}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-semibold transition-all active:scale-95"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>Login Google untuk Sinkron Akun</span>
                    </button>
                  )}
                  {isSyncingDb && (
                    <span className="text-[11px] text-slate-400 animate-pulse flex items-center gap-1">
                      <Server className="w-3 h-3 text-indigo-400" />
                      Menyinkronkan data...
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-2xl font-bold text-white">
                  Koleksi Ide Proyek & Lembar Kerja Tersimpan
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Kelola ide proyek yang dirancang oleh AI Gemini, simpan catatan pembelajaran, atau lanjutkan lembar kerja praktik mandiri siswa. Tersimpan otomatis di server database gratis & perangkat lokal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsAiModalOpen(true)}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Rancang Ide Baru</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setActiveView('generator');
                  }}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <span>Mulai Rekomendasi</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Ide Tersimpan vs Jobsheets */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setSavedSubTab('ideas')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  savedSubTab === 'ideas'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                <Bookmark className="w-4 h-4 text-amber-300" />
                <span>Ide Rancangan Proyek</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-[11px] font-mono">
                  {savedProjectIdeas.length}
                </span>
              </button>

              <button
                onClick={() => setSavedSubTab('jobsheets')}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                  savedSubTab === 'jobsheets'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Lembar Kerja Praktik (Jobsheets)</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-950/80 text-[11px] font-mono">
                  {savedSessions.length}
                </span>
              </button>
            </div>

            {/* TAB 1: Ide Rancangan Proyek Tersimpan */}
            {savedSubTab === 'ideas' && (
              <div className="space-y-4">
                {savedProjectIdeas.length === 0 ? (
                  <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
                    <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="font-semibold text-slate-300 text-sm">
                      Belum Ada Rancangan Ide Proyek yang Disimpan
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                      Gunakan fitur <strong>"Rancang AI"</strong> untuk membuat ide simulasi proyek baru dengan AI Gemini, atau klik tombol <strong>"Simpan Ide"</strong> pada kartu rekomendasi agar tersimpan di sini.
                    </p>
                    <div className="pt-2 flex justify-center gap-2">
                      <button
                        onClick={() => setIsAiModalOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Rancang Ide dengan AI Gemini</span>
                      </button>
                      <button
                        onClick={() => {
                          setCurrentStep(3);
                          setActiveView('generator');
                        }}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5"
                      >
                        <span>Jelajahi Rekomendasi</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {savedProjectIdeas.map((idea) => {
                      const proj = idea.project;
                      const isAi = idea.isAiGenerated || proj.title.includes('AI Gemini');
                      const isEditing = editingIdeaId === idea.id;

                      return (
                        <div
                          key={idea.id}
                          className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 sm:p-6 shadow-lg space-y-4 flex flex-col justify-between transition-all"
                        >
                          <div className="space-y-3">
                            {/* Badges & Timestamp */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300">
                                  {proj.targetProfession}
                                </span>
                                {isAi && (
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center gap-1">
                                    <Sparkles className="w-3 h-3 text-amber-300" />
                                    AI Gemini
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(idea.savedAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            {/* Project Title */}
                            <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                              {proj.title}
                            </h3>

                            {/* Rationale */}
                            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                              <span className="text-indigo-300 font-semibold text-[11px] flex items-center gap-1">
                                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                                Representasi Kejuruan:
                              </span>
                              <p className="line-clamp-3 text-slate-300 leading-relaxed">
                                {proj.representationRationale}
                              </p>
                            </div>

                            {/* Info Bar: Readiness, Hours, Tools, Materials */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                <span className="text-[10px] text-slate-400 block">Kesiapan Alat/Bahan:</span>
                                <span className="text-emerald-400 font-bold">{proj.readinessPercentage}% Siap</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                                <span className="text-[10px] text-slate-400 block">Waktu & Kesulitan:</span>
                                <span className="text-slate-200 font-semibold">{proj.estimatedHours} • {proj.difficulty}</span>
                              </div>
                            </div>

                            {/* Deliverable & Badge */}
                            <div className="text-xs text-slate-400">
                              <strong className="text-slate-300 block mb-0.5">Output Siswa:</strong>
                              <p className="text-slate-300 line-clamp-2">{proj.deliverable}</p>
                            </div>

                            {/* Catatan Siswa */}
                            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-indigo-300 text-[11px] flex items-center gap-1">
                                  <Bookmark className="w-3 h-3 text-amber-400" />
                                  Catatan Siswa:
                                </span>
                                {!isEditing && (
                                  <button
                                    onClick={() => {
                                      setEditingIdeaId(idea.id);
                                      setTempNoteText(idea.notes || '');
                                    }}
                                    className="text-[10px] text-slate-400 hover:text-indigo-300 flex items-center gap-0.5"
                                  >
                                    <Edit3 className="w-2.5 h-2.5" />
                                    <span>Ubah Catatan</span>
                                  </button>
                                )}
                              </div>

                              {isEditing ? (
                                <div className="space-y-2 mt-1.5">
                                  <input
                                    type="text"
                                    value={tempNoteText}
                                    onChange={(e) => setTempNoteText(e.target.value)}
                                    placeholder="Tulis catatan atau rencana praktik..."
                                    className="w-full bg-slate-900 border border-indigo-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <button
                                      onClick={() => setEditingIdeaId(null)}
                                      className="px-2 py-1 text-[10px] text-slate-400 hover:text-white"
                                    >
                                      Batal
                                    </button>
                                    <button
                                      onClick={() => handleUpdateIdeaNote(idea.id, tempNoteText)}
                                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-[10px] rounded-md shadow"
                                    >
                                      Simpan
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-slate-300 italic">
                                  {idea.notes ? `"${idea.notes}"` : '(Belum ada catatan khusus)'}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Action Footer */}
                          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleRemoveProjectIdea(idea.id)}
                                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors text-xs flex items-center gap-1"
                                title="Hapus dari ide tersimpan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Hapus</span>
                              </button>
                              <button
                                onClick={() => handleCopyIdeaSummary(idea)}
                                className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1"
                                title="Salin ringkasan ide proyek"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Salin</span>
                              </button>
                            </div>

                            <button
                              onClick={() => setActiveModalProject(proj)}
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Buka Jobsheet</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Progres Lembar Kerja / Jobsheet */}
            {savedSubTab === 'jobsheets' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedSessions.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl space-y-3">
                    <Layers className="w-10 h-10 text-slate-600 mx-auto" />
                    <h4 className="font-semibold text-slate-300 text-sm">Belum Ada Progres Lembar Kerja</h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Buka panduan langkah kerja (jobsheet) proyek mana pun, lalu centang langkah yang selesai dan simpan progres Anda.
                    </p>
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setActiveView('generator');
                      }}
                      className="mt-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                    >
                      <span>Mulai Proyek Pertama</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  savedSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-indigo-400 truncate max-w-[180px]">
                            {sess.targetProfession}
                          </span>
                          {sess.isCompleted ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Selesai
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30">
                              Dalam Proses
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-base leading-snug">
                          {sess.activeProject?.title || 'Simulasi Proyek'}
                        </h4>

                        <p className="text-xs text-slate-400 line-clamp-2">
                          {sess.activeProject?.representationRationale || 'Proyek representatif kejuruan'}
                        </p>

                        <div className="pt-2 text-[11px] text-slate-500 flex justify-between border-t border-slate-800/80">
                          <span>Alat: {sess.resources.tools.length} | Bahan: {sess.resources.materials.length}</span>
                          <span>{new Date(sess.timestamp).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <button
                          onClick={() => handleDeleteSession(sess.id)}
                          className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                        >
                          Hapus
                        </button>
                        <button
                          onClick={() => handleRestoreSession(sess)}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span>Lanjutkan Praktik</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* View: Bank Profesi & Kurikulum */}
        {activeView === 'vocations' && (
          <VocationBankView
            onSelectProfession={(prof) => {
              setTargetProfession(prof);
              setCurrentStep(2);
              setActiveView('generator');
            }}
          />
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 bg-emerald-950/95 border border-emerald-500/50 text-emerald-100 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-3 animate-slideUp">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="flex-1">{toastMessage}</span>
        </div>
      )}

      {/* Modal Jobsheet Praktik Interaktif */}
      <InteractiveJobsheetModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
        onSaveProgress={handleSaveActiveSession}
        onUpdateProject={handleUpdateActiveProject}
      />

      {/* Modal Studio Perancang Proyek Vokasi AI Gemini */}
      <AiProjectGeneratorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        targetProfession={targetProfession}
        availableResources={availableResources}
        onProjectGenerated={(newProject) => {
          handleAddAiProject(newProject);
          setCurrentStep(3);
          setActiveView('generator');
        }}
        onSaveProjectIdea={handleSaveProjectIdea}
        isProjectSaved={isProjectIdeaSaved}
        onOpenSimulation={(proj) => setActiveModalProject(proj)}
        onViewSavedIdeas={() => {
          setSavedSubTab('ideas');
          setActiveView('saved');
        }}
      />

      {/* Drawer Riwayat Cepat */}
      <SavedSessionsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        sessions={savedSessions}
        onSelectSession={handleRestoreSession}
        onDeleteSession={handleDeleteSession}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-900/60 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center">
          <span className="font-medium text-slate-400">
            &copy; {new Date().getFullYear()} SMKN 4 Kendari. Hak Cipta Dilindungi (Copyright).
          </span>
        </div>
      </footer>
    </div>
  );
}

