import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X } from 'lucide-react-native';

export const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmText = 'Confirm', confirmVariant = 'danger' }) => {
  const { colors } = useApp();

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modalBox, { backgroundColor: colors.bgSurface }]}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <X size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: confirmVariant === 'danger' ? colors.negativeLight : colors.warningLight
              }
            ]}
          >
            <AlertTriangle size={28} color={confirmVariant === 'danger' ? colors.negative : colors.warning} />
          </View>

          <Text style={[styles.title, { color: colors.textMain }]}>{title}</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, { backgroundColor: colors.bgSubtle, borderColor: colors.border }]}
              onPress={onClose}
            >
              <Text style={[styles.btnText, { color: colors.textMain }]}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.btn,
                { backgroundColor: confirmVariant === 'danger' ? colors.negative : colors.primary }
              ]}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text style={styles.btnTextWhite}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalBox: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center'
  },
  description: {
    fontSize: 13,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 18
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%'
  },
  btn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cancelBtn: {
    borderWidth: 1
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600'
  },
  btnTextWhite: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700'
  }
});
