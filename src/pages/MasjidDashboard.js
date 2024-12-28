import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Switch
} from '@mui/material';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getPrayerTimes, adjustPrayerTime } from '../services/prayerTimes';

export default function MasjidDashboard() {
  const { user } = useAuth();
  const [masjidData, setMasjidData] = useState(null);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [offsets, setOffsets] = useState({
    Fajr: 0,
    Dhuhr: 0,
    Asr: 0,
    Maghrib: 0,
    Isha: 0
  });
  const [combinedPrayers, setCombinedPrayers] = useState({
    dhuhrAsr: false,
    maghribIsha: false
  });

  useEffect(() => {
    async function loadMasjidData() {
      const masjidDoc = await getDoc(doc(db, 'masjids', user.uid));
      if (masjidDoc.exists()) {
        setMasjidData(masjidDoc.data());
        // Load prayer times based on masjid location
        // This is a placeholder - you'll need to store/get actual coordinates
        const times = await getPrayerTimes(51.5074, -0.1278);
        setPrayerTimes(times);
      }
    }
    loadMasjidData();
  }, [user]);

  async function handleOffsetChange(prayer, value) {
    const newOffsets = { ...offsets, [prayer]: value };
    setOffsets(newOffsets);
    await updateDoc(doc(db, 'masjids', user.uid), {
      prayerOffsets: newOffsets
    });
  }

  async function handleCombinedPrayerToggle(prayers) {
    const newCombinedPrayers = {
      ...combinedPrayers,
      [prayers]: !combinedPrayers[prayers]
    };
    setCombinedPrayers(newCombinedPrayers);
    await updateDoc(doc(db, 'masjids', user.uid), {
      combinedPrayers: newCombinedPrayers
    });
  }

  if (!masjidData || !prayerTimes) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {masjidData.name} Dashboard
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Prayer Times & Iqamah Adjustments
              </Typography>
              <List>
                {Object.entries(prayerTimes).map(([prayer, time]) => (
                  ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].includes(prayer) && (
                    <ListItem key={prayer}>
                      <ListItemText
                        primary={prayer}
                        secondary={`Adhan: ${time} | Iqamah: ${adjustPrayerTime(
                          time,
                          offsets[prayer]
                        )}`}
                      />
                      <TextField
                        type="number"
                        label="Offset (minutes)"
                        value={offsets[prayer]}
                        onChange={(e) =>
                          handleOffsetChange(prayer, e.target.value)
                        }
                        size="small"
                      />
                    </ListItem>
                  )
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Combined Prayers
              </Typography>
              <List>
                <ListItem>
                  <ListItemText primary="Combine Dhuhr & Asr" />
                  <Switch
                    checked={combinedPrayers.dhuhrAsr}
                    onChange={() => handleCombinedPrayerToggle('dhuhrAsr')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Combine Maghrib & Isha" />
                  <Switch
                    checked={combinedPrayers.maghribIsha}
                    onChange={() => handleCombinedPrayerToggle('maghribIsha')}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
} 