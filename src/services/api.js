import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const DOG_API_URL = 'https://dog.ceo/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

export const submitPetDetails = async (petData) => {
  try {
    const response = await api.post('/posts', {
      title: petData.name,
      body: JSON.stringify({
        breed: petData.breed,
        age: petData.age,
        price: petData.price,
        image: petData.image
      }),
      userId: 1
    });
    
    return {
      success: true,
      data: {
        ...response.data,
        id: response.data.id,
        ...petData
      },
      message: 'Pet details submitted successfully!'
    };
  } catch (error) {
    console.log('API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'Failed to submit pet details',
      message: 'Failed to submit pet details. Please try again.'
    };
  }
};

export const fetchRandomDogImage = async () => {
  try {
    const response = await axios.get(`${DOG_API_URL}/breeds/image/random`);
    return {
      success: true,
      data: response.data.message,
      message: 'Image fetched successfully!'
    };
  } catch (error) {
    console.log('Dog API Error:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to fetch dog image',
      message: 'Failed to fetch random dog image. Please try again.'
    };
  }
};