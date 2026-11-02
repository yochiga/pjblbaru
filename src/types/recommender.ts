export interface VocationField {
  id: string;
  name: string;
  category: string;
  description: string;
  typicalTools: string[];
  typicalMaterials: string[];
  sampleRealWorldTasks: string[];
  iconName?: string;
}

export interface AvailableResources {
  tools: string[];
  materials: string[];
  notes?: string;
}

export interface ProjectStep {
  stepNumber: number;
  title: string;
  instruction: string;
  safetyTip?: string;
  checkpoint: string;
}

export interface RecommendedProject {
  id: string;
  title: string;
  targetProfession: string;
  representationRationale: string; // Mengapa proyek ini merepresentasikan profesi tersebut
  difficulty: 'Mudah' | 'Sedang' | 'Menantang';
  estimatedHours: string;
  toolsUsed: { name: string; available: boolean }[];
  materialsUsed: { name: string; available: boolean; quantity?: string }[];
  alternativeMaterialsSuggested?: string[];
  readinessPercentage: number;
  coreCompetenciesLearned: string[];
  deliverable: string;
  safetyProtocols: string[];
  steps: ProjectStep[];
  badgeEarned: string;
}

export interface RecommendedToolItem {
  id: string;
  name: string;
  role: string; // Fungsi teknis untuk purwarupa
  isCritical: boolean; // Wajib (inti) vs Pendukung
  lowCostAlternative: string; // Alternatif alat sederhana di sekitar lingkungan siswa
  available: boolean; // Status ketersediaan di siswa
}

export interface RecommendedMaterialItem {
  id: string;
  name: string;
  quantity: string; // Takaran / jumlah purwarupa
  role: string; // Fungsi bahan dalam purwarupa
  recycledAlternative: string; // Alternatif bahan daur ulang / barang bekas sekitar siswa
  available: boolean; // Status ketersediaan di siswa
}

export interface PrototypeKitRecommendation {
  prototypeTitle: string;
  prototypeRationale: string;
  difficulty: 'Mudah' | 'Sedang' | 'Menantang';
  estimatedHours: string;
  deliverable: string;
  coreCompetencies: string[];
  tools: RecommendedToolItem[];
  materials: RecommendedMaterialItem[];
  safetyTips: string[];
  isAiGenerated: boolean;
  modelUsed?: string;
  targetProfession: string;
}

export interface SavedStudentSession {
  id: string;
  studentName: string;
  schoolName: string;
  targetProfession: string;
  resources: AvailableResources;
  recommendedProjects: RecommendedProject[];
  activeProject?: RecommendedProject;
  completedStepIndices: number[];
  projectNotes: string;
  isCompleted: boolean;
  timestamp: string;
}

export interface SavedProjectIdea {
  id: string;
  project: RecommendedProject;
  savedAt: string;
  notes?: string;
  isAiGenerated?: boolean;
}

