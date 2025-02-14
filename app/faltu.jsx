import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const faltu = () => {
    return (
        <View style={styles.container}>
          <Image
            source={{ uri: '../assets/images/ghar_l.png' }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>Hotel President</Text>
            <View style={styles.locationRow}>
              <Icon name="map-marker" size={16} color="#FF385C" />
              <Text style={styles.locationText}>Las Mercedes, Caracas</Text>
            </View>
            <View style={styles.ratingRow}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.85 (2,300)</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.button}>
                <Icon name="phone" size={16} color="#007AFF" />
                <Text style={styles.buttonText}>Contact</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="map-marker" size={16} color="#007AFF" />
                <Text style={styles.buttonText}>Location</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Icon name="menu" size={16} color="#007AFF" />
                <Text style={styles.buttonText}>Menu</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.openStatusRow}>
              <Icon name="clock-outline" size={16} color="#4CAF50" />
              <Text style={styles.openStatusText}>Open Now · Closes at 03:00 AM</Text>
              <Icon name="chevron-down" size={16} color="#000" />
            </View>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText} numberOfLines={2}>
              Hotel President is a 5 star hotel made up of so many specialty shops, amenities & offices.
            </Text>
            <TouchableOpacity>
              <Text style={styles.readMoreText}>Read more</Text>
            </TouchableOpacity>
            <View style={styles.amenitiesRow}>
              <View style={styles.amenityItem}>
                <Icon name="wifi" size={24} color="#007AFF" />
                <Text style={styles.amenityText}>Fast Wifi</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="car" size={24} color="#007AFF" />
                <Text style={styles.amenityText}>Car Park</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="coffee" size={24} color="#007AFF" />
                <Text style={styles.amenityText}>Breakfast</Text>
              </View>
              <View style={styles.amenityItem}>
                <Icon name="dumbbell" size={24} color="#007AFF" />
                <Text style={styles.amenityText}>Gym</Text>
              </View>
            </View>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        backgroundColor: 'white',
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      image: {
        width: '100%',
        height: 200,
      },
      content: {
        padding: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      },
      locationText: {
        marginLeft: 4,
        color: '#666',
      },
      ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      },
      ratingText: {
        marginLeft: 4,
        fontWeight: 'bold',
      },
      buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
      },
      buttonText: {
        marginLeft: 4,
        color: '#007AFF',
      },
      openStatusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
      },
      openStatusText: {
        marginLeft: 4,
        marginRight: 4,
        color: '#4CAF50',
      },
      descriptionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
      },
      descriptionText: {
        color: '#666',
        marginBottom: 4,
      },
      readMoreText: {
        color: '#007AFF',
        marginBottom: 12,
      },
      amenitiesRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      amenityItem: {
        alignItems: 'center',
      },
      amenityText: {
        marginTop: 4,
        fontSize: 12,
        color: '#666',
      },
    });

export default faltu;