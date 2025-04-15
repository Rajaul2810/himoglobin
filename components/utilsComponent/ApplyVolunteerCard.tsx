import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { ThemedView } from '../ThemedView'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
const ApplyVolunteerCard = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="hand-heart" size={40} color={Colors.light.tint} />
        </View>
        
        <ThemedText style={styles.title}>Become a Volunteer</ThemedText>
        <ThemedText style={styles.description}>
          Join our community of volunteers and make a difference in people's lives. Your small contribution can create a big impact.
        </ThemedText>

        <TouchableOpacity onPress={() => router.push({
          pathname: "/user/form",
          params: { rules: "leader" }
        })} style={styles.button}>
          <ThemedText style={styles.buttonText}>Apply Now</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default ApplyVolunteerCard

const styles = StyleSheet.create({
  container: {
    margin: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 99, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})