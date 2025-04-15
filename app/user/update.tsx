import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Dropdown } from "react-native-element-dropdown"
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Stack } from 'expo-router'
const UserUpdate = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: new Date(),
    lastDonationTime: new Date(),
    contact: '',
    bloodDonationCount: '',
    address: '',
    district: 'Nilphamari',
    upazila: '',
    union: '',
    userType: '',
    bloodDonationStatus: '',
    gender: '',
    bloodGroup: '',
    physicalComplexity: '',
    profilePicture: null as string | null,
    nid: null as string | null,
    
  })

  type ErrorType = {
    fullName?: string;
    contact?: string;
    district?: string;
    upazila?: string;
    union?: string;
    userType?: string;
    gender?: string;
    bloodDonationStatus?: string;
  }

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState('dob')
  const [errors, setErrors] = useState<ErrorType>({})

  const router = useRouter()

  const districts = [{label: 'Nilphamari', value: 'Nilphamari'}]
  const upazilas = [{label: 'Dimla', value: 'Dimla'}]
  const unions = [{label: 'Bala Para', value: 'Bala Para'}]
  const userTypes = [{label: 'Donor', value: 'donor'}]
  const genders = [{label: 'Male', value: 'male'}, {label: 'Female', value: 'female'}, {label: 'Other', value: 'other'}]
  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(value => ({label: value, value}))
  const donationStatus = [{label: 'Available', value: 'available'}, {label: 'Not Available', value: 'not_available'}]

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

  const validate = () => {
    const newErrors: ErrorType = {}
    if (!formData.fullName) newErrors.fullName = 'Full name is required'
    if (!formData.contact) newErrors.contact = 'Contact is required'
    if (!formData.district) newErrors.district = 'District is required'
    if (!formData.upazila) newErrors.upazila = 'Upazila is required'
    if (!formData.union) newErrors.union = 'Union is required'
    if (!formData.userType) newErrors.userType = 'User type is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'
    if (!formData.bloodDonationStatus) newErrors.bloodDonationStatus = 'Blood donation status is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleRegister = () => {
    if (validate()) {
      // Handle registration logic here
      router.push('/(tabs)')
    }
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Update Profile"}} />
    <View style={{flex: 1}}>
      <ScrollView>
        <ThemedView style={styles.formContainer}>
          <ThemedText type='title' style={styles.title}>  Update Profile</ThemedText>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={[styles.input, errors?.fullName && styles.errorInput]}
              placeholder="Enter your full name"
              value={formData.fullName}
              onChangeText={(text) => setFormData({...formData, fullName: text})}
            />
            {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
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
            <Text style={styles.label}>Date of Birth *</Text>
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
            <Text style={styles.label}>Contact *</Text>
            <TextInput
              style={[styles.input, errors.contact && styles.errorInput]}
              placeholder="Enter contact number"
              value={formData.contact}
              onChangeText={(text) => setFormData({...formData, contact: text})}
              keyboardType="phone-pad"
            />
            {errors.contact && <Text style={styles.errorText}>{errors.contact}</Text>}
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
            <Text style={styles.label}>District *</Text>
            <Dropdown
              data={districts}
              placeholder="Select District"
              labelField="label"
              valueField="value"
              value={formData.district}
              onChange={item => setFormData({...formData, district: item.value})}
              style={[styles.dropdown, errors.district && styles.errorInput]}
            />
            {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Upazila *</Text>
            <Dropdown
              data={upazilas}
              placeholder="Select Upazila"
              labelField="label"
              valueField="value"
              value={formData.upazila}
              onChange={item => setFormData({...formData, upazila: item.value})}
              style={[styles.dropdown, errors.upazila && styles.errorInput]}
            />
            {errors.upazila && <Text style={styles.errorText}>{errors.upazila}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Union *</Text>
            <Dropdown
              data={unions}
              placeholder="Select Union"
              labelField="label"
              valueField="value"
              value={formData.union}
              onChange={item => setFormData({...formData, union: item.value})}
              style={[styles.dropdown, errors.union && styles.errorInput]}
            />
            {errors.union && <Text style={styles.errorText}>{errors.union}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>User Type *</Text>
            <Dropdown
              data={userTypes}
              placeholder="Select User Type"
              labelField="label"
              valueField="value"
              value={formData.userType}
              onChange={item => setFormData({...formData, userType: item.value})}
              style={[styles.dropdown, errors.userType && styles.errorInput]}
            />
            {errors.userType && <Text style={styles.errorText}>{errors.userType}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Blood Donation Status *</Text>
            <Dropdown
              data={donationStatus}
              placeholder="Select Status"
              labelField="label"
              valueField="value"
              value={formData.bloodDonationStatus}
              onChange={item => setFormData({...formData, bloodDonationStatus: item.value})}
              style={[styles.dropdown, errors.bloodDonationStatus && styles.errorInput]}
            />
            {errors.bloodDonationStatus && <Text style={styles.errorText}>{errors.bloodDonationStatus}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender *</Text>
            <Dropdown
              data={genders}
              placeholder="Select Gender"
              labelField="label"
              valueField="value"
              value={formData.gender}
              onChange={item => setFormData({...formData, gender: item.value})}
              style={[styles.dropdown, errors.gender && styles.errorInput]}
            />
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
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
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Submit</Text>
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
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