import { StyleSheet, Text, View, useColorScheme, Image, TouchableOpacity, Linking, Alert } from 'react-native'
import React from 'react'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { FlatList } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Stack } from 'expo-router'
import apiServices, { BACKEND_URL } from '@/utils/apiServices'
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import useAuthStore from '@/store/authStore'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const VolunteersPage = () => {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'
  const router = useRouter()
  const { token } = useAuthStore((state: any) => state)
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['allScoutLeaders'],
    queryFn: () => apiServices.getScoutLeaders(1, 50),
    refetchOnReconnect: true,
  })
  
  if (isLoading) return <LoadingComponent />
  if (error) return <ErrorComponent error={error} refetch={refetch} />

  const handleCall = (phoneNumber: string) => {
    if (token) {
      Linking.openURL(`tel:${phoneNumber}`)
    } else {
      Alert.alert(
        "Please login to call the volunteer",
        "You need to be logged in to contact volunteers",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => {
              router.push("/auth/login")
            },
          },
        ]
      )
    }
  }

  return (
    <>
      <Stack.Screen options={{headerTitle: "Volunteers"}} />
      <View style={{flex:1, backgroundColor: isDark && Colors.dark.background || '' }}>
        <FlatList
          data={data?.data}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.card,
                {
                  borderColor: isDark ? Colors.dark.border : Colors.light.border,
                  backgroundColor: isDark ? "#1c1c1e" : "#fff",
                },
              ]}
            >
              <View style={styles.badgeContainer}>
                <LinearGradient
                  colors={["#ff4757", "#ff6b81"]}
                  style={styles.badge}
                >
                  <ThemedText style={styles.bloodGroupText}>
                    {item?.bloodGroup || "N/A"}
                  </ThemedText>
                </LinearGradient>
              </View>

              <View style={styles.profileSection}>
                <Image
                  source={
                    item?.imageUrl
                      ? {
                          uri: `${BACKEND_URL}/${item?.imageUrl}`,
                        }
                      : require("@/assets/images/user.jpg")
                  }
                  style={styles.profileImage}
                />
                <ThemedText style={styles.name}>{item?.fullName}</ThemedText>
                <ThemedText style={styles.role}>{item?.leaderType}</ThemedText>
              </View>

              <ThemedView style={styles.divider} />

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons
                    name="school-outline"
                    size={16}
                    color={isDark ? "#f0f0f0" : "#555"}
                  />
                  <ThemedText style={styles.infoText}>
                    {item?.instituteName || "Institution not specified"}
                  </ThemedText>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={isDark ? "#f0f0f0" : "#555"}
                  />
                  <ThemedText style={styles.infoText}>
                    {item?.gender || "Gender not specified"}
                  </ThemedText>
                </View>

                {item?.mobileNumber && (
                  <View style={styles.infoRow}>
                    <Ionicons
                      name="call-outline"
                      size={16}
                      color={isDark ? "#f0f0f0" : "#555"}
                    />
                    <ThemedText style={styles.infoText}>
                      {token
                        ? item.mobileNumber
                        : `${item.mobileNumber.slice(0, 5)}${"x".repeat(6)}`}
                    </ThemedText>
                  </View>
                )}
              </View>

              {item?.mobileNumber && (
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => handleCall(item.mobileNumber)}
                >
                  <Ionicons name="call" size={18} color="white" />
                  <Text style={styles.callButtonText}>Contact</Text>
                </TouchableOpacity>
              )}
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              No volunteers found
            </ThemedText>
          }
        />
      </View>
    </>
  )
}

export default VolunteersPage

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    position: "relative",
    
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: 15,
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  bloodGroupText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 15,
    marginTop: 5,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.light.tint,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  role: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: 10,
  },
  infoSection: {
    gap: 8,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    flex: 1,
    flexWrap: 'wrap',
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
})