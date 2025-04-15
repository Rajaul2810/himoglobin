import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
  Alert,
  Image
} from 'react-native'
import React, { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { MaterialIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import AdminCampaingCard from '@/components/Admin/AdminCampaingCard'

const PermittedCampaign = () => {
    const [pageNo, setPageNo] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const colorTheme = useColorScheme()
    const router = useRouter()
    

    const {data, isLoading, error, refetch} = useQuery({
        queryKey: ['permittedCampaign', pageNo, pageSize],
        queryFn: () => apiServices.getVolunteerPermittedCampaigns(pageNo, pageSize),
        refetchOnReconnect: true,
    })

    if(isLoading) return <LoadingComponent />
    if(error) return <ErrorComponent error={error} refetch={refetch} />
    const permittedCampaigns = data?.data
    console.log('permittedCampaigns',permittedCampaigns)

    const handleLoadMore = () => {
      if (permittedCampaigns?.length === pageSize) {
        setPageNo(pageNo + 1);
      }
    };

    const navigateToDonorAdd = () => {
      // Navigate to add donor screen or show modal
      Alert.alert("Add Donor", "Navigate to add donor functionality");
    };

    return (
      <>
        <Stack.Screen options={{ headerTitle: "Permitted Campaign" }} />
        <View style={{ flex: 1 }}>
          <ThemedView style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText type="subtitle" style={styles.headerTitle}>
                Permitted Campaigns
              </ThemedText>
            </View>
            <TouchableOpacity
              onPress={navigateToDonorAdd}
              style={styles.addButton}
            >
              <MaterialIcons name="add" size={20} color="white" />
              <ThemedText style={styles.addButtonText}>Add Donor</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <FlatList
            data={permittedCampaigns}
            renderItem={({ item }) => (
              <ThemedView style={styles.card}>
                <View style={styles.content}>
                  <Image
                    source={{ uri: 'https://mehrabmahi21-001-site1.qtempurl.com/' + item.bannerUrl }} 
                    style={styles.image} 
                  />
                  <View style={{width: '65%'}}>
                    <ThemedText style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.name}</ThemedText>
                    <ThemedText numberOfLines={1} ellipsizeMode="tail">{item.institute || 'No Institution'}</ThemedText>
                    <View style={styles.dateContainer}>
                      <ThemedText style={styles.dateText}>
                        Start: {item.startDate.split('T')[0]}
                      </ThemedText>
                      <ThemedText style={styles.dateText}>End: {item.endDate.split('T')[0]}</ThemedText>
                    </View>
                  </View>
                </View>
                <View style={styles.actionContainer}>
                    <TouchableOpacity onPress={() => router.push({pathname: '/admin/manage-media', params: {id: item.id}})} style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Media</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push({pathname: '/volunteers/add-donor', params: {id: item.id}})} style={styles.actionButton2}>
                        <Text style={styles.actionButtonText}>Add Donor</Text>
                    </TouchableOpacity>
                </View>
              </ThemedView>
            )}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <ThemedView style={styles.emptyContainer}>
                <MaterialIcons
                  name="campaign"
                  size={48}
                  color={Colors.light.tint}
                />
                <ThemedText style={styles.emptyText}>No permitted campaigns found</ThemedText>
              </ThemedView>
            }
            contentContainerStyle={styles.listContainer}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>
      </>
    )
}

export default PermittedCampaign

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 15,
    gap: 15,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateText: {
    fontSize: 14,
  },        
  card: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 5,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
    flex: 1,
  },
  actionButton: {   
    backgroundColor: 'green',
    flex: 1,
    padding: 5,
    borderRadius: 5,
  },
  actionButton2: {   
    backgroundColor: 'blue',
    flex: 1,
    padding: 5,
    borderRadius: 5,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})