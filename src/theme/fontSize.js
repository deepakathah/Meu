import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Use proper grouping with parentheses to avoid operator precedence issues
const scale = SCREEN_WIDTH / (Platform.OS === 'android' ? 450 : 425);

const normalize = (size) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export default normalize;