import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useQuery } from '@tanstack/react-query';
import apiServices from '@/utils/apiServices';
import LoadingComponent from '@/components/utilsComponent/Loading';
import ErrorComponent from '@/components/utilsComponent/Error';
import { Stack } from 'expo-router';

export default function ManageContact() {
  const [selectedType, setSelectedType] = useState('Contact');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const { data: contactList, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['contacts', selectedType, page, size],
    queryFn: () => apiServices.getAllContact(selectedType, page, size),
    refetchOnReconnect: true,
    enabled: !!selectedType,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
  });

  useEffect(() => {
    refetch();
  }, [selectedType]);

  const filterTypes = [
    { label: 'Contact', value: 'Contact' },
    { label: 'Complain', value: 'Complain' },
    { label: 'Suggestion', value: 'Suggestion' }
  ];

  const renderContactItem = useCallback(({ item }: { item: any }) => (
    <ThemedView style={styles.contactCard}>
      <View style={styles.cardHeader}>
        <ThemedText numberOfLines={1} style={styles.subject}>Name: {item.createdBy || 'Unknown'}</ThemedText>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.contactType) }]}>
          <ThemedText style={styles.typeText}>{item.contactType}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.subject} numberOfLines={1}>
        Subject: {item.subject || ''}
      </ThemedText>
      <ThemedText style={styles.message} numberOfLines={3}>
        Message: {item.message || ''}
      </ThemedText>
      
      <View style={styles.cardFooter}>
        <ThemedText style={styles.date}>Date: {item.createTime.split('T')[0] || 'Unknown'}</ThemedText>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleReadContact(item.id)}
        >
          <MaterialIcons 
            name={item.isRead ? "visibility" : "visibility-off"} 
            size={24} 
            color={Colors.light.tint} 
          />
        </TouchableOpacity>
      </View>
    </ThemedView>
  ), []);

  const handleReadContact = async (id: string) => {
    try {
      await apiServices.readContact(id);
      refetch();
    } catch (error) {
      console.error('Error marking contact as read:', error);
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Contact':
        return '#4CAF50';
      case 'Complain':
        return '#F44336';
      case 'Suggestion':
        return '#2196F3';
      default:
        return Colors.light.tint;
    }
  };

  const handleTypeChange = (value: string) => {
    if (value !== selectedType) {
      setSelectedType(value);
      setPage(1);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoading && !isFetching && !isLoadingMore && contactList?.data?.length >= size) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  }, [isLoading, isFetching, isLoadingMore, contactList?.data?.length, size]);


  return (
    <>
    <Stack.Screen options={{headerTitle: "Manage Contact"}} />
    <View style={styles.container}>
      <ThemedView style={styles.filterContainer}>
        {filterTypes.map((type: any) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterButton,
              selectedType === type.value && styles.filterButtonActive
            ]}
            onPress={() => handleTypeChange(type.value)}
          >
            <ThemedText style={[
              styles.filterButtonText,
              selectedType === type.value && styles.filterButtonTextActive
            ]}>
              {type.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
      {isLoading ? (
        <LoadingComponent />
      ) : 
      error ? (
       <ErrorComponent error={error} refetch={refetch} />
      ) : (
        <FlatList
          data={contactList?.data || []}
          renderItem={renderContactItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <ThemedText style={styles.emptyText}>
            {isLoading ? 'Loading...' : 'No contacts found'}
          </ThemedText>
        }
        ListFooterComponent={
          isFetching && page > 1 ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator size="small" color={Colors.light.tint} />
              <ThemedText>Loading more...</ThemedText>
            </View>
          ) : null
        }
      />
      )}
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: Colors.light.tint,
  },
  filterButtonActive: {
    backgroundColor: Colors.light.tint,
  },
  filterButtonText: {
    color: Colors.light.tint,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 15,
    gap: 15,
    flexGrow: 1,
  },
  contactCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subject: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 1,
    borderRadius: 15,
  },
  typeText: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
  message: {
    fontSize: 14,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  loadingMore: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
});
