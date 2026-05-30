import { describe, it, expect } from 'vitest';
import {
  CANONICAL_UNITS,
  SENSOR_TYPES,
  canonicalUnitFor,
  convertValue,
  normalizeUnit,
  normalizeSensorUnits,
} from './units.js';

describe('canonicalUnitFor', () => {
  it('returns the canonical unit per type', () => {
    expect(canonicalUnitFor('temperature')).toBe('°C');
    expect(canonicalUnitFor('humidity')).toBe('%');
    expect(canonicalUnitFor('light')).toBe('lux');
    expect(canonicalUnitFor('sound')).toBe('dB');
  });

  it('throws 400 for an unknown type', () => {
    expect(() => canonicalUnitFor('pressure')).toThrowError(/Unknown sensor type/);
    try {
      canonicalUnitFor('pressure');
    } catch (e) {
      expect(e.statusCode).toBe(400);
    }
  });

  it('exposes the supported sensor types', () => {
    expect(SENSOR_TYPES).toEqual(['temperature', 'humidity', 'light', 'sound']);
    expect(Object.keys(CANONICAL_UNITS).sort()).toEqual(SENSOR_TYPES.slice().sort());
  });
});

describe('convertValue - temperature', () => {
  it('keeps celsius unchanged', () => {
    expect(convertValue('temperature', 20, 'C')).toBe(20);
    expect(convertValue('temperature', 20, '°C')).toBe(20);
    expect(convertValue('temperature', 20, 'celsius')).toBe(20);
  });

  it('converts fahrenheit to celsius', () => {
    expect(convertValue('temperature', 32, 'F')).toBe(0);
    expect(convertValue('temperature', 212, 'fahrenheit')).toBe(100);
    expect(convertValue('temperature', 98.6, '°F')).toBe(37);
  });

  it('converts kelvin to celsius', () => {
    expect(convertValue('temperature', 273.15, 'K')).toBe(0);
    expect(convertValue('temperature', 300, 'kelvin')).toBe(26.85);
  });
});

describe('convertValue - other types', () => {
  it('treats humidity and sound as identity', () => {
    expect(convertValue('humidity', 55, '%')).toBe(55);
    expect(convertValue('humidity', 55, 'percent')).toBe(55);
    expect(convertValue('sound', 70, 'dB')).toBe(70);
    expect(convertValue('sound', 70, 'decibel')).toBe(70);
  });

  it('converts foot-candles to lux', () => {
    expect(convertValue('light', 0, 'fc')).toBe(0);
    expect(convertValue('light', 1, 'fc')).toBe(10.7639);
    expect(convertValue('light', 500, 'lux')).toBe(500);
  });
});

describe('convertValue - validation', () => {
  it('is case- and whitespace-insensitive', () => {
    expect(convertValue('temperature', 32, '  f  ')).toBe(0);
    expect(convertValue('temperature', 32, 'FaHrEnHeIt')).toBe(0);
  });

  it('passes null/undefined through untouched', () => {
    expect(convertValue('temperature', null, 'F')).toBeNull();
    expect(convertValue('temperature', undefined, 'F')).toBeUndefined();
  });

  it('throws 400 for an incompatible unit', () => {
    expect(() => convertValue('temperature', 10, 'lux')).toThrowError(/not valid for sensor type/);
    expect(() => convertValue('humidity', 10, 'F')).toThrowError(/not valid/);
  });

  it('throws 400 for a non-numeric value', () => {
    expect(() => convertValue('temperature', 'hot', 'C')).toThrowError(/not a number/);
  });
});

describe('normalizeUnit', () => {
  it('resolves aliases to the canonical unit', () => {
    expect(normalizeUnit('temperature', 'fahrenheit')).toBe('°C');
    expect(normalizeUnit('light', 'lx')).toBe('lux');
  });

  it('throws for an invalid unit', () => {
    expect(() => normalizeUnit('sound', 'lux')).toThrowError(/not valid/);
  });
});

describe('normalizeSensorUnits', () => {
  it('converts thresholds and sets the canonical unit', () => {
    expect(
      normalizeSensorUnits({ type: 'temperature', unit: 'F', min_value: 32, max_value: 212 }),
    ).toEqual({ unit: '°C', min_value: 0, max_value: 100 });
  });

  it('assumes canonical unit when none is given', () => {
    expect(
      normalizeSensorUnits({ type: 'humidity', min_value: 20, max_value: 80 }),
    ).toEqual({ unit: '%', min_value: 20, max_value: 80 });
  });

  it('passes null thresholds through', () => {
    expect(
      normalizeSensorUnits({ type: 'sound', unit: 'dB', min_value: null, max_value: null }),
    ).toEqual({ unit: 'dB', min_value: null, max_value: null });
  });

  it('throws 400 for an unknown type', () => {
    expect(() => normalizeSensorUnits({ type: 'pressure', min_value: 1, max_value: 2 })).toThrowError(
      /Unknown sensor type/,
    );
  });
});
