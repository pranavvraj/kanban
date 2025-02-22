import React, { useEffect, useState } from "react";
import {
  Grid,
  GridItem,
  Box,
  Input,
  Modal,
  ModalOverlay,
} from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";

import EditForm from "./EditForm";
import axios from "axios";
import "./styles.css";
import Column from "./Column";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
function ColumnContainer() {
  const [task, setTask] = useState({}); 
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searched, setSearched] = useState(""); 

  const searchChange = (e) => {
    setSearched(e.target.value);
  };

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const onCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const refreshTasks = async () => {
    try {
      let token = localStorage.getItem("access_token");
      const response = await axios.get(`${API_BASE_URL}/kanban/tasks/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTask(response.data); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("access_token"); 

        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/kanban/tasks/get/`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        const data = response.data;
        setTask(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  // Search function
  const filterTasks = (tasks, searchTerm) => {
    if (!searchTerm) return tasks || [];

    return tasks
      ? tasks.filter(
          (t) =>
            t.task_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.summary.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : [];
  };

  const searchNotStarted = filterTasks(task.not_started, searched);
  const searchInProgress = filterTasks(task.in_progress, searched);
  const searchCompleted = filterTasks(task.completed, searched);

  return (
    <Grid
      marginTop="250px"
      templateColumns="repeat(3, 1fr)"
      gap={43}
      width="664px"
      marginLeft="73px"
      position="absolute"
    >
      <GridItem
        colSpan={3}
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "white",
          borderBottom: "1px solid #eeeeee",
        }}
      >
        <Box p={3}>
          <Input
            placeholder="Search a task"
            value={searched}
            onChange={searchChange}
          />
        </Box>
      </GridItem>
      <GridItem backgroundColor="#eeeeee" height="fit-content">
        <Box backgroundColor="white" textAlign="left" paddingBottom="5px">
          Not started ({searchNotStarted.length})
        </Box>
        <Box p={3}>
          <AnimatePresence>
            {searchNotStarted.map((card, index) => (
              <Column
                card={card}
                key={index}
                handleCardClick={handleCardClick}
              />
            ))}
          </AnimatePresence>
        </Box>
      </GridItem>
      <GridItem backgroundColor="#eeeeee" height="fit-content">
        <Box backgroundColor="white" textAlign="left" paddingBottom="5px">
          In progress ({searchInProgress.length})
        </Box>
        <Box p={4}>
          <AnimatePresence>
            {searchInProgress.map((card, index) => (
              <Column
                card={card}
                key={index}
                handleCardClick={handleCardClick}
              />
            ))}
          </AnimatePresence>
        </Box>
      </GridItem>
      <GridItem backgroundColor="#eeeeee" height="fit-content">
        <Box backgroundColor="white" textAlign="left" paddingBottom="5px">
          Completed ({searchCompleted.length})
        </Box>
        <Box p={4}>
          <AnimatePresence>
            {searchCompleted.map((card, index) => (
              <Column
                card={card}
                key={index}
                handleCardClick={handleCardClick}
              />
            ))}
          </AnimatePresence>
        </Box>
      </GridItem>

      {selectedCard && (
        <Modal isOpen={isModalOpen} onClose={onCloseModal} size={"2xl"}>
          <ModalOverlay />
          <EditForm 
          selectedCard={selectedCard} 
          setSelectedCard={setSelectedCard}  
          refreshTasks={refreshTasks}       
          onClose={onCloseModal}            
        />
        </Modal>
      )}
    </Grid>
  );
}

export default ColumnContainer;
