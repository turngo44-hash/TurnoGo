import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../theme/theme';
import { commonStyles } from '../theme/commonStyles';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', // 'primary' | 'outline' | 'secondary'
  size = 'base',      // 'sm' | 'base' | 'lg'
  disabled = false,
  style,
  textStyle,
  ...props 
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`size_${size}Text`],
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={textStyles}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: borderRadius.base,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  
  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  
  // Sizes
  size_sm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  size_base: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
  },
  size_lg: {
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
  },
  
  // Text styles
  text: {
    fontWeight: typography.weights.semibold,
  },
  primaryText: {
    color: colors.background,
  },
  outlineText: {
    color: colors.primary,
  },
  secondaryText: {
    color: colors.background,
  },
  
  // Size-specific text
  size_smText: {
    fontSize: typography.sizes.sm,
  },
  size_baseText: {
    fontSize: typography.sizes.base,
  },
  size_lgText: {
    fontSize: typography.sizes.lg,
  },
  
  // Disabled state
  disabled: {
    backgroundColor: colors.gray[300],
    borderColor: colors.gray[300],
    ...shadows.none,
  },
  disabledText: {
    color: colors.gray[500],
  },
});