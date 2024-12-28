import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Container } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserType() {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isMasjidAdmin) {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }
      }
    }
    checkUserType();
  }, [user, navigate]);

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <CircularProgress />
    </Container>
  );
} 