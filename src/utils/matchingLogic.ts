import {
  Student,
  InventoryItem,
  ToolRequirement,
  MaterialRequirement,
  ReadinessAnalysis,
  MatchedItem,
  SimulationProject,
} from '../types';

/**
 * Normalizes strings for flexible fuzzy and substring comparison
 */
export function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * Checks if inventory item matches a requirement by name, substring, or known alias
 */
export function isItemMatch(reqName: string, invItemName: string, aliases?: string[]): boolean {
  const r = normalizeName(reqName);
  const inv = normalizeName(invItemName);

  if (r === inv || inv.includes(r) || r.includes(inv)) {
    return true;
  }

  // Check aliases or substitutes
  if (aliases && aliases.length > 0) {
    for (const alias of aliases) {
      const a = normalizeName(alias);
      if (a === r || a.includes(r) || r.includes(a)) {
        return true;
      }
    }
  }

  // Token overlap check
  const rTokens = r.split(/\s+/).filter(t => t.length > 2);
  const invTokens = inv.split(/\s+/).filter(t => t.length > 2);
  const common = rTokens.filter(t => invTokens.includes(t));
  return common.length >= Math.max(1, Math.min(rTokens.length, 2));
}

/**
 * Finds the best inventory match or substitute for a tool requirement
 */
export function matchToolRequirement(
  req: ToolRequirement,
  inventory: InventoryItem[]
): MatchedItem<ToolRequirement> {
  const tools = inventory.filter(i => i.type === 'tool');

  // Exact or direct match
  const direct = tools.find(t => isItemMatch(req.name, t.name, t.substitutes));

  if (direct) {
    const isAvailable =
      direct.availableQuantity > 0 &&
      direct.condition !== 'Depleted' &&
      direct.condition !== 'Habis' &&
      direct.condition !== 'Maintenance' &&
      direct.condition !== 'Pemeliharaan';

    if (isAvailable) {
      return {
        requirement: req,
        matchedInventoryItem: direct,
        status: 'Cocok Penuh',
        fulfillmentPct: 100,
        notes: `Tersedia di ${direct.location} (${direct.availableQuantity} unit siap pakai)`,
      };
    } else {
      return {
        requirement: req,
        matchedInventoryItem: direct,
        status: 'Stok Rendah',
        fulfillmentPct: 35,
        notes: `Ada di ${direct.location} namun status ${direct.condition.toLowerCase()} (tersedia: ${direct.availableQuantity})`,
      };
    }
  }

  // Look for substitute
  const sub = tools.find(t =>
    t.substitutes?.some(s => isItemMatch(req.name, s)) ||
    (t.category === req.category && t.availableQuantity > 0)
  );

  if (sub && sub.availableQuantity > 0) {
    return {
      requirement: req,
      substituteItem: sub,
      status: 'Tersedia Pengganti',
      fulfillmentPct: 75,
      notes: `Alat pengganti lab yang dapat dipakai: ${sub.name} di ${sub.location}`,
    };
  }

  return {
    requirement: req,
    status: 'Tidak Tersedia',
    fulfillmentPct: 0,
    notes: 'Belum ada di inventaris lab sekolah. Perlu pengajuan pengadaan.',
  };
}

/**
 * Finds the best inventory match or substitute for a material requirement
 */
