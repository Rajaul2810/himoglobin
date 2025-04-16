import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, useColorScheme } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { Dropdown } from "react-native-element-dropdown"
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack } from 'expo-router'
import useAuthStore from '@/store/authStore'
import { useShallow } from 'zustand/react/shallow'
import apiServices from '@/utils/apiServices'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'


const UserUpdate = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const { user } = useAuthStore(
    useShallow((state: any) => ({
      user: state.user,
    }))
  );
 
  const [formData, setFormData] = useState({
    FullName: user?.fullName || '',
    FatherName: user?.fatherName || '',
    MotherName: user?.motherName || '',
    DateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
    LastDonationTime: user?.lastDonationTime ? new Date(user.lastDonationTime) : new Date(),
    MobileNumber: user?.mobileNumber || '',
    BloodDonationCount: user?.bloodDonationCount || '',
    Address: user?.address || '',
    District: user?.district || '1',
    Upazila: user?.Upazila || '',
    Union: user?.Union || '',
    BloodDonationStatus: user?.bloodDonationStatus || '',
    Gender: user?.gender || '',
    BloodGroup: user?.bloodGroup || '',
    PhysicalComplexity: user?.physicalComplexity || 'No',
    ProfilePicture: null as string | null,
    Nid: [] as string[],
  })
  
  type ErrorType = {
    FullName?: string;
    MobileNumber?: string;
    District?: string;
    Upazila?: string;
    Union?: string;
    Gender?: string;
    BloodDonationStatus?: string;
    BloodGroup?: string;
    FatherName?: string;
    MotherName?: string;
    DateOfBirth?: string;
    PhysicalComplexity?: string;
  }
  
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState('dob')
  const [errors, setErrors] = useState<ErrorType>({})
  const [loading, setLoading] = useState(false)
  const [upazilas, setUpazilas] = useState<{label: string, value: any}[]>([])
  const [unions, setUnions] = useState<{label: string, value: any}[]>([])
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(null)
  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>('')
  const [selectedUnionName, setSelectedUnionName] = useState<string>('')
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()

  const districts = useMemo(() => [{label: 'Nilphamari', value: '1'}], [])
  const genders = useMemo(() => [{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}], [])
  const bloodGroups = useMemo(() => ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(value => ({label: value, value})), [])
  const donationStatus = useMemo(() => [{label: 'Interested', value: 'Interested'}, {label: 'Not Interested', value: 'Not Interested'}, {label: 'Not Sure', value: 'Not Sure'}], [])
  const physicalComplexity = useMemo(() => [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}], [])

  const {data: locationData} = useQuery({
    queryKey: ['location'],
    queryFn: () => apiServices.getLocationByParentId(1),
  })

  useEffect(() => {
    if(locationData?.data?.length > 0){
      const upazilasData = locationData.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      setUpazilas(upazilasData);
    }
  }, [locationData])

  const {data: unionData} = useQuery({
    queryKey: ['union', selectedUpazilaId],
    queryFn: () => {
      if (selectedUpazilaId) {
        return apiServices.getLocationByParentId(selectedUpazilaId)
      }
      return null
    },
    enabled: !!selectedUpazilaId
  })

  useEffect(() => {
    if(unionData?.data?.length > 0){
      const unionsData = unionData.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      setUnions(unionsData);
    } else {
      setUnions([]);
    }
  }, [unionData])

  useEffect(() => {
    if(formData.Upazila) {
      setFormData(prev => ({...prev, Union: ''}));
      setSelectedUnionName('');
    }
  }, [formData.Upazila])

  const validate = () => {
    const newErrors: ErrorType = {}
    if (!formData.FullName) newErrors.FullName = 'Full name is required'
    
    // Mobile number validation
    if (!formData.MobileNumber) {
      newErrors.MobileNumber = 'Contact is required'
    } else if (!/^01\d{9}$/.test(formData.MobileNumber)) {
      newErrors.MobileNumber = 'Mobile number must be 11 digits and Valid'
    }
    
    if (!formData.District) newErrors.District = 'District is required'
    if (!formData.Upazila) newErrors.Upazila = 'Upazila is required'
    if (!formData.Union) newErrors.Union = 'Union is required'
    if (!formData.Gender) newErrors.Gender = 'Gender is required'
    if (!formData.BloodDonationStatus) newErrors.BloodDonationStatus = 'Blood donation status is required'
    if (!formData.BloodGroup) newErrors.BloodGroup = 'Blood group is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const pickImage = async (type: 'ProfilePicture' | 'Nid') => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1,
      })

      if (!result.canceled) {
        if (type === 'ProfilePicture') {
          setFormData({...formData, ProfilePicture: result.assets[0].uri})
        } else if (type === 'Nid') {
          // For NID, allow multiple images
          setFormData({...formData, Nid: [...formData.Nid, result.assets[0].uri]})
        }
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Error', 'Failed to pick image. Please try again.')
    }
  }

  const removeImage = (type: 'ProfilePicture' | 'Nid', index?: number) => {
    if (type === 'ProfilePicture') {
      setFormData({...formData, ProfilePicture: null})
    } else if (type === 'Nid' && typeof index === 'number') {
      const updatedNid = [...formData.Nid]
      updatedNid.splice(index, 1)
      setFormData({...formData, Nid: updatedNid})
    }
  }

  const {mutate: updateUserProfile, isPending: isUpdating} = useMutation({
    mutationFn: (data: any) => apiServices.updateUser(data),
    onSuccess: (data: any) => {
      if(data?.data?.isSuccess){
        Alert.alert('Success', 'Profile updated successfully')
        router.back()
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile')
      }
    },
    onError: (error: any) => {
      Alert.alert('Error', error.message || 'Failed to update profile')
    }
  })

  const handleUpdate = async () => {
    if (!validate()) return;
    
    setLoading(true)
    try {
      // Create FormData for image upload
      const formDataObj = new FormData()
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'ProfilePicture' && key !== 'Nid') {
          if (key === 'DateOfBirth' || key === 'LastDonationTime') {
            formDataObj.append(key, formData[key as keyof typeof formData].toISOString())
          } else {
            formDataObj.append(key, formData[key as keyof typeof formData])
          }
        }
      })
      
      // Add image files if they exist
      if (formData.ProfilePicture) {
        const filename = formData.ProfilePicture.split('/').pop()
        const match = /\.(\w+)$/.exec(filename || '')
        const type = match ? `image/${match[1]}` : 'image'
        
        formDataObj.append('ProfilePicture', {
          uri: formData.ProfilePicture,
          name: filename,
          type
        } as any)
      }
      
      if (formData.Nid.length > 0) {
        formData.Nid.forEach((uri, index) => {
          const filename = uri.split('/').pop()
          const match = /\.(\w+)$/.exec(filename || '')
          const type = match ? `image/${match[1]}` : 'image'
          
          formDataObj.append('Nid', {
            uri,
            name: filename,
            type
          } as any)
        })
      }
      formDataObj.append('Id', user?.id)
      updateUserProfile(formDataObj)
      
    } catch (error) {
      console.error(error)
      Alert.alert('Error', 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Update Profile"}} />
    <View style={{flex: 1}}>
      <ScrollView>
        <ThemedView style={styles.formContainer}>
          <ThemedText type='title' style={styles.title}>Update Profile</ThemedText>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Full Name</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput, errors.FullName && styles.inputError]}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.FullName}
              onChangeText={(text) => setFormData({...formData, FullName: text})}
            />
            {errors.FullName && <Text style={styles.errorText}>{errors.FullName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Father's Name</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput, errors.FatherName && styles.inputError]}
              placeholder="Enter father's name"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.FatherName}
              onChangeText={(text) => setFormData({...formData, FatherName: text})}
            />
            {errors.FatherName && <Text style={styles.errorText}>{errors.FatherName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Mother's Name</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput, errors.MotherName && styles.inputError]}
              placeholder="Enter mother's name"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.MotherName}
              onChangeText={(text) => setFormData({...formData, MotherName: text})}
            />
            {errors.MotherName && <Text style={styles.errorText}>{errors.MotherName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Date of Birth</Text>
            <TouchableOpacity 
              style={[styles.input, isDark && styles.darkInput, errors.DateOfBirth && styles.inputError]}
              onPress={() => {
                setDatePickerType('dob')
                setShowDatePicker(true)
              }}
            >
              <Text style={isDark ? styles.darkText : {}}>{formData.DateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {errors.DateOfBirth && <Text style={styles.errorText}>{errors.DateOfBirth}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Last Donation Time</Text>
            <TouchableOpacity 
              style={[styles.input, isDark && styles.darkInput]}
              onPress={() => {
                setDatePickerType('lastDonation')
                setShowDatePicker(true)
              }}
            >
              <Text style={isDark ? styles.darkText : {}}>{formData.LastDonationTime.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Mobile Number</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput, errors.MobileNumber && styles.inputError]}
              placeholder="Enter contact number"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.MobileNumber}
              onChangeText={(text) => setFormData({...formData, MobileNumber: text})}
              keyboardType="phone-pad"
            />
            {errors.MobileNumber && <Text style={styles.errorText}>{errors.MobileNumber}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Blood Donation Count</Text>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              placeholder="Enter donation count"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.BloodDonationCount}
              onChangeText={(text) => setFormData({...formData, BloodDonationCount: text})}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput, isDark && styles.darkInput]}
              placeholder="Enter your address"
              placeholderTextColor={isDark ? '#999' : '#999'}
              value={formData.Address}
              onChangeText={(text) => setFormData({...formData, Address: text})}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>District</Text>
            <Dropdown
              data={districts}
              placeholder="Select District"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.District}
              onChange={item => {
                setFormData({...formData, District: item.value, Upazila: '', Union: ''})
                setSelectedUpazilaId(null)
                setSelectedUpazilaName('')
                setSelectedUnionName('')
              }}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.District && styles.inputError]}
            />
            {errors.District && <Text style={styles.errorText}>{errors.District}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Upazila</Text>
            <Dropdown
              data={upazilas}
              placeholder="Select Upazila"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.Upazila}
              onChange={item => {
                setFormData({...formData, Upazila: item.value, Union: ''})
                setSelectedUpazilaId(item.value)
                setSelectedUpazilaName(item.label)
                setSelectedUnionName('')
              }}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.Upazila && styles.inputError]}
              disable={!formData.District}
            />
            {errors.Upazila && <Text style={styles.errorText}>{errors.Upazila}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Union</Text>
            <Dropdown
              data={unions}
              placeholder="Select Union"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.Union}
              onChange={item => {
                setFormData({...formData, Union: item.value})
                setSelectedUnionName(item.label)
              }}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.Union && styles.inputError]}
              disable={!formData.Upazila}
            />
            {errors.Union && <Text style={styles.errorText}>{errors.Union}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Blood Donation Status</Text>
            <Dropdown
              data={donationStatus}
              placeholder="Select Status"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.BloodDonationStatus}
              onChange={item => setFormData({...formData, BloodDonationStatus: item.value})}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.BloodDonationStatus && styles.inputError]}
            />
            {errors.BloodDonationStatus && <Text style={styles.errorText}>{errors.BloodDonationStatus}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Gender</Text>
            <Dropdown
              data={genders}
              placeholder="Select Gender"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.Gender}
              onChange={item => setFormData({...formData, Gender: item.value})}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.Gender && styles.inputError]}
            />
            {errors.Gender && <Text style={styles.errorText}>{errors.Gender}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Blood Group</Text>
            <Dropdown
              data={bloodGroups}
              placeholder="Select Blood Group"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.BloodGroup}
              onChange={item => setFormData({...formData, BloodGroup: item.value})}
              style={[styles.dropdown, isDark && styles.darkDropdown, errors.BloodGroup && styles.inputError]}
            />
            {errors.BloodGroup && <Text style={styles.errorText}>{errors.BloodGroup}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Physical Complexity</Text>
            <Dropdown
              data={physicalComplexity}
              placeholder="Select Physical Complexity"
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              labelField="label"
              valueField="value"
              value={formData.PhysicalComplexity}
              onChange={item => setFormData({...formData, PhysicalComplexity: item.value})}
              style={[styles.dropdown, isDark && styles.darkDropdown]}
            />
            <Text style={styles.helperText}>Do you have any physical complications?</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>Profile Picture</Text>
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={() => pickImage('ProfilePicture')}
            >
              <Text style={styles.imagePickerText}>Choose Image</Text>
            </TouchableOpacity>
            {formData.ProfilePicture && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: formData.ProfilePicture }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.deleteImageButton} 
                  onPress={() => removeImage('ProfilePicture')}
                >
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.darkText]}>NID</Text>
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={() => pickImage('Nid')}
            >
              <Text style={styles.imagePickerText}>Choose Image</Text>
            </TouchableOpacity>
            {formData.Nid.length > 0 && (
              <View style={styles.nidImagesContainer}>
                {formData.Nid.map((uri, index) => (
                  <View key={index} style={styles.nidImageWrapper}>
                    <Image source={{ uri }} style={styles.nidPreviewImage} />
                    <TouchableOpacity 
                      style={styles.deleteNidButton} 
                      onPress={() => removeImage('Nid', index)}
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleUpdate}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={datePickerType === 'dob' ? formData.DateOfBirth : formData.LastDonationTime}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false)
            if (selectedDate) {
              setFormData({
                ...formData,
                [datePickerType === 'dob' ? 'DateOfBirth' : 'LastDonationTime']: selectedDate
              })
            }
          }}
        />
      )}
    </View>
    </>
  )
}

export default UserUpdate

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: 'white',
  },
  darkInput: {
    backgroundColor: '#333',
    borderColor: '#555',
    color: '#fff',
  },
  darkText: {
    color: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  selectedText: {
    color: Colors.light.tint,
    fontSize: 14,
    marginTop: 5,
  },
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
  },
  darkDropdown: {
    backgroundColor: '#333',
    borderColor: '#555',
  },
  darkPlaceholderText: {
    color: '#999',
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePickerButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePickerText: {
    color: Colors.light.tint,
    fontWeight: '500',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  nidImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  nidImageWrapper: {
    position: 'relative',
    width: '48%',
    marginBottom: 10,
  },
  nidPreviewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  deleteNidButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  registerButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  registerButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 20,
    marginBottom: 40,
  }
})