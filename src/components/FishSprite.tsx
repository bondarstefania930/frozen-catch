import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SPECIES, SpeciesKey} from '../game/collection';
import {COLORS} from '../constants/theme';

export const FISH_W = 44;
export const FISH_H = 30;

interface Props {
  species: SpeciesKey;
  x: number;
  y: number;
  dirRight: boolean;
  showTag: boolean;
  marked: boolean;
}

/**
 * All contract sprites are drawn facing RIGHT; a swimmer going left is
 * mirrored with scaleX: -1. Aspect is always preserved, the sprite is never
 * put inside a rounded overflow wrapper.
 */
function FishSprite({species, x, y, dirRight, showTag, marked}: Props) {
  const def = SPECIES[species];
  return (
    <View
      pointerEvents="none"
      style={[styles.wrap, {left: x - FISH_W / 2, top: y - FISH_H / 2}]}>
      {marked && def.hazard ? <View style={styles.ring} /> : null}
      <Image
        source={def.sprite}
        resizeMode="contain"
        style={[
          styles.img,
          {transform: [{scaleX: dirRight ? 1 : -1}]},
        ]}
      />
      {showTag && def.tag ? (
        <Text style={[styles.tag, {color: def.accent}]}>{def.tag}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {position: 'absolute', width: FISH_W, alignItems: 'center'},
  img: {width: FISH_W, height: FISH_H},
  ring: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: FISH_W + 10,
    height: FISH_H + 10,
    borderRadius: (FISH_H + 10) / 2,
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  tag: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

export default React.memo(FishSprite);
