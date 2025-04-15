import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert, useColorScheme } from 'react-native'
import React, { useEffect, useState, useMemo } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { IconSymbol } from '@/components/ui/IconSymbol'
import { Dropdown } from "react-native-element-dropdown"
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useMutation, useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import { Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const RegisterPage = () => {
  const {rules} = useLocalSearchParams()
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [formData, setFormData] = useState({
    FullName: '',
    FatherName: '',
    MotherName: '',
    DateOfBirth: new Date(),
    LastDonationTime: new Date(),
    MobileNumber: '',
    BloodDonationCount: '',
    Address: '',
    District: '1',
    Upazila: '',
    Union: '',
    UserType: '',
    BloodDonationStatus: '',
    Gender: '',
    BloodGroup: '',
    PhysicalComplexity: 'No',
    ProfilePicture: null as string | null,
    Nid: [] as string[],
    LeaderType: '',
    InstituteName:''
  })

  type ErrorType = {
    FullName?: string;
    MobileNumber?: string;
    District?: string;
    Upazila?: string;
    Union?: string;
    UserType?: string;
    Gender?: string;
    BloodDonationStatus?: string;
    BloodGroup?: string;
    LeaderType?: string;
    InstituteName?: string;
    FatherName?: string;
    MotherName?: string;
    DateOfBirth?: string;
    PhysicalComplexity?: string;
  }

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [datePickerType, setDatePickerType] = useState('dob')
  const [errors, setErrors] = useState<ErrorType>({})
  const [upazilas, setUpazilas] = useState<{label: string, value: any}[]>([])
  const [unions, setUnions] = useState<{label: string, value: any}[]>([])
  const [selectedUpazilaId, setSelectedUpazilaId] = useState<number | null>(null)
  const [selectedUpazilaName, setSelectedUpazilaName] = useState<string>('')
  const [selectedUnionName, setSelectedUnionName] = useState<string>('')
  const [isFormValid, setIsFormValid] = useState(false)
  const router = useRouter()

  const districts = useMemo(() => [{label: 'Nilphamari', value: '1'}], [])
  const userTypes = useMemo(() => {
    if(rules === 'leader') return [{label: 'Leader', value: 'Volunteer'}];
    if(rules === 'admin') return [{label: 'Admin', value: 'Admin'}];
    return [{label: 'Donor', value: 'Donor'}];
  }, [rules])
  
  const LeaderTypes = useMemo(() => [{label: 'DC Office', value: 'DcOffic'},{label: 'Civil Surgeon Office', value: 'CivilOffice'}, {label: 'Volunteer (Scout)', value: 'Scouts'}], [])
  const genders = useMemo(() => [{label: 'Male', value: 'Male'}, {label: 'Female', value: 'Female'}, {label: 'Other', value: 'Other'}], [])
  const bloodGroups = useMemo(() => ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(value => ({label: value, value})), [])
  const donationStatus = useMemo(() => [{label: 'Interested', value: 'Interested'}, {label: 'Not Interested', value: 'Not Interested'}, {label: 'Not Sure', value: 'Not Sure'}], [])
  const physicalComplexity = useMemo(() => [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}], [])

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
    if (!formData.UserType) newErrors.UserType = 'User type is required'
    if (!formData.Gender) newErrors.Gender = 'Gender is required'
    if (!formData.BloodDonationStatus) newErrors.BloodDonationStatus = 'Blood donation status is required'
    if (!formData.BloodGroup) newErrors.BloodGroup = 'Blood group is required'
    if (formData.UserType === 'Volunteer' && !formData.LeaderType) newErrors.LeaderType = 'Leader type is required'
    if (formData.UserType === 'Volunteer' || formData.UserType === 'Admin' && !formData.InstituteName) newErrors.InstituteName = 'Institute name is required'
    if (!formData.FatherName) newErrors.FatherName = 'Father name is required'
    if (!formData.MotherName) newErrors.MotherName = 'Mother name is required'
    if (!formData.DateOfBirth) newErrors.DateOfBirth = 'Date of birth is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Check form validity whenever formData changes
  useEffect(() => {
    const isValid = validate()
    setIsFormValid(isValid)
  }, [formData])

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

  const {mutate: register, isPending} = useMutation({
    mutationFn: (data: any) => {
      const formDataToSend = new FormData();
      
      // Append text fields
      Object.keys(data).forEach(key => {
        if (key !== 'ProfilePicture' && key !== 'Nid') {
          formDataToSend.append(key, data[key]);
        }
      });
      
      // Append image files
      if (data.ProfilePicture) {
        const filename = data.ProfilePicture.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image';
        
        formDataToSend.append('ProfilePicture', {
          uri: data.ProfilePicture,
          name: filename,
          type
        } as any);
      }
      
      // Append multiple NID images
      if (data.Nid && data.Nid.length > 0) {
        data.Nid.forEach((nidUri: string, index: number) => {
          const filename = nidUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename || '');
          const type = match ? `image/${match[1]}` : 'image';
          
          formDataToSend.append('Nid', {
            uri: nidUri,
            name: filename,
            type
          } as any);
        });
      }
      
      return apiServices.register(formDataToSend);
    },
    onSuccess: (data) => {
      if(data?.data?.isSuccess){
        Alert.alert('Success', 'Registration successful!');
      }else{
        Alert.alert('Error', data?.data?.message);
      }
    },
    onError: (error) => {
      console.log(error);
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  })

  const handleRegister = () => {
    if (validate()) {
      // Create a copy of the date objects to avoid timezone issues
      const dobDate = new Date(formData.DateOfBirth);
      const lastDonationDate = new Date(formData.LastDonationTime);
      
      const formattedData = {
        ...formData,
        // Format dates with UTC to prevent timezone offset issues
        DateOfBirth: `${dobDate.getFullYear()}-${String(dobDate.getMonth() + 1).padStart(2, '0')}-${String(dobDate.getDate()).padStart(2, '0')}`,
        LastDonationTime: `${lastDonationDate.getFullYear()}-${String(lastDonationDate.getMonth() + 1).padStart(2, '0')}-${String(lastDonationDate.getDate()).padStart(2, '0')}`,
      }
      console.log(formattedData);
      register(formattedData);
    }
  }

  // Define dark mode styles
  const darkImagePickerButton = useMemo(() => ({
    backgroundColor: '#333',
    borderColor: '#555',
  }), []);

  return (
    <>
    <Stack.Screen options={{headerTitle: "Create Account"}} />
      <SafeAreaView style={{flex: 1}}>
      <ScrollView>
        <ThemedView style={styles.formContainer}>
          <ThemedText type='title' style={styles.title}>Create Account</ThemedText>
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>User Type *</ThemedText>
            <Dropdown
              data={userTypes || []}
              placeholder="Select User Type"
              labelField="label"
              valueField="value"
              value={formData.UserType}
              onChange={item => setFormData({...formData, UserType: item.value})}
              style={[styles.dropdown, errors.UserType && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.UserType && <Text style={styles.errorText}>{errors.UserType}</Text>}
          </View>
          {formData.UserType === 'Volunteer' && (
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Leader Type *</ThemedText>
            <Dropdown
              data={LeaderTypes}
              placeholder="Select Leader Type"
              labelField="label"
              valueField="value"
              value={formData.LeaderType}
              onChange={item => setFormData({...formData, LeaderType: item.value})}
              style={[styles.dropdown, errors.LeaderType && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.LeaderType && <Text style={styles.errorText}>{errors.LeaderType}</Text>}
          </View>
          )}

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Full Name *</ThemedText>
            <TextInput
              style={[
                styles.input, 
                errors?.FullName && styles.errorInput,
                isDark && styles.darkInput
              ]}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.FullName}
              onChangeText={(text) => setFormData({...formData, FullName: text})}
            />
            {errors.FullName && <Text style={styles.errorText}>{errors.FullName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Date of Birth *</ThemedText>
            <TouchableOpacity 
              style={[styles.input, isDark && styles.darkInput]}
              onPress={() => {
                setDatePickerType('dob')
                setShowDatePicker(true)
              }}
            >
              <ThemedText>{formData.DateOfBirth.toLocaleDateString()}</ThemedText>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Mobile Number *</ThemedText>
            <TextInput
              style={[
                styles.input, 
                errors.MobileNumber && styles.errorInput,
                isDark && styles.darkInput
              ]}
              placeholder="Enter contact number (01xxxxxxxxx)"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.MobileNumber}
              onChangeText={(text) => setFormData({...formData, MobileNumber: text})}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {errors.MobileNumber && <Text style={styles.errorText}>{errors.MobileNumber}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Father's Name *</ThemedText>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              placeholder="Enter father's name"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.FatherName}
              onChangeText={(text) => setFormData({...formData, FatherName: text})}
            />
            {errors.FatherName && <Text style={styles.errorText}>{errors.FatherName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Mother's Name *</ThemedText>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              placeholder="Enter mother's name"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.MotherName}
              onChangeText={(text) => setFormData({...formData, MotherName: text})}
            />
            {errors.MotherName && <Text style={styles.errorText}>{errors.MotherName}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>District *</ThemedText>
            <Dropdown
              data={districts}
              placeholder="Select District"
              labelField="label"
              valueField="value"
              value={formData.District}
              onChange={item => setFormData({...formData, District: item.value})}
              style={[styles.dropdown, errors.District && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.District && <Text style={styles.errorText}>{errors.District}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Upazila *</ThemedText>
            <Dropdown
              data={upazilas}
              placeholder={selectedUpazilaName ? selectedUpazilaName : "Select Upazila"}
              labelField="label"
              valueField="value"
              search
              searchPlaceholder="Search Upazila"
              value={formData.Upazila}
              onChange={item => {
                setFormData({...formData, Upazila: item.value});
                setSelectedUpazilaId(item.value);
                setSelectedUpazilaName(item.label);
              }}
              style={[styles.dropdown, errors.Upazila && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
              inputSearchStyle={isDark ? styles.darkSearchInput : {}}
            />
            {errors.Upazila && <Text style={styles.errorText}>{errors.Upazila}</Text>}
            
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Union *</ThemedText>
            <Dropdown
              data={unions}
              placeholder={selectedUnionName ? selectedUnionName : "Select Union"}
              labelField="label"
              valueField="value"
              search
              searchPlaceholder="Search Union"
              value={formData.Union}
              onChange={item => {
                setFormData({...formData, Union: item.value});
                setSelectedUnionName(item.label);
              }}
              style={[styles.dropdown, errors.Union && styles.errorInput, isDark && styles.darkDropdown]}
              disable={!selectedUpazilaId}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
              inputSearchStyle={isDark ? styles.darkSearchInput : {}}
            />
            {errors.Union && <Text style={styles.errorText}>{errors.Union}</Text>}
           
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Gender *</ThemedText>
            <Dropdown
              data={genders}
              placeholder="Select Gender"
              labelField="label"
              valueField="value"
              value={formData.Gender}
              onChange={item => setFormData({...formData, Gender: item.value})}
              style={[styles.dropdown, errors.Gender && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.Gender && <Text style={styles.errorText}>{errors.Gender}</Text>}
          </View>

          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Address</ThemedText>
            <TextInput
              style={[styles.input, styles.addressInput, isDark && styles.darkInput]}
              placeholder="Enter your address"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.Address}
              onChangeText={(text) => setFormData({...formData, Address: text})}
              multiline
              numberOfLines={1}
            />
          </View>

          {formData.UserType === 'Volunteer' || formData.UserType === 'Admin' && (
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Institute Name *</ThemedText>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}  
              placeholder="Enter your institute name"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.InstituteName}
              onChangeText={(text) => setFormData({...formData, InstituteName: text})}
            />
            {errors.InstituteName && <Text style={styles.errorText}>{errors.InstituteName}</Text>}
          </View>

          )}

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Blood Group *</ThemedText>
            <Dropdown
              data={bloodGroups}
              placeholder="Select Blood Group"
              labelField="label"
              valueField="value"
              value={formData.BloodGroup}
              onChange={item => setFormData({...formData, BloodGroup: item.value})}
              style={[styles.dropdown, errors.BloodGroup && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.BloodGroup && <Text style={styles.errorText}>{errors.BloodGroup}</Text>}
          </View>
          
          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Blood Donation Status *</ThemedText>
            <Dropdown
              data={donationStatus}
              placeholder="Select Status"
              labelField="label"
              valueField="value"
              value={formData.BloodDonationStatus}
              onChange={item => setFormData({...formData, BloodDonationStatus: item.value})}
              style={[styles.dropdown, errors.BloodDonationStatus && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.BloodDonationStatus && <Text style={styles.errorText}>{errors.BloodDonationStatus}</Text>}
          </View>


          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Last Donation Date</ThemedText>
            <TouchableOpacity 
              style={[styles.input, isDark && styles.darkInput]}
              onPress={() => {
                setDatePickerType('lastDonation')
                setShowDatePicker(true)
              }}
            >
              <ThemedText>{formData.LastDonationTime.toLocaleDateString()}</ThemedText>
            </TouchableOpacity>
          </View>


          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Blood Donation Count</ThemedText>
            <TextInput
              style={[styles.input, isDark && styles.darkInput]}
              placeholder="Enter donation count"
              placeholderTextColor={isDark ? '#999' : '#777'}
              value={formData.BloodDonationCount}
              onChangeText={(text) => setFormData({...formData, BloodDonationCount: text})}
              keyboardType="numeric"
            />
          </View>



          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Profile Picture</ThemedText>
            <TouchableOpacity 
              style={[styles.imagePickerButton, isDark && darkImagePickerButton]} 
              onPress={() => pickImage('ProfilePicture')}
            >
              <ThemedText style={styles.imagePickerText}>Choose Image</ThemedText>
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
            <ThemedText style={styles.label}>NID Images</ThemedText>
            <TouchableOpacity 
              style={[styles.imagePickerButton, isDark && darkImagePickerButton]} 
              onPress={() => pickImage('Nid')}
            >
              <ThemedText style={styles.imagePickerText}>Choose NID Images</ThemedText>
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
            <ThemedText style={styles.helperText}>{formData.Nid.length} images selected</ThemedText>
          </View>

          <View style={styles.inputContainer}>
            <ThemedText style={styles.label}>Physical Complexity (Diabetes, Cancer, etc.)</ThemedText>
            <Dropdown
              data={physicalComplexity}
              placeholder="Select Physical Complexity"
              labelField="label"
              valueField="value"
              value={formData.PhysicalComplexity}
              onChange={item => setFormData({...formData, PhysicalComplexity: item.value})}
              style={[styles.dropdown, errors.PhysicalComplexity && styles.errorInput, isDark && styles.darkDropdown]}
              placeholderStyle={isDark ? styles.darkPlaceholderText : {}}
              selectedTextStyle={isDark ? styles.darkText : {}}
              activeColor={isDark ? '#333' : undefined}
            />
            {errors.PhysicalComplexity && <Text style={styles.errorText}>{errors.PhysicalComplexity}</Text>}
          </View>

          <TouchableOpacity 
            style={[
              styles.registerButton, 
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleRegister}
            disabled={isPending || !isFormValid}
          >
            <Text style={styles.registerButtonText}>{isPending ? 'Registering...' : 'Register'}</Text>
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
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}
    </SafeAreaView>
    </>
  )
}

export default RegisterPage

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
    fontWeight: '500',
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
  errorInput: {
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
  darkText: {
    color: '#fff',
  },
  darkSearchInput: {
    color: '#fff',
  },
  addressInput: {
    height: 50,
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