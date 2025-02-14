import React, { useState, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,Image,Button,StyleSheet,ScrollView,Dimensions,Platform,ActivityIndicator,} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { RadioButton } from "react-native-paper";
import { Checkbox } from "react-native-paper";
import apiManager from "../ApiManager";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";

const { width } = Dimensions.get("window");

const router = useRouter;

// Options for dropdowns
const constructionStatusOptions = [
  { label: "Completed", value: "Completed" },
  { label: "Under Construction", value: "Under Construction" },
];

const furnishingStatusOptions = [
  { label: "Unfurnished", value: "Unfurnished" },
  { label: "Semi-furnished", value: "Semi Furnished" },
  { label: "Fully-furnished", value: "Fully Furnished" },
];

// Dynamic options for Bedroom and Bathroom
const BEDROOM_OPTIONS = Array.from({ length: 10 }, (_, i) => ({
  item: (i + 1).toString(),
  id: (i + 1).toString(),
}));

const bathroomOptions = Array.from({ length: 10 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));

const PropertyArea = [
  { label: "Sq. Ft.", value: "Sq. Ft." },
  { label: "Sq. Yrd.", value: "Sq. Yrd." },
  { label: "Sq. Mtr.", value: "Sq. Mtr." },
  { label: "Acre", value: "Acre" },
  { label: "Hectare", value: "Hectare" },
];

const amenitiesOptions = [
  { label: "Security", value: "Security" },
  { label: "Reserved Parking", value: "Reserved Parking" },
  { label: "Visitor Parking", value: "Visitor Parking" },
  { label: "Lift", value: "Lift" },
  { label: "Gymnasium", value: "Gymnasium" },
  { label: "Power Back Up", value: "Power Back Up" },
  { label: "RO Water System", value: "RO Water System" },
  { label: "Fire Fighting Equipment", value: "Fire Fighting Equipment" },
  { label: "Vaastu Compliant", value: "Vaastu Compliant" },
  { label: "Intercom", value: "Intercom" },
  { label: "Club House", value: "Club House" },
  { label: "Rain Water Harvesting", value: "Rain Water Harvesting" },
  { label: "Swimming Pool", value: "Swimming Pool" },
  { label: "Park", value: "Park" },
  { label: "Pipe Gas", value: "Pipe Gas" },
  { label: "24 Hours Water Supply", value: "24 Hours Water Supply" },
  { label: "Banquet Hall", value: "Banquet Hall" },
  { label: "CCTV", value: "CCTV" },
];

export default function AddProperty() {
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const [selectedPropertyArea, setSelectedPropertyArea] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState("free");
  const [images, setImages] = useState([null, null, null, null]);
  const [unitimages, setUnitImages] = useState([null, null, null]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [bedroomValue, setBedroomValue] = useState([]);
  const [bathroomValue, setBathroomValue] = useState("");
  const [constructionStatus, setConstructionStatus] = useState("");
  const [furnishingStatus, setFurnishingStatus] = useState("");
  const propData = useLocalSearchParams();
  const parsePropdData = propData.propItem
    ? JSON.parse(propData.propItem)
    : null;

  //console.warn("parsePropdData",parsePropdData.PropertyType);

  const [userDetail, setUserDetail] = useState({});
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetailString = await AsyncStorage.getItem("userToken");
        if (userDetailString) {
          const user = JSON.parse(userDetailString);
          setUserDetail(user); // Set user details in the state
          setFormData((prevData) => ({
            ...prevData,
            PostUser: user.nid,
            PostBy: user.nid,
          }));
        }
      } catch (error) {
        console.error(
          "Failed to retrieve user details from AsyncStorage:",
          error
        );
      }
    };

    fetchUserDetails();
  }, []);

  const [dropdownValues, setDropdownValues] = useState({
    Configration_Badrooms: "",
    NoOfBathrooms: "",
    ConstrationStatus: "",
    FurnishingStatus: "",
  });
