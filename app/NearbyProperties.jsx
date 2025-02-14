import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, FlatList } from 'react-native';
import { Color, FontFamily, FontSize } from "../GlobalStyles";
import { useRouter } from 'expo-router';

const NearbyProperties = () => {
  const [nearbyProperties, setNearbyProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const myHeaders = new Headers();
        myHeaders.append("Atoken", "WRUQWIR4565746SFHKJU3535#ETUjsdf557f");
        myHeaders.append("Atokenpass", "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>");
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const body = new URLSearchParams({
          Atoken: "WRUQWIR4565746SFHKJU3535#ETUjsdf557f",
          Atokenpass: "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>",
        }).toString();

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: body,
          redirect: "follow",
        };

        const response = await fetch(
          "https://admin.ghardekhoonline.com/ghar_web.asmx/getTreandingHomePageRandom",
          requestOptions
        );
        const result = await response.json();
        setNearbyProperties(result.data || []);
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
console.log('nearbyProperties',nearbyProperties);

  const renderPropertyCard = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "Homedetails",
          params: {
            pageName: JSON.stringify(item),
          },
        })
      }
      style={styles.nearbyPropertyCard}
    >
      <Image
        source={{ uri: item.ImgSrc }}
        style={styles.nearbyImagePlaceholder}
      />
      <Text style={styles.recommendText}>Recommended</Text>
      <Text style={styles.propertyTitle}>{item.PropertyTitle}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Trending Projects
        </Text>
        <TouchableOpacity style={styles.viewAlls} onPress={() => router.push({
            pathname: "Categories",
            params: {
              pageName: 'Residentail',
            },
          })}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={nearbyProperties}
        renderItem={renderPropertyCard}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    marginLeft:8,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular', // Poppins for section titles
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
  nearbyProperties: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  nearbyPropertyCard: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  nearbyImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  recommendText: {
    fontSize: 12,
    color: 'gray',
    marginVertical: 5,
    fontFamily: 'Roboto_400Regular', // Roboto for smaller texts
  },
  propertyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins_400Regular', // Poppins for property titles
  },
  propertyPrice: {
    fontSize: 14,
    color: 'green',
    fontFamily: 'Roboto_400Regular', // Roboto for price text
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NearbyProperties;
