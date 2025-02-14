import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { useRouter } from "expo-router";

const RentalProperties = () => {
  const [rentalProperties, setRentalProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(
          "https://admin.ghardekhoonline.com/ghar_web.asmx/getAllPropertyRegidantal", 
          {
            method: "POST",
            headers: {
              "Atoken": "WRUQWIR4565746SFHKJU3535#ETUjsdf557f",
              "Atokenpass": "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>",
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              Atoken: "WRUQWIR4565746SFHKJU3535#ETUjsdf557f",
              Atokenpass: "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>",
              category: "All",
            }).toString(),
          }
        );
        const result = await response.json();
        setRentalProperties(result.data || []);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderPropertyCard = ({ item,index  }) => (
      <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "Homedetails",
          params: {
            pageName: JSON.stringify(item),
            index:index.toString()
          },
        })
      }
      style={styles.nearbyPropertyCard}
    >
      <Image
        source={{ uri: item.ImgSrc }}
        style={styles.nearbyImagePlaceholder}
        resizeMode="cover"
      />
      <Text style={styles.recommendText}>Recommended</Text>
      <Text style={styles.propertyTitle}>{item.PropertyTitle}</Text>
      </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rental Properties</Text>
        <TouchableOpacity style={styles.viewAlls} onPress={() => router.push({
            pathname: "Categories",
            params: {
              pageName: 'Rental',
            },
          })}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={rentalProperties}
        renderItem={renderPropertyCard}
        keyExtractor={(item) => item.nid.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingHorizontal: '5%',
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft:8,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  viewAlls: {
    paddingVertical: 5,
    marginRight:15,
  },
  viewAllText: {
    fontSize: 14,
    color: Color.colorDarkslategray,
    fontWeight:'bold',
    fontFamily: FontFamily.robotoBold,
  },
  row: {
    justifyContent: "space-between",
  },
  nearbyPropertyCard: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nearbyImagePlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  recommendText: {
    fontSize: 12,
    color: "gray",
    marginVertical: 5,
    fontFamily: "Roboto_400Regular",
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins_400Regular",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RentalProperties;