export function matchMaterialRequirement(
  req: MaterialRequirement,
  inventory: InventoryItem[]
): MatchedItem<MaterialRequirement> {
  const materials = inventory.filter(i => i.type === 'raw_material');

  const direct = materials.find(m => isItemMatch(req.name, m.name, m.substitutes));

  if (direct) {
    if (direct.availableQuantity >= req.quantityNeeded) {
      return {
        requirement: req,
        matchedInventoryItem: direct,
        status: 'Cocok Penuh',
        fulfillmentPct: 100,
        notes: `Stok mencukupi: ${direct.availableQuantity} ${direct.unit} di ${direct.location}`,
      };
    } else if (direct.availableQuantity > 0) {
      const pct = Math.round((direct.availableQuantity / req.quantityNeeded) * 100);
      return {
        requirement: req,
        matchedInventoryItem: direct,
        status: 'Stok Rendah',
        fulfillmentPct: Math.min(90, Math.max(20, pct)),
        notes: `Jumlah parsial: ${direct.availableQuantity}/${req.quantityNeeded} ${req.unit} tersedia`,
      };
    } else {
      return {
        requirement: req,
        matchedInventoryItem: direct,
        status: 'Tidak Tersedia',
        fulfillmentPct: 0,
        notes: `Stok habis di ${direct.location}. Perlu restock.`,
      };
    }
  }

  // Check substitute
  const sub = materials.find(m =>
    m.substitutes?.some(s => isItemMatch(req.name, s)) ||
    (m.category === req.category && m.availableQuantity > 0)
  );

  if (sub && sub.availableQuantity > 0) {
    return {
      requirement: req,
      substituteItem: sub,
      status: 'Tersedia Pengganti',
      fulfillmentPct: 70,
      notes: `Bahan pengganti lab tersedia: ${sub.name} (${sub.availableQuantity} ${sub.unit})`,
    };
  }

  return {
    requirement: req,
    status: 'Tidak Tersedia',
    fulfillmentPct: 0,
    notes: 'Tidak ditemukan di stok bahan sekolah. Tambahkan ke anggaran.',
  };
}

const PRIORITY_WEIGHTS: Record<string, number> = {
  Kritis: 3.5,
  Critical: 3.5,
  Direkomendasikan: 2.0,
  Recommended: 2.0,
  Opsional: 1.0,
  Optional: 1.0,
};

/**
 * Analyzes readiness of school environment resources for a given student's requirements
 */
export function analyzeStudentResourceReadiness(
  student: Student,
  inventory: InventoryItem[]
): ReadinessAnalysis {
  const matchedTools = student.requirements.tools.map(toolReq =>
    matchToolRequirement(toolReq, inventory)
  );

  const matchedMaterials = student.requirements.materials.map(matReq =>
    matchMaterialRequirement(matReq, inventory)
  );

  let totalToolWeight = 0;
  let earnedToolWeight = 0;

  for (const match of matchedTools) {
    const weight = PRIORITY_WEIGHTS[match.requirement.priority] || 2;
    totalToolWeight += weight;
    earnedToolWeight += (match.fulfillmentPct / 100) * weight;
  }

  let totalMatWeight = 0;
  let earnedMatWeight = 0;

  for (const match of matchedMaterials) {
    const weight = PRIORITY_WEIGHTS[match.requirement.priority] || 2;
    totalMatWeight += weight;
    earnedMatWeight += (match.fulfillmentPct / 100) * weight;
  }

  const toolsScore = totalToolWeight > 0 ? Math.round((earnedToolWeight / totalToolWeight) * 100) : 100;
  const materialsScore = totalMatWeight > 0 ? Math.round((earnedMatWeight / totalMatWeight) * 100) : 100;

  // Blended overall score (tools 50%, materials 50%)
  const readinessScore = Math.round((toolsScore * 0.52) + (materialsScore * 0.48));

  const criticalBottlenecks: string[] = [];
  let procurementEstimateIDR = 0;

  for (const mt of matchedTools) {
    const isCrit = mt.requirement.priority === 'Kritis' || mt.requirement.priority === 'Critical';
    if (isCrit && (mt.status === 'Tidak Tersedia' || mt.status === 'Stok Rendah')) {
      criticalBottlenecks.push(`Kendala Alat Kritis: ${mt.requirement.name} (${mt.notes})`);
      procurementEstimateIDR += 1250000;
    }
  }

  for (const mm of matchedMaterials) {
    const isCrit = mm.requirement.priority === 'Kritis' || mm.requirement.priority === 'Critical';
    if (isCrit && (mm.status === 'Tidak Tersedia' || mm.status === 'Stok Rendah')) {
      criticalBottlenecks.push(`Kendala Bahan Kritis: ${mm.requirement.name} (${mm.notes})`);
      procurementEstimateIDR += 350000;
    }
  }

  const allItems = [...matchedTools, ...matchedMaterials];
  const readilyAvailableCount = allItems.filter(i => i.status === 'Cocok Penuh').length;
  const substituteCount = allItems.filter(i => i.status === 'Tersedia Pengganti').length;
  const missingCount = allItems.filter(i => i.status === 'Tidak Tersedia' || i.status === 'Stok Rendah').length;

  return {
    readinessScore,
    toolsScore,
    materialsScore,
    matchedTools,
    matchedMaterials,
    criticalBottlenecks,
    readilyAvailableCount,
    substituteCount,
    missingCount,
    procurementEstimateIDR,
  };
}

