import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Share, Alert, useColorScheme } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import apiServices, { BACKEND_URL } from '@/utils/apiServices';
import LoadingComponent from '@/components/utilsComponent/Loading';
import ErrorComponent from '@/components/utilsComponent/Error';

import { Colors } from '@/constants/Colors';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


const UserDetails = () => {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["userById", id],
        queryFn: () => apiServices.getUserById(id),
    });

    if (isLoading) return <LoadingComponent />;
    if (error) return <ErrorComponent error={error} refetch={refetch} />;

    const userData = data?.data;
    console.log('userData',userData)

    
  return (
    <>
      <Stack.Screen options={{ headerTitle: "User Details" }} />
      <ScrollView style={styles.container}>
        <ThemedView style={styles.card}>
          <View style={styles.header}>
            <View style={styles.profileImageContainer}>
              {userData?.imageUrl ? (
                <Image source={{ uri: `${BACKEND_URL}/${userData.imageUrl}` }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profileImage, styles.noImage]}>
                  <Text style={styles.profileInitial}>{userData?.fullName?.[0] || 'U'}</Text>
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <ThemedText style={styles.name}>{userData?.fullName}</ThemedText>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{userData?.userType}</Text>
              </View>
              {userData?.isApproved ? (
                <View style={[styles.statusBadge, styles.approvedBadge]}>
                  <Text style={styles.statusText}>Approved</Text>
                </View>
              ) : (
                <View style={[styles.statusBadge, styles.pendingBadge]}>
                  <Text style={styles.statusText}>Pending</Text>
                </View>
              )}
            </View>
          </View>
         

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Full Name:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.fullName || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Father's Name:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.fatherName || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mother's Name:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.motherName || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Date of Birth:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData?.dob ? new Date(userData.dob).toLocaleDateString() : 'Not available'}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Gender:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.gender || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Mobile:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.mobileNumber || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>User Code:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.code || 'Not available'}</ThemedText>
            </View>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Blood Information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Blood Group:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.bloodGroup || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Donation Status:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.bloodDonationStatus || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Donation Count:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.bloodDonationCount || '0'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Last Donation:</ThemedText>
              <ThemedText style={styles.infoValue}>
                {userData?.lastDonationTime ? new Date(userData.lastDonationTime).toLocaleDateString() : 'Never donated'}
              </ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Physical Complexity:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.physicalComplexity ? 'Yes' : 'No'}</ThemedText>
            </View>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Address Information</ThemedText>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Address:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.address || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>District:</ThemedText>
              <ThemedText style={styles.infoValue}>Nilphamari</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Upazila:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.upazilaName || 'Not available'}</ThemedText>
            </View>
            <View style={styles.infoRow}>
              <ThemedText style={styles.infoLabel}>Union:</ThemedText>
              <ThemedText style={styles.infoValue}>{userData?.unionName || 'Not available'}</ThemedText>
            </View>
          </ThemedView>

          {userData?.userType === 'Volunteer' && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionTitle}>Volunteer Information</ThemedText>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Leader Type:</ThemedText>
                <ThemedText style={styles.infoValue}>{userData?.leaderType || 'Not available'}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText style={styles.infoLabel}>Institute Name:</ThemedText>
                <ThemedText style={styles.infoValue}>{userData?.instituteName || 'Not available'}</ThemedText>
              </View>
            </ThemedView>
          )}
        </ThemedView>
      </ScrollView>
    </>
  )
}

export default UserDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  noImage: {
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 36,
    color: 'white',
    fontWeight: 'bold',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  approvedBadge: {
    backgroundColor: '#E6FFE6',
  },
  pendingBadge: {
    backgroundColor: '#FFEAEB',
  },
  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },
  shareButton: {
    backgroundColor: Colors.light.tint,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontWeight: '600',
    width: '40%',
  },
  infoValue: {
    flex: 1,
  },
})