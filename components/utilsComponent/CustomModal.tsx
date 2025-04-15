import { Modal, View, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { ReactNode } from 'react';
import { Colors } from '@/constants/Colors';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface CustomModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  height?: number;
  title?: string;
}

const CustomModal = ({
  isVisible,
  onClose,
  children,
  height = Dimensions.get('window').height * 0.8, // default height as 80% of screen height
  title = 'Modal Title'
}: CustomModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ThemedView style={[styles.modalContainer, {height: height}]}>
          <TouchableOpacity 
            style={[styles.closeButton, {backgroundColor: Colors.light.tint}]}
            onPress={onClose}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <ThemedText style={styles.modalTitle}>{title}</ThemedText>
          <ScrollView>
            <View style={styles.contentContainer}>
              {children}
            </View>
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    
    width: '95%',
    borderRadius: 10,
    padding: 15,
    position: 'relative',
    maxHeight: '90%'
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 5,
    borderRadius: 50
  },
  contentContainer: {
    flex: 1,
    marginTop: 10,
    overflow: 'scroll'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default CustomModal;
