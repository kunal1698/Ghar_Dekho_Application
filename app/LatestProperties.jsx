import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";

const LatestProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef(null);
  const cardWidth = 341 + 16; // Card width + marginRight

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("https://admin.ghardekhoonline.com/ghar_web.asmx/getallLatestProperties", {
          method: "POST",
          headers: {
            "Atoken": "WRUQWIR4565746SFHKJU3535#ETUjsdf557f",
            "Atokenpass": "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            Atoken: "WRUQWIR4565746SFHKJU3535#ETUjsdf557f",
            Atokenpass: "rsfjsfRRH42248hafhaPPORYT5239529#@sfsfYIHB4224HH>",
          }).toString(),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.json();
        setProperties(result.data || []);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: (scrollViewRef.current.scrollX + cardWidth) % (properties.length * cardWidth), animated: true });
      }
    }, 3000); // Adjust the interval as needed

    return () => clearInterval(intervalId);
  }, [properties]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal={true}
      style={styles.scrollContainer}
      showsHorizontalScrollIndicator={false}
    >
      {properties.slice(0, 5).map((property, index) => (
        <PropertyCard
          key={property.nid}
          title={property.PropertyTitle}
          label={property.Locality}
          price={property.SalePrice}
          imageUri={property.ImgSrc}
          item={property} // Pass the property item
          index={index} // Pass the index
        />
      ))}
    </ScrollView>
  );
};

const PropertyCard = ({ title, label, price, imageUri, item, index }) => {
  const router = useRouter();
  
  return (
    <View style={styles.card}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "Homedetails",
            params: {
              pageName: JSON.stringify(item),
              index: index.toString(),
            },
          })
        }
        style={styles.nearbyPropertyCard}
      >
        <Image
          source={{ uri: imageUri || "https://via.placeholder.com/341x256" }}
          style={styles.image}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}> {title} </Text>
          <View style={styles.locationContainer}>
          <Icon name="location-on" size={18} color="#fff" />
            <Text style={styles.cardLabel}> {label} </Text>
          </View>
          <Text style={styles.price}> ₹ {price} </Text>
        </View>
        <AntDesign
          name="heart"
          size={24}
          color="#FFD700"
          style={styles.heartIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginRight: 16,
    width: 341,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 5,
    backgroundColor: '#05555c',
  },
  cardLabel: {
    color: 'white',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  heartIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});

export default LatestProperties;
