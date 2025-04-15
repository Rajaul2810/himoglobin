import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Dropdown } from "react-native-element-dropdown"
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack } from 'expo-router'
import useAuthStore from '@/store/authStore'
import { useShallow } from 'zustand/react/shallow'
import axios from 'axios'
import apiServices from '@/utils/apiServices'
import { useQuery } from '@tanstack/react-query'


const UserUpdate = () => {
  const { logout, user, token, updateUser } = useAuthStore(
    useShallow((state: any) => ({
      logout: state.logout,
      user: state.user,
      token: state.token,
      updateUser: state.updateUser
    }))
  );
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    fatherName: user?.fatherName || '',
    motherName: user?.motherName || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : new Date(),
    lastDonationTime: user?.lastDonationTime ? new Date(user.lastDonationTime) : new Date(),
    contact: user?.contact || '',
    bloodDonationCount: user?.bloodDonationCount || '',
    address: user?.address || '',
    district: user?.district || '',
    Upazila: user?.Upazila || '',
    Union: user?.Union || '',
    userType: user?.userType || '',
    bloodDonationStatus: user?.bloodDonationStatus || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    physicalComplexity: user?.physicalComplexity || '',
    profilePicture: null as string | null,
    nid: null as string | null,
  })
  
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState('dob')
  const [loading, setLoading] = useState(false)
  const [upazilas, setUpazilas] = useState<{label: string, value: any}[]>([])
  const [unions, setUnions] = useState<{label: string, value: any}[]>([])
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(null)
  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>('')
  const [selectedUnionName, setSelectedUnionName] = useState<string>('')
 
  const router = useRouter()

  const genders = [{label: 'Male', value: 'male'}, {label: 'Female', value: 'female'}, {label: 'Other', value: 'other'}]
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(value => ({label: value, value}))
  const donationStatus = [{label: 'Available', value: 'available'}, {label: 'Not Available', value: 'not_available'},{lavel:'Not Sure', value:'not_sure'}]

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

  const pickImage = async (type: 'profilePicture' | 'nid') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setFormData({...formData, [type]: result.assets[0].uri})
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      // Create FormData for image upload
      const formDataObj = new FormData()
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'profilePicture' && key !== 'nid') {
          if (key === 'dateOfBirth' || key === 'lastDonationTime') {
            formDataObj.append(key, formData[key].toISOString())
          } else {
            formDataObj.append(key, formData[key as keyof typeof formData])
          }
        }
      })
      
      // Add image files if they exist
      if (formData.profilePicture) {
        const filename = formData.profilePicture.split('/').pop()
        const match = /\.(\w+)$/.exec(filename || '')
        const type = match ? `image/${match[1]}` : 'image'
        
        formDataObj.append('profilePicture', {
          uri: formData.profilePicture,
          name: filename,
          type
        } as any)
      }
      
      if (formData.nid) {
        const filename = formData.nid.split('/').pop()
        const match = /\.(\w+)$/.exec(filename || '')
        const type = match ? `image/${match[1]}` : 'image'
        
        formDataObj.append('nid', {
          uri: formData.nid,
          name: filename,
          type
        } as any)
      }
    } catch (error) {
      console.error(error)
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
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Father's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter father's name"
              value={formData.fatherName}
              onChangeText={(text) => setFormData({...formData, fatherName: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mother's Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter mother's name"
              value={formData.motherName}
              onChangeText={(text) => setFormData({...formData, motherName: text})}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => {
                setDatePickerType('dob')
                setShowDatePicker(true)
              }}
            >
              <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Last Donation Time</Text>
            <TouchableOpacity 
              style={styles.input}
              onPress={() => {
                setDatePickerType('lastDonation')
                setShowDatePicker(true)
              }}
            >
              <Text>{formData.lastDonationTime.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter contact number"
              value={formData.contact}
              onChangeText={(text) => setFormData({...formData, contact: text})}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Donation Count</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter donation count"
              value={formData.bloodDonationCount}
              onChangeText={(text) => setFormData({...formData, bloodDonationCount: text})}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter your address"
              value={formData.address}
              onChangeText={(text) => setFormData({...formData, address: text})}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>District</Text>
            <Dropdown
              data={[]}
              placeholder="Select District"
              labelField="label"
              valueField="value"
              value={formData.district}
              onChange={item => setFormData({...formData, district: item.value, Upazila: '', Union: ''})}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upazila</Text>
            <Dropdown
              data={upazilas}
              placeholder="Select Upazila"
              labelField="label"
              valueField="value"
              value={formData.Upazila}
              onChange={item => setFormData({...formData, Upazila: item.value, Union: ''})}
              style={styles.dropdown}
              disable={!formData.district}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Union</Text>
            <Dropdown
              data={unions}
              placeholder="Select Union"
              labelField="label"
              valueField="value"
              value={formData.Union}
              onChange={item => setFormData({...formData, Union: item.value})}
              style={styles.dropdown}
              disable={!formData.Upazila}
            />
          </View>


          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Donation Status</Text>
            <Dropdown
              data={donationStatus}
              placeholder="Select Status"
              labelField="label"
              valueField="value"
              value={formData.bloodDonationStatus}
              onChange={item => setFormData({...formData, bloodDonationStatus: item.value})}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <Dropdown
              data={genders}
              placeholder="Select Gender"
              labelField="label"
              valueField="value"
              value={formData.gender}
              onChange={item => setFormData({...formData, gender: item.value})}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Group</Text>
            <Dropdown
              data={bloodGroups}
              placeholder="Select Blood Group"
              labelField="label"
              valueField="value"
              value={formData.bloodGroup}
              onChange={item => setFormData({...formData, bloodGroup: item.value})}
              style={styles.dropdown}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Profile Picture</Text>
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={() => pickImage('profilePicture')}
            >
              <Text>Choose Image</Text>
            </TouchableOpacity>
            {formData.profilePicture && (
              <Image source={{ uri: formData.profilePicture }} style={styles.previewImage} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>NID (Front and Back)</Text>
            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={() => pickImage('nid')}
            >
              <Text>Choose Image</Text>
            </TouchableOpacity>
            {formData.nid && (
              <Image source={{ uri: formData.nid }} style={styles.previewImage} />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Physical Complexity</Text>
            <TextInput
              style={[styles.input, styles.addressInput]}
              placeholder="Enter any physical complications (e.g., Diabetes, Cancer, Thyroid)"
              value={formData.physicalComplexity}
              onChangeText={(text) => setFormData({...formData, physicalComplexity: text})}
              multiline
              numberOfLines={3}
            />
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
          value={datePickerType === 'dob' ? formData.dateOfBirth : formData.lastDonationTime}
          mode="date"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false)
            if (selectedDate) {
              setFormData({
                ...formData,
                [datePickerType === 'dob' ? 'dateOfBirth' : 'lastDonationTime']: selectedDate
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
  dropdown: {
    height: 50,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
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
  },
  previewImage: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  registerButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
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