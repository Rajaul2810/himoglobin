import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  Dimensions,
  useColorScheme,
  ScrollView,
  Alert,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { campaigns } from "@/constants/data";
import AdminCampaingCard from "@/components/Admin/AdminCampaingCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CustomModal from "@/components/utilsComponent/CustomModal";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { MultiSelect } from 'react-native-element-dropdown';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiServices from "@/utils/apiServices";
import LoadingComponent from "@/components/utilsComponent/Loading";
import { Stack } from "expo-router";

interface Campaign {
  id: number;
  Name: string;
  Description: string;
  Bannar: string;
  Address: string;
  InstitutionName: string;
  StartDate: string;
  EndDate: string;
  VolunteerList: { id: string; name: string; code: string }[];
}

const ManageCampaing = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [Name, setName] = useState("");
  const [Description, setDescription] = useState("");
  const [Bannar, setBannar] = useState<any>(null);
  const [BannerUrl, setBannerUrl] = useState("");
  const [Address, setAddress] = useState("");
  const [Institution, setInstitution] = useState("");
  const [StartDate, setStartDate] = useState(new Date());
  const [EndDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedVolunteers, setSelectedVolunteers] = useState<{ label: string; value: string }[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const colorTheme = useColorScheme();
  const queryClient = useQueryClient();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setBannar({
           uri: result.assets[0].uri,
           name: result.assets[0].fileName,
           type: result.assets[0].type
      });
      setBannerUrl(result.assets[0].uri);
    }
  };

  const { data: campaignsData, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['campaigns', pageNo, pageSize],
    queryFn: () => apiServices.getAllCampaign(pageNo, pageSize),
  });

  //console.log('campaignsData',campaignsData)

  const { data: volunteers, isLoading: isLoadingVolunteers } = useQuery({
    queryKey: ['volunteers', pageNo, pageSize],
    queryFn: () => apiServices.getApprovedVolunteer(pageNo, pageSize),
    refetchOnReconnect: true,
  });
  

  const { mutate: createCampaign, isPending: isCreating } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append('Name', Name);
      formData.append('Description', Description);
      if (Bannar) {
        formData.append('Bannar', Bannar);
      }
      formData.append('Address', Address);
      formData.append('InstitutionName', Institution);
      formData.append('VolunteerList', selectedVolunteers.map(volunteer => volunteer.value).join(','));
      formData.append('StartDate', StartDate.toISOString());
      formData.append('EndDate', EndDate.toISOString());
      return apiServices.createCampaign(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      resetForm();
      setIsModalVisible(false);
      Alert.alert("Success", "Campaign created successfully");
      console.log('data',data);
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", "Failed to create campaign");
    }
  });

  const { mutate: updateCampaign, isPending: isUpdating } = useMutation({
    mutationFn: () => {
      if (!selectedCampaign) return Promise.reject("No campaign selected");
      
      const formData = new FormData();
      formData.append('Id', selectedCampaign.id.toString());
      formData.append('Name', Name);
      formData.append('Description', Description);
      if (Bannar) {
        formData.append('Bannar', Bannar);
      }
      formData.append('Address', Address);
      formData.append('InstitutionName', Institution);
      formData.append('VolunteerList', selectedVolunteers.map(volunteer => volunteer.value).join(','));
      formData.append('StartDate', StartDate.toISOString());
      formData.append('EndDate', EndDate.toISOString());
      return apiServices.updateCampaign(selectedCampaign.id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      resetForm();
      setIsModalVisible(false);
      Alert.alert("Success", "Campaign updated successfully");
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", "Failed to update campaign");
    }
  });

  const { mutate: deleteCampaign, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => {
      return apiServices.deleteCampaign(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsDeleteModalVisible(false);
      setCampaignToDelete(null);
      Alert.alert("Success", "Campaign deleted successfully");
    },
    onError: (error) => {
      console.log(error);
      Alert.alert("Error", "Failed to delete campaign");
    }
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setBannar(null);
    setBannerUrl("");
    setAddress("");
    setInstitution("");
    setStartDate(new Date());
    setEndDate(new Date());
    setSelectedVolunteers([]);
    setIsEditMode(false);
    setSelectedCampaign(null);
  };

  const handleEditCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsEditMode(true);
    setName(campaign.Name);
    setDescription(campaign.Description);
    setBannar(campaign.Bannar);
    setBannerUrl(campaign.Bannar); // Set the banner URL for display
    setAddress(campaign.Address);
    setInstitution(campaign.InstitutionName);
    setStartDate(new Date(campaign.StartDate));
    setEndDate(new Date(campaign.EndDate));
    
    // Set selected volunteers
    if (campaign.VolunteerList && volunteers) {
      const selectedVols = campaign.VolunteerList.map((vol: any) => {
        return {
          label: vol.name + " (" + vol.code + ")",
          value: vol.id
        };
      });
      setSelectedVolunteers(selectedVols);
    }
    
    setIsModalVisible(true);
  };

  const handleDeleteCampaign = (id: number) => {
    setCampaignToDelete(id);
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = () => {
    if (campaignToDelete !== null) {
      deleteCampaign(campaignToDelete);
    }
  };

  const handleLoadMore = () => {
    if (campaignsData?.data.length === pageSize) {
      setPageNo(pageNo + 1);
    }
  };

  if (isLoadingCampaigns || isLoadingVolunteers) {
    return <LoadingComponent />;
  }

  // Prepare volunteer data for dropdown
  const volunteerOptions = volunteers?.data || [];

  return (
    <>
    <Stack.Screen options={{headerTitle: "Manage Campaign"}} />
    <View style={{ flex: 1 }}>
      <ThemedView style={styles.header}>
        <View style={styles.headerLeft}>
          <ThemedText type="subtitle" style={styles.headerTitle}>
            Manage Campaign
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => {
            resetForm();
            setIsModalVisible(true);
          }}
          style={styles.addButton}
        >
          <MaterialIcons name="add" size={20} color="white" />
          <ThemedText style={styles.addButtonText}>Add Campaign</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <FlatList
        data={campaignsData?.data}
        renderItem={({ item }) => (
          <AdminCampaingCard 
            item={item} 
            onEdit={() => handleEditCampaign(item)} 
            onDelete={() => handleDeleteCampaign(item.id)} 
          />
          
        )}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <ThemedView style={styles.emptyContainer}>
            <MaterialIcons
              name="campaign"
              size={48}
              color={Colors.light.tint}
            />
            <ThemedText style={styles.emptyText}>No campaigns found</ThemedText>
          </ThemedView>
        }
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {/* Add/Edit Campaign Modal */}
      <CustomModal
        isVisible={isModalVisible}
        onClose={() => {
          resetForm();
          setIsModalVisible(false);
        }}
        title={isEditMode ? "Edit Campaign" : "Add Campaign"}
        height={Dimensions.get("window").height * 0.8}
      >
        <ScrollView>
          <ThemedView style={styles.modalContent}>
            <ThemedText>Title</ThemedText>
            <TextInput
              style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
              value={Name}
              onChangeText={setName}
              placeholder="Enter campaign title"
              placeholderTextColor={colorTheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
            />

            <ThemedText>Description</ThemedText>
            <TextInput
              style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text, minHeight: 60}]}
              value={Description}
              onChangeText={setDescription}
              placeholder="Enter campaign description"
              placeholderTextColor={colorTheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
              multiline
              numberOfLines={3}
            />

            <ThemedText>Image</ThemedText>
            {BannerUrl ? (
              <View style={styles.selectedImageContainer}>
                <Image 
                  source={{ uri: BannerUrl }} 
                  style={styles.imagePreview} 
                  resizeMode="cover"
                />
                <View style={styles.selectedFileContainer}>
                  <ThemedText numberOfLines={1} style={styles.selectedFileName}>
                    Selected Image
                  </ThemedText>
                  <TouchableOpacity onPress={() => {setBannerUrl(""); setBannar(null);}}>
                    <MaterialIcons name="close" size={20} color={Colors.light.tint} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
                <MaterialIcons name="add-photo-alternate" size={24} color={Colors.light.tint} />
                <ThemedText style={styles.filePickerText}>Choose Image</ThemedText>
              </TouchableOpacity>
            )}

            <ThemedText>Address</ThemedText>
            <TextInput
              style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
              value={Address}
              onChangeText={setAddress}
              placeholder="Enter address"
              placeholderTextColor={colorTheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
            />

            <ThemedText>Institution Name</ThemedText>
            <TextInput
              style={[styles.input, {color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text}]}
              value={Institution}
              onChangeText={setInstitution}
              placeholder="Enter institution name"
              placeholderTextColor={colorTheme === 'dark' ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault}
            />

            <ThemedText>Assign Volunteers</ThemedText>
            <MultiSelect
              style={styles.dropdown}
              data={volunteerOptions}
              labelField="fullName"
              valueField="id"
              search
              searchPlaceholder="Search volunteers"
              placeholder="Select volunteers"
              value={selectedVolunteers.map(volunteer => volunteer.value)}
              onChange={item => {
                const selectedItems = item.map(value => {
                  const found = volunteerOptions.find((volunteer: any) => volunteer.id === value);
                  return found ? { label: found.fullName + " (" + found.code + ")", value: found.id } : { label: '', value: '' };
                });
                setSelectedVolunteers(selectedItems);
              }}
              selectedTextStyle={{
                color: colorTheme === 'dark' ? Colors.dark.text : Colors.light.text
              }}
              renderItem={(item) => (
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>
                    {item.fullName} ({item.code})
                  </Text>
                </View>
              )}
            />

            <View style={styles.dateContainer}>
              <View style={styles.dateWrapper}>
                <ThemedText>Start Date</ThemedText>
                <TouchableOpacity
                  style={styles.filePicker}
                  onPress={() => setShowStartPicker(true)}
                >
                  <MaterialIcons name="event" size={24} color={Colors.light.tint} />
                  <ThemedText>{StartDate.toLocaleDateString()}</ThemedText>
                </TouchableOpacity>
              </View>

              <View style={styles.dateWrapper}>
                <ThemedText>End Date</ThemedText>
                <TouchableOpacity
                  style={styles.filePicker}
                  onPress={() => setShowEndPicker(true)}
                >
                  <MaterialIcons name="event" size={24} color={Colors.light.tint} />
                  <ThemedText>{EndDate.toLocaleDateString()}</ThemedText>
                </TouchableOpacity>
              </View>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={StartDate}
                mode="date"
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (date) setStartDate(date);
                }}
              />
            )}

            {showEndPicker && (
              <DateTimePicker
                value={EndDate}
                mode="date"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}
          </ThemedView>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.modalButton, 
            (!Name || !Description) && styles.modalButtonDisabled,
            (isCreating || isUpdating) && styles.modalButtonDisabled
          ]}
          disabled={!Name || !Description || isCreating || isUpdating}
          onPress={() => {
            if (isEditMode) {
              updateCampaign();
            } else {
              createCampaign();
            }
          }}
        >
          <ThemedText style={styles.modalButtonText}>
            {isCreating || isUpdating ? "Processing..." : isEditMode ? "Update Campaign" : "Add Campaign"}
          </ThemedText>
        </TouchableOpacity>
      </CustomModal>

      {/* Delete Confirmation Modal */}
      <CustomModal
        isVisible={isDeleteModalVisible}
        onClose={() => {
          setIsDeleteModalVisible(false);
          setCampaignToDelete(null);
        }}
        title="Confirm Delete"
        height={200}
      >
        <ThemedView style={styles.deleteModalContent}>
          <ThemedText style={styles.deleteModalText}>
            Are you sure you want to delete this campaign?
          </ThemedText>
          <View style={styles.deleteModalButtons}>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.cancelButton]}
              onPress={() => {
                setIsDeleteModalVisible(false);
                setCampaignToDelete(null);
              }}
              disabled={isDeleting}
            >
              <ThemedText style={styles.deleteModalButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.deleteModalButton, styles.confirmButton, isDeleting && styles.modalButtonDisabled]}
              onPress={confirmDelete}
              disabled={isDeleting}
            >
              <ThemedText style={styles.deleteModalButtonText}>
                {isDeleting ? "Deleting..." : "Delete"}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </CustomModal>
    </View>
    </>
  );
};

export default ManageCampaing;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    marginLeft: 5,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  listContainer: {
    padding: 15,
    gap: 15,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
    gap: 10,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
  },
  modalContent: {
    padding: 15,
    gap: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  selectedImageContainer: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  selectedFileName: {
    flex: 1,
    marginRight: 10,
  },
  filePicker: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  filePickerText: {
    color: Colors.light.tint,
  },
  dateContainer: {
    flexDirection: "row",
    gap: 15,
  },
  dateWrapper: {
    flex: 1,
    gap: 5,
  },
  modalButton: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 6,
    padding: 10,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  dropdownItemText: {
    fontSize: 14,
  },
  deleteModalContent: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteModalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  deleteModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: 10,
  },
  deleteModalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
  },
  confirmButton: {
    backgroundColor: "red",
  },
  deleteModalButtonText: {
    color: "white",
    fontWeight: "600",
  }
});
