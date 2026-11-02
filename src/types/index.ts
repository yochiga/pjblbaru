export type VentureType =
  | 'Karier Profesional / Karyawan'
  | 'Wirausaha Mandiri'
  | 'Kewirausahaan Sosial';

export type PriorityLevel =
  | 'Kritis'
  | 'Direkomendasikan'
  | 'Opsional'
  | 'Critical'
  | 'Recommended'
  | 'Optional';

export type ItemType = 'tool' | 'raw_material';

export type ItemCondition =
  | 'Beroperasi'
  | 'Digunakan'
  | 'Pemeliharaan'
  | 'Habis'
  | 'Stok Cukup'
  | 'Stok Rendah'
  | 'Operational'
  | 'In-Use'
  | 'Maintenance'
  | 'Depleted'
  | 'Adequate'
  | 'Low Stock';

export interface ToolRequirement {
  id: string;
  name: string;
  category: string;
  minimumSpecs?: string;
  priority: PriorityLevel;
}

export interface MaterialRequirement {
  id: string;
  name: string;
  category: string;
  quantityNeeded: number;
  unit: string;
  priority: PriorityLevel;
}

export interface StudentRequirements {
  tools: ToolRequirement[];
  materials: MaterialRequirement[];
  coreCompetencies: string[];
  safetyCertificationsNeeded: string[];
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  avatarSeed: string;
  targetedProfession: string;
  ventureType: VentureType;
  careerCluster: string;
  statementOfIntent: string;
  skillsAcquired: string[];
  requirements: StudentRequirements;
  activeSimulationId?: string;
  completedSimulationIds: string[];
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  category: string;
  location: string;
  totalQuantity: number;
  availableQuantity: number;
  unit: string;
  condition: ItemCondition;
  minimumThreshold: number;
  costEstimate: number;
  substitutes?: string[];
  lastRestocked: string;
}

export interface SimulationStep {
  id: string;
  title: string;
  phase:
    | 'Pemeriksaan Alat & K3'
    | 'Perakitan & Sintesis Desain'
    | 'Kalibrasi & Diagnostik'
    | 'Presentasi Vokasi & Portofolio';
  description: string;
  actionType: 'checklist' | 'calculator' | 'tester' | 'reflection';
  interactiveData?: {
    prompts?: string[];
    benchmarkKey?: string;
    targetValue?: number;
    unit?: string;
  };
}

export interface SimulationProject {
  id: string;
  title: string;
  targetProfession: string;
  ventureType: VentureType;
  careerCluster: string;
  summary: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  durationHours: number;
  requiredTools: string[];
  requiredMaterials: { name: string; quantity: number; unit: string }[];
  learningOutcomes: string[];
  realWorldDeliverable: string;
  safetyProtocols: string[];
  steps: SimulationStep[];
  badgeName: string;
}

export interface MatchedItem<T> {
  requirement: T;
  matchedInventoryItem?: InventoryItem;
  status: 'Cocok Penuh' | 'Tersedia Pengganti' | 'Stok Rendah' | 'Tidak Tersedia';
  substituteItem?: InventoryItem;
  fulfillmentPct: number;
  notes: string;
}

export interface ReadinessAnalysis {
  readinessScore: number;
  toolsScore: number;
  materialsScore: number;
  matchedTools: MatchedItem<ToolRequirement>[];
  matchedMaterials: MatchedItem<MaterialRequirement>[];
  criticalBottlenecks: string[];
  readilyAvailableCount: number;
  missingCount: number;
  substituteCount: number;
  procurementEstimateIDR: number;
}
