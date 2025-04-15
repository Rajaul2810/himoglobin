import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import { ThemedText } from '@/components/ThemedText'
import UserCard from '@/components/User/UserCard'
const DonorList = () => {
  const [pageNo, setPageNo] = useState(1)
  const [pageSize, setPageSize] = useState(10)  
  const {data, isLoading, error, refetch} = useQuery({
    queryKey: ["donor-list"],
    queryFn: () => apiServices.getPermittedDonors(pageNo, pageSize)
    
  })
  if(isLoading) {
    return <LoadingComponent />
  }
  if(error) {
    return <ErrorComponent error={error} refetch={refetch} />
  }
  
  return (
    <View>
      <ThemedText type="title" style={{textAlign: 'center', marginVertical: 10}}>Donor List</ThemedText>
      <FlatList
        data={data?.data}
        renderItem={({item}: any) => 
        <UserCard user={item} />
        }
        keyExtractor={(item: any) => item.id.toString()}
        onEndReached={() => setPageNo(pageNo + 1)}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<ThemedText>No donors found</ThemedText>}
      />
    </View>
  )
}

export default DonorList

const styles = StyleSheet.create({})