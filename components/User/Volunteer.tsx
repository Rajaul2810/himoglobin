import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Linking,
  Alert,
  ImageBackground,
} from "react-native";
import React from "react";
import apiServices from "@/utils/apiServices";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../utilsComponent/Loading";
import ErrorComponent from "../utilsComponent/Error";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Image } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";

const Volunteer = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { token } = useAuthStore((state: any) => state);
  const { getScoutLeaders } = apiServices;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["scoutLeaders"],
    queryFn: () => getScoutLeaders(1, 10),
    refetchOnReconnect: true,
  });
  
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} refetch={refetch} />;

  const handleCall = (phoneNumber: string) => {
    if (token) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(
        "Please login to call the volunteer",
        "You need to be logged in to contact volunteers",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Login",
            onPress: () => {
              router.push("/auth/login");
            },
          },
        ]
      );
    }
  };

  return (
    <View style={[styles.container, { marginTop: 10 }]}>
      <ThemedView style={styles.header}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText style={styles.title}>Volunteer (Scouts)</ThemedText>
          <ThemedText style={styles.subtitle}>
            Dedicated scout volunteers ready to help
          </ThemedText>
        </ThemedView>
        <TouchableOpacity
          onPress={() => router.push("/volunteers")}
          style={styles.viewAllButton}
        >
          <ThemedText style={styles.viewAllText}>View All</ThemedText>
          <Ionicons
            name="arrow-forward-outline"
            size={20}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={data?.data}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <ThemedView
            style={[
              styles.card,
              {
                borderColor: isDark ? Colors.dark.border : Colors.light.border,
                backgroundColor: isDark ? "#1c1c1e" : "#fff",
              },
            ]}
          >
            <View style={styles.badgeContainer}>
              <LinearGradient
                colors={["#ff4757", "#ff6b81"]}
                style={styles.badge}
              >
                <ThemedText style={styles.bloodGroupText}>
                  {item?.bloodGroup || "N/A"}
                </ThemedText>
              </LinearGradient>
            </View>

            <View style={styles.profileSection}>
              <Image
                source={
                  item?.imageUrl
                    ? {
                        uri:
                          "https://mehrabmahi21-001-site1.qtempurl.com/" +
                          item?.imageUrl,
                      }
                    : require("@/assets/images/user.jpg")
                }
                style={styles.profileImage}
              />
              <ThemedText style={styles.name}>{item?.fullName}</ThemedText>
              <ThemedText style={styles.role}>{item?.leaderType}</ThemedText>
            </View>

            <ThemedView style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons
                  name="school-outline"
                  size={16}
                  color={isDark ? "#f0f0f0" : "#555"}
                />
                <ThemedText style={styles.infoText}>
                  {item?.instituteName || "Institution not specified"}
                </ThemedText>
              </View>

              <View style={styles.infoRow}>
                <Ionicons
                  name="person-outline"
                  size={16}
                  color={isDark ? "#f0f0f0" : "#555"}
                />
                <ThemedText style={styles.infoText}>
                  {item?.gender || "Gender not specified"}
                </ThemedText>
              </View>

              {item?.mobileNumber && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="call-outline"
                    size={16}
                    color={isDark ? "#f0f0f0" : "#555"}
                  />
                  <ThemedText style={styles.infoText}>
                    {token
                      ? item.mobileNumber
                      : `${item.mobileNumber.slice(0, 5)}${"x".repeat(6)}`}
                  </ThemedText>
                </View>
              )}
            </View>
          </ThemedView>
        )}
      />
    </View>
  );
};

export default Volunteer;

const styles = StyleSheet.create({
  container: {
    
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 5,
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  listContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  card: {
    width: 280,
    borderRadius: 16,
    marginHorizontal: 10,
    padding: 20,
    borderWidth: 1,
    position: "relative",
  },
  badgeContainer: {
    position: "absolute",
    top: -10,
    right: 20,
    zIndex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bloodGroupText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: Colors.light.tint,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  role: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: 15,
  },
  infoSection: {
    gap: 10,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 14,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.tint,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
