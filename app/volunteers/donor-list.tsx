import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import { ThemedText } from '@/components/ThemedText'
import UserCard from '@/components/User/UserCard'

const DonorList = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [donors, setDonors] = useState<any[]>([])

  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ['donor-list', pageNo],
    queryFn: () => apiServices.getPermittedDonors(pageNo, pageSize),
    refetchOnReconnect: true,
  })    

  useEffect(() => {
    if (data?.data) {
      if (pageNo === 1) {
        setDonors(data.data)
      } else {
        setDonors((prevDonors: any[]) => [...prevDonors, ...data.data])
      }
    }
  }, [data])

  if(isLoading && pageNo === 1) {
    return <LoadingComponent />
  }
  
  if(isError) {
    return <ErrorComponent error={error} refetch={refetch} />
  }
  console.log('donors', data);

  const handleLoadMore = () => {
    if (data?.data?.length === pageSize) {
      setPageNo(pageNo + 1)
    }
  }

  return (
    <>
    <Stack.Screen options={{ headerTitle: "Donor List" }} />
    <View style={styles.container}>
      <FlatList
        data={donors}
        renderItem={({item}) => <UserCard user={item} />}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No donors found</ThemedText>
          </View>
        }
        contentContainerStyle={donors.length === 0 ? styles.emptyList : null}
      />
    </View>
    </>
  )
}

export default DonorList

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  }
})