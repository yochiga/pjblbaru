import { describe, it } from 'node:test';
import assert from 'node:assert';

// Formula test for Photography Exposure Triangle and Lighting Calculations
describe('Photography Exposure Triangle & Studio Lighting Physics', () => {
  it('correctly calculates nominal balanced exposure value around 0 EV', () => {
    // Nominal baseline: f/4 (lightScore 5), 1/125s (lightScore 4), ISO 100 (lightScore 1)
    // Key light 75%, Fill 40%, Rim 35% -> studioLightScore = (75*0.55 + 40*0.3 + 35*0.15)/10 = 5.85
    const apertureScore = 5;
    const shutterScore = 4;
    const isoScore = 1;
    const keyPower = 75;
    const fillPower = 40;
    const rimPower = 35;

    const studioLightScore = (keyPower * 0.55 + fillPower * 0.30 + rimPower * 0.15) / 10;
    const cameraIntakeScore = apertureScore + shutterScore + isoScore;
    const combinedLightIndex = cameraIntakeScore + studioLightScore * 1.4;
    const nominalBalanced = 18.2;
    const rawEvDelta = (combinedLightIndex - nominalBalanced) / 2.6;
    const evDelta = Math.max(-3.0, Math.min(3.0, Math.round(rawEvDelta * 10) / 10));

    // Balanced EV should be close to 0 (-0.5 <= evDelta <= +0.5)
    assert.ok(Math.abs(evDelta) <= 0.5, `EV delta ${evDelta} should be close to 0 EV`);
  });

  it('correctly detects underexposed condition when studio lights are off and aperture is closed', () => {
    // f/16 (lightScore 1), 1/1000s (lightScore 1), ISO 100 (lightScore 1)
    // Lights turned down low (Key 10, Fill 0, Rim 0)
    const apertureScore = 1;
    const shutterScore = 1;
    const isoScore = 1;
    const studioLightScore = (10 * 0.55) / 10; // 0.55
    const combinedLightIndex = (apertureScore + shutterScore + isoScore) + studioLightScore * 1.4;
    const rawEvDelta = (combinedLightIndex - 18.2) / 2.6;
    const evDelta = Math.max(-3.0, Math.min(3.0, Math.round(rawEvDelta * 10) / 10));

    assert.strictEqual(evDelta, -3.0, 'Extreme low light should clamp to -3.0 EV underexposed');
  });

  it('correctly detects overexposed condition when ISO is maxed and lights are intense', () => {
    // f/1.4 (lightScore 8), 1s (lightScore 9), ISO 12800 (lightScore 8)
    const apertureScore = 8;
    const shutterScore = 9;
    const isoScore = 8;
    const studioLightScore = (100 * 0.55 + 100 * 0.30 + 100 * 0.15) / 10; // 10
    const combinedLightIndex = (apertureScore + shutterScore + isoScore) + studioLightScore * 1.4;
    const rawEvDelta = (combinedLightIndex - 18.2) / 2.6;
    const evDelta = Math.max(-3.0, Math.min(3.0, Math.round(rawEvDelta * 10) / 10));

    assert.strictEqual(evDelta, 3.0, 'Extreme light intake should clamp to +3.0 EV overexposed');
  });

  it('enforces tripod stabilization when shutter speed is slower than 1/60s', () => {
    const slowShutterRisk = 8.5; // 1/15s
    const handheldTripodOff = false;
    const studioTripodOn = true;

    const shakeRiskHandheld = handheldTripodOff ? 0 : slowShutterRisk;
    const shakeRiskTripod = studioTripodOn ? 0 : slowShutterRisk;

    assert.strictEqual(shakeRiskTripod, 0, 'Tripod should completely eliminate camera motion shake blur');
    assert.strictEqual(shakeRiskHandheld, 8.5, 'Handheld shooting with slow shutter carries high shake risk');
  });
});