//console.warn('dd',parsePropdData.PropertyType);

  useEffect(() => {
    if (parsePropdData && userDetail) {
      // Set individual dropdown states
      const bedroomData = parsePropdData.Configration_Badrooms
        ? parsePropdData.Configration_Badrooms.split(", ").map((bedroom) => ({
            id: bedroom, 
            value: bedroom, 
          }))
        : [];

      // Set individual dropdown states
      setBedroomValue(bedroomData);
      setBathroomValue(parsePropdData.NoOfBathrooms);
      setConstructionStatus(parsePropdData.ConstrationStatus);
      setFurnishingStatus(parsePropdData.FurnishingStatus);

      // Set dropdown values for other inputs
      setDropdownValues({
        Configration_Badrooms: bedroomData,
        NoOfBathrooms: parsePropdData.NoOfBathrooms,
        ConstrationStatus: parsePropdData.ConstrationStatus,
        FurnishingStatus: parsePropdData.FurnishingStatus,
      });

      // Initialize other fields
      setSelectedUserType(parsePropdData.PostingPropertyfor);
      setSelectedPropertyType(parsePropdData.Property);
      setSelectedProperty(parsePropdData.PropertyType);
      setSelectedAmenities(parsePropdData.Amenities);
      switch (parsePropdData.Property) {
        case "Residentail":
          setPropertyTypes(residentialTypes);
          break;
        case "Commercial":
          setPropertyTypes(commercialTypes);
          break;
        case "Rental":
          setPropertyTypes(rentalTypes);
          break;
        default:
          setPropertyTypes([]);
      }
      // Set form data
      setFormData({
        ...formData,
        PropertyTitle: parsePropdData.PropertyTitle,
        Property: parsePropdData.Property,
        PostingPropertyfor: parsePropdData.PostingPropertyfor,
        PropertyType: parsePropdData.PropertyType,
        Locality: parsePropdData.Locality,
        ProjectName: parsePropdData.ProjectName,
        EmailAddress: parsePropdData.PropertyAddress,
        LandmarkNear: parsePropdData.LandmarkNear,
        Configration_Badrooms: 1,
        NoOfBathrooms: parsePropdData.NoOfBathrooms,
        ConstrationStatus: parsePropdData.ConstrationStatus,
        FurnishingStatus: parsePropdData.FurnishingStatus,
        PropertyArea: parsePropdData?.PropertyArea,
        CarpetArea: parsePropdData.CarpetArea,
        BuildupArea: parsePropdData.BuildupArea,
        Description: parsePropdData.Description,
        SalePrice: parsePropdData.SalePrice,
        Amenities: parsePropdData.Amenities,
        AddPostPackage: parsePropdData.AddPostPackage,
        ImgSrc: parsePropdData.ImgSrc,
        PostUser: userDetail.nid,
        PostBy: userDetail.nid,
        Imgsrc1: parsePropdData.Imgsrc1,
        Imgsrc2: parsePropdData.Imgsrc2,
        Imgsrc3: parsePropdData.Imgsrc3,
        ProjectHighlights: parsePropdData.ProjectHighlights,
        UnitText1: parsePropdData.UnitText1,
        UnitImg1: parsePropdData.UnitImg1,
        UnitText2: parsePropdData.UnitText2,
        UnitImg2: parsePropdData.UnitImg2,
        UnitText3: parsePropdData.UnitText3,
        UnitImg3: parsePropdData.UnitImg3,
        UnitPrice1: parsePropdData.UnitPrice1,
        UnitPrice2: parsePropdData.UnitPrice2,
        UnitPrice3: parsePropdData.UnitPrice3,
        VideoUrl: parsePropdData.VideoUrl,
      });
    }
  }, []);

  const residentialTypes = [
    { label: "Apartment", value: "1" },
    { label: "Villa / Individual House", value: "2" },
    { label: "Builder Floor", value: "3" },
    { label: "Studio Apartment", value: "4" },
    { label: "Residential Plot", value: "5" },
    { label: "Row House", value: "6" },
    { label: "Farm House", value: "7" },
    { label: "Penthouse Apartment", value: "8" },
  ];

  const commercialTypes = [
    { label: "Office Space", value: "9" },
    { label: "Hotel/Resort", value: "10" },
    { label: "Showroom", value: "11" },
    { label: "Industrial Land", value: "12" },
    { label: "Agricultural Land", value: "13" },
    { label: "Commercial Land", value: "14" },
    { label: "Warehouse", value: "15" },
    { label: "Shop", value: "16" },
  ];

  const rentalTypes = [
    { label: "Farmhouse", value: "17" },
    { label: "Villa", value: "18" },
    { label: "Cottage", value: "19" },
    { label: "Builder Floor", value: "20" },
  ];

  const [formData, setFormData] = useState({
    nid: "0",
    PropertyTitle: "",
    Property: "",
    PostingPropertyfor: "",
    PropertyType: "",
    Locality: "",
    ProjectName: "",
    EmailAddress: "",
    LandmarkNear: "",
    Configration_Badrooms: "",
    NoOfBathrooms: "",
    ConstrationStatus: "",
    FurnishingStatus: "",
    PropertyArea: "",
    CarpetArea: "",
    BuildupArea: "",
    Description: "",
    SalePrice: "",
    Amenities: "",
    AddPostPackage: "",
    ImgSrc: "",
    PostUser: userDetail.nid,
    PostBy: userDetail.nid,
    Imgsrc1: "",
    Imgsrc2: "",
    Imgsrc3: "",
    ProjectHighlights: "",
    UnitText1: "",
    UnitImg1: "",
    UnitText2: "",
    UnitImg2: "",
    UnitText3: "",
    UnitImg3: "",
    UnitPrice1: "",
    UnitPrice2: "",
    UnitPrice3: "",
    VideoUrl: "",
  });
  console.warn(formData, "============");

  // Handler for changing property type from radio buttons
  const handlePropertyTypeChange = (type) => {
    setSelectedPropertyType(type);
    setSelectedProperty("");
    setFormData((prevFormData) => ({
      ...prevFormData,
      Property: type,
    }));

    switch (type) {
      case "Residentail":
        setPropertyTypes(residentialTypes);
        break;
      case "Commercial":
        setPropertyTypes(commercialTypes);
        break;
      case "Rental":
        setPropertyTypes(rentalTypes);
        break;
      default:
        setPropertyTypes([]);
    }
  };

  // Handler for dropdown change to set specific property
  const handleDropdownChange = (item) => {
    setSelectedProperty(item.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      PropertyType: item.value,
    }));
    //console.warn("Selected Property:", item.value);
  };

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePostingPropertyForRadioChange = (value) => {
    setSelectedUserType(value);
    setFormData((prevData) => {
      const updatedFormData = {
        ...prevData,
        PostingPropertyfor: value,
      };
      return updatedFormData;
    });
  };

  // Function to handle checkbox selection
  const handleAmenityChange = (amenityValue) => {
    let newSelectedAmenities = [];

    // Add or remove the amenity from selectedAmenities
    if (selectedAmenities.includes(amenityValue)) {
      newSelectedAmenities = selectedAmenities.filter(
        (item) => item !== amenityValue
      );
    } else {
      newSelectedAmenities = [...selectedAmenities, amenityValue];
    }

    // Convert the array to a comma-separated string
    const amenitiesString = newSelectedAmenities.join(", ");

    // Update selectedAmenities state
    setSelectedAmenities(newSelectedAmenities);

    // Update formData with the comma-separated amenities string
    setFormData((prevData) => ({
      ...prevData,
      Amenities: amenitiesString, // Store the comma-separated string
    }));

    // Log the updated amenities in the console
    console.warn("Selected Amenities:", amenitiesString);
  };

  const handleDropdownChangeArea = (item) => {
    setSelectedPropertyArea(item.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      PropertyArea: item.value,
    }));
  };

  // Function to handle radio button selection
  const handleAddpostpackageDropdown = (value) => {
    setSelectedPackage(value);
    setFormData((prevData) => ({
      ...prevData,
      AddPostPackage: value,
    }));
  };

  // const handleBedroomChange = (selectedItem) => {
  //   setBedroomValue(selectedItem);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     Configration_Badrooms: selectedItem.value,
  //   }));
  // };
  
  function onMultiChange(item) {
    if (item && item.id) {
      // Update the selected bedroom values
      const updatedBedroomValue = xorBy(bedroomValue, [item], "id");
      setBedroomValue(updatedBedroomValue);
      //console.warn('bedroomValue',bedroomValue);

    // Join selected bedroom values as a comma-separated string
    const bedroomValuesString = updatedBedroomValue.map((bedroom) => bedroom.item).join(", ");
    //console.warn('bedroomValuesString',bedroomValuesString);
    
    // Update formData with the comma-separated string
    setFormData((prevFormData) => ({
      ...prevFormData,
      Configration_Badrooms: bedroomValuesString, // Comma-separated values
    }));
  }
}

  
  
  
  const handleBathroomChange = (selectedItem) => {
    setBathroomValue(selectedItem.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      NoOfBathrooms: selectedItem.value,
    }));
    //console.warn("bathroom",selectedItem.value);
  };

  const handleConstructionStatusChange = (selectedItem) => {
    setConstructionStatus(selectedItem.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      ConstrationStatus: selectedItem.value,
    }));
    //console.warn("Constration Status",selectedItem.value);
  };

  const handleFurnishingStatusChange = (selectedItem) => {
    setFurnishingStatus(selectedItem.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      FurnishingStatus: selectedItem.value,
    }));
    //console.warn("Furnishing Status",selectedItem.value);
  };

  // Submit form data to the server
  const handleSubmit = async () => {
    try {
      // Validate form fields before submission
      if (
        !formData.PropertyTitle ||
        !formData.PropertyType ||
        !formData.EmailAddress
      ) {
        Alert.alert("Validation Error", "Please fill in all required fields.");
        return;
      }

      // Debugging: Log the form data before sending
      console.log("Form Data:", formData);

      // Make the API request to the same endpoint
      const response = await apiManager.post("/insertAdPostProperty", formData);

      if (response && response.data) {
        console.log("API Response:", response.data);
        Alert.alert(
          "Success",
          formData.nid > 0
            ? "Ad Post Updated Successfully"
            : "Ad Post Inserted Successfully"
        );
        navigation.replace("AddProperty");
      } else {
        throw new Error("Failed to post the ad.");
      }
    } catch (error) {
      console.error(
        "Error occurred while submitting data:",
        error.response || error.message || error
      );
    }
  };

  // Function to handle image selection and uploading
  const pickImage = async (imgName) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access gallery is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      uploadImage(imageUri, imgName);
    }
  };

  // Function to upload the selected image
  const uploadImage = async (imageUri, imgName) => {
    if (!imageUri) return;

    setIsLoading(true); // Show loader
    setUploadSuccess(false); // Reset success message

    let filename = imageUri.split("/").pop();
    let formData2 = new FormData();
    formData2.append("uploadedfile", {
      uri: imageUri,
      name: filename,
      type: "image/jpeg",
    });
    formData2.append("filename", filename);

    try {
      const response = await axios({
        method: "post",
        url: "https://admin.ghardekhoonline.com/file_upload.php",
        data: formData2,
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        maxBodyLength: Infinity,
      });

      console.log("Response:", response.data.filename);

      setFormData((prevData) => ({
        ...prevData,
        [imgName]: `https://admin.ghardekhoonline.com/dist/${response.data.filename}`,
      }));

      setIsLoading(false); // Hide loader
      setUploadSuccess(true); // Show success message
    } catch (error) {
      console.log("Error uploading image:", error);
      setIsLoading(false); // Hide loader on error
    }
  };

  const fetchData = async () => {
    try {
      const response = await apiManager.post("/insertAdPostProperty", formData);
      console.log("API Response:", response.data);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      Alert.alert("Success", "Ad Post Property Successfully");
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Property</Text>
        <TouchableOpacity>
          <Icon name="bell-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.photoSection}>
        <Text style={styles.sectionTitle}>Property Title</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Type property title or name here"
          value={formData.PropertyTitle}
          onChangeText={(text) => handleInputChange("PropertyTitle", text)}
        />
        <Text style={styles.sectionTitle}>Property</Text>
        <View style={styles.radioContainer}>
          {["Residentail", "Commercial", "Rental"].map((type) => (
            <View style={styles.radioOption} key={type}>
              <RadioButton
                value={type}
                status={selectedPropertyType === type ? "checked" : "unchecked"}
                onPress={() => handlePropertyTypeChange(type)}
              />
              <Text style={styles.radioText}>{type}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Posting Property For</Text>
        <View style={styles.radioContainer}>
          {["Sale", "Resale", "Rent"].map((type) => (
            <View style={styles.radioOption} key={type}>
              <RadioButton
                value={type}
                status={selectedUserType === type ? "checked" : "unchecked"}
                onPress={() => handlePostingPropertyForRadioChange(type)}
              />
              <Text style={styles.radioText}>{type}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>Property Type</Text>
        <View style={styles.fullWidthDropdownWrapper}>
          <Dropdown
            style={styles.fullWidthDropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={propertyTypes}
            labelField="label"
            valueField="value"
            placeholder="Select property type"
            value={selectedProperty}
            onChange={handleDropdownChange}
          />
        </View>
        <Text style={styles.sectionTitle}>City</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="City"
          value={formData.Locality}
          onChangeText={(text) => handleInputChange("Locality", text)}
        />
        <Text style={styles.sectionTitle}>Project Name</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Project Name"
          value={formData.ProjectName}
          onChangeText={(text) => handleInputChange("ProjectName", text)}
        />
        <Text style={styles.sectionTitle}>Address</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Address"
          value={formData.EmailAddress}
          onChangeText={(text) => handleInputChange("EmailAddress", text)}
        />
        <Text style={styles.sectionTitle}>Landmark Near</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Landmark Near"
          value={formData.LandmarkNear}
          onChangeText={(text) => handleInputChange("LandmarkNear", text)}
        />

        {/* Render Property Details Section */}
        <View style={styles.card}>
          <Text style={styles.propertyDetailsTitle}>Property Details</Text>

          {/* Row for Bedroom Multi-Select Dropdown */}
          <View style={styles.row}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.propertyDropdownDetailsTitle}>Bedrooms</Text>
              <SelectBox
                label="Select Bedroom"
                options={BEDROOM_OPTIONS}
                selectedValues={bedroomValue}
                onMultiSelect={onMultiChange}
                onTapClose={onMultiChange}
                isMulti
                style={styles.selectBox}
              />
            </View>
          </View>

          {/* Row for Bathroom Single-Select Dropdown */}
          <View style={styles.row}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.propertyDropdownDetailsTitle}>Bathrooms</Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Bathroom"
                data={bathroomOptions}
                labelField="label"
                valueField="value"
                value={bathroomValue}
                onChange={handleBathroomChange}
                multiple={false}
                placeholderStyle={styles.placeholderStyle}
                itemStyle={styles.itemStyle}
              />
            </View>
          </View>

          {/* Row for Construction Status Single-Select Dropdown */}
          <View style={styles.row}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.propertyDropdownDetailsTitle}>
                Construction Status
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Construction Status"
                data={constructionStatusOptions}
                labelField="label"
                valueField="value"
                value={constructionStatus}
                onChange={handleConstructionStatusChange}
                multiple={false}
                placeholderStyle={styles.placeholderStyle}
                itemStyle={styles.itemStyle}
              />
            </View>
          </View>

          {/* Row for Furnishing Status Single-Select Dropdown */}
          <View style={styles.row}>
            <View style={styles.dropdownContainer}>
              <Text style={styles.propertyDropdownDetailsTitle}>
                Furnishing Status
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholder="Select Furnishing Status"
                data={furnishingStatusOptions}
                labelField="label"
                valueField="value"
                value={furnishingStatus}
                onChange={handleFurnishingStatusChange}
                placeholderStyle={styles.placeholderStyle}
                itemStyle={styles.itemStyle}
              />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Property Area</Text>
        <View style={styles.fullWidthDropdownWrapper}>
          <Dropdown
            style={styles.fullWidthDropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={PropertyArea}
            labelField="label"
            valueField="value"
            placeholder="Select property area"
            value={formData.PropertyArea}
            onChange={handleDropdownChangeArea}
          />
        </View>
        <Text style={styles.sectionTitle}>Carpet Area</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Carpet Area"
          value={formData.CarpetArea}
          onChangeText={(text) => handleInputChange("CarpetArea", text)}
        />
        <Text style={styles.sectionTitle}>Build Up Area</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Build Up Area"
          value={formData.BuildupArea}
          onChangeText={(text) => handleInputChange("BuildupArea", text)}
        />

        {/* // Upload Images Section */}
        <Text style={styles.sectionTitle}>Upload Images</Text>
        <View style={styles.photoGrid}>
          <View style={styles.imageUploadContainer}>
            <Button title="Upload Image" onPress={() => pickImage("ImgSrc")} />
            {formData.ImgSrc && (
              <Image source={{ uri: formData.ImgSrc }} style={styles.image} />
            )}
          </View>
          <View style={styles.imageUploadContainer}>
            <Button title="Upload Image" onPress={() => pickImage("Imgsrc1")} />
            {formData.Imgsrc1 && (
              <Image source={{ uri: formData.Imgsrc1 }} style={styles.image} />
            )}
          </View>
          <View style={styles.imageUploadContainer}>
            <Button title="Upload Image" onPress={() => pickImage("Imgsrc2")} />
            {formData.Imgsrc2 && (
              <Image source={{ uri: formData.Imgsrc2 }} style={styles.image} />
            )}
          </View>
          <View style={styles.imageUploadContainer}>
            <Button title="Upload Image" onPress={() => pickImage("Imgsrc3")} />
            {formData.Imgsrc3 && (
              <Image source={{ uri: formData.Imgsrc3 }} style={styles.image} />
            )}
          </View>

          {/* Show Loader during upload */}
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          {/* Show Success Message */}
          {uploadSuccess && (
            <Text style={styles.successMessage}>
              Photo uploaded successfully!
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Unit Text</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Text 1"
          value={formData.UnitText1}
          onChangeText={(text) => handleInputChange("UnitText1", text)}
        />
        <Text style={styles.sectionTitle}>Unit Text 2</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Text 2"
          value={formData.UnitText2}
          onChangeText={(text) => handleInputChange("UnitText2", text)}
        />
        <Text style={styles.sectionTitle}>Unit Text 3</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Text 3"
          value={formData.UnitText3}
          onChangeText={(text) => handleInputChange("UnitText3", text)}
        />
        {/* // Unit Images Section */}
        <Text style={styles.sectionTitle}>Unit Images</Text>
        <View style={styles.photoGrid}>
          <View style={styles.imageUploadContainer}>
            <Button
              title="Upload Unit Image"
              onPress={() => pickImage("UnitImg1")}
            />
            {formData.UnitImg1 && (
              <Image source={{ uri: formData.UnitImg1 }} style={styles.image} />
            )}
          </View>
          <View style={styles.imageUploadContainer}>
            <Button
              title="Upload Unit Image"
              onPress={() => pickImage("UnitImg2")}
            />
            {formData.UnitImg2 && (
              <Image source={{ uri: formData.UnitImg2 }} style={styles.image} />
            )}
          </View>
          <View style={styles.imageUploadContainer}>
            <Button
              title="Upload Unit Image"
              onPress={() => pickImage("UnitImg3")}
            />
            {formData.UnitImg3 && (
              <Image source={{ uri: formData.UnitImg3 }} style={styles.image} />
            )}
          </View>
          {/* Show Loader during upload */}
          {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
          {/* Show Success Message */}
          {uploadSuccess && (
            <Text style={styles.successMessage}>
              Photo uploaded successfully!
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Unit Price</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Price 1"
          value={formData.UnitPrice1}
          onChangeText={(text) => handleInputChange("UnitPrice1", text)}
        />
        <Text style={styles.sectionTitle}>Unit Price 2</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Price 2"
          value={formData.UnitPrice2}
          onChangeText={(text) => handleInputChange("UnitPrice2", text)}
        />
        <Text style={styles.sectionTitle}>Unit Price 3</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Unit Price 3"
          value={formData.UnitPrice3}
          onChangeText={(text) => handleInputChange("UnitPrice3", text)}
        />
        <Text style={styles.sectionTitle}>Project Highlights</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Project Highlights"
          value={formData.ProjectHighlights}
          onChangeText={(text) => handleInputChange("ProjectHighlights", text)}
        />
        <Text style={styles.sectionTitle}>Sale Price</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Sale Price"
          value={formData.SalePrice}
          onChangeText={(text) => handleInputChange("SalePrice", text)}
        />
        <Text style={styles.sectionTitle}>Description</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Description"
          value={formData.Description}
          onChangeText={(text) => handleInputChange("Description", text)}
        />
        <View style={styles.amenitiesContainer}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>Amenities</Text>
          <View style={styles.checkboxRow}>
            {amenitiesOptions.map((amenity) => (
              <View key={amenity.value} style={styles.checkboxContainer}>
                <Checkbox
                  status={
                    selectedAmenities.includes(amenity.value)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleAmenityChange(amenity.value)}
                />
                <Text style={styles.checkboxLabel}>{amenity.label}</Text>
              </View>
            ))}
          </View>
        </View>
        <Text style={styles.sectionTitle}>Url</Text>
        <TextInput
          style={styles.propertyTitleInput}
          placeholder="Url"
          value={formData.VideoUrl}
          onChangeText={(text) => handleInputChange("VideoUrl", text)}
        />

        <Text style={styles.sectionTitle}>Add Post Package</Text>
        <View style={styles.radioContainer}>
          {["free", "paid"].map((type) => (
            <View style={styles.radioOption} key={type}>
              <TouchableOpacity
                style={styles.radioCircle}
                onPress={() => handleAddpostpackageDropdown(type)}
              >
                {selectedPackage === type && <View style={styles.selectedRb} />}
              </TouchableOpacity>
              <Text style={styles.radioText}>{type}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {formData.nid > 0 ? "Update Property" : "Submit Property"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "5%",
    paddingTop: Platform.OS === "ios" ? "10%" : "5%",
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "2%",
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTitle: {
    fontSize: width < 360 ? 14 : 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  propertyTitleInput: {
    backgroundColor: "#fff",
    padding: "3%",
    borderRadius: 10,
    marginTop: "2%",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#006666",
    padding: "4%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: "5%",
    width: "100%",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: width < 360 ? 14 : 16,
  },
  photoSection: {
    marginBottom: "5%",
  },
  sectionTitle: {
    fontSize: width < 360 ? 16 : 18,
    fontWeight: "bold",
    marginBottom: "2%",
  },
  propertyDetailsSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: "4%",
    marginTop: "2%",
    marginBottom: "5%",
    elevation: 3,
  },

  propertyDropdownDetailsTitle: {
    fontSize: width < 360 ? 10 : 12,
    fontWeight: "bold",
    marginBottom: "2%",
    color: "#000",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: "2%",
  },
  imageUploadContainer: {
    width: "48%",
    marginBottom: "3%",
  },
  image: {
    width: "100%",
    height: 100,
    marginTop: "2%",
    borderRadius: 8,
  },

  card: {
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  propertyDetailsTitle: {
    fontSize: width < 360 ? 14 : 16,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: "2%",
    color: "#006666",
  },
  row: {
    marginBottom: 15,
  },
  propertyDropdownDetailsTitle: {
    fontSize: width < 360 ? 10 : 12,
    fontWeight: "bold",
    marginBottom: "2%",
    color: "#000",
  },
  dropdownContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  placeholderStyle: {
    fontSize: 12,
    color: "#999",
  },
  itemStyle: {
    justifyContent: "flex-start",
    height: 40,
  },
  dropdown: {
    height: 30,
    borderRadius: 15,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
  },
  selectBox: {
    padding: 12,
  },
  // dropdownContainer: {
  //   flexDirection: "row",
  //   flexWrap: "wrap",
  //   justifyContent: "space-between",
  //   marginTop: "2%",
  // },
  // propertyDetailsTitle: {
  //   fontSize: width < 360 ? 16 : 18,
  //   fontWeight: "bold",
  //   marginBottom: "2%",
  //   color: "#006666",
  // },
  // row: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginBottom: 16,
  // },

  // dropdownWrapper: {
  //   flex: 1,
  //   width: "48%",
  //   marginBottom: "3%",
  // },
  // placeholderStyle: {
  //   color: "#999",
  // },
  selectedTextStyle: {
    fontWeight: "bold",
  },
  radioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "5%",
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioText: {
    marginLeft: 8,
  },
  fullWidthDropdownWrapper: {
    width: "100%",
    marginBottom: 10,
  },
  fullWidthDropdown: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  placeholderStyle: {
    color: "#999",
  },
  selectedTextStyle: {
    fontWeight: "bold",
  },
  amenitiesContainer: {
    marginBottom: "5%",
  },
  checkboxRow: {
    flexDirection: "row", // Set to 'row' for horizontal alignment
    flexWrap: "wrap", // Allows wrapping to the next line if space is limited
  },
  checkboxContainer: {
    flexDirection: "row", // Keep checkbox and label in a row
    alignItems: "center", // Center vertically
    marginRight: 15, // Add margin between checkboxes
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  horizontalContainer: {
    flexDirection: "row", // Layout for horizontal arrangement
    alignItems: "center",
  },
  radioContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  radioLabel: {
    marginLeft: 8,
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#2C6A6A",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#2C6A6A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});
