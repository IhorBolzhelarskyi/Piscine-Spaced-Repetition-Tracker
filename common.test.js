// common.test.mjs

import { getUserIds } from "./common.mjs"; // Correct import casing

describe('getUserIds', () => {
  test('should return the correct number of user IDs', () => {
    // Jest's expect assertion
    expect(getUserIds().length).toBe(5);
  });

  test('should return an array containing specific IDs', () => {
    const expectedIds = ["1", "2", "3", "4", "5"];
    expect(getUserIds()).toEqual(expect.arrayContaining(expectedIds));
  });

  test('should return an array of strings', () => {
    const userIds = getUserIds();
    expect(userIds.every(id => typeof id === 'string')).toBe(true);
  });
});