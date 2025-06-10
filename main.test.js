
import { calcRevisionDates } from './main.mjs';

describe('calcRevisionDates', () => {
  // Test case 1: Basic calculation for a known date
  test('should calculate correct revision dates for a given topic and start date', () => {
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

  // Test case 2: Check if it handles different start dates correctly
  test('should calculate dates accurately for a start date at month end', () => {
    const topic = 'Advanced CSS';
    const startDate = '2025-01-31'; // January 31, 2025

    const expectedRevisions = [
      { topic: 'Advanced CSS', date: '2025-02-07' }, // +7 days (Feb 7)
      { topic: 'Advanced CSS', date: '2025-02-28' }, // +1 month (Feb 28, not Mar 3)
      { topic: 'Advanced CSS', date: '2025-04-30' }, // +3 months (Apr 30, not May 1)
      { topic: 'Advanced CSS', date: '2025-07-31' }, // +6 months (July 31)
      { topic: 'Advanced CSS', date: '2026-01-31' }  // +12 months (Jan 31)
    ];

    const result = calcRevisionDates(topic, startDate);
    expect(result).toEqual(expectedRevisions);
  });

  // Test case 3: Empty topic name (though validation might be elsewhere, function should still process)
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