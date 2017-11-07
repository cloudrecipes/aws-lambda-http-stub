exports.validator = (t, testCases) => (actual, idx) => t.deepEqual(actual, testCases[idx].expected)
