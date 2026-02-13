import * as yup from 'yup';

export const petValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Pet name is required')
    .min(2, 'Pet name must be at least 2 characters')
    .max(50, 'Pet name must be less than 50 characters'),
  
  breed: yup
    .string()
    .required('Breed is required')
    .min(2, 'Breed must be at least 2 characters')
    .max(50, 'Breed must be less than 50 characters'),
  
  age: yup
    .number()
    .required('Age is required')
    .positive('Age must be a positive number')
    .integer('Age must be an integer')
    .max(30, 'Age must be less than 30 years'),
  
  price: yup
    .number()
    .required('Price is required')
    .positive('Price must be a positive number')
    .typeError('Price must be a valid number'),
  
  image: yup
    .string()
    .required('Pet image is required'),
});

export const validatePetForm = async (formData) => {
  try {
    await petValidationSchema.validate(formData, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach((err) => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};