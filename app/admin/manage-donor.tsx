// Start of Selection
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  useColorScheme,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";
import { useMutation, useQuery } from "@tanstack/react-query";
import apiServices from "@/utils/apiServices";
import UserCard from "@/components/User/UserCard";
import { Stack } from "expo-router";

const bloodGroups = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
];

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const ManageDonor = () => {
  const colorScheme = useColorScheme();
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState({label: '', value: ''});
  const [selectedUpazila, setSelectedUpazila] = useState({label: '', value: ''});
  const [selectedUnion, setSelectedUnion] = useState({label: '', value: ''});
  const [selectedGender, setSelectedGender] = useState({label: '', value: ''});
  const [startAge, setStartAge] = useState("");
  const [endAge, setEndAge] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isBloodGroupFocus, setIsBloodGroupFocus] = useState(false);
  const [isUpazilaFocus, setIsUpazilaFocus] = useState(false);
  const [isUnionFocus, setIsUnionFocus] = useState(false);
  const [isGenderFocus, setIsGenderFocus] = useState(false);
  const [upazilaOptions, setUpazilaOptions] = useState([]);
  const [unionOptions, setUnionOptions] = useState([]);
  const [donors, setDonors] = useState<any[]>([]);
  const [isEndReached, setIsEndReached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upazilaId, setUpazilaId] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [userType, setUserType] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  const filters = {
    bloodGroup: selectedBloodGroup?.value ? selectedBloodGroup.value : null,
    upazila: selectedUpazila?.value ? selectedUpazila.value : null,
    union: selectedUnion?.value ? selectedUnion.value : null,
    gender: selectedGender?.value ? selectedGender.value : null,
    startAge: startAge ? parseInt(startAge) : null,
    endAge: endAge ? parseInt(endAge) : null,
    isApproved: isApproved,
    userType: userType ? userType : null,
  }

  // Query to fetch donors based on filters and approval status
  const { mutate: fetchDonors, isPending: isDonorsLoading } = useMutation({
    mutationFn: () => {
      if (activeTab === 'approved') {
        return apiServices.getApprovedDonor({pageNo, pageSize, ...filters});
      } else {
        return apiServices.getUnapprovedDonor({pageNo, pageSize, ...filters});
      }
    },
    onSuccess: (data) => {
      if (pageNo === 1) {
        setDonors(data?.data || []);
      } else {
        setDonors(prevDonors => [...prevDonors, ...(data?.data || [])]);
      }
      setIsEndReached((data?.data?.length || 0) < pageSize);
      setIsLoading(false);
    },
    onError: (error) => {
      console.log('error', error);
      setIsLoading(false);
    }
  });

  // Effect to fetch donors when filters or pagination changes
  useEffect(() => {
    fetchDonors();
  }, [pageNo, selectedBloodGroup, selectedUpazila, selectedUnion, selectedGender, startAge, endAge, activeTab]);

  // Query to fetch location data for dropdowns
  const { data: locationData, isLoading: isLocationLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: () => apiServices.getLocationByParentId(1), // Assuming 1 is the parent ID for upazilas
  });

  useEffect(() => {
    if(locationData?.data?.length > 0){
      const upazilasData = locationData.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      setUpazilaOptions(upazilasData);
    }
  }, [locationData]);

  const {data: unionData, isLoading: isUnionLoading} = useQuery({
    queryKey: ['union', upazilaId],
    queryFn: () => {
      if (upazilaId) {
        return apiServices.getLocationByParentId(upazilaId)
      }
      return null
    },
    enabled: !!upazilaId
  });

  useEffect(() => {
    if(unionData?.data?.length > 0){
      const unionsData = unionData.data.map((item: any) => ({
        label: item.name,
        value: item.id
      }));
      setUnionOptions(unionsData);
    } else {
      setUnionOptions([]);
      setSelectedUnion({label: '', value: ''});
    }
  }, [unionData]);

  const handleLoadMore = useCallback(() => {
    if (!isEndReached && !isLoading && !isDonorsLoading) {
      setIsLoading(true);
      setPageNo(prev => prev + 1);
    }
  }, [isEndReached, isLoading, isDonorsLoading]);

  const handleApplyFilter = useCallback(() => {
    setPageNo(1);
    setFilterModalVisible(false);
    fetchDonors();
  }, [selectedBloodGroup, selectedUpazila, selectedUnion, selectedGender, startAge, endAge]);

  const resetFilters = useCallback(() => {
    setSelectedBloodGroup({label: '', value: ''});
    setSelectedUpazila({label: '', value: ''});
    setSelectedUnion({label: '', value: ''});
    setSelectedGender({label: '', value: ''});
    setStartAge("");
    setEndAge("");
    setPageNo(1);
    setUpazilaId(null);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsApproved(tab === 'approved');
    setPageNo(1);
    setDonors([]);
  };

  return (
      <>
    <Stack.Screen options={{headerTitle: "Manage Donor"}} />
    <View style={{ flex: 1 }}>
      {/* Status Tab Buttons */}
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'pending' && styles.activeTabButton,
            { backgroundColor: activeTab === 'pending' ? 
              (colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint) : 
              (colorScheme === "dark" ? Colors.dark.background : Colors.light.background) }
          ]}
          onPress={() => handleTabChange('pending')}
        >
          <ThemedText 
            style={[
              styles.tabButtonText, 
              activeTab === 'pending' && { color: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
            ]}
          >
            Pending
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'approved' && styles.activeTabButton,
            { backgroundColor: activeTab === 'approved' ? 
              (colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint) : 
              (colorScheme === "dark" ? Colors.dark.background : Colors.light.background) }
          ]}
          onPress={() => handleTabChange('approved')}
        >
          <ThemedText 
            style={[
              styles.tabButtonText, 
              activeTab === 'approved' && { color: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
            ]}
          >
            Approved
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.filterContainer}>
        <View style={styles.bloodGroupContainer}>
          <Dropdown
            style={[
              styles.dropdown, 
              isBloodGroupFocus && { borderColor: Colors[colorScheme === "dark" ? "dark" : "light"].tint },
              { backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
            ]}
            placeholderStyle={[styles.placeholderStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
            selectedTextStyle={[styles.selectedTextStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
            inputSearchStyle={[styles.inputSearchStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
            iconStyle={styles.iconStyle}
            data={bloodGroups}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Blood Group"
            searchPlaceholder="Search..."
            value={selectedBloodGroup.value}
            onFocus={() => setIsBloodGroupFocus(true)}
            onBlur={() => setIsBloodGroupFocus(false)}
            onChange={(item) => {
              setSelectedBloodGroup(item);
              setIsBloodGroupFocus(false);
              setPageNo(1);
            }}
            renderLeftIcon={() => (
              <Ionicons
                name="water"
                size={20}
                color={isBloodGroupFocus ? Colors[colorScheme === "dark" ? "dark" : "light"].tint : (colorScheme === "dark" ? Colors.dark.text : Colors.light.text)}
                style={styles.icon}
              />
            )}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            { backgroundColor: colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint }
          ]} 
          onPress={() => setFilterModalVisible(true)}
        >
          <Feather name="filter" size={24} color={colorScheme === "dark" ? Colors.dark.background : Colors.light.background} />
        </TouchableOpacity>
      </ThemedView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Advanced Filters</ThemedText>
            
            <ScrollView style={styles.filterScrollView}>
              <ThemedText style={styles.filterLabel}>Blood Group</ThemedText>
              <Dropdown
                style={[
                  styles.filterDropdown, 
                  isBloodGroupFocus && { borderColor: Colors[colorScheme === "dark" ? "dark" : "light"].tint },
                  { backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
                ]}
                placeholderStyle={[styles.placeholderStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                selectedTextStyle={[styles.selectedTextStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                inputSearchStyle={[styles.inputSearchStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                iconStyle={styles.iconStyle}
                data={bloodGroups}
                search
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Blood Group"
                searchPlaceholder="Search..."
                value={selectedBloodGroup.value}
                onFocus={() => setIsBloodGroupFocus(true)}
                onBlur={() => setIsBloodGroupFocus(false)}
                onChange={(item) => {
                  setSelectedBloodGroup(item);
                  setIsBloodGroupFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    name="water"
                    size={20}
                    color={isBloodGroupFocus ? Colors[colorScheme === "dark" ? "dark" : "light"].tint : (colorScheme === "dark" ? Colors.dark.text : Colors.light.text)}
                    style={styles.icon}
                  />
                )}
              />

              <ThemedText style={styles.filterLabel}>Upazila</ThemedText>
              {isLocationLoading ? (
                <ActivityIndicator size="small" color={Colors[colorScheme === "dark" ? "dark" : "light"].tint} />
              ) : (
                <Dropdown
                  style={[
                    styles.filterDropdown, 
                    isUpazilaFocus && { borderColor: Colors[colorScheme === "dark" ? "dark" : "light"].tint },
                    { backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
                  ]}
                  placeholderStyle={[styles.placeholderStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  selectedTextStyle={[styles.selectedTextStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  inputSearchStyle={[styles.inputSearchStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  data={upazilaOptions || []}
                  search
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Upazila"
                  searchPlaceholder="Search..."
                  value={selectedUpazila.value}
                  onFocus={() => setIsUpazilaFocus(true)}
                  onBlur={() => setIsUpazilaFocus(false)}
                  onChange={(item) => {
                    setSelectedUpazila(item);
                    setUpazilaId(item?.value);
                    setIsUpazilaFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <MaterialIcons
                      name="location-city"
                      size={20}
                      color={isUpazilaFocus ? Colors[colorScheme === "dark" ? "dark" : "light"].tint : (colorScheme === "dark" ? Colors.dark.text : Colors.light.text)}
                      style={styles.icon}
                    />
                  )}
                />
              )}

              <ThemedText style={styles.filterLabel}>Union</ThemedText>
              {isUnionLoading ? (
                <ActivityIndicator size="small" color={Colors[colorScheme === "dark" ? "dark" : "light"].tint} />
              ) : (
                <Dropdown
                  style={[
                    styles.filterDropdown, 
                    isUnionFocus && { borderColor: Colors[colorScheme === "dark" ? "dark" : "light"].tint },
                    { backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
                  ]}
                  placeholderStyle={[styles.placeholderStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  selectedTextStyle={[styles.selectedTextStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  inputSearchStyle={[styles.inputSearchStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                  data={unionOptions || []}
                  search
                  maxHeight={200}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Union"
                  searchPlaceholder="Search..."
                  value={selectedUnion.value}
                  onFocus={() => setIsUnionFocus(true)}
                  onBlur={() => setIsUnionFocus(false)}
                  onChange={(item) => {
                    setSelectedUnion(item);
                    setIsUnionFocus(false);
                  }}
                  renderLeftIcon={() => (
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color={isUnionFocus ? Colors[colorScheme === "dark" ? "dark" : "light"].tint : (colorScheme === "dark" ? Colors.dark.text : Colors.light.text)}
                      style={styles.icon}
                    />
                  )}
                  disable={!upazilaId}
                />
              )}

              <ThemedText style={styles.filterLabel}>Gender</ThemedText>
              <Dropdown
                style={[
                  styles.filterDropdown, 
                  isGenderFocus && { borderColor: Colors[colorScheme === "dark" ? "dark" : "light"].tint },
                  { backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background }
                ]}
                placeholderStyle={[styles.placeholderStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                selectedTextStyle={[styles.selectedTextStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                inputSearchStyle={[styles.inputSearchStyle, { color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text }]}
                data={genderOptions}
                maxHeight={200}
                labelField="label"
                valueField="value"
                placeholder="Select Gender"
                value={selectedGender.value}
                onFocus={() => setIsGenderFocus(true)}
                onBlur={() => setIsGenderFocus(false)}
                onChange={(item) => {
                  setSelectedGender(item);
                  setIsGenderFocus(false);
                }}
                renderLeftIcon={() => (
                  <Ionicons
                    name="people-outline"
                    size={20}
                    color={isGenderFocus ? Colors[colorScheme === "dark" ? "dark" : "light"].tint : (colorScheme === "dark" ? Colors.dark.text : Colors.light.text)}
                    style={styles.icon}
                  />
                )}
              />

              <ThemedText style={styles.filterLabel}>Age Range</ThemedText>
              <View style={styles.ageRangeContainer}>
                <TextInput
                  style={[
                    styles.ageInput,
                    { 
                      borderColor: colorScheme === "dark" ? Colors.dark.border : Colors.light.border,
                      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                      backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background
                    }
                  ]}
                  placeholder="Min"
                  placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                  keyboardType="numeric"
                  value={startAge}
                  onChangeText={setStartAge}
                />
                <ThemedText style={{ marginHorizontal: 10 }}>to</ThemedText>
                <TextInput
                  style={[
                    styles.ageInput,
                    { 
                      borderColor: colorScheme === "dark" ? Colors.dark.border : Colors.light.border,
                      color: colorScheme === "dark" ? Colors.dark.text : Colors.light.text,
                      backgroundColor: colorScheme === "dark" ? Colors.dark.background : Colors.light.background
                    }
                  ]}
                  placeholder="Max"
                  placeholderTextColor={colorScheme === "dark" ? "#666" : "#999"}
                  keyboardType="numeric"
                  value={endAge}
                  onChangeText={setEndAge}
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.resetButton]} 
                onPress={resetFilters}
              >
                <ThemedText style={styles.buttonText}>Reset</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.applyButton,
                  { backgroundColor: colorScheme === "dark" ? Colors.dark.tint : Colors.light.tint }
                ]} 
                onPress={handleApplyFilter}
              >
                <Text style={[styles.buttonText]}>Apply</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>

      {/* Donors List */}
      <View style={styles.donorContainer}>
        {isDonorsLoading && pageNo === 1 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme === "dark" ? "dark" : "light"].tint} />
            <ThemedText style={styles.loadingText}>Loading donors...</ThemedText>
          </View>
        ) : (
          <FlatList
            data={donors || []}
            keyExtractor={(item: any, index: any) => (item?.id?.toString() || `donor-${index}`)}
            renderItem={({ item }) => (
              <UserCard user={item} />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
            ListFooterComponent={
              isLoading ? (
                <View style={styles.footerLoading}>
                  <ActivityIndicator size="small" color={Colors[colorScheme === "dark" ? "dark" : "light"].tint} />
                  <ThemedText style={{ textAlign: "center", padding: 10 }}>
                    Loading more donors...
                  </ThemedText>
                </View>
              ) : isEndReached && donors.length > 0 ? (
                <ThemedText style={{ textAlign: "center", padding: 10 }}>
                  No more donors to load
                </ThemedText>
              ) : null
            }
            ListEmptyComponent={
              !isDonorsLoading ? (
                <ThemedView style={styles.emptyContainer}>
                  <Ionicons
                    name="people-outline"
                    size={50}
                    color={colorScheme === "dark" ? Colors.dark.text : Colors.light.text}
                  />
                  <ThemedText style={styles.emptyText}>
                    No donors found with the selected filters
                  </ThemedText>
                </ThemedView>
              ) : null
            }
          />
        )}
      </View>
    </View>
    </>
  );
};

export default ManageDonor;

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 8,
    overflow: "hidden",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  activeTabButton: {
    borderColor: "transparent",
  },
  tabButtonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  bloodGroupContainer: {
    flex: 1,
    marginRight: 10,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.tint,
  },
  donorContainer: {
    flex: 1,
    paddingBottom: 5,
  },
  donorCard: {
    borderWidth: 1,
    borderRadius: 10,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  info: {
    marginTop: 5,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  filterScrollView: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },
  filterDropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  ageRangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  ageInput: {
    flex: 1,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  resetButton: {
    borderWidth: 1,
    borderColor: "#ccc",
  },
  applyButton: {
    backgroundColor: Colors.light.tint,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  loadingText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  footerLoading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
