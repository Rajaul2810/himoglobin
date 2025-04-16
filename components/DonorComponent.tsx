// Start of Selection
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  Linking,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import apiServices, { BACKEND_URL } from "@/utils/apiServices";
import { lastBloodDonation } from "@/utils/lastBloodDonation";
import useAuthStore from "@/store/authStore";
import { useRouter } from "expo-router";
const bloodType = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const { width } = Dimensions.get("window");

const DonorComponent = () => {
  const colorScheme = useColorScheme();
  const [selectedBloodType, setSelectedBloodType] = useState("All");
  const [donors, setDonors] = useState([]);
  const router = useRouter();
  const { token } = useAuthStore((state: any) => state);

  const { mutate: getDoners, isPending } = useMutation({
    mutationFn: (data: any) => apiServices.getBloodBankData(data),
    onSuccess: (data: any) => {
      setDonors(data?.data);
    },
    onError: (error: any) => {
      console.log("error", error);
    },
  });

  useEffect(() => {
    if (selectedBloodType === "All") {
      getDoners({ pageNo: 1, pageSize: 20 });
    } else {
      getDoners({ bloodGroup: selectedBloodType, pageNo: 1, pageSize: 20 });
    }
  }, [selectedBloodType]);

  const handleCall = (phoneNumber: string) => {
    if (token) {
      Linking.openURL(`tel:${phoneNumber}`);
    } else {
      Alert.alert(
        "Please login to call the donor",
        "You need to be logged in to contact donors",
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
    <View>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.donorTitle}>
          <FontAwesome5
            name="hand-holding-medical"
            size={18}
            color={Colors.light.tint}
          />{" "}
          Donors
        </ThemedText>
        <FlatList
          data={bloodType}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.bloodTypeButton,
                {
                  backgroundColor:
                    item === selectedBloodType ? Colors.light.tint : "#f0c2c2",
                },
              ]}
              onPress={() => setSelectedBloodType(item)}
            >
              <ThemedText
                style={[
                  styles.bloodTypeText,
                  {
                    color:
                      item === selectedBloodType
                        ? Colors.light.background
                        : Colors.light.tint,
                  },
                ]}
              >
                {item}
              </ThemedText>
            </TouchableOpacity>
          )}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </ThemedView>
      <View style={styles.donorContainer}>
        {isPending ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.tint} />
            <ThemedText style={styles.loadingText}>
              Loading donors...
            </ThemedText>
          </View>
        ) : donors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="blood-bag"
              size={50}
              color={Colors.light.tint}
            />
            <ThemedText style={styles.emptyText}>No donors found</ThemedText>
          </View>
        ) : (
          <FlatList
            data={donors}
            keyExtractor={(item: any, index: number) => index.toString()}
            renderItem={({ item }) => (
              <ThemedView
                style={[
                  styles.donorCard,
                  {
                    borderColor:
                      colorScheme === "dark"
                        ? Colors.dark.border
                        : Colors.light.border,
                    backgroundColor:
                      colorScheme === "dark" ? "#2A2A2A" : "#FFFFFF",
                  },
                ]}
              >
                <View style={styles.bloodGroupBadge}>
                  <ThemedText style={styles.bloodGroupText}>
                    {item?.bloodGroup}
                  </ThemedText>
                </View>

                <View style={styles.imageContainer}>
                  <View style={styles.profileContainer}>
                    <Image
                      source={
                        item?.imageUrl
                          ? {
                              uri:
                                `${BACKEND_URL}/${item?.imageUrl}`,
                            }
                          : require("@/assets/images/user.jpg")
                      }
                      style={styles.image}
                    />
                    <View>
                      <ThemedText style={styles.donorName}>
                        {item?.fullName}
                      </ThemedText>
                      <View style={styles.lastDonationContainer}>
                        <Ionicons name="time-outline" size={12} color="gray" />
                        <ThemedText style={styles.lastDonationText}>
                          Last Donation:{" "}
                          {lastBloodDonation(item?.lastDonationTime)} days ago
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                </View>

                <ThemedView style={styles.divider} />

                <View style={styles.info}>
                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <FontAwesome5
                        name="tint"
                        size={14}
                        color={Colors.light.tint}
                      />
                      <ThemedText style={styles.infoText}>
                        Donations: {item?.bloodDonationCount}
                      </ThemedText>
                    </View>

                    <View style={styles.infoItem}>
                      <Ionicons
                        name="medical-outline"
                        size={14}
                        color={item.physicalComplexity ? "#E53935" : "#4CAF50"}
                      />
                      <ThemedText style={styles.infoText}>
                        Complexity:{" "}
                        {item.physicalComplexity === false ? "No" : "Yes"}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                      <MaterialCommunityIcons
                        name="blood-bag"
                        size={14}
                        color={
                          item?.bloodDonationStatus === "Available"
                            ? "#4CAF50"
                            : "#E53935"
                        }
                      />
                      <ThemedText style={styles.infoText}>
                        Status: {item?.bloodDonationStatus}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.contactContainer}>
                    {token ? (
                      <View style={styles.phoneContainer}>
                        <Ionicons
                          name="call"
                          size={14}
                          color={Colors.light.tint}
                        />
                        <ThemedText style={styles.phoneText}>
                          {item?.mobileNumber}
                        </ThemedText>
                      </View>
                    ) : (
                      <View style={styles.phoneContainer}>
                        <Ionicons
                          name="lock-closed"
                          size={14}
                          color={Colors.light.tint}
                        />
                        <ThemedText style={styles.phoneText}>
                          {item?.mobileNumber
                            ? `${item?.mobileNumber.slice(0, 5)}${"x".repeat(
                                6
                              )}`
                            : ""}
                        </ThemedText>
                      </View>
                    )}
                    <TouchableOpacity
                      onPress={() => handleCall(item?.mobileNumber)}
                      style={styles.callButton}
                    >
                      <Ionicons name="call-outline" size={16} color={"white"} />
                      <Text style={styles.callButtonText}>Call</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ThemedView>
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.donorListContainer}
          />
        )}
      </View>
    </View>
  );
};

export default DonorComponent;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  donorContainer: {
    paddingBottom: 10,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: Colors.light.tint,
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    opacity: 0.7,
  },
  donorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 15,
    marginTop: 10,
  },
  bloodTypeButton: {
    padding: 3,
    paddingHorizontal: 10,
    marginRight: 6,
    borderRadius: 5,
    backgroundColor: "#f0c2c2",
    marginHorizontal: 5,
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  donorListContainer: {
    paddingHorizontal: 5,
  },
  donorCard: {
    borderWidth: 1,
    borderRadius: 16,
    margin: 10,
    padding: 15,
    width: width * 0.8,
    maxWidth: 340,
    position: "relative",
  },
  bloodGroupBadge: {
    position: "absolute",
    top: -10,
    right: 15,
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  bloodGroupText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginVertical: 12,
  },
  info: {
    justifyContent: "center",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  lastDonationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  lastDonationText: {
    fontSize: 12,
    color: "gray",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  contactContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  phoneText: {
    fontSize: 14,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  callButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
