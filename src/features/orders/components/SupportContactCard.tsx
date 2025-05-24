import React from 'react';
import { View, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { ThemedText } from '../../../shared/components/ThemedText';
import { colors } from '../../../constants/Colors';
import { typography } from '../../../constants/Typography';
import { Feather } from '@expo/vector-icons';

type SupportContactCardProps = {
  orderNumber?: string;
  showHeader?: boolean;
};

export function SupportContactCard({ orderNumber, showHeader = true }: SupportContactCardProps) {
  const contactOptions = [
    {
      id: 'phone',
      title: 'Llamar',
      subtitle: '+593 2 123-4567',
      icon: 'phone' as const,
      color: colors.success,
      action: () => Linking.openURL('tel:+5932123456'),
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      subtitle: 'Chat directo',
      icon: 'message-circle' as const,
      color: '#25D366',
      action: () => {
        const message = orderNumber ? `Hola, necesito ayuda con mi pedido #${orderNumber}` : 'Hola, necesito ayuda con mi cuenta';
        Linking.openURL(`whatsapp://send?phone=5932123456&text=${encodeURIComponent(message)}`);
      },
    },
    {
      id: 'email',
      title: 'Email',
      subtitle: 'soporte@almendros.com',
      icon: 'mail' as const,
      color: colors.primary,
      action: () => {
        const subject = orderNumber ? `Consulta sobre pedido #${orderNumber}` : 'Consulta general';
        Linking.openURL(`mailto:soporte@almendros.com?subject=${encodeURIComponent(subject)}`);
      },
    },
  ];

  const handleContactPress = async (option: (typeof contactOptions)[0]) => {
    try {
      await option.action();
    } catch (error) {
      console.error('Error opening contact option:', error);

      let fallbackMessage = '';
      if (option.id === 'phone') {
        fallbackMessage = 'Llámanos al: +593 2 123-4567';
      } else if (option.id === 'whatsapp') {
        fallbackMessage = 'Escríbenos por WhatsApp al: +593 2 123-4567';
      } else if (option.id === 'email') {
        fallbackMessage = 'Escríbenos a: soporte@almendros.com';
      }

      Alert.alert('Información de Contacto', fallbackMessage, [{ text: 'Entendido' }]);
    }
  };

  return (
    <View style={styles.container}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Feather name="headphones" size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <ThemedText style={styles.headerTitle}>¿Necesitas ayuda?</ThemedText>
            <ThemedText style={styles.headerSubtitle}>Nuestro equipo de soporte está aquí para ayudarte</ThemedText>
          </View>
        </View>
      )}

      <View style={styles.optionsContainer}>
        {contactOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionItem}
            onPress={() => handleContactPress(option)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionIcon, { backgroundColor: `${option.color}15` }]}>
              <Feather name={option.icon} size={20} color={option.color} />
            </View>
            <View style={styles.optionContent}>
              <ThemedText style={styles.optionTitle}>{option.title}</ThemedText>
              <ThemedText style={styles.optionSubtitle}>{option.subtitle}</ThemedText>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Feather name="clock" size={16} color={colors.textSecondary} style={styles.footerIcon} />
          <ThemedText style={styles.footerText}>Lunes a Viernes: 8:00 AM - 6:00 PM</ThemedText>
        </View>
        <View style={styles.footerInfo}>
          <Feather name="calendar" size={16} color={colors.textSecondary} style={styles.footerIcon} />
          <ThemedText style={styles.footerText}>Sábados: 9:00 AM - 2:00 PM</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.backgroundAlt,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: 16,
    color: colors.text,
    marginBottom: 2,
  },
  optionSubtitle: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerIcon: {
    marginRight: 8,
  },
  footerText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: 14,
    color: colors.textSecondary,
  },
});
