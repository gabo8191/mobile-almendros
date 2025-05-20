import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ThemedText } from '../../../shared/components/ThemedText';
import { colors } from '../../../constants/Colors';
import { typography } from '../../../constants/Typography';
import { Feather } from '@expo/vector-icons';

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PA';

type DocumentTypeOption = {
  value: DocumentType;
  label: string;
  description: string;
};

const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: 'CC', label: 'CC', description: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'CE', description: 'Cédula de Extranjería' },
  { value: 'TI', label: 'TI', description: 'Tarjeta de Identidad' },
  { value: 'PA', label: 'PA', description: 'Pasaporte' },
];

type DocumentTypeSelectorProps = {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
};

export function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = DOCUMENT_TYPES.find((option) => option.value === value) || DOCUMENT_TYPES[0];

  const handleSelect = (option: DocumentTypeOption) => {
    onChange(option.value);
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
        <View style={styles.selectedOption}>
          <ThemedText style={styles.selectedOptionText}>{selectedOption.label}</ThemedText>
        </View>
        <Feather name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Tipo de documento</ThemedText>
              <TouchableOpacity onPress={() => setModalVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Feather name="x" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={DOCUMENT_TYPES}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, item.value === value && styles.optionItemSelected]}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.optionContent}>
                    <View style={[styles.optionBadge, item.value === value && styles.optionBadgeSelected]}>
                      <ThemedText style={[styles.optionCode, item.value === value && styles.optionCodeSelected]}>
                        {item.label}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.optionDescription}>{item.description}</ThemedText>
                  </View>
                  {item.value === value && <Feather name="check" size={20} color={colors.primary} />}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.optionsList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 56,
  },
  selectedOption: {
    flex: 1,
  },
  selectedOptionText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  modalTitle: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.h4,
    color: colors.text,
  },
  optionsList: {
    padding: 10,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginVertical: 4,
  },
  optionItemSelected: {
    backgroundColor: `${colors.primary}10`,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionBadge: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  optionBadgeSelected: {
    backgroundColor: `${colors.primary}20`,
    borderColor: colors.primary,
  },
  optionCode: {
    fontFamily: typography.fontFamily.sansBold,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
  },
  optionCodeSelected: {
    color: colors.primary,
  },
  optionDescription: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.body,
    color: colors.text,
  },
});
