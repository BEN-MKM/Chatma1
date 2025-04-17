import * as ExpoDocumentPicker from 'expo-document-picker';

const DocumentPicker = {
  pickDocument: async (options = {}) => {
    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false,
        ...options,
      });

      if (result.type === 'success') {
        return {
          uri: result.uri,
          name: result.name,
          size: result.size,
          mimeType: result.mimeType,
        };
      }
      return null;
    } catch (error) {
      console.error('Error picking document:', error);
      return null;
    }
  },

  pickMultipleDocuments: async (options = {}) => {
    try {
      const result = await ExpoDocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: true,
        ...options,
      });

      if (result.type === 'success') {
        return result.output.map(doc => ({
          uri: doc.uri,
          name: doc.name,
          size: doc.size,
          mimeType: doc.mimeType,
        }));
      }
      return [];
    } catch (error) {
      console.error('Error picking multiple documents:', error);
      return [];
    }
  }
};

export default DocumentPicker;