/**
 * Calculates a match score for a simulation project against the school inventory and student
 */
export function scoreSimulationForInventoryAndStudent(
  simulation: SimulationProject,
  student: Student,
  inventory: InventoryItem[]
): {
  project: SimulationProject;
  score: number;
  inventoryFeasibilityPct: number;
  professionAlignmentPct: number;
  availableToolsCount: number;
  totalToolsCount: number;
  availableMaterialsCount: number;
  totalMaterialsCount: number;
  missingItems: string[];
} {
  // Check required tools
  let availableToolsCount = 0;
  const missingItems: string[] = [];

  for (const toolName of simulation.requiredTools) {
    const found = inventory.find(
      i => i.type === 'tool' &&
      isItemMatch(toolName, i.name, i.substitutes) &&
      i.availableQuantity > 0 &&
      i.condition !== 'Maintenance' &&
      i.condition !== 'Pemeliharaan'
    );
    if (found) {
      availableToolsCount++;
    } else {
      missingItems.push(toolName);
    }
  }

  // Check required materials
  let availableMaterialsCount = 0;
  for (const mat of simulation.requiredMaterials) {
    const found = inventory.find(
      i => i.type === 'raw_material' &&
      isItemMatch(mat.name, i.name, i.substitutes) &&
      i.availableQuantity >= mat.quantity
    );
    if (found) {
      availableMaterialsCount++;
    } else {
      missingItems.push(mat.name);
    }
  }

  const totalTools = simulation.requiredTools.length;
  const totalMats = simulation.requiredMaterials.length;
  const totalReqs = totalTools + totalMats;
  const availableReqs = availableToolsCount + availableMaterialsCount;

  const inventoryFeasibilityPct = totalReqs > 0 ? Math.round((availableReqs / totalReqs) * 100) : 100;

  // Career alignment
  let professionAlignmentPct = 50;
  const targetProfNorm = normalizeName(student.targetedProfession);
  const simProfNorm = normalizeName(simulation.targetProfession);

  if (targetProfNorm === simProfNorm || simProfNorm.includes(targetProfNorm) || targetProfNorm.includes(simProfNorm)) {
    professionAlignmentPct = 100;
  } else if (student.careerCluster === simulation.careerCluster) {
    professionAlignmentPct = 85;
  } else {
    // Check keyword overlap
    const sTokens = targetProfNorm.split(/\s+/);
    const pTokens = simProfNorm.split(/\s+/);
    if (sTokens.some(t => pTokens.includes(t))) {
      professionAlignmentPct = 75;
    }
  }

  // Composite score: 60% inventory feasibility + 40% profession alignment
  const score = Math.round((inventoryFeasibilityPct * 0.6) + (professionAlignmentPct * 0.4));

  return {
    project: simulation,
    score,
    inventoryFeasibilityPct,
    professionAlignmentPct,
    availableToolsCount,
    totalToolsCount: totalTools,
    availableMaterialsCount,
    totalMaterialsCount: totalMats,
    missingItems,
  };
}

/**
 * Filter and rank project simulations for a student based on school inventory
 */
export function rankRecommendedSimulations(
  student: Student,
  simulations: SimulationProject[],
  inventory: InventoryItem[]
) {
  return simulations
    .map(sim => scoreSimulationForInventoryAndStudent(sim, student, inventory))
    .sort((a, b) => b.score - a.score);
}
