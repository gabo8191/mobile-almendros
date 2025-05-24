import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Image,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StatusBar,
} from 'react-native';
import { ThemedText } from '../../src/shared/components/ThemedText';
import { AppLoader } from '../../src/shared/components/AppLoader';
import { colors } from '../../src/constants/Colors';
import { useAuth } from '../../src/shared/context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { typography } from '../../src/constants/Typography';
import { DocumentTypeSelector, DocumentType } from '../../src/features/auth/components/DocumentTypeSelector';

export default function LoginScreen() {
  const [documentType, setDocumentType] = useState<DocumentType>('CC');
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentError, setDocumentError] = useState('');

  const { loginWithDocument, isLoading, error, clearError } = useAuth();

  // Limpiar errores cuando el usuario cambie los datos
  useEffect(() => {
    if (error) {
      clearError();
    }
    if (documentError) {
      setDocumentError('');
    }
  }, [documentType, documentNumber]);

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setDocumentError('');
    clearError();

    // Validate document number
    if (!documentNumber.trim()) {
      setDocumentError('El número de documento es requerido');
      isValid = false;
    } else if (!/^\d+$/.test(documentNumber.trim())) {
      setDocumentError('El número de documento debe contener solo dígitos');
      isValid = false;
    } else if (documentNumber.trim().length < 6) {
      setDocumentError('El número de documento debe tener al menos 6 dígitos');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (validateForm()) {
      try {
        await loginWithDocument(documentType, documentNumber.trim());
      } catch (error) {
        // El AuthContext ya maneja los errores específicos
        console.error('Login error handled by context:', error);
      }
    }
  };

  const handleDocumentNumberChange = (text: string) => {
    // Solo permitir números
    const numericText = text.replace(/[^0-9]/g, '');
    setDocumentNumber(numericText);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />

          <View style={styles.contentContainer}>
            {/* Logo y título */}
            <View style={styles.logoContainer}>
              <Image source={require('../../assets/images/logo.png')} style={styles.logoImage} resizeMode="contain" />
              <ThemedText style={styles.logoText} type="title">
                Almendros
              </ThemedText>
            </View>

            {/* Header */}
            <View style={styles.headerContainer}>
              <ThemedText style={styles.welcomeText} type="subtitle">
                Bienvenido
              </ThemedText>
              <ThemedText style={styles.subtitleText} type="heading">
                Ingrese su documento para consultar sus pedidos
              </ThemedText>
            </View>

            {/* Formulario */}
            <View style={styles.formContainer}>
              {/* Selector de tipo de documento */}
              <View style={styles.formField}>
                <ThemedText style={styles.inputLabel}>Tipo de documento</ThemedText>
                <DocumentTypeSelector value={documentType} onChange={setDocumentType} />
              </View>

              {/* Input de número de documento */}
              <View style={styles.formField}>
                <ThemedText style={styles.inputLabel}>Número de documento</ThemedText>
                <View style={[styles.inputWrapper, documentError && styles.inputWrapperError]}>
                  <Feather name="user" size={20} color={colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    value={documentNumber}
                    onChangeText={handleDocumentNumberChange}
                    placeholder="Ej: 12345678"
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    placeholderTextColor={colors.textTertiary}
                    maxLength={15}
                    editable={!isLoading}
                  />
                </View>
                {documentError ? <ThemedText style={styles.errorText}>{documentError}</ThemedText> : null}
              </View>

              {/* Error general */}
              {error && (
                <View style={styles.errorContainer}>
                  <Feather name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />
                  <ThemedText style={styles.errorText}>{error}</ThemedText>
                </View>
              )}

              {/* Botón de login */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={isLoading || !documentNumber.trim()}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <AppLoader size="small" color={colors.textLight} />
                ) : (
                  <ThemedText style={styles.buttonText} type="button">
                    Ingresar
                  </ThemedText>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer informativo */}
            <View style={styles.footer}>
              <View style={styles.infoRow}>
                <Feather name="shield" size={16} color={colors.primary} style={styles.infoIcon} />
                <ThemedText style={styles.infoText}>Consulta segura de tus pedidos</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <Feather name="clock" size={16} color={colors.primary} style={styles.infoIcon} />
                <ThemedText style={styles.infoText}>Disponible 24/7</ThemedText>
              </View>
            </View>
          </View>

          {isLoading && <AppLoader fullScreen />}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.background,
  },
  logoText: {
    marginTop: 16,
    fontSize: 32,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily.serif,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 28,
    color: colors.primary,
    marginBottom: 8,
    fontFamily: typography.fontFamily.sans,
  },
  subtitleText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.sansLight,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
  },
  formField: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
    fontFamily: typography.fontFamily.sansBold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.sans,
    height: '100%',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamily.sans,
    flex: 1,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  loginButtonDisabled: {
    opacity: 0.6,
    elevation: 1,
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: colors.textLight,
    fontSize: typography.sizes.button,
    fontFamily: typography.fontFamily.sansBold,
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.sans,
  },
});
