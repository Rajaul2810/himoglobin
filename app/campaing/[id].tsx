import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, useColorScheme, Dimensions, SafeAreaView } from 'react-native'
import React from 'react'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import apiServices, { BACKEND_URL } from '@/utils/apiServices';
import { useQuery } from '@tanstack/react-query';
import LoadingComponent from '@/components/utilsComponent/Loading';
import ErrorComponent from '@/components/utilsComponent/Error';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CampaignDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { getCampaignById } = apiServices;
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["campaignById", id],
        queryFn: () => getCampaignById(id),
    });

    if (isLoading) return <LoadingComponent />;
    if (error) return <ErrorComponent error={error} refetch={refetch} />;

    const campaignData = data?.data;
    const isActive = new Date(campaignData?.endDate) > new Date();
    const startDate = new Date(campaignData?.startDate).toLocaleDateString();
    const endDate = new Date(campaignData?.endDate).toLocaleDateString();

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen 
                options={{ 
                    headerTitle: campaignData?.name || "Campaign Details",
                    headerTitleStyle: { fontSize: 18 }
                }} 
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Banner Image */}
                <View style={styles.bannerContainer}>
                    <Image 
                        source={{ uri: `${BACKEND_URL}/${campaignData?.bannerUrl}` }} 
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                    <View style={[styles.statusBadge, { backgroundColor: isActive ? Colors.light.tint : '#888' }]}>
                        <ThemedText style={styles.statusText}>
                            {isActive ? "Active" : "Ended"}
                        </ThemedText>
                    </View>
                </View>

                {/* Campaign Details */}
                <ThemedView style={styles.detailsContainer}>
                    <ThemedText style={styles.campaignTitle}>{campaignData?.name}</ThemedText>

                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="business" size={22} color={Colors.light.tint} />
                            <ThemedText style={styles.infoText}>{campaignData?.institute}</ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="location" size={22} color={Colors.light.tint} />
                            <ThemedText style={styles.infoText}>{campaignData?.address}</ThemedText>
                        </View>

                        <View style={styles.dateSection}>
                            <View style={styles.dateItem}>
                                <MaterialIcons name="event" size={22} color={Colors.light.tint} />
                                <View>
                                    <ThemedText style={styles.dateLabel}>Start Date</ThemedText>
                                    <ThemedText style={styles.dateValue}>{startDate}</ThemedText>
                                </View>
                            </View>

                            <View style={styles.dateItem}>
                                <MaterialIcons name="event-available" size={22} color={Colors.light.tint} />
                                <View>
                                    <ThemedText style={styles.dateLabel}>End Date</ThemedText>
                                    <ThemedText style={styles.dateValue}>{endDate}</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.volunteerSection}>
                        <View style={styles.volunteerHeader}>
                            <FontAwesome5 name="users" size={20} color={Colors.light.tint} />
                            <ThemedText style={styles.volunteerTitle}>Volunteers</ThemedText>
                        </View>
                        <View style={styles.volunteerCount}>
                            <ThemedText style={styles.volunteerCountText}>
                                {campaignData?.volunteerList?.length || 0} Volunteers Participating
                            </ThemedText>
                        </View>
                    </View>

                    
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}

export default CampaignDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bannerContainer: {
        position: 'relative',
        width: '100%',
        height: 200,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    detailsContainer: {
        padding: 16,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -20,
    },
    campaignTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    infoSection: {
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 16,
        marginLeft: 10,
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    dateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '48%',
    },
    dateLabel: {
        fontSize: 12,
        marginLeft: 8,
        opacity: 0.7,
    },
    dateValue: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    volunteerSection: {
        marginVertical: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    volunteerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    volunteerTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 8,
    },
    volunteerCount: {
        marginTop: 5,
    },
    volunteerCountText: {
        fontSize: 16,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%',
        paddingVertical: 12,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
    }
})