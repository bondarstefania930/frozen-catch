import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Assets from '../assets';
import AuroraField from './AuroraField';
import {COLORS} from '../constants/theme';

interface Props {
  /** Overlay colours — alpha is baked in, the art always sits underneath. */
  colors: string[];
  locations?: number[];
  auroraIntensity?: number;
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  children: React.ReactNode;
}

/**
 * The shared background of every screen: the one contract background image,
 * a screen-specific gradient overlay over it, the aurora, then the content.
 * Loader and Menu use the same art with deliberately different overlays.
 */
function ScreenShell({
  colors,
  locations,
  auroraIntensity = 0.12,
  start = {x: 0.1, y: 0},
  end = {x: 0.9, y: 1},
  children,
}: Props) {
  return (
    <View style={styles.root}>
      <Image source={Assets.bgGame} resizeMode="cover" style={styles.bg} />
      <LinearGradient
        colors={colors}
        locations={locations as any}
        start={start}
        end={end}
        style={styles.bg}
        pointerEvents="none"
      />
      <AuroraField intensity={auroraIntensity} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.abyss},
  bg: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
  content: {flex: 1},
});

export default ScreenShell;
