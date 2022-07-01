import { Box } from '@mui/system';
import { Button, Stack, Typography } from '@mui/material';
import { loggedInUserContext } from '../../Helper/loggedInUserContext';
import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../searchBar/SearchBar';

const Header = ({ companyName }) => {
  const { loggedInUser } = useContext(loggedInUserContext);
  let navigate = useNavigate();

  const handleAddCohortClick = (event) => {
    event.preventDefault();
    navigate('../cohorts/add-cohort', { replace: true });
  };

	const onGotoDeliveryLogsPageRequested = () => {
		navigate('../log');
	};

  const signOut = (event) => {
    event.preventDefault();
    localStorage.setItem(process.env.REACT_APP_USER_TOKEN, '');
    localStorage.removeItem('loggedInUser')
    navigate('../', { replace: true });
  };

	return (
		loggedInUser && (
			<>
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
						<Typography>
							<span>{companyName}</span>
						</Typography>
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignContent: 'center',
						}}
					>
						<SearchBar />
					</Box>

          <Box>
            <Stack spacing={2} direction='row'>
              <Link to='/home'>
                <Button variant='contained'>Home</Button>
              </Link>

              <Link to={`/profile/${loggedInUser.id}`}>
                <Button variant='contained'>Profile</Button>
              </Link>

              {loggedInUser?.role === 'TEACHER' && 
                <>
                  <Button variant='contained' onClick={onGotoDeliveryLogsPageRequested }>Delivery Logs</Button>
                  <Button variant='contained' onClick={handleAddCohortClick}>Add Cohort</Button>
                </>
              }
              <Button variant='contained' id='user-signout-button' onClick={signOut}>Logout</Button>
            </Stack>
          </Box>
        </Box>
      </>
    )
  );
};

export default Header;
