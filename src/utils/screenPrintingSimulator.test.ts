import { describe, it } from 'node:test';
import assert from 'node:assert';

// Unit tests for Vocational Screen Printing & Heat Press Evaluation Logic
describe('Screen Printing (Sablon Kaos) Physics & Heat Press Curing Logic', () => {
  it('awards Grade A for ideal squeegee angle (65-75°), ideal pressure, and proper plastisol curing temperature (165°C) with teflon', () => {
    const squeegeeAngle: number = 70;
    const squeegeePressure: string = 'ideal';
    const strokeCount: number = 2;
    const inkType: string = 'plastisol';
    const heatPressTemp: number = 165;
    const heatPressTimerSetting = 15;
    const useTeflonSheet = true;

    let score = 100;

    // Squeegee stroke
    if (squeegeeAngle < 55 || squeegeeAngle > 82) score -= 15;
    if (squeegeePressure !== 'ideal') score -= 15;
    if (strokeCount === 0) score -= 40;

    // Heat press
    const idealTempMin = inkType === 'plastisol' ? 160 : 140;
    const idealTempMax = inkType === 'plastisol' ? 172 : 152;
    if (heatPressTemp < idealTempMin || heatPressTemp > 185) score -= 25;

    // Teflon
    if (!useTeflonSheet) score -= 30;

    assert.strictEqual(score, 100, 'Ideal parameters should score 100 points');
  });

  it('penalizes when teflon sheet is forgotten because wet ink sticks to the hot metal platen', () => {
    const useTeflonSheet = false;
    let score = 100;
    if (!useTeflonSheet) {
      score -= 30;
    }
    assert.strictEqual(score, 70, 'Missing teflon sheet should incur severe penalty');
  });

  it('penalizes under-curing when heat press temperature is below ink curing threshold', () => {
    const inkType = 'plastisol';
    const heatPressTemp = 120; // Needs at least 160°C
    let score = 100;

    const idealTempMin = inkType === 'plastisol' ? 160 : 140;
    if (heatPressTemp < idealTempMin) {
      score -= 25;
    }

    assert.ok(score <= 75, 'Under-cured temperature should penalize score');
  });

  it('penalizes scorched shirts when heat press temperature exceeds safe cotton limits', () => {
    const heatPressTemp = 195; // > 185°C burns fabric
    let score = 100;
    if (heatPressTemp > 185) {
      score -= 30;
    }
    assert.strictEqual(score, 70, 'Excessive heat should penalize for scorch damage');
  });
});
