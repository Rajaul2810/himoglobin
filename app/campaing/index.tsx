import { SafeAreaView, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import CampaingCard from '@/components/utilsComponent/CampaingCard'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import LoadingComponent from '@/components/utilsComponent/Loading'
import ErrorComponent from '@/components/utilsComponent/Error'
import { Colors } from '@/constants/Colors'
import { Stack } from 'expo-router'
interface Campaign {
  id: string;
  name: string;
  address: string;
  institute: string;
  startDate: string;
  endDate: string;
  bannerUrl: string;
  volunteerList: any[];
}

const CampaingsPage = () => {
  const [pageNo, setPageNo] = useState(1) 
  const [pageSize, setPageSize] = useState(10)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['campaigns', pageNo],
    queryFn: () => apiServices.getAllCampaign(pageNo, pageSize),
    enabled: hasMore,
  })

  useEffect(() => {
    if (data) {
      // Check if data and data.data exist before accessing length
      if (!data?.data || data?.data?.length === 0) {
        setHasMore(false)
      } else {
        if (pageNo === 1) {
          setCampaigns(data?.data)
        } else {
          setCampaigns((prev: any) => [...prev, ...data?.data])
        }
      }
      setIsLoadingMore(false)
    }
  }, [data, pageNo])

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && hasMore && !isFetching) {
      setIsLoadingMore(true)
      setPageNo(prev => prev + 1)
    }
  }, [isLoadingMore, hasMore, isFetching])

  const renderFooter = () => {
    if (!isLoadingMore) return <ThemedView style={{ marginBottom: 100 }} />
    
    return (
      <ThemedView style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.light.tint} />
        <ThemedText style={styles.loadingText}>Loading more campaigns...</ThemedText>
      </ThemedView>
    )
  }

  if (isLoading && pageNo === 1) {
    return <LoadingComponent />
  }

  if (isError && pageNo === 1) {
    return <ErrorComponent error={error} refetch={refetch} />
  }

  return (
    <>
    <Stack.Screen options={{headerTitle: "Campaign"}} />
    <SafeAreaView style={{ flex: 1 }}>
        <FlatList
            data={campaigns}
            keyExtractor={(item: any, index: any) => item.id?.toString() || index.toString()}
            renderItem={({ item }) => <CampaingCard item={item} />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>No campaigns found</ThemedText>
              </ThemedView>
            }
            ListFooterComponent={renderFooter}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
        />
    </SafeAreaView>
    </>
  )
}

export default CampaingsPage

const styles = StyleSheet.create({
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 100
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center'
  }
})