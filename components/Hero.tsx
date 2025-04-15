import { StyleSheet, Text, View, ActivityIndicator, Dimensions, Image } from 'react-native'
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import apiServices from '@/utils/apiServices'
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import { ThemedView } from '@/components/ThemedView'
import { ThemedText } from './ThemedText'
import { LinearGradient } from 'expo-linear-gradient'
import LoadingComponent from './utilsComponent/Loading'
const { width } = Dimensions.get('window');

const Hero = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboardData'],
        queryFn: () => apiServices.getDashboardData(),
        refetchOnReconnect: true,
    })

    const dashboardData = data?.data || { volunteer: 0, donor: 0, registeredDonor: 0, campaign: 0 }

    if (isLoading) {
        return (
            <LoadingComponent />
        )
    }

    return (
        <ThemedView style={styles.container}>
            <View style={styles.headerContainer}>
                <View>
                    <ThemedText type='subtitle' style={styles.title}>Hemoglobin</ThemedText>
                    <ThemedText style={styles.subtitle}>রক্ত দিয়ে বাচাই প্রাণ</ThemedText>
                </View>
                <Image 
                    source={require('../assets/images/darkLogo.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            
            <View style={styles.statsContainer}>
                <LinearGradient
                    colors={['#00796B', '#004D40']}
                    style={styles.statCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="hand-holding-heart" size={28} color="#fff" />
                    </View>
                    <Text style={styles.statCount}>{dashboardData.volunteer}</Text>
                    <Text style={styles.statLabel}>Leaders</Text>
                </LinearGradient>

                <LinearGradient
                    colors={['#2E7D32', '#1B5E20']}
                    style={styles.statCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <Ionicons name="people" size={28} color="#fff" />
                    </View>
                    <Text style={styles.statCount}>{dashboardData.registeredDonor}</Text>
                    <Text style={styles.statLabel}>Donors</Text>
                </LinearGradient>

                <LinearGradient
                    colors={['#8E24AA', '#6A0572']}
                    style={styles.statCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name="calendar-heart" size={28} color="#fff" />
                    </View>
                    <Text style={styles.statCount}>{dashboardData.campaign}</Text>
                    <Text style={styles.statLabel}>Campaigns</Text>
                </LinearGradient>
            </View>
        </ThemedView>
    )
}

export default Hero

const styles = StyleSheet.create({
    container: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 12,
       
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.8,
        marginTop: 4,
    },
    logo: {
        width: 50,
        height: 50,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        borderRadius: 12,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        width: width > 350 ? '31%' : '31%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
       
    },
    iconContainer: {
        marginBottom: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 50,
    },
    statCount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    }
})