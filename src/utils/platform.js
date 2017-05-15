import { Platform } from 'react-native';

/**
 * Check the current platform/device
 *
 * Usage:
 *
 * if (Platform.iOS) {
 *   // ...
 * }
 */

export default {
  iOS: (Platform.OS === 'ios'),
  Android: (Platform.OS === 'android'),
  Version: Platform.Version,
};
