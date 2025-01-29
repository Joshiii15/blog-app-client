import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { Notyf } from "notyf";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const notyf = new Notyf();

  // Fetch all posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `https://blog-app-api-4c9z.onrender.com/posts/`,
          // "http://localhost:4000/posts/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };

    fetchPosts();
  }, []);

  // Handle delete single post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://blog-app-api-4c9z.onrender.com/posts/admin/deletePost/${postId}`,
        // `http://localhost:4000/posts/admin/deletePost/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      notyf.success("Post Deleted");
      setPosts(posts.filter((post) => post._id !== postId));
      setShowConfirmDelete(false);
    } catch (error) {
      console.error("Error deleting post", error);
      notyf.error(error);
    }
  };

  // Handle delete all posts
  const handleDeleteAllPosts = async () => {
    try {
      await axios.delete(
        `https://blog-app-api-4c9z.onrender.com/posts/admin/deletePost`,
        // "http://localhost:4000/posts/admin/deletePost",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
      notyf.success("All posts deleted");
      setPosts([]);
      setConfirmDeleteAll(false);
    } catch (error) {
      console.error("Error deleting all posts", error);
      notyf.error(error);
    }
  };

  return (
    <Container className="mt-5">
      <h1 className="text-center text-white mb-4">Admin Dashboard</h1>
      {posts.length > 0 ? (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, index) => (
                <tr key={post._id}>
                  <td>{index + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.author.name}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => {
                        setSelectedPostId(post._id);
                        setShowConfirmDelete(true);
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="text-center mt-4">
            <Button variant="danger" onClick={() => setConfirmDeleteAll(true)}>
              Delete All Posts
            </Button>
          </div>
        </>
      ) : (
        <h4 className="text-center">No posts available</h4>
      )}

      {/* Confirm Delete All Modal */}
      <Modal
        show={confirmDeleteAll}
        onHide={() => setConfirmDeleteAll(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete all posts?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setConfirmDeleteAll(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDeleteAllPosts()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this post?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeletePost(selectedPostId)}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
