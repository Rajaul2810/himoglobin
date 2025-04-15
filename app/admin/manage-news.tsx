import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Alert, Dimensions, useColorScheme } from 'react-native'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import ActionModal from '@/components/utilsComponent/ActionModal'
import CustomModal from '@/components/utilsComponent/CustomModal'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack } from 'expo-router'

interface News {
  id: number
  name: string
  description: string
  url: string
  createTime: string
  publishDate?: string
}

const ManageNews = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [publishDate, setPublishDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [date, setDate] = useState(new Date())

  const colorTheme = useColorScheme()
  const queryClient = useQueryClient()

  // Fetch news with error handling
  const {
    data: newsData,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['news', pageNo, pageSize],
    queryFn: () => apiServices.getAllNews(pageNo, pageSize),
    refetchOnReconnect(query) {
      return true
    },
  })

  // Reset form
  const resetForm = () => {
    setIsModalVisible(false)
    setSelectedNews(null)
    setName('')
    setDescription('')
    setUrl('')
    setPublishDate('')
    setDate(new Date())
    setIsSubmitting(false)
  }

  // Create news mutation
  const { mutate: createNewsMutation } = useMutation({
    mutationFn: () => {
      const newsData = {
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        publishDate: publishDate
      }
      return apiServices.createNews(newsData)
    },
    onSuccess: () => {
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['news'] })
      Alert.alert('Success', 'News created successfully')
    },
    onError: (error) => {
      setIsSubmitting(false)
      Alert.alert('Error', 'Failed to create news. Please try again.')
      console.error('Error creating news:', error)
    }
  })

  // Handle create news with validation
  const handleCreateNews = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }
    
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a URL')
      return
    }
    
    setIsSubmitting(true)
    createNewsMutation()
  }

  // Update news mutation
  const { mutate: updateNewsMutation } = useMutation({
    mutationFn: () => {
      const newsData = {
        id: selectedNews?.id,
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        publishDate: publishDate
      }
      return apiServices.updateNews(newsData)
    },
    onSuccess: () => {
      resetForm()
      queryClient.invalidateQueries({ queryKey: ['news'] })
      Alert.alert('Success', 'News updated successfully')
    },
    onError: (error) => {
      setIsSubmitting(false)
      Alert.alert('Error', 'Failed to update news. Please try again.')
      console.error('Error updating news:', error)
    }
  })

  // Handle update news with validation
  const handleUpdateNews = () => {
    setIsSubmitting(true)
    updateNewsMutation()
  }

  // Delete news mutation
  const { mutate: deleteNewsMutation } = useMutation({
    mutationFn: (id: number) => apiServices.deleteNews(id),
    onSuccess: () => {
      setIsDeleteModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['news'] })
      Alert.alert('Success', 'News deleted successfully')
    },
    onError: (error) => {
      setIsDeleteModalVisible(false)
      Alert.alert('Error', 'Failed to delete news. Please try again.')
      console.error('Error deleting news:', error)
    }
  })

  // Handle delete news
  const handleDeleteNews = () => {
    if (selectedNews) {
      deleteNewsMutation(selectedNews.id)
    }
  }

  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false)
    if (selectedDate) {
      setDate(selectedDate)
      setPublishDate(selectedDate.toISOString().split('T')[0])
    }
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Manage News"}} />
      <View>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Manage News</ThemedText>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => {
            resetForm()
            setIsModalVisible(true)
          }}
        >
          <ThemedText style={styles.addButtonText}>Add News</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>Loading news...</ThemedText>
        </ThemedView>
      ) : isError ? (
        <ThemedView style={styles.centerContent}>
          <ThemedText>Failed to load news</ThemedText>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <FlatList
          data={newsData?.data}
          renderItem={({item}) => (
            <ThemedView style={styles.newsCard}>
              <View style={styles.newsContent}>
                <View style={styles.newsIcon}>
                  <MaterialCommunityIcons name="newspaper" size={40} color={Colors.light.tint} />
                </View>
                <View style={styles.newsDetails}>
                  <ThemedText style={styles.newsTitle} numberOfLines={2}>{item.name}</ThemedText>
                  <ThemedText style={styles.newsDescription} numberOfLines={2}>{item.description}</ThemedText>
                  <ThemedText style={styles.newsUrl} numberOfLines={1}>{item.url}</ThemedText>
                  <ThemedText style={styles.newsDate}>
                    Date: {item.createTime ? item.createTime.split('T')[0] : 'N/A'}
                  </ThemedText>
                  {item.publishDate && (
                    <ThemedText style={styles.newsDate}>
                      Publish Date: {item.publishDate}
                    </ThemedText>
                  )}
                </View>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.actionButtonEdit} 
                  onPress={() => {
                    setSelectedNews(item)
                    setName(item.name)
                    setDescription(item.description || '')
                    setUrl(item.url || '')
                    setPublishDate(item.publishDate || '')
                    if (item.publishDate) {
                      setDate(new Date(item.publishDate))
                    }
                    setIsModalVisible(true)
                  }}>
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButtonDelete}
                  onPress={() => {
                    setSelectedNews(item)
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
              <ThemedText>No news found</ThemedText>
            </ThemedView>
          }
          ListFooterComponent={<View style={{ height: 100 }} />}
          onEndReached={() => {
            if (newsData?.totalPages > pageNo) {
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
        title="Delete News"
      >
        <ThemedText>Are you sure you want to delete this news?</ThemedText>
        <View style={styles.modalButtons}>
          <TouchableOpacity 
            style={styles.actionButtonDeleteNo} 
            onPress={() => setIsDeleteModalVisible(false)}
          >
            <Text style={styles.actionButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButtonDelete} 
            onPress={handleDeleteNews}
          >
            <Text style={styles.actionButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </ActionModal>

      <CustomModal
        isVisible={isModalVisible}
        onClose={resetForm}
        title={selectedNews ? 'Edit News' : 'Add News'}
        height={Dimensions.get('window').height * 0.6}
      >
        <ThemedView style={styles.modalContent}>
          <ThemedText>Title <Text style={styles.requiredField}>*</Text></ThemedText>
          <TextInput  
            style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
            value={name}
            onChangeText={setName}
            placeholder="Enter news title"
            maxLength={100}
          />
          <ThemedText>Description</ThemedText>
          <TextInput  
            style={[styles.input, styles.textArea, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter news description"
            multiline
            numberOfLines={3}
            maxLength={500}
          />
          <ThemedText>URL <Text style={styles.requiredField}>*</Text></ThemedText>
          <TextInput  
            style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
            value={url}
            onChangeText={setUrl}
            placeholder="Enter news URL"
            autoCapitalize="none"
            keyboardType="url"
          />
          <ThemedText>Publish Date</ThemedText>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <ThemedText style={styles.datePickerText}>
              {publishDate ? publishDate : 'Select publish date'}
            </ThemedText>
            <Ionicons name="calendar" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}
        </ThemedView>
        <TouchableOpacity 
          style={[
            styles.modalButton, 
            ((!name || !url) || isSubmitting) && styles.modalButtonDisabled
          ]} 
          disabled={(!name || !url) || isSubmitting}
          onPress={() => {
            if (selectedNews) {
              handleUpdateNews()
            } else {
              handleCreateNews()
            }
          }}>
          <ThemedText style={styles.modalButtonText}>
            {isSubmitting ? 'Processing...' : selectedNews ? 'Update News' : 'Add News'}
          </ThemedText>
        </TouchableOpacity>
      </CustomModal>
    </View>
    </>
  )
}

export default ManageNews

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  addButton: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  newsCard: {
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  newsContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  newsIcon: {
    marginRight: 12,
    justifyContent: 'center',
  },
  newsDetails: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  newsDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  newsUrl: {
    fontSize: 12,
    color: Colors.light.tint,
    marginBottom: 4,
  },
  newsDate: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButtonEdit: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonDelete: {
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonDeleteNo: {
    backgroundColor: '#888',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  requiredField: {
    color: '#ff4d4f',
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  modalButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  selectedFileName: {
    flex: 1,
    marginRight: 8,
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
    borderStyle: 'dashed',
  },
  filePickerText: {
    marginLeft: 8,
    color: Colors.light.tint,
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  datePickerText: {
    color: '#555',
  },
})