import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TUTORIAL_STEPS,
  TUTORIAL_TOPICS,
  searchTutorialTopics,
  getTutorialTopicsByCategory,
  getStepByIndex,
} from './tutorialData';

test('tutorial steps data integrity', () => {
  assert.ok(TUTORIAL_STEPS.length >= 5);
  TUTORIAL_STEPS.forEach((step, idx) => {
    assert.equal(step.id, idx + 1);
    assert.ok(step.title.length > 5);
    assert.ok(step.description.length > 10);
    assert.ok(step.tips.length > 0);
  });
});

test('tutorial topics knowledge base integrity', () => {
  assert.ok(TUTORIAL_TOPICS.length >= 6);
  TUTORIAL_TOPICS.forEach((topic) => {
    assert.ok(topic.id.length > 0);
    assert.ok(topic.title.length > 0);
    assert.ok(topic.sections.length > 0);
    assert.ok(topic.tags.length > 0);
  });
});

test('searchTutorialTopics returns matching topics across title, tags, and content', () => {
  // Search by tag / keyword 'sablon'
  const sablonResults = searchTutorialTopics(TUTORIAL_TOPICS, 'sablon');
  assert.ok(sablonResults.length >= 1);
  assert.ok(sablonResults.some((t) => t.id === 'screen-printing-guide'));

  // Search by keyword 'segitiga eksposur'
  const photoResults = searchTutorialTopics(TUTORIAL_TOPICS, 'segitiga eksposur');
  assert.ok(photoResults.length >= 1);
  assert.ok(photoResults.some((t) => t.id === 'photo-game-guide'));

  // Search by keyword 'rubrik'
  const rubricResults = searchTutorialTopics(TUTORIAL_TOPICS, 'rubrik');
  assert.ok(rubricResults.length >= 1);
  assert.ok(rubricResults.some((t) => t.id === 'assessment-pdf-guide'));

  // Empty query returns all topics
  assert.equal(searchTutorialTopics(TUTORIAL_TOPICS, '').length, TUTORIAL_TOPICS.length);

  // Non-matching query returns empty array
  assert.equal(searchTutorialTopics(TUTORIAL_TOPICS, 'xyznonexistentword987').length, 0);
});

test('getTutorialTopicsByCategory filters correctly', () => {
  const simTopics = getTutorialTopicsByCategory(TUTORIAL_TOPICS, 'simulations');
  assert.ok(simTopics.length >= 2);
  simTopics.forEach((t) => assert.equal(t.category, 'simulations'));

  const allTopics = getTutorialTopicsByCategory(TUTORIAL_TOPICS, 'all');
  assert.equal(allTopics.length, TUTORIAL_TOPICS.length);
});

test('getStepByIndex safe indexing', () => {
  assert.equal(getStepByIndex(TUTORIAL_STEPS, 0)?.id, 1);
  assert.equal(getStepByIndex(TUTORIAL_STEPS, -1), undefined);
  assert.equal(getStepByIndex(TUTORIAL_STEPS, 999), undefined);
});
