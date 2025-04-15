import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions, useColorScheme, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import ActionModal from '@/components/utilsComponent/ActionModal'
import CustomModal from '@/components/utilsComponent/CustomModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import * as DocumentPicker from 'expo-document-picker'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import { Stack } from 'expo-router'
interface Notice {
  id: number;
  name: string;
  description: string;
  publishDate: string;
  fileUrl?: string;
}

const ManageNotice = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null)
  const [Files, setFiles] = useState<DocumentPicker.DocumentPickerResult | null>(null)
  const [Name, setName] = useState('')
  const [Description, setDescription] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const colorTheme = useColorScheme()
  const queryClient = useQueryClient()

  // Fetch notices with error handling
  const {
    data: noticeData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['notice', pageNo, pageSize],
    queryFn: () => apiServices.getAllNotice(pageNo, pageSize),
    refetchOnReconnect(query) {
      return true
    },
  })

  // Reset form
  const resetForm = () => {
    setIsModalVisible(false)
    setSelectedNotice(null)
    setFiles(null)
    setName('')
    setDescription('')
    setIsSubmitting(false)
  }

  // Document picker with improved error handling
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setFiles(result);
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document. Please try again.')
      console.error('Document picking error:', err);
    }
  };

  // Create notice mutation
  const { mutate: createNotice } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('Name', Name.trim());
      formData.append('Description', Description.trim());
      if (Files && !Files.canceled) {
        const file = Files.assets[0];
        formData.append('Files', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        } as any);
      }
      return apiServices.createNotice(formData);
    },
    onSuccess: () => {
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['notice'] })
      Alert.alert('Success', 'Notice created successfully')
    },
    onError: (error) => {
      setIsSubmitting(false)
      Alert.alert('Error', 'Failed to create notice. Please try again.')
      console.error('Error creating notice:', error)
    }
  })

  // Handle create notice with validation
  const handleCreateNotice = () => {
    if (!Name.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }
    
    if (!Files) {
      Alert.alert('Error', 'Please select a file')
      return
    }
    
    setIsSubmitting(true)
    createNotice()
  }

  // Update notice mutation
  const { mutate: updateNotice } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('Name', Name.trim());
      formData.append('Description', Description.trim());
      if (Files && !Files.canceled) {
        const file = Files.assets[0];
        formData.append('Files', {
          uri: file.uri,
          name: file.name,
          type: file.mimeType
        } as any);
      }
      return apiServices.updateNotice(selectedNotice?.id, formData);
    },
    onSuccess: () => {
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['notice'] })
      Alert.alert('Success', 'Notice updated successfully')
    },
    onError: (error) => {
      setIsSubmitting(false)
      Alert.alert('Error', 'Failed to update notice. Please try again.')
      console.error('Error updating notice:', error)
    }
  })

  // Handle update notice with validation
  const handleUpdateNotice = () => {
    if (!Name.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }
    
    setIsSubmitting(true)
    updateNotice()
  }

  // Delete notice mutation
  const { mutate: deleteNotice } = useMutation({
    mutationFn: (id: number) => apiServices.deleteNotice(id),
    onSuccess: () => {
      setIsDeleteModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['notice'] })
      Alert.alert('Success', 'Notice deleted successfully')
    },
    onError: (error) => {
      setIsDeleteModalVisible(false)
      Alert.alert('Error', 'Failed to delete notice. Please try again.')
      console.error('Error deleting notice:', error)
    }
  })

  // Handle delete notice
  const handleDeleteNotice = () => {
    if (selectedNotice) {
      deleteNotice(selectedNotice.id)
    }
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Manage Notice"}} />
    <View>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Manage Notices</ThemedText>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            resetForm()
            setIsModalVisible(true)
          }}
        >
          <ThemedText style={styles.addButtonText}>Add Notice</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading notices...</ThemedText>
        </ThemedView>
      ) : isError ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>Failed to load notices</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <FlatList
          data={noticeData?.data}
          renderItem={({item}) => (
            <ThemedView style={styles.noticeCard}>
              <View style={styles.noticeContent}>
                <View style={styles.fileIcon}>
                  <MaterialCommunityIcons name="file-pdf-box" size={40} color={Colors.light.tint} />
                </View>
                <View style={styles.noticeDetails}>
                  <ThemedText style={styles.noticeTitle} numberOfLines={2}>{item.name}</ThemedText>
                  <ThemedText style={styles.noticeFile}>{item.description}</ThemedText>
                  <ThemedText style={styles.noticeDate}>
                    Date: {item.publishDate ? item.publishDate.split('T')[0] : 'N/A'}
                  </ThemedText>
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButtonEdit} 
                  onPress={() => {
                    setSelectedNotice(item)
                    setName(item.name)
                    setDescription(item.description || '')
                    setFiles(null)
                    setIsModalVisible(true)
                  }}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButtonDelete}
                  onPress={() => {
                    setSelectedNotice(item)
                    setIsDeleteModalVisible(true)
                  }}>
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </ThemedView>
          )}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <ThemedView style={styles.centerContent}>
              <ThemedText>No notices found</ThemedText>
            </ThemedView>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          onEndReached={() => {
            if (noticeData?.totalPages > pageNo) {
              setPageNo(prev => prev + 1)
            }
          }}
          onEndReachedThreshold={0.5}
          refreshing={isLoading}
          onRefresh={refetch}
        />
      )}

      <ActionModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete Notice"
      >
        <ThemedText>Are you sure you want to delete this notice?</ThemedText>
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={styles.actionButtonDeleteNo} 
            onPress={() => setIsDeleteModalVisible(false)}
          >
            <Text style={styles.actionButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButtonDelete} 
            onPress={handleDeleteNotice}
          >
            <Text style={styles.actionButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </ActionModal>

      <CustomModal
        isVisible={isModalVisible}
        onClose={resetForm}
        title={selectedNotice ? 'Edit Notice' : 'Add Notice'}
        height={Dimensions.get('window').height * 0.6}
      >
        <ThemedView style={styles.modalContent}>
          <ThemedText>Title <Text style={styles.requiredField}>*</Text></ThemedText>
          <TextInput  
            style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
            value={Name}
            onChangeText={setName}
            placeholder="Enter notice title"
            maxLength={100}
          />
          <ThemedText>Description</ThemedText>
          <TextInput  
            style={[styles.input, styles.textArea, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
            value={Description}
            onChangeText={setDescription}
            placeholder="Enter notice description"
            multiline
            numberOfLines={2}
            maxLength={300}
          />
          <ThemedText>File {!selectedNotice && <Text style={styles.requiredField}>*</Text>}</ThemedText>
          {Files ? (
            <View style={styles.selectedFileContainer}>
              <ThemedText numberOfLines={1} style={styles.selectedFileName}>
                {Files.assets?.[0]?.name}
              </ThemedText>
              <TouchableOpacity onPress={() => setFiles(null)}>
                <MaterialCommunityIcons name="close" size={20} color={Colors.light.tint} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.filePicker} onPress={pickDocument}>
              <MaterialCommunityIcons name="file-upload" size={24} color={Colors.light.tint} />
              <ThemedText style={styles.filePickerText}>Choose PDF file</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>
        <TouchableOpacity 
          style={[
            styles.modalButton, 
            ((!Name || (!Files && !selectedNotice)) || isSubmitting) && styles.modalButtonDisabled
          ]} 
          disabled={(!Name || (!Files && !selectedNotice)) || isSubmitting}
          onPress={() => {
            if (selectedNotice) {
              handleUpdateNotice()
            } else {
              handleCreateNotice()
            }
          }}>
          <ThemedText style={styles.modalButtonText}>
            {isSubmitting ? 'Processing...' : selectedNotice ? 'Update Notice' : 'Add Notice'}
          </ThemedText>
        </TouchableOpacity>
      </CustomModal>
    </View>
    </>
  )
}

export default ManageNotice

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  addButton: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    margin: 10
  },
  addButtonText: {
    color: 'white',
    fontSize: 16
  },
  listContainer: {
    padding: 10,
    gap: 10
  },
  noticeCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border
  },
  noticeContent: {
    flexDirection: 'row',
    marginBottom: 10
  },
  fileIcon: {
    marginRight: 15
  },
  noticeDetails: {
    flex: 1
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  noticeFile: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3
  },
  noticeDate: {
    fontSize: 12,
    color: '#888'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  actionButtonEdit: {
    backgroundColor: '#007AFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  actionButtonDelete: {
    backgroundColor: '#FF3B30',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  actionButtonDeleteNo: {
    backgroundColor: '#666',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20
  },
  modalContent: {
    gap: 10,
    padding: 10
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    padding: 10
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top'
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 5
  },
  modalButtonDisabled: {
    backgroundColor: '#ccc'
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  filePicker: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  filePickerText: {
    color: Colors.light.tint
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    padding: 10
  },
  selectedFileName: {
    flex: 1,
    marginRight: 10
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  retryButton: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14
  },
  requiredField: {
    color: 'red'
  }
})