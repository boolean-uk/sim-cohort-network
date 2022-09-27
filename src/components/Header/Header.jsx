import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';

import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import client from '../../utils/client';
import { Alert } from '@mui/material';

const Header = ({ companyName }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    biography: '',
    profile_image_url: '',
    github_url: '',
  });
  const [authError, setAuthError] = useState(false)

  useEffect(() => {
    const userId = getLoggedInUserId();
    if (userId === null) {
      return;
    }
    client
      .get(`/user/${userId}`)
      .then(res => setUser(res.data.data.user))
      .catch(err => {
        console.error(err.response);
        setAuthError(true);

        setTimeout(() => {
          setAuthError(false);
        }, '3000');
      });
    // eslint-disable-next-line
  }, []);

  const getLoggedInUserId = () => {
    const loadedToken = localStorage.getItem('token');
    if (loadedToken === null) {
      return null;
    }
    const decoded = jwt_decode(loadedToken);
    return decoded.userId;
  };

  const { profile_image_url } = user;

  const handleClick = () => {
    const userId = getLoggedInUserId();
    if (userId === null) {
      return;
    }
    client
      .get(`/user/${userId}`)
      .then(res => setUser(res.data.data.user))
      .catch(err => console.log(err));
    navigate('/profile')
  }

  return (
    <>
    {authError && (
        <Alert severity="error">This user cannot be found</Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          backgroundColor: 'grey',
          justifyContent: 'space-between',
          alignContent: 'center',
          width: '100vw',
          padding: '1em',
        }}
      >
        <Box>
          <Typography fontSize={22}>
            <Link to="/posts">{companyName}</Link>
          </Typography>
        </Box>

        <Box>
          <Stack spacing={2} direction="row">
            <Button variant="contained" href="/posts">Posts</Button>
            <Button variant="contained" onClick={handleClick}>Profile</Button>
            <Button variant="contained" href="/">Logout</Button>
            <Button href="/account"><Avatar src={profile_image_url} /></Button>
          </Stack>
        </Box>
      </Box>
      <Outlet />
    </>
  );
};

export default Header;
