/* eslint-env jest */
jest.mock('react-native-keychain', () => ({
  ACCESSIBLE: {
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY',
  },
  setGenericPassword: jest.fn(),
  getGenericPassword: jest.fn(async () => false),
  resetGenericPassword: jest.fn(),
}));
