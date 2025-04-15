import { StyleSheet, Text, View, FlatList, Image, useColorScheme } from 'react-native'
import React, { useState, useEffect } from 'react'
import { initiators } from '@/constants/data'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import apiServices from '@/utils/apiServices'
import { useQuery } from '@tanstack/react-query'
import LoadingComponent from '../utilsComponent/Loading'
import ErrorComponent from '../utilsComponent/Error'

const Initiator = () => {
  const isDark = useColorScheme() === 'dark'
  const [officialLeaders, setOfficialLeaders] = useState<any[]>([])

  const {data: officialLeadersData, isLoading: officialLeadersLoading, error: officialLeadersError, refetch: refetchOfficialLeaders} = useQuery({
    queryKey: ['officialLeaders'],
    queryFn: () => apiServices.getOfficialLeaders(),
    refetchOnReconnect(query) {
      return true
    },
  })

  if(officialLeadersLoading) {
    return <LoadingComponent />
  }

  if(officialLeadersError) {
    return <ErrorComponent error={officialLeadersError} refetch={refetchOfficialLeaders} />
  }

  //console.log(officialLeadersData)
  
  return (
    <ThemedView style={{ marginTop:10, paddingBottom: 10}}>
      <ThemedText style={styles.title}>Civil Surgeons Official</ThemedText>
      <FlatList
        data={officialLeadersData?.civilOfficeLeaders}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => 
        <ThemedView style={[styles.initiatorCard, {borderColor:  isDark ? Colors.dark.border : Colors.light.border, backgroundColor: isDark ? Colors.dark.background : 'lightgray'}]}>
            <View style={styles.imageContainer}>
              {item.imageUrl ? (
                <Image source={{uri: 'https://mehrabmahi21-001-site1.qtempurl.com/'+item.imageUrl}} style={styles.image} />
              ) : (
                <Image source={require('@/assets/images/user.jpg')} style={styles.image} />
              )}
              <View style={styles.badge}>
                <ThemedText style={styles.bloodGroup}>{item.bloodGroup}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.name}>{item.fullName}</ThemedText>
            <View style={styles.infoContainer}>
              
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="school-outline" size={16} color={Colors.light.tint} />
                <ThemedText style={styles.infoText}>{item.instituteName}</ThemedText>
              </View>
            </View>
        </ThemedView>
        }
      />
      <View style={[styles.divider, {backgroundColor: isDark ? Colors.dark.border : Colors.light.border}]}></View>
      <ThemedText style={styles.title}>District Commissioners Official</ThemedText>
      <FlatList
        data={officialLeadersData?.dcOfficeLeaders}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => 
        <ThemedView style={[styles.initiatorCard, {borderColor:  isDark ? Colors.dark.border : Colors.light.border, backgroundColor: isDark ? Colors.dark.background : 'lightgray'}]}>
            <View style={styles.imageContainer}>
            {item.imageUrl ? (
                <Image source={{uri: 'https://mehrabmahi21-001-site1.qtempurl.com/'+item.imageUrl}} style={styles.image} />
              ) : (
                <Image source={require('@/assets/images/user.jpg')} style={styles.image} />
              )}
              <View style={styles.badge}>
                <ThemedText style={styles.bloodGroup}>{item.bloodGroup}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.name}>{item.fullName}</ThemedText>
            <View style={styles.infoContainer}>
             
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="school-outline" size={16} color={Colors.light.tint} />
                <ThemedText style={styles.infoText}>{item.instituteName}</ThemedText>
              </View>
            </View>
        </ThemedView>
        }
      />
    </ThemedView>
  )
}

export default Initiator

const styles = StyleSheet.create({
    title:{
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 10,
        marginTop: 10
    },
    initiatorCard:{
        width: 250,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        marginHorizontal: 10,
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: 'lightgray'
    },
    imageContainer: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 10
    },
    image:{
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: Colors.light.tint
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 50,
        backgroundColor: Colors.light.tint,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15
    },
    bloodGroup: {
        color: '#fff',
        fontWeight: 'bold'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10
    },
    infoContainer: {
        gap: 8
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    infoText: {
        fontSize: 14,
        color: '#666'
    },
    divider: {
        height: 1,
        marginVertical: 10
    }
})