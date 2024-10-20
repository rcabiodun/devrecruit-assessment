import React, { useEffect, useState, useLayoutEffect } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Dashboard = (props) => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // State to store users
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "edit" or "add"
  const [selectedProject, setSelectedProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate(); // React-router navigation

  useLayoutEffect(() => {
    let result = localStorage.getItem("token");
    if (!result) {
      navigate("/login");
    }
  });


  useEffect(() => {
    let result = localStorage.getItem("token");
    if (!result) {
      navigate("/login");
      return;
    }
    props.setLoggedIn(true);
    fetchProjects();
    fetchUsers();
    result = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(result);
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/projects/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      setProjects([...data]);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/api/view-users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setUsers([...data]); // Store users in state
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    localStorage.removeItem("isAdmin"); // Remove isAdmin from localStorage
    props.setLoggedIn(false);
    navigate("/login"); // Redirect to the login page
  };
  // Handle creating or updating a project
  const handleSaveProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let projectData = Object.fromEntries(formData.entries());
    if (projectData["assigned_to"]) {
      projectData["assigned_to"] = Number(projectData["assigned_to"]);
    } else {
      projectData["assigned_to"] = null;
    }
    console.log(projectData);

    //  projectData["assigned_to"]=Numberassigned_to[]
    const method = modalType === "edit" ? "PUT" : "POST";
    const url =
      modalType === "edit"
        ? `http://0.0.0.0:8000/api/projects/${selectedProject.id}/`
        : "http://0.0.0.0:8000/api/projects/";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        fetchProjects(); // Refresh projects list
        setShowModal(false);
      } else {
        console.error("Error saving project");
      }
    } catch (error) {
      console.error("Error saving project", error);
    }
  };

  // Handle deleting a project
  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        let result = await fetch(
          `http://0.0.0.0:8000/api/projects/${projectId}/`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );
        if (result.status === 403) {
          alert("You are not authorized to perform this action");
          return;
        }
        fetchProjects(); // Refresh projects list
      } catch (error) {
        console.error("Error deleting project", error);
      }
    }
  };

  // Open modal for editing or adding a project
  const openModal = (project = null) => {
    setModalType(project ? "edit" : "add");
    setSelectedProject(project);
    setShowModal(true);
  };

  return (
    <div className="container mt-5">
      <h2>Project Dashboard</h2>
      <Button
        variant={isAdmin ? "primary" : "secondary"}
        className="mb-3"
        onClick={() => isAdmin && openModal()}
        disabled={!isAdmin}
      >
        Add Project
      </Button>

      {/* Logout Button */}
      <Button variant="danger" className="mb-3" onClick={handleLogout}>
        Logout
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created By</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.id}</td>
              <td>{project.name}</td>
              <td>{project.description}</td>
              <td>{project.status}</td>
              <td>{project.priority}</td>
              <td>{project.created_by.username}</td>
              <td>
                {project.assigned_to ? project.assigned_to.username : "None"}
              </td>
              <td>
                <Button
                  variant={isAdmin ? "warning" : "secondary"}
                  className="mr-2"
                  onClick={() => isAdmin && openModal(project)}
                  disabled={!isAdmin}
                >
                  Edit
                </Button>
                <Button
                  variant={isAdmin ? "danger" : "secondary"}
                  onClick={() => isAdmin && handleDeleteProject(project.id)}
                  disabled={!isAdmin}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Creating/Editing Project */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === "edit" ? "Edit Project" : "Add Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveProject}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                defaultValue={selectedProject ? selectedProject.name : ""}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                defaultValue={
                  selectedProject ? selectedProject.description : ""
                }
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                defaultValue={selectedProject ? selectedProject.status : ""}
                required
              >
                <option value="in progress">In Progress</option>
                <option value="done">Done</option>
                <option value="abandoned">Abandoned</option>
                <option value="canceled">Canceled</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                defaultValue={selectedProject ? selectedProject.priority : ""}
                required
              >
                <option value="low">Low</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Assign To User</Form.Label>
              <Form.Control as="select" name="assigned_to">
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
