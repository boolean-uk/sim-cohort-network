import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import client from '../../utils/client';
import './style.css';
import jwt_decode from 'jwt-decode';
import { renderPosts } from './utils/getAllPosts';
import PostItem from './PostItem';

import StudentList from '../../components/studentList/StudentList'
import TeacherAdmin from '../teacher/TeacherAdmin';


const PostsPage = ({ getUserId, setProfileView, user, setUser }) => {

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

  return (
    <>

      {isTeacher && <TeacherAdmin />}


      <section className='posts-section'>
        <p>Status: {postResponse.status}</p>
        <PostForm
          handleSubmit={createPost}
          handleChange={handleChange}
          value={post.content}
        />

        {
          posts?.length > 0 ? (
            <ul className='posts-list'>
              {posts?.map((post, index) => (
                <PostItem
                  post={post}
                  key={index}
                  userId={getUserId}
                  setPost={setPost}
                  setPostResponse={setPostResponse}
                  setProfileView={setProfileView}
                  setUser={setUser}
                />
              ))}
            </ul>
          ) : (
            <p className='no-posts-message'>There are no posts at the moment.</p>
          )
        }
      </section >
      {user.role !== 'TEACHER' && <StudentList setUser={setUser} />}
    </>
  );
};

export default PostsPage;
