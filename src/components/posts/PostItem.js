import defaultPFP from "../../assets/default.png";

const PostItem = ({ post }) => {
  return (
    <li className="post-item">
      <div className="post-header-wrap">
        <div className="post-profile-wrap">
          <img
            className="post-profile-img"
            src={post.user.profile.profileImageUrl || defaultPFP}
            alt="profile"
          />
          <h3>
            {post.user.profile.firstName} {post.user.profile.lastName}
          </h3>
        </div>

        <p className="createdAt-time">{post.createdAt}</p>
      </div>

      <p className="post-content">{post.content}</p>

      <div className="modify-btn-wrap">
        <button className="modify-btn">Edit</button>
        <button className="modify-btn">Delete</button>
      </div>
    </li>
  );
};

export default PostItem;
