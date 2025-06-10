// main.test.mjs

// Make sure calcRevisionDates is EXPORTED from your main.mjs file
import { calcRevisionDates } from './main.mjs';

describe('calcRevisionDates', () => {
  // Test case 1: Basic calculation for a known date
  test('should calculate correct revision dates for a given topic and start date', () => {
    // Current date for consistent testing (June 10, 2025)
    // Note: If you run this test on a different day, and your logic relies on Date().getDate()
    // without mocking, results could differ for month/day calculations.
    // For this specific test, as it's hardcoded to '2025-06-10', it should be fine.
    const topic = 'Introduction to JavaScript';
    const startDate = '2025-06-10'; // June 10, 2025

    const expectedRevisions = [
      { topic: 'Introduction to JavaScript', date: '2025-06-17' }, // +7 days
      { topic: 'Introduction to JavaScript', date: '2025-07-10' }, // +1 month
      { topic: 'Introduction to JavaScript', date: '2025-09-10' }, // +3 months
      { topic: 'Introduction to JavaScript', date: '2025-12-10' }, // +6 months
      { topic: 'Introduction to JavaScript', date: '2026-06-10' }  // +12 months
    ];

    const result = calcRevisionDates(topic, startDate);
    expect(result).toEqual(expectedRevisions);
  });

  // Test case 2: Check if it handles different start dates correctly (especially month end)
  test('should calculate dates accurately for a start date at month end', () => {
    const topic = 'Advanced CSS';
    const startDate = '2025-01-31'; // January 31, 2025

    const expectedRevisions = [
      { topic: 'Advanced CSS', date: '2025-02-07' }, // +7 days (Feb 7)
      { topic: 'Advanced CSS', date: '2025-02-28' }, // +1 month (Feb 28, handles Feb max days)
      { topic: 'Advanced CSS', date: '2025-04-30' }, // +3 months (Apr 30, handles month max days)
      { topic: 'Advanced CSS', date: '2025-07-31' }, // +6 months (July 31)
      { topic: 'Advanced CSS', date: '2026-01-31' }  // +12 months (Jan 31)
    ];

    const result = calcRevisionDates(topic, startDate);
    expect(result).toEqual(expectedRevisions);
  });

  // Test case 3: Empty topic name
  test('should return correct dates even with an empty topic string', () => {
    const topic = '';
    const startDate = '2025-05-01';

    const expectedRevisions = [
      { topic: '', date: '2025-05-08' },
      { topic: '', date: '2025-06-01' },
      { topic: '', date: '2025-08-01' },
      { topic: '', date: '2025-11-01' },
      { topic: '', date: '2026-05-01' }
    ];

    const result = calcRevisionDates(topic, startDate);
    expect(result).toEqual(expectedRevisions);
  });
});