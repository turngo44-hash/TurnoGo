// Estilos comunes reutilizables para componentes
import { StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from './theme';

export const commonStyles = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.base,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    ...shadows.base,
  },
  
  // Textos
  title: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.bold,
    color: colors.text,
    marginBottom: spacing.base,
  },
  subtitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  text: {
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  textSecondary: {
    fontSize: typography.sizes.base,
    color: colors.textSecondary,
  },
  
  // Botones
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonOutlineText: {
    color: colors.primary,
  },
  
  // Inputs
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.base,
    padding: spacing.base,
    fontSize: typography.sizes.base,
    color: colors.text,
  },
  inputLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  
  // Utilidades
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shadow: shadows.base,
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.base,
  },
});