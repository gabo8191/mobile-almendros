import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../../shared/components/ThemedText';
import { colors } from '../../../constants/Colors';
import { typography } from '../../../constants/Typography';

export type DocumentType = 'CC' | 'CE' | 'TI' | 'PA';

type DocumentTypeOption = {
  value: DocumentType;
  label: string;
};

const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { value: 'CC', label: 'CC' },
  { value: 'CE', label: 'CE' },
  { value: 'TI', label: 'TI' },
  { value: 'PA', label: 'PA' },
];

type DocumentTypeSelectorProps = {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
};

export function DocumentTypeSelector({ value, onChange }: DocumentTypeSelectorProps) {
  return (
    <View style={styles.container}>
      {DOCUMENT_TYPES.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[styles.option, value === option.value && styles.optionSelected]}
          onPress={() => onChange(option.value)}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.optionText, value === option.value && styles.optionTextSelected]}>{option.label}</ThemedText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: `${colors.primary}15`,
    borderColor: colors.primary,
  },
  optionText: {
    fontFamily: typography.fontFamily.sans,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
  },
  optionTextSelected: {
    fontFamily: typography.fontFamily.sansBold,
    color: colors.primary,
  },
});
