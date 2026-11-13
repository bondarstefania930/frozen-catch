import React from 'react';
import {StyleSheet} from 'react-native';
import Svg, {Circle, Line, Path} from 'react-native-svg';
import {COLORS} from '../constants/theme';

interface Props {
  width: number;
  height: number;
  pivotX: number;
  pivotY: number;
  hookX: number;
  hookY: number;
  tense: boolean;
}

/** The line and the hook itself — a vector, never a text glyph. */
function HookLine({
  width,
  height,
  pivotX,
  pivotY,
  hookX,
  hookY,
  tense,
}: Props) {
  const color = tense ? COLORS.aurora : COLORS.textOnDark;
  const shank = 'M ' + hookX + ' ' + hookY + ' l 0 12';
  const barb =
    'M ' +
    hookX +
    ' ' +
    (hookY + 12) +
    ' a 7 7 0 1 0 -7 -3';
  return (
    <Svg width={width} height={height} style={styles.svg} pointerEvents="none">
      <Line
        x1={pivotX}
        y1={pivotY}
        x2={hookX}
        y2={hookY}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.9}
      />
      <Path d={shank} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Path
        d={barb}
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={hookX} cy={hookY} r={3} fill={COLORS.aurora} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  svg: {position: 'absolute', top: 0, left: 0},
});

export default React.memo(HookLine);
