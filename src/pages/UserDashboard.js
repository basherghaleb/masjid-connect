import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function UserDashboard() {
  const { user } = useAuth();
  const [favoriteMasjids, setFavoriteMasjids] = useState([]);
  const [nearbyMasjids, setNearbyMasjids] = useState([]);

  useEffect(() => {
    async function loadUserData() {
      if (user) {
        // Load favorite masjids
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().favorites) {
          const favorites = await Promise.all(
            userDoc.data().favorites.map(async (masjidId) => {
              const masjidDoc = await getDoc(doc(db, 'masjids', masjidId));
              return { id: masjidId, ...masjidDoc.data() };
            })
          );
          setFavoriteMasjids(favorites);
        }

        // Load nearby masjids (simplified version - you'll want to use geolocation)
        const masjidsRef = collection(db, 'masjids');
        const masjidsSnapshot = await getDocs(masjidsRef);
        const masjids = [];
        masjidsSnapshot.forEach((doc) => {
          masjids.push({ id: doc.id, ...doc.data() });
        });
        setNearbyMasjids(masjids);
      }
    }
    loadUserData();
  }, [user]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Favorite Masjids
              </Typography>
              <List>
                {favoriteMasjids.map((masjid) => (
                  <ListItem key={masjid.id}>
                    <ListItemText
                      primary={masjid.name}
                      secondary={masjid.address}
                    />
                  </ListItem>
                ))}
              </List>
              {favoriteMasjids.length === 0 && (
                <Typography color="textSecondary">
                  No favorite masjids yet
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Nearby Masjids
              </Typography>
              <List>
                {nearbyMasjids.map((masjid) => (
                  <ListItem key={masjid.id}>
                    <ListItemText
                      primary={masjid.name}
                      secondary={masjid.address}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {/* Add favorite functionality */}}
                    >
                      Add to Favorites
                    </Button>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 