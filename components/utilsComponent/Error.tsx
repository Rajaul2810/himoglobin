import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'

const ErrorComponent = ({ error, refetch }: { error: any; refetch: () => void }) => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="error-outline" size={80} color="#FF3B30" style={styles.icon} />
      <Text style={styles.errorTitle}>Oops!</Text>
      <Text style={styles.errorMessage}>
        {error?.message || 'Something went wrong. Please try again.'}
      </Text>
      <TouchableOpacity 
        style={styles.retryButton} 
        onPress={refetch}
        activeOpacity={0.7}
      >
        <MaterialIcons name="refresh" size={20} color="#fff" />
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  )
}

export default ErrorComponent

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  icon: {
    marginBottom: 20
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 10
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: '80%'
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
})