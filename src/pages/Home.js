import React, { useContext, useEffect, useState } from "react";
import {
  Container,
  Button,
  Modal,
  Card,
  Form,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import axios from "axios";
import { Notyf } from "notyf";
import UserContext from "../UserContext";
import { format } from "date-fns";
import ArtPattern from "../components/ArtPattern";
import { Link } from "react-router-dom";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useContext(UserContext);
  const notyf = new Notyf();

  useEffect(() => {
    const fetchPosts = async () => {
      if (isLoggedIn) {
        const response = await axios.get(
          `https://blog-app-api-4c9z.onrender.com/posts/`,
          // "http://localhost:4000/posts/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        console.log(response);

        if (response.status !== 200) {
          setMessage("No posts available");
          setPosts([]);
        } else {
          const posts = response.data;
          setPosts(posts);
        }
      } else {
        setMessage("Register and Login to explore.");
      }
      setLoading(false);
    };
    fetchPosts();
  }, [isLoggedIn]);

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
    setShowAddModal(false);
    setSelectedPost(null);
    setCommentContent("");
    setNewPost({ title: "", content: "" });
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://blog-app-api-4c9z.onrender.com/posts/${postId}`,
        // `http://localhost:4000/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setPosts(posts.filter((post) => post._id !== postId));
      handleCloseModal();
      notyf.success("Deleted");
    } catch (error) {
      console.error("Error deleting post", error);
      notyf.error("Only authors can delete their posts.");
    }
  };

  const handleUpdatePost = async () => {
    try {
      const updatedPost = await axios.put(
        `https://blog-app-api-4c9z.onrender.com/posts/${selectedPost._id}`,
        // `http://localhost:4000/posts/${selectedPost._id}`,
        {
          title: selectedPost.title,
          content: selectedPost.content,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setPosts(
        posts.map((post) =>
          post._id === updatedPost.data._id ? updatedPost.data : post
        )
      );
      notyf.success("Updated successfully");
      handleCloseModal();
    } catch (error) {
      console.error("Error updating post", error);
      notyf.error("Only authors can edit their post");
    }
  };

  const handleEditPost = () => {
    setShowModal(false);
    setShowEditModal(true);
  };

  const handleAddComment = async () => {
    try {
      const response = await axios.post(
        `https://blog-app-api-4c9z.onrender.com/posts/addComment/${selectedPost._id}`,
        // `http://localhost:4000/posts/addComment/${selectedPost._id}`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      setSelectedPost(response.data.post);
      setPosts(
        posts.map((post) =>
          post._id === response.data.post._id ? response.data.post : post
        )
      );
      notyf.success("Comment Added");
      setCommentContent("");
      handleCloseModal();
    } catch (error) {
      console.error("Error adding comment", error);
      notyf.error(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(
        `https://blog-app-api-4c9z.onrender.com/posts/deleteComment/${selectedPost._id}/${commentId}`,
        // `http://localhost:4000/posts/deleteComment/${selectedPost._id}/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      console.log(response.data); // Debug: Inspect the API response structure

      if (response.status === 200) {
        const updatedPost = response.data.post;

        if (updatedPost) {
          setSelectedPost(updatedPost);
          setPosts(
            posts.map((post) =>
              post._id === updatedPost._id ? updatedPost : post
            )
          );
          notyf.success("Comment deleted successfully");
        } else {
          // If the post object is missing, handle gracefully
          notyf.success("Comment deleted, but unable to update the display");
        }
      } else {
        notyf.error("Not allowed");
      }
    } catch (error) {
      console.error("Error deleting comment", error);
      notyf.error("An error occurred while deleting the comment");
    }
  };

  const handleAddPost = async () => {
    try {
      const response = await axios.post(
        `https://blog-app-api-4c9z.onrender.com/posts/addPost`,
        // "http://localhost:4000/posts/addPost",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      console.log(response);
      const addedPost = response.data;
      if (addedPost.message === "Post created successfully") {
        setPosts([addedPost.post, ...posts]);
        notyf.success("Post added");
      } else {
        notyf.error("Login to Add Post");
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error adding post", error);
    }
  };

  if (loading) {
    return (
      <Container className="text-center text-white">
        <Spinner animation="border" variant="light" />
      </Container>
    );
  }

  return (
    <>
      <Container className="text-white py-5">
        <h1 className="text-center mb-4 fw-bold">📝 Latest Blog Posts</h1>

        <div className="d-flex justify-content-center mb-4">
          <Button
            variant="primary"
            className="px-4 py-2 fw-semibold shadow"
            onClick={() => setShowAddModal(true)}
          >
            Add Post
          </Button>
        </div>

        {isLoggedIn ? (
          posts.length > 0 ? (
            <Row className="g-4">
              {posts.map((post) => (
                <Col key={post._id} md={6} lg={4}>
                  <Card className="bg-dark text-white shadow-sm h-100">
                    <Card.Body>
                      <Card.Title className="fw-bold">{post.title}</Card.Title>
                      <Card.Subtitle className="text-info mb-2">
                        {post.author.name}
                      </Card.Subtitle>
                      <Card.Text className="text-light">
                        {post.content}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between align-items-center">
                      <small className="text-secondary">
                        Updated:{" "}
                        {format(new Date(post.updatedAt), "MMMM dd, yyyy")}
                      </small>
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => handleViewPost(post)}
                      >
                        View Post
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <h5 className="text-center mt-4">{message}</h5>
          )
        ) : (
          <>
            <div>
              <ArtPattern />
            </div>
            <h5 className="text-center mt-4">
              <Link to="/register">Register</Link> or{" "}
              <Link to="/login">Log in</Link> to explore!
            </h5>
          </>
        )}
      </Container>

      {selectedPost && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedPost.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{selectedPost.content}</p>
            <p>Author: {selectedPost.author.name}</p>
            <hr />
            <h5>Comments</h5>
            {selectedPost.comments.length > 0 ? (
              selectedPost.comments.map((comment) => (
                <div key={comment._id}>
                  <p>
                    <strong>{comment.commenter?.name}</strong>:{" "}
                    {comment.content}
                  </p>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete Comment
                  </Button>
                </div>
              ))
            ) : (
              <p>No comments yet</p>
            )}
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Add a comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddComment}>
                Add Comment
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDeletePost(selectedPost._id)}
            >
              Delete Post
            </Button>
            <Button variant="warning" onClick={handleEditPost}>
              Update Post
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {selectedPost && (
        <Modal show={showEditModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedPost.title}
                  onChange={(e) =>
                    setSelectedPost({ ...selectedPost, title: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={selectedPost.content}
                  onChange={(e) =>
                    setSelectedPost({
                      ...selectedPost,
                      content: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Button variant="primary" onClick={handleUpdatePost}>
                Save Changes
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      )}

      <Modal show={showAddModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter content"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddPost}>
              Add Post
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};
