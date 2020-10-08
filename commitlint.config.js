const levelError = 2;
const length = 100;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [levelError, 'always', length],
  },
};
