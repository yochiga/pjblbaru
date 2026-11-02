import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalize,
  checkAvailability,
  recommendProjectsForStudent,
  POPULAR_VOCATION_FIELDS,
  CURATED_SIMULATION_PROJECTS,
} from './projectRecommender.ts';

test('normalize converts text to lowercase and strips non-alphanumeric characters', () => {
  assert.equal(normalize('Teknik Instalasi Listrik!'), 'teknik instalasi listrik');
  assert.equal(normalize('  Tang Crimping (RJ-45)  '), 'tang crimping rj 45');
});

test('checkAvailability detects exact and fuzzy token matches', () => {
  const availableTools = ['Tang Kombinasi', 'Tespen Listrik', 'Obeng Plus Minus'];
  
  // Exact or direct substring
  assert.equal(checkAvailability('Tespen', availableTools), true);
  assert.equal(checkAvailability('Tang Kombinasi', availableTools), true);
  assert.equal(checkAvailability('Obeng Plus & Minus', availableTools), true);
  
  // Not available
  assert.equal(checkAvailability('Solder Listrik', availableTools), false);
  assert.equal(checkAvailability('Kunci Busi', availableTools), false);
});

test('recommendProjectsForStudent calculates readiness and prioritizes targeted profession', () => {
  const targetProfession = 'Teknik Instalasi Tenaga Listrik (TITL)';
  const userResources = {
    tools: ['Tespen', 'Obeng Plus & Minus', 'Tang Kombinasi'],
    materials: ['Kabel Listrik / Kabel Kawat Sederhana', 'Saklar Ganda'],
  };

  const recommendations = recommendProjectsForStudent(targetProfession, userResources);
  
  assert.ok(recommendations.length > 0, 'Should return recommendations');
  
  // The first recommendation should be for electrical installation
  const topProj = recommendations[0];
  assert.match(topProj.targetProfession, /Listrik/i);
  assert.ok(topProj.readinessPercentage > 0, 'Readiness percentage should be > 0');
  
  // Check toolsUsed availability mapping
  const tespenTool = topProj.toolsUsed.find(t => t.name.toLowerCase().includes('tespen'));
  assert.ok(tespenTool, 'Tespen should be in toolsUsed');
  assert.equal(tespenTool?.available, true, 'Tespen should be marked available');

  // Verify all curated projects have valid steps and required properties
  for (const proj of CURATED_SIMULATION_PROJECTS) {
    assert.ok(proj.id, 'Project must have an id');
    assert.ok(proj.title, 'Project must have a title');
    assert.ok(proj.representationRationale, 'Project must explain representation rationale');
    assert.ok(proj.steps.length >= 3, 'Project should have at least 3 steps');
    assert.ok(proj.deliverable, 'Project should have a clear deliverable');
  }

  // Verify popular vocation fields
  assert.ok(POPULAR_VOCATION_FIELDS.length >= 8, 'Should have at least 8 popular SMK vocations');
});

test('saved project idea data structures maintain required attributes and serialization', () => {
  const sampleProject = CURATED_SIMULATION_PROJECTS[0];
  const savedIdea = {
    id: `idea-${sampleProject.id}-${Date.now()}`,
    project: sampleProject,
    savedAt: new Date().toISOString(),
    notes: 'Praktik mandiri di rumah siswa',
    isAiGenerated: false,
  };

  assert.ok(savedIdea.id.startsWith('idea-'));
  assert.equal(savedIdea.project.title, sampleProject.title);
  assert.equal(savedIdea.notes, 'Praktik mandiri di rumah siswa');

  const serialized = JSON.stringify(savedIdea);
  const parsed = JSON.parse(serialized);
  assert.equal(parsed.project.id, sampleProject.id);
  assert.equal(parsed.project.readinessPercentage, sampleProject.readinessPercentage);
});

