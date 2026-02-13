import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
  PermissionsAndroid, 
  Platform
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';


import { submitPetDetails, fetchRandomDogImage } from '../services/api';
import { validatePetForm } from '../utils/validation';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast from '../components/Toast';
import usePetStore from '../store/PetStore';

const PetUploadScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    price: '',
    image: null,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: '' });
  
  const { addPet } = usePetStore();

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };



const handleImagePick = async (type) => {
  try {
    if (Platform.OS === 'android') {
      if (type === 'camera') {
        const cameraPermission = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take pet photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Camera permission is required to take photos');
          return;
        }
      } else {
        if (Platform.Version >= 33) {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          );
          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Storage permission is required to select photos');
            return;
          }
        } else {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (permission !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission Denied', 'Storage permission is required to select photos');
            return;
          }
        }
      }
    }

    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 600,
      maxWidth: 600,
      quality: 0.8,
      saveToPhotos: false,
    };

    const picker = type === 'camera' ? launchCamera : launchImageLibrary;

    picker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image: ' + response.error);
      } else if (response.errorCode) {
        console.log('ImagePicker Error Code: ', response.errorCode);
        Alert.alert('Error', 'Failed to pick image: ' + response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setFormData(prev => ({ ...prev, image: response.assets[0].uri }));
        setErrors(prev => ({ ...prev, image: '' }));
      }
    });
  } catch (error) {
    console.log('Permission error:', error);
    Alert.alert('Error', 'Failed to access camera/gallery');
  }
};

  const handleFetchRandomImage = async () => {
    setLoading(true);
    const result = await fetchRandomDogImage();
    setLoading(false);
    
    if (result.success) {
      setFormData(prev => ({ ...prev, image: result.data }));
      showToast('Random dog image fetched!', 'success');
    } else {
      showToast(result.message, 'error');
    }
  };

  const handleSubmit = async () => {
    const validation = await validatePetForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);
    
    // Submit to mock API
    const result = await submitPetDetails({
      name: formData.name,
      job: 'pet_owner',
    });
    
    if (result.success) {
      const petData = {
        name: formData.name,
        breed: formData.breed,
        age: parseInt(formData.age),
        price: parseFloat(formData.price),
        image: formData.image,
      };
      
      const addResult = await addPet(petData);
      
      if (addResult.success) {
        showToast('Pet added successfully!', 'success');
        
        setFormData({
          name: '',
          breed: '',
          age: '',
          price: '',
          image: null,
        });
        setErrors({});
        
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    } else {
      showToast(result.message, 'error');
    }
    
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {toast.visible && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast({ visible: false, message: '', type: '' })}
        />
      )}

      <View style={styles.content}>
        <View style={styles.imageSection}>
          <Text style={styles.label}>Pet Image *</Text>
          
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleImagePick('camera')}
            >
              <Icon name="camera-alt" size={24} color="#3498db" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => handleImagePick('gallery')}
            >
              <Icon name="photo-library" size={24} color="#3498db" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imageButton}
              onPress={handleFetchRandomImage}
              disabled={loading}
            >
              <Icon name="pets" size={24} color="#3498db" />
              <Text style={styles.imageButtonText}>Random</Text>
            </TouchableOpacity>
          </View>

          {formData.image && (
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: formData.image }}
                style={styles.previewImage}
              />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setFormData(prev => ({ ...prev, image: null }))}
              >
                <Icon name="close" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          )}
          {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pet Name *</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter pet name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Breed *</Text>
            <TextInput
              style={[styles.input, errors.breed && styles.inputError]}
              placeholder="Enter breed"
              value={formData.breed}
              onChangeText={(text) => handleInputChange('breed', text)}
            />
            {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Age (years) *</Text>
              <TextInput
                style={[styles.input, errors.age && styles.inputError]}
                placeholder="Age"
                value={formData.age}
                onChangeText={(text) => handleInputChange('age', text)}
                keyboardType="numeric"
              />
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.label}>Price ($) *</Text>
              <TextInput
                style={[styles.input, errors.price && styles.inputError]}
                placeholder="Price"
                value={formData.price}
                onChangeText={(text) => handleInputChange('price', text)}
                keyboardType="numeric"
              />
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
            </View>
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" color="#FFF" />
            ) : (
              <>
                <Icon name="pets" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Submit Pet Details</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  imageSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  imageButton: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    minWidth: 80,
  },
  imageButtonText: {
    marginTop: 4,
    fontSize: 12,
    color: '#3498db',
  },
  previewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginTop: 10,
  },
  removeImage: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(231, 76, 60, 0.9)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#e74c3c',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default PetUploadScreen;