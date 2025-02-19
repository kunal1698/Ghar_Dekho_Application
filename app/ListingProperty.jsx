import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ListingProperty = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Icon name="menu-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Listing Property</Text>
        <TouchableOpacity>
          <Icon name="notifications-outline" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Top Listed Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Listed</Text>
        <Text style={styles.sectionSubtitle}>
          Find our top listed properties, houses, and cottages under your budget
        </Text>

        <View style={styles.card}>
          <Image source={require('../assets/images/photo.png')} style={styles.propertyImage} />
          <View style={styles.cardContent}>
            <Text style={styles.propertyTitle}>Rose House</Text>
            <Text style={styles.propertySubtitle}>Blue Smith 74</Text>
            <Text style={styles.propertyPrice}>$2500/m</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.buttonText}>Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.buttonText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Property On Sale Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Property On Sale</Text>
        <Text style={styles.sectionSubtitle}>Properties available for sale.</Text>

        <View style={styles.propertySaleCard}>
          <Text style={styles.saleBadge}>Best known for New Flat</Text>
          <Text style={styles.propertySaleTitle}>Villa Coteg 450</Text>
          <Text style={styles.propertyPrice}>$500/m</Text>
        </View>
      </View>

      {/* Recommended Section */}
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.sectionTitle}>Recommended</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recommendationRow}>
          <View style={styles.recommendationCard}>
            <Image source={require('../assets/images/photo.png')} style={styles.recommendationImage} />
            <Text style={styles.recommendationTitle}>Hill 90FC</Text>
            <Text style={styles.propertyPrice}>$750/m</Text>
          </View>

          <View style={styles.recommendationCard}>
            <Image source={require('../assets/images/photo.png')} style={styles.recommendationImage} />
            <Text style={styles.recommendationTitle}>Hill 90FC</Text>
            <Text style={styles.propertyPrice}>$750/m</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#00695c',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  propertyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#ccc', // Placeholder color
    marginRight: 15,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  propertySubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#009688',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  detailsButton: {
    backgroundColor: '#00695c',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  contactButton: {
    backgroundColor: '#009688',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  propertySaleCard: {
    backgroundColor: '#e0f2f1',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saleBadge: {
    backgroundColor: '#004d40',
    color: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  propertySaleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAll: {
    color: '#009688',
    fontWeight: 'bold',
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recommendationCard: {
    width: width * 0.45,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 10,
    marginBottom: 5,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ListingProperty;
