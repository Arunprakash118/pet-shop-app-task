const BASE_URL = 'https://678895e22c874e66b7d58e7f.mockapi.io/api/v1/menu';

export const getProductDetails = async () => {
    try {
      const response = await fetch(`${BASE_URL}`);
      return await response.json();
    } catch (error) {
      throw error; 
    }
  };