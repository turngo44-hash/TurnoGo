import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  onSubmitEditing,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  returnKeyType = 'next',
  editable = true,
  blurOnSubmit = true,
  style,
  inputRef,
  noBorder = false, // Nueva prop para eliminar bordes
  showError = false, // Mostrar borde de error cuando el campo está enfocado
  textPaddingTop, // allow parent to override paddingTop for the internal TextInput
  textPaddingBottom, // allow parent to override paddingBottom for the internal TextInput
  leftComponent, // optional element to render on the left inside the input container
  leftComponentWidth, // width (number) in px of the left component to offset label/text
  rightComponent, // optional element to render on the right inside the input container
  rightComponentWidth, // width in px of the right component to offset input padding
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    const parentFocus = typeof props.forceFocus === 'boolean' ? props.forceFocus : undefined;
    const focusedNow = (typeof parentFocus === 'boolean' ? parentFocus : isFocused) || (value && value !== '');

    Animated.timing(animatedValue, {
      toValue: focusedNow ? 1 : 0,
      duration: 120, // Animación un poco más rápida
      useNativeDriver: false,
    }).start();
  }, [isFocused, props.forceFocus, value]);

  const handleFocus = () => {
    setIsFocused(true);
    // Llamar al onFocus pasado por props para que el padre también lo reciba
    if (props && typeof props.onFocus === 'function') {
      props.onFocus();
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Llamar al onBlur pasado por props para que el padre también lo reciba
    if (props && typeof props.onBlur === 'function') {
      props.onBlur();
    }
  };

  // If parent supplies forceFocus, use it as the source of truth for focus state
  const effectiveFocused = typeof props.forceFocus === 'boolean' ? props.forceFocus : isFocused;

  const labelStyle = {
    position: 'absolute',
  left: (typeof leftComponentWidth === 'number' ? leftComponentWidth : 0) + 18, // Alinear el label con el texto (respetar leftComponent si existe)
    top: animatedValue.interpolate({
      inputRange: [0, 1],
  outputRange: [18, 7],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
  outputRange: [16, 12], // Un poco más pequeño que el texto
    }),
  // Do not change label color on error; only change border. Keep label color based on focus state.
  color: effectiveFocused ? '#000000' : '#6B7280',
  // allow parent to explicitly set label background (useful when input is placed inside a custom container)
  backgroundColor: typeof props.labelBackground === 'string' ? props.labelBackground : (props.noBorder ? 'transparent' : 'white'),
  paddingHorizontal: 0,
    zIndex: 1,
    pointerEvents: 'none', // No interferir con el input
  };
  const inputContainerStyle = [
    styles.inputContainer,
    !noBorder && {
      // Si hay error, mostrar borde rojo incluso si no está enfocado.
  borderColor: showError ? '#EF4444' : (effectiveFocused ? '#000000' : (value ? '#D1D5DB' : '#E5E7EB')),
  borderWidth: showError ? 2 : (effectiveFocused ? 2 : 1),
    },
    noBorder && {
      borderWidth: 0,
      shadowOpacity: 0,
      elevation: 0,
      backgroundColor: 'transparent',
    },
    style,
  ];

  return (
    <View style={styles.container}>
      <View style={inputContainerStyle}>
        {/* leftComponent rendered inside the input container so phone input can reuse exact styles */}
        {leftComponent ? (
          <View style={[styles.leftComponentWrapper, { width: leftComponentWidth || 0 }]} pointerEvents="box-none">
            {leftComponent}
          </View>
        ) : null}
        {/* rightComponent rendered inside the input container (e.g., show password toggle) */}
        {rightComponent ? (
          <View style={[styles.rightComponentWrapper, { width: rightComponentWidth || 40 }]} pointerEvents="box-none">
            {rightComponent}
          </View>
        ) : null}
        <Animated.Text style={labelStyle}>
          {label || placeholder}
        </Animated.Text>
    <TextInput
          ref={inputRef}
          style={[
            styles.input,
            leftComponent ? { paddingLeft: (18 + (leftComponentWidth || 0)) } : {},
            rightComponent ? { paddingRight: (12 + (rightComponentWidth || 40)) } : {},
            noBorder && {
              paddingHorizontal: 18, // Restaurar padding normal (alineado)
      paddingTop: typeof textPaddingTop === 'number' ? textPaddingTop : 14, // Ajustar para centrar verticalmente dentro de contenedores externos
      paddingBottom: typeof textPaddingBottom === 'number' ? textPaddingBottom : 12,
            }
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onSubmitEditing={onSubmitEditing}
          selectionColor="#000000"
          placeholder=""
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          editable={editable}
          blurOnSubmit={blurOnSubmit}
          placeholderTextColor="transparent"
          multiline={false}
          {...props}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12, // Separación intermedia y uniforme
  },
  inputContainer: {
    position: 'relative',
    borderRadius: 8, // Border radius como Netflix
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'visible', // Asegurar que el label sea visible
  },
  leftComponentWrapper: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 3,
    paddingLeft: 18,
  },
  input: {
  fontSize: 17, // Tamaño un poco más grande
  fontWeight: '500', // Menos pesado que 600 para que no se vea tan negrilla
    paddingHorizontal: 18, // Un poco menos espacioso
    paddingVertical: 16, // Menos padding vertical
  paddingTop: 24, // Ajustado para el label
  paddingBottom: 10, // Menos espacio inferior
  color: '#374151', // tono un poco más claro para reducir contraste del texto
    backgroundColor: 'transparent',
  height: 52, // altura fija para asegurar centrado vertical
  textAlignVertical: 'center',
    width: '100%', // Asegurar que ocupe todo el ancho
    zIndex: 2, // Por encima del label
  },
});

export default FloatingLabelInput;
