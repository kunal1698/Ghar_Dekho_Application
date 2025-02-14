import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
  Modal,
  TextInput,
  Button,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import apiManager from "../ApiManager";
import CustomAlert from "./CustomAlert";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

const Homedetails = () => {
  const [showMore, setShowMore] = useState(false);
  const [showMoreHighlights, setShowMoreHighlights] = useState(false);
  const HomeData = useLocalSearchParams();
  const parsedData = HomeData.pageName ? JSON.parse(HomeData.pageName) : null;
  const router = useRouter();

  const truncateDescription = (description) => {
    if (!description) return "";
    const words = description.split(" ");
    return words.length > 20
      ? words.slice(0, 20).join(" ") + "..."
      : description;
  };

  // Function to truncate highlights
  const truncateHighlights = (ProjectHighlights) => {
    if (!ProjectHighlights) return "";
    const words = ProjectHighlights.split(" ");
    return words.length > 10
      ? words.slice(0, 10).join(" ") + "..."
      : ProjectHighlights;
  };

  // Parsing amenities (assuming they are comma-separated)
  const amenities = parsedData?.Amenities?.split(",") || [];

  // Fixed phone number
  const phoneNumber = parsedData.MobileNo;

  // Function to handle phone call
  const handlePhoneCall = () => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

 // Function to open WhatsApp with a predefined message
 const handleWhatsAppSend = () => {
  const phoneNumber = `91${parsedData.MobileNo}`;
  const propertyTitle = parsedData?.PropertyTitle?.trim().replace(/\s+/g, '-') || '';
  const message = encodeURIComponent(`Query From Mobile App Ghar Dekho Online https://ghardekhoonline.com/Master/PropertyDetail/${propertyTitle}`);
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

  Linking.openURL(whatsappUrl).catch(() =>
    alert("Make sure WhatsApp is installed on your device")
  );
};



  // State for modal visibility and form data
  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    FullName: "",
    Mobile: "",
    EmailAddress: "",
    Message: "",
    QuearyBy: "By App",
    PID: parsedData?.nid || "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState("success");
  const [loading, setLoading] = useState(false);

  // Close the alert
  const handleCloseAlert = () => {
    setIsAlertVisible(false);
  };

  // Function to handle chat form submission
  const handleSubmit = async () => {
    // Check if required fields are filled
    if (
      !formData.FullName ||
      !formData.Mobile ||
      !formData.EmailAddress ||
      !formData.Message
    ) {
      setAlertMessage("Please fill in all fields.");
      setAlertType("error");
      setIsAlertVisible(true); // Show the alert
      return;
    }

    try {
      setLoading(true); // Start loading
      setAlertMessage(""); // Clear previous alerts

      // Make your API call here
      const result = await apiManager.post("insertContactQueary", formData); // Replace with your API endpoint

      // Handle the result from the API
      if (result && result.data && result.data[0]?.mSMS) {
        console.log("Result:", result.data);
        setAlertMessage(result.data[0].mSMS);
        setAlertType("success");
        setIsAlertVisible(true);
      } else {
        throw new Error("No valid message received");
      }

      // Reset form data and close modal
      setFormData({
        FullName: "",
        Mobile: "",
        EmailAddress: "",
        Message: "",
        QuearyBy: "By App",
        PID: parsedData?.nid || "",
      });
      setModalVisible(false); // Close modal
    } catch (error) {
      console.error("Error:", error);
      setAlertMessage("Failed to submit the query. Please try again.");
      setAlertType("error");
      setIsAlertVisible(true); // Show error alert
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Building Image */}
      <View style={styles.imageContainer}>
        {/* Back Button Icon */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Building Image */}
        <Image
          source={{ uri: parsedData?.ImgSrc }}
          style={styles.buildingImage}
          resizeMode="cover"
        />
      </View>

      {/* Property Info Section */}
      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <View style={styles.postingPropertyContainer}>
            <Text style={styles.tagText}>
              On {parsedData?.PostingPropertyfor}
            </Text>
          </View>
          <Text style={styles.salePrice}> ₹ {parsedData?.SalePrice}</Text>
        </View>

        <Text style={styles.buildingName}>{parsedData?.PropertyTitle}</Text>
        <Text style={styles.ProjectName}>{parsedData?.ProjectName}</Text>
        <Text style={styles.unittext}>
          {parsedData?.UnitText1},{parsedData?.UnitText2},
          {parsedData?.UnitText3}
        </Text>

        <View style={styles.locationContainer}>
          <Icon name="location-on" size={18} color="#8A8A8A" />
          <Text style={styles.location}>{parsedData?.LandmarkNear}</Text>
        </View>
      </View>

      {/* Agent Information */}
      <View style={styles.agentContainer}>
        <View style={styles.agentInfo}>
          <Text style={styles.agentName}>{parsedData?.PropertyTitle}</Text>
        </View>
        <View style={styles.contactIcons}>
          {["whatsapp", "phone", "chat"].map((icon, index) => (
            <TouchableOpacity
              key={index}
              style={styles.iconButton}
              onPress={
                icon === "phone"
                  ? handlePhoneCall
                  : icon === "chat"
                  ? () => setModalVisible(true)
                  : icon === "whatsapp"
                  ? handleWhatsAppSend
                  : null
              }
            >
              {icon === "whatsapp" ? (
                <FontAwesomeIcon name="whatsapp" size={12} color="#ffffff" />
              ) : (
                <Icon name={icon} size={12} color="#ffffff" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Modal for Chat */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Send a Message</Text>
              <TextInput
                placeholder="Name"
                value={formData.FullName}
                onChangeText={(text) =>
                  setFormData({ ...formData, FullName: text })
                }
                style={styles.input}
              />
              <TextInput
                placeholder="Mobile No"
                value={formData.Mobile}
                onChangeText={(text) =>
                  setFormData({ ...formData, Mobile: text })
                }
                style={styles.input}
                keyboardType="phone-pad"
              />
              <TextInput
                placeholder="Email Address"
                value={formData.EmailAddress}
                onChangeText={(text) =>
                  setFormData({ ...formData, EmailAddress: text })
                }
                style={styles.input}
                keyboardType="email-address"
              />
              <TextInput
                placeholder="Message"
                value={formData.Message}
                onChangeText={(text) =>
                  setFormData({ ...formData, Message: text })
                }
                style={styles.input}
                multiline
              />
              <CustomAlert
                visible={isAlertVisible}
                onClose={handleCloseAlert}
                message={alertMessage}
                type={alertType}
              />
              <Button
                title={loading ? "Sending..." : "Send"}
                onPress={handleSubmit}
                disabled={loading}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Overview Section */}
      <View style={styles.featuresContainer}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.featuresContent}>
          {[
            { icon: "bed", label: parsedData?.Configration_Badrooms || "N/A" },
            { icon: "bathtub", label: parsedData?.NoOfBathrooms || "N/A" },
            {
              icon: "format-line-spacing",
              label: parsedData?.CarpetArea || "N/A",
            },
            {
              icon: "check-circle",
              label: parsedData?.ConstrationStatus || "N/A",
            },
          ].map((feature, index) => (
            <View key={index} style={styles.feature}>
              <Icon
                name={feature.icon}
                size={24}
                color="#C0A94A"
                style={styles.featureIcon}
              />
              <Text style={styles.featureText}>{feature.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Unit Types Section */}
      <View style={styles.unitContainer}>
        <Text style={styles.sectionTitle}>Unit Details</Text>
        <View style={styles.unitContent}>
          {[
            {
              unit: parsedData?.UnitText1 || "Unit 1",
              price: parsedData?.UnitPrice1 || "N/A",
            },
            {
              unit: parsedData?.UnitText2 || "Unit 2",
              price: parsedData?.UnitPrice2 || "N/A",
            },
            {
              unit: parsedData?.UnitText3 || "Unit 3",
              price: parsedData?.UnitPrice3 || "N/A",
            },
          ].map((item, index) => (
            <View key={index} style={styles.unitRow}>
              <Text style={styles.unitText}>{item.unit}</Text>
              <Text style={styles.unitPrice}>₹ {item.price}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Description Section */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.descriptionText}>
        {showMore
          ? parsedData?.Description
          : truncateDescription(parsedData?.Description)}
      </Text>
      <TouchableOpacity onPress={() => setShowMore(!showMore)}>
        <Text style={styles.showMoreText}>
          {showMore ? "Show Less" : "Show More"}
        </Text>
      </TouchableOpacity>

      {/* Project Highlights Section */}
      <Text style={styles.sectionTitle}>Project Highlights</Text>
      <Text style={styles.descriptionText}>
        {showMoreHighlights
          ? parsedData?.ProjectHighlights
          : truncateHighlights(parsedData?.ProjectHighlights)}
      </Text>
      <TouchableOpacity
        onPress={() => setShowMoreHighlights(!showMoreHighlights)}
      >
        <Text style={styles.showMoreText}>
          {showMoreHighlights ? "Show Less" : "Show More"}
        </Text>
      </TouchableOpacity>

      {/* Photo Gallery Section */}
      <Text style={styles.sectionTitle}>Photo Gallery</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.galleryContainer}
      >
        {[
          "Imgsrc1",
          "Imgsrc2",
          "Imgsrc3",
          "UnitImg1",
          "UnitImg2",
          "UnitImg3",
        ].map((imgSrc, index) => (
          <View key={index} style={styles.imagePlaceholder}>
            <Image
              source={{ uri: parsedData?.[imgSrc] }}
              style={styles.imageSize}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>

      {/* Amenities Section */}
      <View style={styles.amenitiesContainer}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContent}>
          {amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityCard}>
              <Icon
                name="check-circle"
                size={20}
                color="#C0A94A"
                style={styles.amenityIcon}
              />
              <Text style={styles.amenityText}>{amenity.trim()}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#C0A94A",
    padding: 10,
    borderRadius: 50,
    elevation: 2,
  },
  buildingImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  infoContainer: {
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20, // Adjust the distance from the top
    left: 10, // Adjust the distance from the left side
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    borderRadius: 20, // Rounded corners
    padding: 8, // Padding inside the button
    zIndex: 1, // Make sure it’s on top of the image
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postingPropertyContainer: {
    backgroundColor: "#C0A94A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 15,
  },
  tagText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  salePrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#C0A94A",
  },
  buildingName: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
    color: "red",
  },
  unittext: {
    fontSize: 10,
    color: "blue",
  },
  ProjectName: {
    fontSize: 10,
    color: "blue",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  location: {
    fontSize: 16,
    color: "#8A8A8A",
    marginLeft: 5,
  },
  agentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    marginVertical: 20,
    borderRadius: 12,
    elevation: 2,
  },
  agentInfo: {
    flex: 2,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  contactIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#C0A94A",
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  featuresContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  featuresContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  unitContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    marginVertical: 10,
  },
  unitContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  unitRow: {
    flexDirection: "column", // Change from row to column
    alignItems: "flex-start", // Align text to the start
    paddingVertical: 5,
    marginBottom: 10, // Optional: Add some space between rows
    // flexDirection: "row",
    // justifyContent: "space-between",
    // alignItems: "center",
    // width: "45%",
    // marginBottom: 10,
  },
  unitText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  unitPrice: {
    fontSize: 16,
    color: "#C0A94A",
  },

  descriptionText: {
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  showMoreText: {
    color: "#C0A94A",
    padding: 16,
    fontWeight: "bold",
    fontSize: 16,
  },
  galleryContainer: {
    paddingHorizontal: 12,
  },
  imagePlaceholder: {
    width: width * 0.4,
    height: 90,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 10,
  },
  imageSize: {
    width: "100%",
    height: "100%",
  },
  amenitiesContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 12,
    elevation: 2,
    marginVertical: 10,
  },
  amenitiesContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  amenityCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
    marginBottom: 15,
  },
  amenityIcon: {
    marginRight: 8,
  },
  amenityText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "blue",
  },
});

export default Homedetails;
