import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box
} from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function AdminSetup() {
  const [masjidName, setMasjidName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Create masjid document
      await setDoc(doc(db, 'masjids', user.uid), {
        name: masjidName,
        address,
        phone,
        adminId: user.uid,
        createdAt: new Date().toISOString()
      });

      // Update user document
      await setDoc(doc(db, 'users', user.uid), {
        isMasjidAdmin: true,
        masjidId: user.uid,
        email: user.email
      });

      navigate('/admin/dashboard');
    } catch (err) {
      setError('Failed to set up masjid: ' + err.message);
    }
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Masjid Setup
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Masjid Name"
            value={masjidName}
            onChange={(e) => setMasjidName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Complete Setup
          </Button>
        </Box>
      </Paper>
    </Container>
  );
} 