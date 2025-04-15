import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import useAuthStore from '@/store/authStore';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Stack } from 'expo-router';

interface UserData {
  fullName?: string;
  code?: string;
  gender?: string;
  dateOfBirth?: string;
  dob?: string;
  mobileNumber?: string;
  userType?: string;
  isActive?: boolean;
  bloodGroup?: string;
  bloodDonationCount?: number;
  lastDonationTime?: string;
  physicalComplexity?: boolean;
  bloodDonationStatus?: string;
}

const DownloadReport = () => {
  const { user } = useAuthStore((state: any) => state);
  const [userData, setUserData] = useState<UserData>({});

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const shareReport = async () => {
    try {
      const dateOfBirth = userData?.dob 
        ? new Date(userData.dob).toLocaleDateString()
        : userData?.dateOfBirth || 'Not available';
      
      const lastDonation = userData?.lastDonationTime 
        ? new Date(userData.lastDonationTime).toLocaleDateString()
        : 'Never donated';
      
      await Share.share({
        message: `User Report for ${userData?.fullName || 'User'}\n\n` +
          `Personal Information:\n` +
          `Name: ${userData?.fullName || 'Not available'}\n` +
          `Gender: ${userData?.gender || 'Not available'}\n` +
          `Date of Birth: ${dateOfBirth}\n` +
          `Mobile: ${userData?.mobileNumber || 'Not available'}\n` +
          `User Type: ${userData?.userType || 'Not available'}\n\n` +
          `Blood Information:\n` +
          `Blood Group: ${userData?.bloodGroup || 'Not available'}\n` +
          `Donation Count: ${userData?.bloodDonationCount || 0}\n` +
          `Last Donation: ${lastDonation}\n` +
          `Physical Complexity: ${userData?.physicalComplexity ? 'Yes' : 'No'}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!userData) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedText>Loading user data...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "User Report"}} />
    <View style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>User Report</ThemedText>
          <TouchableOpacity style={styles.shareButton} onPress={shareReport}>
            <MaterialIcons name="share" size={24} color={Colors.light.tint} />
          </TouchableOpacity>
        </ThemedView>

        {/* Personal Information Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="person" size={24} color={Colors.light.tint} />
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.infoContainer}>
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Full Name</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.fullName || 'Not available'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>User ID</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.code || 'Not available'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Gender</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.gender || 'Not available'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Date of Birth</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData?.dateOfBirth || 'Not available'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mobile</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.mobileNumber || 'Not available'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>User Type</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.userType || 'Not available'}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Account Status</ThemedText>
              <ThemedView style={[styles.statusBadge, userData.isActive ? styles.activeStatus : styles.inactiveStatus]}>
                <Text style={styles.statusText}>{userData.isActive ? 'Active' : 'Inactive'}</Text>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* Blood Information Section */}
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <MaterialIcons name="bloodtype" size={24} color={Colors.light.tint} />
            <ThemedText style={styles.sectionTitle}>Blood Information</ThemedText>
          </ThemedView>
          
          <ThemedView style={styles.infoContainer}>
            <ThemedView style={styles.bloodGroupContainer}>
              <ThemedText style={styles.bloodGroupText}>
                {userData.bloodGroup ? userData.bloodGroup : '?'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Donation Count</ThemedText>
              <ThemedText style={styles.infoValue}>{userData.bloodDonationCount || 0}</ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Last Donation</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.lastDonationTime 
                  ? new Date(userData.lastDonationTime).toLocaleDateString()
                  : 'Never donated'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Physical Complexity</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.physicalComplexity ? 'Yes' : 'No'}
              </ThemedText>
            </ThemedView>
            
            <ThemedView style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Donation Status</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData.bloodDonationStatus || 'Not available'}
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>
        
        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Report generated on {new Date().toLocaleDateString()}
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </View>
    </>
  );
};

export default DownloadReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 8,
  },
  section: {
    borderRadius: 10,
    margin: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  infoContainer: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 16,
    color: '#666',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  activeStatus: {
    backgroundColor: '#e6f7e6',
  },
  inactiveStatus: {
    backgroundColor: '#ffe6e6',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bloodGroupContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    width: 70,
    height: 70,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: Colors.light.tint,
   
  },
  bloodGroupText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.light.tint,
    textAlign: 'center',
    
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});