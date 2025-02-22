import React from "react";
import { Heading } from "@chakra-ui/react";
import Form from "./Form";
import ColumnContainer from "./ColumnContainer";
import Chatbot from "./Chatbot";



function Dashboard() {
  return (
    <>
      <Heading
        fontSize="36px"
        fontWeight="400"
        position="absolute"
        left="102px"
        top="102px"
        maxWidth="239px"
        maxHeight="44px"
        textAlign="left"
        lineHeight="43.57px"
        border="none"
        padding="0"
      >
        Kanban Board
      </Heading>
      <Heading
        fontSize="24px"
        fontWeight="400"
        position="absolute"
        left="102px"
        top="146px"
        maxWidth="210px"
        maxHeight="29px"
        textAlign="left"
        lineHeight="29.05px"
        border="none"
        padding="0"
      >
        Your tasks
      </Heading>

      <Form />
      <ColumnContainer />
      <Chatbot/>
    </>
  );
}

export default Dashboard;
