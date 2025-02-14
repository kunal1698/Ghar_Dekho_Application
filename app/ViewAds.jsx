import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, useWindowDimensions, Modal } from 'react-native';
import apiManager from '../ApiManager';

const ViewAds = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [selectedPropertyId, setSelectedPropertyId] = useState(null); // State to hold selected property ID
  const catData = useLocalSearchParams();
  const { width: screenWidth } = useWindowDimensions();
  const router = useRouter();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const formData = {
        subcategory: catData?.pageName,
        category: "All",
      };

      const result = await apiManager.post('getPropertyListing', formData);
      setProperties(result.data);
    } catch (error) {
      console.warn('Error:', error);
      router.push('SignUp');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedPropertyId(item); // Set selected property ID
    setModalVisible(true); // Show the modal
  };

  const confirmEdit = () => {     
    console.warn('item',selectedPropertyId);
       
    setModalVisible(false); 
    router.push({
      pathname: 'AddProperty', 
      params: {
        propItem: JSON.stringify(selectedPropertyId), 
        viewAds:''
      },
    });
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { width: screenWidth / 2 - 20 }]}
    >
      <View style={styles.imagePlaceholder}>
        <Image source={{ uri: item.ImgSrc }} style={styles.image} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>{item.PropertyTitle}</Text>
        <Text style={styles.categoryProperties}>{item.Property}</Text>
        <View style={styles.rightSideContainer}>
          <Text style={styles.SalePrice}> ₹ {item.SalePrice}</Text>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Image
              source={require('../assets/images/combinedshape.png')}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>{catData?.pageName}</Text>
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

      {/* Modal for edit confirmation */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Do you want to edit this property?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={()=>confirmEdit(catData)}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  categoriesList: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryCard: {
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 10,
  },
  imagePlaceholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  categoryInfo: {
    padding: 10,
    backgroundColor: "#fff",
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  categoryProperties: {
    fontSize: 12,
    color: "#999",
  },
  rightSideContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  SalePrice: {
    fontSize: 11,
    fontWeight: "bold",
    color: "orange",
    marginRight: 5,
  },
  editIcon: {
    width: 16,
    height: 16,
    tintColor: "#1e90ff",
  },
  exploreMoreButton: {
    backgroundColor: "#00695c",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  exploreMoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default ViewAds;
