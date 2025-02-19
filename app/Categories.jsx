import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, FlatList, useWindowDimensions } from 'react-native';
import apiManager from '../ApiManager';

const Categories = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const catData = useLocalSearchParams(); 
  const { width: screenWidth } = useWindowDimensions(); // Get screen width dynamically

  
  //console.warn('catData',catData);
  
const router=useRouter()
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const formData = {
        subcategory: catData?.pageName,
        category: catData.searchQuery?catData.searchQuery : 'All',
      };

      const result = await apiManager.post('getPropertyListing', formData);
      setProperties(result.data);
    } catch (error) {
      console.warn("Error:", error);
      router.push('SignUp');
    } finally {
      setLoading(false); 
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity       onPress={() =>
      router.push({
        pathname: "Homedetails",
        params: {
          pageName: JSON.stringify(item),
        },
      })
    }
      style={[styles.categoryCard, { width: screenWidth / 2 - 20 }]}>
      <View style={styles.imagePlaceholder}>
        <Image
          source={{ uri: item.ImgSrc }}
          style={styles.image}
        />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>{item.PropertyTitle}</Text>
        <Text style={styles.categoryProperties}>{item.Property}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>{catData?.pageName}</Text>
        <TouchableOpacity>
          {/* <Text style={styles.viewAll}>View All</Text> */}
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text>Loading...</Text> 
      ) : (
        <FlatList
          data={properties}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.categoriesList}
        />
      )}

      <TouchableOpacity style={styles.exploreMoreButton}>
        <Text style={styles.exploreMoreText}>Explore More</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    color: '#1e90ff',
    fontSize: 14,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Ensure the image covers the container
  },
  categoryInfo: {
    padding: 10,
    backgroundColor: '#fff',
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  categoryProperties: {
    fontSize: 12,
    color: '#999',
  },
  exploreMoreButton: {
    backgroundColor: '#00695c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  exploreMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Categories;
