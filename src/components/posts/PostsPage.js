import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import client from '../../utils/client';
import './style.css';
import jwt_decode from 'jwt-decode';
import Button from '@mui/material/Button';
import { Box, CardActions } from '@mui/material';
import { renderPosts } from './utils/getAllPosts';
import PostItem from './PostItem';

import SearchBar from './SearchBar';

import { NavLink } from 'react-router-dom';
import Card from '@mui/material/Card';


const PostsPage = ({ getUserId }) => {
  const [post, setPost] = useState({ content: '' });
  const [postResponse, setPostResponse] = useState('');
  const [posts, setPosts] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(process.env.REACT_APP_USER_TOKEN);
    if (!token) {
      return;
    }
    const decoded = jwt_decode(token);

    let id = decoded.userId;

    client
      .get(`/user/${id}`)
      .then(res => {
        if (res.data.data.user.role === 'TEACHER') {
          setIsTeacher(true);
        }
      })
      .catch(console.log);
    renderPosts(setPosts);
  }, [postResponse]);

  const createPost = async event => {
    event.preventDefault();
    client

      .post('/post', post)
      .then(res => setPostResponse(res.data))
      .then(() => {
        setPost({ content: '' });
      })
      .catch(() => {
        setPostResponse('There was a problem creating this post');
      });
  };

  const handleChange = event => {
    event.preventDefault();
    const { value } = event.target;
    setPost({
      ...post,
      content: value,
    });
  };

  const signOut = event => {
    event.preventDefault();
    localStorage.setItem(process.env.REACT_APP_USER_TOKEN, '');
    navigate('../', { replace: true });
  };

  return (
    <>
      {isTeacher && (
        <div className="teacher-section">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Card variant="outlined" sx={{ width: 1000 }}>
              <h3>Teacher Admin</h3>
              <CardActions>
                <Button variant="contained">
                  <NavLink to="/cohort">Manage Cohort</NavLink>
                </Button>
                <Button variant="contained">
                  <NavLink to="/enrolment">Enrolment</NavLink>
                </Button>
              </CardActions>
            </Card>
          </Box>

          
          <SearchBar />
          <section className='cohort-list'>
            <h4>Cohort List</h4>
            {cohorts.map((cohort) => {
              return <p>{cohort}</p>;
            })}
          </section>

        </div>
      )}

      <section className="posts-section">
        <button id="user-signout-button" onClick={signOut}>
          sign out
        </button>

        <p>Status: {postResponse.status}</p>
        <PostForm
          handleSubmit={createPost}
          handleChange={handleChange}
          value={post.content}
        />

        {posts?.length > 0 ? (
          <ul className="posts-list">
            {posts?.map((post, index) => (
              <PostItem
                post={post}
                key={index}
                userId={getUserId}
                setPost={setPost}
                setPostResponse={setPostResponse}
              />
            ))}
          </ul>
        ) : (
          <p className="no-posts-message">There are no posts at the moment.</p>
        )}
      </section>
    </>
  );
};

export default PostsPage;
