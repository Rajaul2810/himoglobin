import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Dropdown } from 'react-native-element-dropdown'
import { useMutation } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from '@/components/ThemedText'
import { Colors } from '@/constants/Colors'
import { toast } from 'sonner-native'
import useAuthStore from '@/store/authStore'
import LoadingComponent from '@/components/utilsComponent/Loading'
import { Stack } from 'expo-router'

const Contact = () => {
  const [formData, setFormData] = useState({
    contactType: '',
    subject: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const [errors, setErrors] = useState({
    contactType: '',
    subject: '',
    message: ''
  })
  const { token } = useAuthStore((state: any) => state)

  const contactTypes = [
    { label: 'Contact', value: 'Contact' },
    { label: 'Complain', value: 'Complain' },
    { label: 'Suggestion', value: 'Suggestion' }
  ]

  const validate = () => {
    let isValid = true
    const newErrors = {
      contactType: '',
      subject: '',
      message: ''
    }

    if (!formData.contactType) {
      newErrors.contactType = 'Type is required'
      isValid = false
    }

    if (!formData.subject) {
      newErrors.subject = 'Subject is required'
      isValid = false
    }

    if (!formData.message) {
      newErrors.message = 'Message is required'
      isValid = false
    } else if (formData.message.length > 500) {
      newErrors.message = 'Message should not exceed 500 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const {mutate: submit, isPending} = useMutation({
    mutationFn: (data: any) => apiServices.sendContact(data),
    onSuccess: (data: any) => {
      console.log(data)
      if(data?.data?.isSuccess){
        toast.success(data?.data?.message)
        setFormData({
          contactType: '',
          subject: '',
          message: ''
        })
      } else {
        toast.error(data?.data?.message || 'Failed to send message')
      }
    },
    onError: (error: any) => {
      console.error('Contact submission error:', error)
      toast.error(error?.message || "Something went wrong")
    }
  })

  const handleSubmit = () => {
    if (validate()) {
      if(token){
        submit(formData)
      } else {
        toast.error('Please login to send a message')
      }
    }
  }

  

  return (
    <>
    <Stack.Screen options={{headerTitle: "Contact Us"}} />
    <View style={{flex: 1}}>
      <ThemedView style={styles.formContainer}>
        <ThemedText type='title' style={styles.title}>Contact Us</ThemedText>
        
        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Type *</ThemedText>
          <Dropdown
            data={contactTypes}
            placeholder="Select Type"
            labelField="label"
            valueField="value"
            value={formData.contactType}
            onChange={item => setFormData({...formData, contactType: item.value})}
            style={[styles.dropdown, errors.contactType && styles.errorInput]}
            placeholderStyle={styles.placeholderStyle}
          />
          {errors.contactType && <Text style={styles.errorText}>{errors.contactType}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Subject *</ThemedText>
          <TextInput
            style={[styles.input, errors.subject && styles.errorInput]}
            placeholder="Enter subject"
            value={formData.subject}
            onChangeText={(text) => setFormData({...formData, subject: text})}
            maxLength={100}
          />
          {errors.subject && <Text style={styles.errorText}>{errors.subject}</Text>}
        </View>

        <View style={styles.inputContainer}>
          <ThemedText style={styles.label}>Message *</ThemedText>
          <TextInput
            style={[styles.input, styles.messageInput, errors.message && styles.errorInput]}
            placeholder="Enter your message"
            value={formData.message}
            onChangeText={(text) => setFormData({...formData, message: text})}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <ThemedText style={styles.charCount}>{formData.message.length}/500</ThemedText>
          {errors.message && <Text style={styles.errorText}>{errors.message}</Text>}
        </View>

        <TouchableOpacity 
          disabled={isPending} 
          style={[styles.button, isPending && styles.disabledButton]} 
          onPress={handleSubmit}
        >  
          <Text style={styles.buttonText}>{isPending ? 'Submitting...' : 'Submit'}</Text>
        </TouchableOpacity>

      </ThemedView>
    </View>
    </>
  )
}

export default Contact

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  placeholderStyle: {
    color: '#aaa',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
    color: '#666',
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
