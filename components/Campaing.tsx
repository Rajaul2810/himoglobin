import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import apiServices from "@/utils/apiServices";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "./utilsComponent/Loading";
import ErrorComponent from "./utilsComponent/Error";
import { useRouter } from "expo-router";
import { campaigns } from "@/constants/data";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const Campaing = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { getRunningAndUpcomingCampaign } = apiServices;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["runningAndUpcomingCampaign"],
    queryFn: () => getRunningAndUpcomingCampaign(1, 10),
    refetchOnReconnect: true,
  });
  const campaignsData = data;
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} refetch={refetch} />;
  
  return (
    <View style={styles.mainContainer}>
      <ThemedView style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <FontAwesome5 name="hand-holding-heart" size={20} color={Colors.light.tint} />
          <ThemedText style={styles.campaingHeaderTitle}>Campaigns</ThemedText>
        </View>
        <TouchableOpacity 
          onPress={() => router.push("/campaing")} 
          style={styles.viewAllButton}
        >
          <ThemedText style={styles.viewAllText}>View All</ThemedText>
          <Ionicons name="arrow-forward-circle" size={22} color={Colors.light.tint} /> 
        </TouchableOpacity>
      </ThemedView>
      
      <FlatList
        data={campaignsData?.data}
        renderItem={({ item }: any) => {
          return (
            <TouchableOpacity 
              onPress={() => router.push({pathname: "/campaing/[id]", params: {id: item?.id}})}
              activeOpacity={0.7}
            >
              <ThemedView 
                style={[
                  styles.campaingContainer, 
                  {
                    borderColor: colorScheme === 'dark' ? Colors.dark.border : Colors.light.border,
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF',
                    shadowColor: colorScheme === 'dark' ? '#000' : '#888',
                  }
                ]}
              >
                <View style={styles.statusBadge}>
                  <ThemedText style={styles.statusText}>
                    {new Date(item?.endDate) > new Date() ? "Active" : "Ended"}
                  </ThemedText>
                </View>
                
                <Image 
                  source={{uri: `https://mehrabmahi21-001-site1.qtempurl.com/${item?.bannerUrl}`}} 
                  resizeMode="cover" 
                  style={styles.campaingImage} 
                />
                
                <View style={styles.contentContainer}>
                  <ThemedText style={styles.campaingTitle} numberOfLines={1} ellipsizeMode="tail">
                    {item?.name}
                  </ThemedText>
                  
                  <View style={styles.infoRow}>
                    <MaterialIcons name="business" size={16} color={Colors.light.tint} />
                    <ThemedText style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                      {item?.institute}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Ionicons name="location-outline" size={16} color={Colors.light.tint} />
                    <ThemedText style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                      {item?.address}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.dateContainer}>
                    <View style={styles.dateItem}>
                      <Ionicons name="calendar-outline" size={14} color={Colors.light.tint} />
                      <ThemedText style={styles.dateText}>
                        {item?.startDate.split('T')[0]}
                      </ThemedText>
                    </View>
                    
                    <Ionicons name="arrow-forward" size={14} color="gray" />
                    
                    <View style={styles.dateItem}>
                      <Ionicons name="calendar" size={14} color={Colors.light.tint} />
                      <ThemedText style={styles.dateText}>
                        {item?.endDate.split('T')[0]}
                      </ThemedText>
                    </View>
                  </View>
                </View>
              </ThemedView>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item?.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

export default Campaing;

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    paddingBottom: 15,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  campaingHeaderTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(220, 53, 69, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  viewAllText: {
    color: Colors.light.tint,
    fontSize: 14,
    fontWeight: 'bold',
  },
  flatListContent: {
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  campaingContainer: {
    marginHorizontal: 8,
    borderWidth: 1,
    borderRadius: 16,
    padding: 0,
    width: width * 0.75,
    maxWidth: 320,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    
    position: 'relative',
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    zIndex: 1,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  campaingImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {
    padding: 12,
  },
  campaingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  dateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
});
