import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Dimensions, useColorScheme, Alert, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import ActionModal from '@/components/utilsComponent/ActionModal'
import CustomModal from '@/components/utilsComponent/CustomModal'
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { Dropdown } from 'react-native-element-dropdown'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import * as ImagePicker from 'expo-image-picker'
import { Stack } from 'expo-router'
interface Media {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  date: string;
}

interface VideoLink {
  id: string;
  url: string;
}

const mediaTypes = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' }
]

const ManageMedia = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null)
  const [mediaTitle, setMediaTitle] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [mediaUrl, setMediaUrl] = useState('')
  const [tab, setTab] = useState<'image' | 'video'>('image')
  const {campaignId} = useLocalSearchParams()
  const colorTheme = useColorScheme()
  const router = useRouter()
  const queryClient = useQueryClient()
  
  // For multiple images
  const [selectedImages, setSelectedImages] = useState<string[]>([])
  
  // For multiple video links
  const [videoLinks, setVideoLinks] = useState<VideoLink[]>([{ id: '1', url: '' }])
  
  const {data: mediaData, isLoading: isLoadingMedia, isError: isErrorMedia, error: mediaError, refetch} = useQuery({
    queryKey: ['media', campaignId],
    queryFn: () => apiServices.getCampaignMedia(campaignId),
    enabled: !!campaignId,
    refetchOnReconnect: true,
  })  

  const {mutate: uploadMedia, isPending: isLoadingUploadMedia, isError: isErrorUploadMedia, error: uploadMediaError} = useMutation({
    mutationFn: () => {
      if (mediaType === 'image') {
        // Handle multiple image uploads
        const uploadPromises = selectedImages.map(imageUri => 
          apiServices.uploadCampaignMedia({mediaTitle, mediaType, mediaUrl: imageUri, campaignId})
        );
        return Promise.all(uploadPromises);
      } else {
        // Handle multiple video links
        const validVideoLinks = videoLinks.filter(link => link.url.trim() !== '');
        const uploadPromises = validVideoLinks.map(link => 
          apiServices.uploadCampaignMedia({mediaTitle, mediaType, mediaUrl: link.url, campaignId})
        );
        return Promise.all(uploadPromises);
      }
    },
    onSuccess: () => {
      setIsModalVisible(false)
      queryClient.invalidateQueries({ queryKey: ['media', campaignId] })
      Alert.alert('Success', 'Media uploaded successfully')
      resetForm()
    },
    onError: (error) => {
      Alert.alert('Error', 'Failed to upload media')
      console.error('Error uploading media:', error)
    }
  })

  const {mutate: deleteMediaMutation, isPending: isLoadingDeleteMedia, isError: isErrorDeleteMedia, error: deleteMediaError} = useMutation({
    mutationFn: () => apiServices.deleteMedia(selectedMedia?.id, campaignId),
    onSuccess: (data) => {
      console.log(data)
      if(data?.data?.isSuccess) {
        setIsDeleteModalVisible(false)
        queryClient.invalidateQueries({ queryKey: ['media', campaignId] })
        Alert.alert('Success', 'Media deleted successfully')
      } else {
        Alert.alert('Error', data?.data?.message)
      }
    },
    onError: (error) => {
      setIsDeleteModalVisible(false)
      Alert.alert('Error', 'Failed to delete media')
      console.error('Error deleting media:', error)
    }
  })

  const resetForm = () => {
    setMediaTitle('')
    setMediaType('image')
    setMediaUrl('')
    setSelectedImages([])
    setVideoLinks([{ id: '1', url: '' }])
  }

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 0.8,
      });
      
      if (!result.canceled) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedImages([...selectedImages, ...newImages]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick images');
      console.error('Error picking images:', error);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const addVideoLink = () => {
    setVideoLinks([...videoLinks, { id: Date.now().toString(), url: '' }]);
  };

  const updateVideoLink = (id: string, url: string) => {
    const updatedLinks = videoLinks.map(link => 
      link.id === id ? { ...link, url } : link
    );
    setVideoLinks(updatedLinks);
  };

  const removeVideoLink = (id: string) => {
    if (videoLinks.length > 1) {
      const updatedLinks = videoLinks.filter(link => link.id !== id);
      setVideoLinks(updatedLinks);
    }
  };

  const handleAddOrUpdateMedia = () => {
    if (!mediaTitle.trim()) {
      Alert.alert('Error', 'Please enter a title')
      return
    }
    
    if (mediaType === 'image' && selectedImages.length === 0) {
      Alert.alert('Error', 'Please select at least one image')
      return
    }
    
    if (mediaType === 'video' && !videoLinks.some(link => link.url.trim() !== '')) {
      Alert.alert('Error', 'Please enter at least one video URL')
      return
    }
    
    uploadMedia()
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Manage Media"}} />
    <View>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle">Manage Media</ThemedText>
        <TouchableOpacity style={styles.addButton} onPress={() => {
          setSelectedMedia(null)
          resetForm()
          setIsModalVisible(true)
        }}>
          <ThemedText style={styles.addButtonText}>Add Media</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tabButton, tab === 'image' && styles.tabButtonActive]} onPress={() => setTab('image')}>
          <ThemedText style={[styles.tabButtonText, tab === 'image' && styles.tabButtonTextActive]}>Image</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, tab === 'video' && styles.tabButtonActive]} onPress={() => setTab('video')}>
          <ThemedText style={[styles.tabButtonText, tab === 'video' && styles.tabButtonTextActive]}>Video</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tab === 'image' ? mediaData?.data?.imageData : mediaData?.data?.videoData}
        renderItem={({item}) => (
          <ThemedView style={styles.mediaCard}>
            <View style={styles.mediaContent}>
              <Image 
                source={{uri: `https://mehrabmahi21-001-site1.qtempurl.com/${item.imageUrl}`}} 
                style={styles.mediaImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButtonDelete}
                onPress={() => {
                  setSelectedMedia(item)
                  setIsDeleteModalVisible(true)
                }}>
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{gap: 10}}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<ThemedText style={{textAlign: 'center'}}>No media found</ThemedText>}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      <ActionModal
        visible={isDeleteModalVisible}
        onClose={() => setIsDeleteModalVisible(false)}
        title="Delete Media"
      >
        <ThemedText>Are you sure you want to delete this media?</ThemedText>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.actionButtonDeleteNo} onPress={() => setIsDeleteModalVisible(false)}>
            <Text style={styles.actionButtonText}>No</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButtonDelete} 
            onPress={() => deleteMediaMutation()}
            disabled={isLoadingDeleteMedia}
          >
            <Text style={styles.actionButtonText}>Yes</Text>
          </TouchableOpacity>
        </View>
      </ActionModal>

      <CustomModal
        isVisible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false)
          setSelectedMedia(null)
          resetForm()
        }}
        title={'Add Media'}
        height={Dimensions.get('window').height * 0.7}
      >
        <ScrollView style={styles.modalScrollView}>
          <ThemedView style={styles.modalContent}>
            <ThemedText>Title</ThemedText>
            <TextInput  
              style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
              value={mediaTitle}
              onChangeText={setMediaTitle}
              placeholder="Enter media title"
            />
            
            <ThemedText>Type</ThemedText>
            <Dropdown
              style={styles.dropdown}
              data={mediaTypes}
              labelField="label"
              valueField="value"
              value={mediaType}
              onChange={item => {
                setMediaType(item.value)
                // Reset when changing type
                setSelectedImages([])
                setVideoLinks([{ id: '1', url: '' }])
              }}
              placeholder="Select media type"
              placeholderStyle={styles.dropdownPlaceholder}
            />

            {mediaType === 'image' ? (
              <View style={styles.imagePickerContainer}>
                <ThemedText>Images</ThemedText>
                <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
                  <Ionicons name="images-outline" size={24} color={Colors.light.tint} />
                  <ThemedText style={styles.imagePickerText}>Select Images</ThemedText>
                </TouchableOpacity>
                
                {selectedImages.length > 0 && (
                  <View style={styles.selectedImagesContainer}>
                    <ThemedText style={styles.selectedImagesTitle}>Selected Images ({selectedImages.length})</ThemedText>
                    <FlatList
                      data={selectedImages}
                      horizontal
                      renderItem={({item, index}) => (
                        <View style={styles.selectedImageContainer}>
                          <Image source={{uri: item}} style={styles.selectedImage} />
                          <TouchableOpacity 
                            style={styles.removeImageButton}
                            onPress={() => removeImage(index)}
                          >
                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                      contentContainerStyle={styles.selectedImagesList}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.videoLinksContainer}>
                <ThemedText>Video Links</ThemedText>
                {videoLinks.map((link, index) => (
                  <View key={link.id} style={styles.videoLinkRow}>
                    <TextInput
                      style={[styles.videoLinkInput, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
                      value={link.url}
                      onChangeText={(text) => updateVideoLink(link.id, text)}
                      placeholder="Enter YouTube video URL"
                    />
                    <TouchableOpacity 
                      style={styles.removeVideoLinkButton}
                      onPress={() => removeVideoLink(link.id)}
                    >
                      <Ionicons name="close-circle" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
                <TouchableOpacity style={styles.addVideoLinkButton} onPress={addVideoLink}>
                  <Ionicons name="add-circle-outline" size={24} color={Colors.light.tint} />
                  <ThemedText style={styles.addVideoLinkText}>Add Another Video Link</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </ThemedView>
        </ScrollView>
        
        <TouchableOpacity 
          style={[styles.modalButton, 
            (!mediaTitle || 
            (mediaType === 'image' && selectedImages.length === 0) || 
            (mediaType === 'video' && !videoLinks.some(link => link.url.trim() !== ''))) 
            && styles.modalButtonDisabled]} 
          disabled={!mediaTitle || 
            (mediaType === 'image' && selectedImages.length === 0) || 
            (mediaType === 'video' && !videoLinks.some(link => link.url.trim() !== '')) || 
            isLoadingUploadMedia}
          onPress={handleAddOrUpdateMedia}
        >
          <ThemedText style={styles.modalButtonText}>
            {isLoadingUploadMedia ? 'Processing...' : 'Add Media'}
          </ThemedText>
        </TouchableOpacity>
      </CustomModal>
    </View>
    </>
  )
}

export default ManageMedia

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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
    gap: 10
  },
  tabButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    backgroundColor: 'lightgray'
  },
  tabButtonText: {
    textAlign: 'center'
  },
  tabButtonTextActive: {
    color: 'white'
  },
  tabButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  mediaImage: {
    width: '100%',
    height: 100,
    borderRadius: 5
  },
  listContainer: {
    padding: 10,
    gap: 10
  },
  mediaCard: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border,
    flex: 1,
    maxWidth: '48%'
  },
  mediaContent: {
    marginBottom: 5
  },
  mediaIcon: {
    marginRight: 15
  },
  mediaDetails: {
    flex: 1
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  mediaType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
    textTransform: 'capitalize'
  },
  mediaDate: {
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
  modalScrollView: {
    flex: 1
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
  dropdown: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  dropdownPlaceholder: {
    color: '#999'
  },
  imagePickerContainer: {
    marginTop: 10
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  imagePickerText: {
    marginLeft: 10,
    color: Colors.light.tint
  },
  selectedImagesContainer: {
    marginTop: 15
  },
  selectedImagesTitle: {
    marginBottom: 10,
    fontWeight: 'bold'
  },
  selectedImagesList: {
    gap: 10
  },
  selectedImageContainer: {
    position: 'relative',
    marginRight: 10
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'white',
    borderRadius: 12
  },
  videoLinksContainer: {
    marginTop: 10,
    gap: 10
  },
  videoLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  videoLinkInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 5,
    padding: 10
  },
  removeVideoLinkButton: {
    padding: 5
  },
  addVideoLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  addVideoLinkText: {
    marginLeft: 5,
    color: Colors.light.tint
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 5,
    marginTop: 10
  },
  modalButtonDisabled: {
    backgroundColor: '#ccc'
  },
  modalButtonText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center'
  }
})