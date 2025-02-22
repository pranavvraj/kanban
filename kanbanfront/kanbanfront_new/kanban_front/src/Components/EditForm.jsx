import React, { useState } from "react";
import {
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  Grid,
  Textarea,
  FormControl,
  ModalBody,
  ModalFooter,
  ModalContent,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const EditForm = ({ selectedCard,setSelectedCard,refreshTasks, onClose }) => {
  const toast = useToast();

  const [formData, setFormData] = useState({
    task_id: selectedCard.task_id,
    task_name: selectedCard.task_name,
    task_type: selectedCard.task_type,
    summary: selectedCard.summary,
    description: selectedCard.description,
    acceptance_criteria: selectedCard.acceptance_criteria,
    status: selectedCard.status,
    priority: selectedCard.priority,
    story_points: selectedCard.story_points,
    reporter: selectedCard.reporter,
    assignee: selectedCard.assignee,
    start_date: selectedCard.start_date,
    end_date: selectedCard.end_date,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const refreshToken = async () => {
    try {
      const refresh_token = localStorage.getItem('refresh_token');
  
      if (!refresh_token) {
        console.warn("No refresh token found. User needs to log in.");
        return null; 
      }
  
      const response = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {
        refresh: refresh_token
      });
  
      const new_access_token = response.data.access;
      localStorage.setItem('access_token', new_access_token);
      
      console.log("Access token refreshed successfully");
      return new_access_token;
    } catch (error) {
      console.error("Token refresh failed:", error.response?.data || error.message);
  
      if (error.response?.status === 401) {
        console.warn("Refresh token expired. Logging out user...");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
      }
  
      return null;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("access_token");

    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please log in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/kanban/tasks/put/${selectedCard.task_id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Update Response:", response.data);
      setSelectedCard(response.data); //  Update selectedCard in parent
      refreshTasks(); // Refresh task list
      onClose(); // Close modal

      toast({
        title: "Task updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Update Error:", error.response?.data || error.message);
      toast({
        title: "Failed to update task!",
        description: error.response?.data?.detail || "Something went wrong!",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
  
    let token = localStorage.getItem("access_token");
  
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authentication token found. Please log in.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/kanban/tasks/delete/${selectedCard.task_id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Delete Response:", response.data);
  
      // 🔥 Remove the deleted task from the UI immediately
      if (typeof refreshTasks === "function") {
        refreshTasks(); // Calls API again to fetch updated tasks list
      } else if (typeof setTasks === "function") {
        setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== selectedCard.task_id));
      }
  
      toast({
        title: "Task deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
  
      onClose(); // Close modal if task was being edited
  
    } catch (error) {
      if (error.response?.status === 401 && error.response?.data?.code === "token_not_valid") {
        try {
          const newToken = await refreshToken();
          
          // Retry delete with new token
          await axios.delete(
            `http://127.0.0.1:8000/kanban/tasks/delete/${selectedCard.task_id}/`,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
                "Content-Type": "application/json",
              },
            }
          );
  
          if (typeof refreshTasks === "function") {
            refreshTasks();
          } else if (typeof setTasks === "function") {
            setTasks((prevTasks) => prevTasks.filter((task) => task.task_id !== selectedCard.task_id));
          }
  
          toast({
            title: "Task deleted successfully!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
  
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          toast({
            title: "Session expired",
            description: "Please log in again",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        console.error("Delete Error:", error.response);
        toast({
          title: "Failed to delete task!",
          description: error.response?.data?.detail || "Something went wrong!",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  

  return (
    <ModalContent>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Flex direction="column">
              <FormLabel fontSize="26px" fontWeight="400">
                {formData.task_name}
              </FormLabel>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Summary</FormLabel>
                <Input type="text" name="summary" value={formData.summary} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Description</FormLabel>
                <Textarea name="description" value={formData.description} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Acceptance Criteria</FormLabel>
                <Textarea name="acceptance_criteria" value={formData.acceptance_criteria} onChange={handleChange} />
              </FormControl>
            </Flex>
            <Flex direction="column">
              <FormControl isRequired>
                <FormLabel fontSize="12px">Status</FormLabel>
                <Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Not started">Not started</option>
                  <option value="In progress">In progress</option>
                  <option value="Completed">Completed</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Priority</FormLabel>
                <Select name="priority" value={formData.priority} onChange={handleChange}>
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </Select>
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Story Points</FormLabel>
                <Input type="text" name="story_points" value={formData.story_points} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Reporter</FormLabel>
                <Input type="text" name="reporter" value={formData.reporter} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Assignee</FormLabel>
                <Input type="text" name="assignee" value={formData.assignee} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">Start Date</FormLabel>
                <Input type="date" name="start_date" value={formData.start_date} onChange={handleChange} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontSize="12px">End Date</FormLabel>
                <Input type="date" name="end_date" value={formData.end_date} onChange={handleChange} />
              </FormControl>
            </Flex>
          </Grid>
        </ModalBody>

        <ModalFooter>
          <Button onClick={handleDelete} backgroundColor="red.500" color="white" _hover={{ backgroundColor: "red.600" }} mr={4}>
            Delete
          </Button>
          <Button onClick={handleSubmit} type="submit" backgroundColor="#2a4ecb" color="white" _hover={{ backgroundColor: "#00008B" }} mr={2}>
            Save
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
};

export default EditForm;
