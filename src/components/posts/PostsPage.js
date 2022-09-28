import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import client from '../../utils/client';
import './style.css';
import jwt_decode from 'jwt-decode';
import { renderPosts } from './utils/getAllPosts';
import PostItem from './PostItem';

import StudentList from '../../components/studentList/StudentList';
import TeacherAdmin from '../teacher/TeacherAdmin';
import PostsOfTheWeek from './PostsOfTheWeek';
import { Alert } from '@mui/material';
import { useLoggedInUser } from '../../context/LoggedInUser';

const PostsPage = ({ getUserId }) => {
  const postPref = useLoggedInUser().user.postPrivacyPref === 'PRIVATE' ? true : false
  const [post, setPost] = useState({ content: '', isPrivate: false });
  const [postResponse, setPostResponse] = useState('');
  const [posts, setPosts] = useState([]);
  const [postsOfTheWeek, setPostsOfTheWeek] = useState([]);
  const [isTeacher, setIsTeacher] = useState(false);
  const [postError, setPostError] = useState(false);
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
      .catch(err => console.error(err));
    renderPosts(setPosts, setPostsOfTheWeek);
    setPost({...post, isPrivate: postPref})
  }, [postResponse, postPref]);

  const createPost = async event => {
    event.preventDefault();
    client
      .post('/post', post)
      .then(res => setPostResponse(res.data))
      .then(() => {
        setPost({ ...post, content: '' });
      })
      .catch(err => {
        console.error(err.response);
        setPostError(true);

        setTimeout(() => {
          setPostError(false);
        }, '3000');
      });
  };

  const handleChange = event => {
    if (event.target.name === 'content') {
      event.preventDefault();
      const { value } = event.target;
      setPost({
        ...post,
        content: value,
      });
    } 
    if (event.target.name === 'switch') {
      setPost({
        ...post,
        isPrivate: !post.isPrivate,
      });
    }
  };

  const signOut = event => {
    event.preventDefault();
    localStorage.setItem(process.env.REACT_APP_USER_TOKEN, '');
    navigate('../', { replace: true });
  };

  return (
    <>
      {isTeacher && <TeacherAdmin />}

      <section className="posts-section">
        <button id="user-signout-button" onClick={signOut}>
          sign out
        </button>

        {postError && <Alert severity="error">Must provide content</Alert>}

        <p>Status: {postResponse.status}</p>
        <PostForm
          handleSubmit={createPost}
          handleChange={handleChange}
          value={post}
        />

        <PostsOfTheWeek
          posts={postsOfTheWeek}
          getUserId={getUserId}
          setPost={setPost}
          setPostResponse={setPostResponse}
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
      {!isTeacher && <StudentList />}
    </>
  );
};

export default PostsPage;
