import React, { useState } from "react";
import {
  FormLabel,
  Input,
  Select,
  Button,
  Flex,
  Grid,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
} from "@chakra-ui/react";

import axios from "axios";

const Form = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [formData, setFormData] = useState({
    task_name: "",
    task_type: "",
    start_date: "",
    end_date: "",
    priority: "2",
    description: "",
    summary: "",
    acceptance_criteria: "",
    story_points: "",
    status: "Not started",
    col: 1,
    reporter: "",
    assignee: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      name === "story_points" &&
      value !== "" &&
      (isNaN(value) || value < 1 || value > 5)
    ) {
      return;
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/kanban/tasks/get/",
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log(response.data);
      window.location.reload();
      alert("Task created successfully");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("You are not authorized. Please login again.");
      } else {
        console.log(error);
        alert("Error creating task");
      }
    }
    onClose();
  };

  return (
    <>
      <Button
        _hover={{
          backgroundColor: "#00008B",
        }}
        border="none"
        position="absolute"
        top="220px"
        left="106px"
        width="79px"
        height="30px"
        borderRadius="4px"
        borderColor="#D9D9D9"
        backgroundColor="#2a4ecb"
        color="white"
        fontFamily="Inter"
        fontWeight="200"
        onClick={onOpen}
      >
        Create
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={"2xl"}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <Flex justify="space-between">
              <ModalHeader style={{ whiteSpace: "nowrap" }}>
                Create a task
              </ModalHeader>

              <ModalHeader
                fontSize="15px"
                fontWeight="400"
                color="#00000080"
                style={{ whiteSpace: "nowrap" }}
              >
                Please fill in all fields to create a task
              </ModalHeader>
            </Flex>

            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap={4}>
                <Flex direction="column">
                  <FormControl isRequired>
                    <FormLabel
                      className="title"
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Task Name
                    </FormLabel>

                    <Input
                      type="text"
                      name="task_name"
                      value={formData.task_name}
                      placeholder=""
                      onChange={handleChange}
                      style={{
                        height: "32px",
                        width: "391.3px",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      className="title"
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Summary
                    </FormLabel>

                    <Input
                      type="text"
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      style={{
                        height: "32px",
                        width: "391.3px",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Description
                    </FormLabel>

                    <Textarea
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      style={{
                        height: "249px",
                        width: "391px",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Acceptance Criteria
                    </FormLabel>

                    <Textarea
                      type="text"
                      name="acceptance_criteria"
                      value={formData.acceptance_criteria}
                      onChange={handleChange}
                      style={{
                        height: "111px",
                        width: "391px",
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                </Flex>
                <Flex direction="column">
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Status
                    </FormLabel>

                    <Select
                      fontSize="12px"
                      fontWeight="400"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    >
                      <option value="Not started">Not Started</option>
                      <option value="In progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Task Type
                    </FormLabel>
                    <Input
                      type="text"
                      name="task_type"
                      value={formData.task_type}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Priority
                    </FormLabel>
                    <Select
                      fontSize="12px"
                      fontWeight="400"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    >
                      <option value="1">High</option>
                      <option value="2">Medium</option>
                      <option value="3">Low</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Story Points
                    </FormLabel>
                    <Input
                      type="number"
                      name="story_points"
                      value={formData.story_points}
                      placeholder="1 to 5"
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Reporter
                    </FormLabel>
                    <Input
                      type="text"
                      name="reporter"
                      value={formData.reporter}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Assignee
                    </FormLabel>
                    <Input
                      type="text"
                      name="assignee"
                      value={formData.assignee}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      Start Date
                    </FormLabel>
                    <Input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel
                      fontSize="12px"
                      color="#00000080"
                      fontWeight="400"
                    >
                      End Date
                    </FormLabel>
                    <Input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleChange}
                      style={{
                        borderRadius: "4px",
                        border: "1px solid #d9d9d9",
                      }}
                    />
                  </FormControl>
                </Flex>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                variant="ghost"
                mr={3}
                onClick={onClose}
                backgroundColor="white"
                color="#00000080"
                fontWeight="400px"
                width="79px"
                height="30px"
                borderRadius="4px"
              >
                Cancel
              </Button>
              <Button
                _hover={{
                  backgroundColor: "#00008B",
                }}
                backgroundColor="#2a4ecb"
                color="white"
                width="79px"
                height="30px"
                borderRadius="4px"
                type="submit"
              >
                Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

export default Form;