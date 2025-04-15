import { StyleSheet, Text, View, FlatList, Image, useColorScheme } from 'react-native'
import React from 'react'
import { initiators } from '@/constants/data'
import { ThemedView } from '../ThemedView'
import { ThemedText } from '../ThemedText'
import { Colors } from '@/constants/Colors'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'

const Initiator = () => {
    const isDark = useColorScheme() === 'dark'
  return (
    <ThemedView style={{ marginTop:10, paddingBottom: 10}}>
      <ThemedText style={styles.title}>Respectful Initiators</ThemedText>
      <FlatList
        data={initiators}
        keyExtractor={(item) => item.id.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => 
        <ThemedView style={[styles.initiatorCard, {borderColor:  isDark ? Colors.dark.border : Colors.light.border}]}>
            <View style={styles.imageContainer}>
              <Image source={item.profileImage} style={styles.image} />
              <View style={styles.badge}>
                <ThemedText style={styles.bloodGroup}>{item.bloodGroup}</ThemedText>
              </View>
            </View>
            <ThemedText style={styles.name}>{item.name}</ThemedText>
            <View style={styles.infoContainer}>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={16} color={Colors.light.tint} />
                <ThemedText style={styles.infoText}>{item.phone}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="email-outline" size={16} color={Colors.light.tint} />
                <ThemedText style={styles.infoText}>{item.email}</ThemedText>
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
        marginTop: 10
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
    }
})