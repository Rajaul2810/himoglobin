import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  useColorScheme
} from 'react-native'
import React, { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import apiServices, { BACKEND_URL } from '@/utils/apiServices'
import { Stack, useRouter } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import { toast } from 'sonner-native'

const ManageAdmin = () => {
  const colorScheme = useColorScheme();
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const router = useRouter();
  
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ['admin'],
    queryFn: () => apiServices.getAllAdmin(page, pageSize),
    refetchOnReconnect: true,
  })

  return (
    <>
    <Stack.Screen options={{
      headerTitle: 'Manage Admin'
    }} />
    
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={{margin: 10, padding: 10, backgroundColor: Colors.light.tint, borderRadius: 5}} onPress={() => router.push({pathname: "/user/form", params: {rules: "admin"}})}>  
        <ThemedText style={{color: "white", textAlign: "center"}}>Add Admin</ThemedText>
      </TouchableOpacity>
      {isLoading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent error={error} refetch={refetch} />
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.adminCard,
                {
                  borderColor:
                    colorScheme === "dark"
                      ? Colors.dark.border
                      : Colors.light.border,
                },
              ]}
            >
              <ThemedView style={styles.imageContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <Image
                    source={
                      item?.imageUrl
                        ? {
                            uri:
                              `${BACKEND_URL}/${item?.imageUrl}`,
                          }
                        : require("@/assets/images/user.jpg")
                    }
                    style={styles.image}
                  />
                  <View>
                    <ThemedText style={styles.name}>{item?.fullName}</ThemedText>
                    <ThemedView
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={"gray"}
                      />
                      <ThemedText style={{ fontSize: 12, color: "gray" }}>
                        {item?.address || "No address"}
                      </ThemedText>
                    </ThemedView>
                  </View>
                </View>
                <ThemedText
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    color: Colors.light.tint,
                  }}
                >
                  {item?.bloodGroup || "N/A"}
                </ThemedText>
              </ThemedView>
              
              <ThemedView style={styles.info}>
                <ThemedText>{item?.mobileNumber}</ThemedText>
                <ThemedText style={styles.role}>Role: Admin</ThemedText>
              </ThemedView>
              
              <TouchableOpacity 
                style={[styles.button, {backgroundColor: Colors.light.tint}]} 
                onPress={() => router.push({pathname: "/user/[id]", params: {id: item?.id}})}
              > 
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              No admins found
            </ThemedText>
          }
        />
      )}
    </View>
    </>
  )
}

export default ManageAdmin

const styles = StyleSheet.create({
  adminCard: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  info: {
    marginTop: 10,
    marginBottom: 15,
  },
  role: {
    marginTop: 5,
    fontStyle: "italic",
    color: Colors.light.tint,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
})