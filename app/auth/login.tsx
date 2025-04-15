import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useMutation } from '@tanstack/react-query';
import apiServices from '@/utils/apiServices';
import { toast } from 'sonner-native';
import { MaterialIcons } from '@expo/vector-icons';
import useAuthStore from '@/store/authStore';
import { Stack } from 'expo-router';
interface LoginFormData {
  MobileNumber: string;
  DateOfBirth: string;
  password?: string;
}


const LoginPage: React.FC = () => {
  // Form state
  const [formData, setFormData] = useState<LoginFormData>({
    MobileNumber: '',
    DateOfBirth: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    password: ''
  });
  
  // UI state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userType, setUserType] = useState<'User' | 'Admin'>('User');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { setToken, setUser } = useAuthStore((state: any) => state);

  // Date picker handler
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Format date as YYYY-MM-DD
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        DateOfBirth: formattedDate
      }));
    }
  };

  // API mutations
  const tokenMutation = useMutation({
    mutationFn: (data: LoginFormData) => apiServices.getToken(data),
    onSuccess: (response: any) => {
      const { data } = response;
      if (data.isSuccess) {
        toast.success(data.message);
        setToken(data?.content?.token);
        //setUser(data.user);
        router.push('/(tabs)');
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error('Login failed. Please try again.')
  });

  const userTypeMutation = useMutation({
    mutationFn: (data: LoginFormData) => apiServices.getUserType(data),
    onSuccess: (response: any) => {
      const { data } = response;
      if (data.isSuccess) {
        toast.success(data.message);
        setUserType(data.userType as 'User' | 'Admin');
        
        if (data.userType !== 'Admin') {
          tokenMutation.mutate({ MobileNumber: formData.MobileNumber, DateOfBirth: formData.DateOfBirth });
        }
      } else {
        toast.error(data.message);
      }
    },
    onError: () => toast.error('Login failed. Please try again.')
  });

  // Form validation
  const validateForm = (): boolean => {
    if (!formData.MobileNumber.match(/^01\d{9}$/)) {
      toast.error('Phone number must be 11 digits and Valid');
      return false;
    }
    
    if (userType === 'Admin' && !formData.password) {
      toast.error('Password is required for admin login');
      return false;
    }

    return true;
  };

  // Submit handlers
  const handleUserLogin = () => {
    if (!validateForm()) return;
    userTypeMutation.mutate(formData);
  };

  const handleAdminLogin = () => {
    if (!validateForm()) return;
    tokenMutation.mutate(formData);
  };

  // Check if any mutation is loading
  const isLoading = userTypeMutation.isPending || tokenMutation.isPending;

  return (
    <>
    <Stack.Screen options={{headerTitle: "Login"}} />
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={formData.MobileNumber}
            onChangeText={(value) => setFormData(prev => ({...prev, MobileNumber: value}))}
            keyboardType="phone-pad"
            maxLength={11}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Birthday</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
            disabled={isLoading}
          >
            <Text>{new Date(formData.DateOfBirth).toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={new Date(formData.DateOfBirth)}
            mode="date"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {userType === 'Admin' && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                value={formData.password}
                onChangeText={(value) => setFormData(prev => ({...prev, password: value}))}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity 
                style={styles.passwordIcon}
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <MaterialIcons 
                  name={showPassword ? "visibility" : "visibility-off"} 
                  size={24} 
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={userType === 'Admin' ? handleAdminLogin : handleUserLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')} disabled={isLoading}>
            <Text style={styles.signupText}>Sign up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
    </>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
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
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
  },
  loginButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  passwordIcon: {
    padding: 10,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 20
  },
  signupText: {
    color: Colors.light.tint
  }
})