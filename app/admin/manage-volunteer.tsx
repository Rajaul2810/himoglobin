import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiServices, { BACKEND_URL } from "@/utils/apiServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/utilsComponent/Loading";
import ErrorComponent from "@/components/utilsComponent/Error";
import { toast } from "sonner-native";
import { Stack, useRouter } from "expo-router";
const ManageVolunteer = () => {
  const colorScheme = useColorScheme();
  const [tab, setTab] = useState("unapproved");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const router = useRouter();
  // Dummy data - replace with actual volunteer data
  const volunteers = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "New York, USA",
      bloodGroup: "A+",
      profileImage: require("../../assets/images/user.jpg"),
      status: "pending",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "123-456-7890",
      address: "New York, USA",
      bloodGroup: "A+",
      profileImage: require("../../assets/images/user.jpg"),
      status: "pending",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "123-456-7890",
      address: "New York, USA",
      bloodGroup: "A+",
      profileImage: require("../../assets/images/user.jpg"),
      status: "pending",
    },
    {
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "123-456-7890",
      address: "New York, USA",
      bloodGroup: "A+",
      profileImage: require("../../assets/images/user.jpg"),
      status: "pending",
    },
    {
      name: "David Brown",
      email: "david@example.com",
      phone: "123-456-7890",
      address: "New York, USA",
      bloodGroup: "A+",
      profileImage: require("../../assets/images/user.jpg"),
      status: "pending",
    },
  ];

  const {
    getUnapprovedVolunteer,
    getApprovedVolunteer,
    approveVolunteer,
    disapproveVolunteer,
  } = apiServices;
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["unapprovedVolunteer"],
    queryFn: () => getUnapprovedVolunteer(pageNo, pageSize),
    refetchOnReconnect: true,
  });

  //console.log(data?.data);

  const {
    data: approvedVolunteer,
    isLoading: approvedVolunteerLoading,
    error: approvedVolunteerError,
    refetch: approvedVolunteerRefetch,
  } = useQuery({
    queryKey: ["approvedVolunteer"],
    queryFn: () => getApprovedVolunteer(pageNo, pageSize),
    refetchOnReconnect: true,
  });

  const { mutate: approveVolunteerMutation } = useMutation({
    mutationFn: (id: string) => approveVolunteer(id),
    onSuccess: (data) => {
      if (data?.data?.isSuccess) {
        toast.success("Volunteer approved successfully");
        refetch();
        approvedVolunteerRefetch();
      } else {
        toast.error("Volunteer approved failed");
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: disapproveVolunteerMutation } = useMutation({
    mutationFn: (id: string) => disapproveVolunteer(id),
    onSuccess: (data) => {
      if (data?.data?.isSuccess) {
        toast.success("Volunteer disapproved successfully");
        refetch();
        approvedVolunteerRefetch();
      } else {
        toast.error("Volunteer disapproved failed");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Volunteer disapproved failed");
    },
  });

  const handleApprove = (id: string) => {
    // Handle approve logic
    console.log("Approved volunteer:", id);
    if (id) {
      Alert.alert("Are you sure you want to approve this volunteer?", "", [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: () => approveVolunteerMutation(id) },
      ]);
    }
  };

  const handleDisapprove = (id: string) => {
    // Handle reject logic
    console.log("Rejected volunteer:", id);
    if (id) {
      Alert.alert("Are you sure you want to disapprove this volunteer?", "", [
        { text: "Cancel", style: "cancel" },
        { text: "Disapprove", onPress: () => disapproveVolunteerMutation(id) },
      ]);
    } else {
      console.log("No id found");
    }
  };

    return (
    <>
    <Stack.Screen options={{headerTitle: "Manage Leader"}} />
    <View style={{ flex: 1 }}>
      {/* <ThemedText style={styles.volunteerTitle}>Manage Volunteers</ThemedText> */}
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:
              tab === "unapproved" ? Colors.light.tint : "transparent",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => setTab("unapproved")}
        >
          <ThemedText
            style={{
              color: tab === "unapproved" ? "white" : "black",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Pending
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor:
              tab === "approved" ? Colors.light.tint : "transparent",
            padding: 10,
            borderRadius: 5,
          }}
          onPress={() => setTab("approved")}
        >
          <ThemedText
            style={{
              color: tab === "approved" ? "white" : "black",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            Approved
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
      {isLoading ? (
        <LoadingComponent />
      ) : error ? (
        <ErrorComponent error={error} refetch={refetch} />
      ) : (
        <FlatList
          data={tab === "unapproved" ? data?.data : approvedVolunteer?.data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ThemedView
              style={[
                styles.volunteerCard,
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
                  }}
                >
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
                    <ThemedText>{item?.fullName}</ThemedText>
                    <ThemedView
                      style={{ alignItems: "center", flexDirection: "row" }}
                    >
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={"gray"}
                      />
                      <ThemedText style={{ fontSize: 12, color: "gray" }}>
                        {item?.address}
                      </ThemedText>
                    </ThemedView>
                  </View>
                </View>
                <ThemedText
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    flex: 1,
                    textAlign: "right",
                    color: Colors.light.tint,
                  }}
                >
                  {item?.bloodGroup}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.info}>
                <ThemedText>{item?.mobileNumber}</ThemedText>
              </ThemedView>
              {tab === "unapproved" ? (
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "red",
                      backgroundColor: "#FFEAEB",
                      paddingHorizontal: 10,
                      paddingVertical: 1,
                      borderRadius: 10,
                    }}
                  >
                    Status: Pending
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.approveButton]}
                    onPress={() => handleApprove(item?.id)}
                  >
                    <ThemedText style={styles.buttonText}>Approve</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              ) : (
                <ThemedView
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      color: "green",
                      backgroundColor: "#E6FFE6",
                      paddingHorizontal: 10,
                      paddingVertical: 1,
                      borderRadius: 10,
                    }}
                  >
                    Status: Approved
                  </Text>
                  <TouchableOpacity
                    style={[styles.button, styles.disapproveButton]}
                    onPress={() => handleDisapprove(item?.id)}
                  >
                    <ThemedText style={styles.buttonText}>
                      Disapprove
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              )}
              <TouchableOpacity style={[styles.button, {backgroundColor: Colors.light.tint, marginTop: 10}]} onPress={() => router.push({pathname: "/user/[id]", params: {id: item?.id}})}> 
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </ThemedView>
          )}
          ListEmptyComponent={
            <ThemedText style={styles.emptyText}>
              No volunteers found
            </ThemedText>
          }
        />
      )}
      </View>
    </>
  );
};

export default ManageVolunteer;

const styles = StyleSheet.create({
  volunteerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    textAlign: "center",
  },
  volunteerCard: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  info: {
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  approveButton: {
    backgroundColor: "green",
  },
  disapproveButton: {
    backgroundColor: "#ff4444",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});
