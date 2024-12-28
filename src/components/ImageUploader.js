import { useState } from 'react';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, CircularProgress } from '@mui/material';

export default function ImageUploader({ masjidId, onUploadComplete }) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const storageRef = ref(storage, `masjids/${masjidId}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        id="image-upload"
        onChange={handleFileSelect}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} /> : 'Upload Image'}
        </Button>
      </label>
    </>
  );
} 