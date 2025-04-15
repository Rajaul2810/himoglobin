import {
  StyleSheet,
  Text,
  View,
  FlatList,
  useColorScheme,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React from "react";
import apiServices from "@/utils/apiServices";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "../utilsComponent/Loading";
import ErrorComponent from "../utilsComponent/Error";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { volunteers } from "@/constants/data";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/authStore";
import { lastBloodDonation } from "@/utils/lastBloodDonation";

const Volunteer = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { token } = useAuthStore((state: any) => state);
  const { getApprovedVolunteer } = apiServices;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["approvedVolunteer"],
    queryFn: () => getApprovedVolunteer(1, 10),
    refetchOnReconnect: true,
  });
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} refetch={refetch} />;

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
  //console.log(data);
  return (
    <ThemedView style={[styles.donorContainer, {marginTop: 10}]}>
      <View style={styles.header}>
        <ThemedText style={styles.donorTitle}>Leaders</ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/volunteers")}
          style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
        >
          <ThemedText
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: Colors.light.tint,
            }}
          >
            View All
          </ThemedText>
          <Ionicons
            name="arrow-forward-outline"
            size={20}
            color={Colors.light.tint}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={data?.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ThemedView
            style={[
              styles.donorCard,
              {
                borderColor:
                  colorScheme === "dark"
                    ? Colors.dark.border
                    : Colors.light.border,
              },
            ]}
          >
            <ThemedView style={styles.imageContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 2,
                  flex: 1,
                  position: "relative",
                }}
              >
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
                  style={styles.image}
                />
                <View>
                  <ThemedText>{item?.fullName}</ThemedText>
                  <ThemedView>
                    <ThemedText style={{ fontSize: 12, color: "gray" }}>
                      Last Donation: {lastBloodDonation(item?.lastDonationTime)}{" "}
                      days ago
                    </ThemedText>
                  </ThemedView>
                </View>
              </View>
            </ThemedView>
            <ThemedText
              style={{
                fontSize: 18,
                fontWeight: "bold",
                padding: 5,
                borderRadius: 50,
                color: "white",
                backgroundColor: Colors.light.tint,
                position: "absolute",
                top: -10,
                right: 10,
              }}
            >
              {item?.bloodGroup}
            </ThemedText>
            <ThemedView style={styles.divider} />
            <ThemedView style={styles.info}>
              <ThemedText style={{ fontSize: 13 }}>
                Number of Donation: {item?.bloodDonationCount}
              </ThemedText>
              <ThemedText style={{ fontSize: 13 }}>
                Physical Complexity:{" "}
                {item.physicalComplexity === false ? "No" : "Yes"}
              </ThemedText>
              <ThemedText style={{ fontSize: 13 }}>
                Donation Status: {item?.bloodDonationStatus}
              </ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {token ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <ThemedText style={{ fontSize: 13 }}>
                      Contact: {item?.mobileNumber}
                    </ThemedText>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <ThemedText style={{ fontSize: 13 }}>
                      Contact:{" "}
                      {item?.mobileNumber
                        ? `${item?.mobileNumber.slice(0, 5)}${"x".repeat(6)}`
                        : ""}
                    </ThemedText>
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => handleCall(item?.mobileNumber)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    backgroundColor: Colors.light.tint,
                    padding: 5,
                    borderRadius: 3,
                  }}
                >
                  <Ionicons name="call-outline" size={16} color={"white"} />
                  <Text style={{ color: "white" }}>Call</Text>
                </TouchableOpacity>
              </View>
            </ThemedView>
          </ThemedView>
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </ThemedView>
  );
};

export default Volunteer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  donorContainer: {
    paddingBottom: 5,
  },
  donorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  bloodTypeButton: {
    padding: 5,
    paddingHorizontal: 20,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#f0c2c2",
    marginHorizontal: 5,
  },
  bloodTypeText: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.tint,
  },
  donorCard: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 10,
    margin: 10,
    padding: 10,
    width: 300,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: "gray",
    padding: 5,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.light.border,
    marginVertical: 10,
  },
  info: {
    justifyContent: "center",
    marginTop: 10,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
});
