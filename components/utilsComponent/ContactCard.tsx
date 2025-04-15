import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Colors } from '@/constants/Colors'

const ContactCard = () => {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="message-text" size={40} color={Colors.light.tint} />
        </View>
        
        <ThemedText style={styles.title}>Contact Us</ThemedText>
        <ThemedText style={styles.description}>
          Have questions or need assistance? We're here to help. Reach out to us and we'll respond as soon as possible.
        </ThemedText>

        <TouchableOpacity onPress={() => router.push("/contact")} style={styles.button}>
          <ThemedText style={styles.buttonText}>Get in Touch</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

export default ContactCard

const styles = StyleSheet.create({
  container: {
    padding: 15,
    
  },
  content: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  }
})
