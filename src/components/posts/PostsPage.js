import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./style.css";

import PostForm from "./PostForm";
import client from "../../utils/client";
import { renderPosts } from "./utils/getAllPosts";
import PostItem from "./PostItem";

const PostsPage = ({ getUserId }) => {
  const [post, setPost] = useState({ content: "" });
  const [postResponse, setPostResponse] = useState("");
  const [posts, setPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    renderPosts(setPosts)
  }, []);

  const createPost = async event => {
    event.preventDefault();
    client
      .post("/post", post)
      .then(res => setPostResponse(res.data))
      .then(renderPosts(setPosts))
      .catch(() => {
        setPostResponse("There was a problem creating this post")
      });
  };

  const handleChange = event => {
    event.preventDefault();
    const { value, name } = event.target;
    setPost({
      ...post,
      [name]: value,
    });
  };

  const signOut = event => {
    event.preventDefault();
    localStorage.setItem(process.env.REACT_APP_USER_TOKEN, "");
    navigate("../", { replace: true });
  };

  return (
    <>
      <section className="posts-section">
        <button id="user-signout-button" onClick={signOut}>
          sign out
        </button>
        <p>Status: {postResponse.status}</p>
        <PostForm handleSubmit={createPost} handleChange={handleChange} />

        {posts?.length > 0 ? (
          <ul className="posts-list">
            {posts?.map((post, index) => (
              <PostItem post={post} key={index} userId={getUserId} />
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
