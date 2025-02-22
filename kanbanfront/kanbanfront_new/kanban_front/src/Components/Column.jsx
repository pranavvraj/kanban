import React from "react";
import { Box, Button, Text, Flex } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
function Column({ card, handleCardClick }) {
  return (
    <motion.div
      key={card.task_id}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.4 }}
    >
      <Box
        className="taskbox"
        marginBottom="12px"
        onClick={() => {
          handleCardClick(card);
        }}
        backgroundColor="white"
        key={card.task_id}
        borderWidth="1px"
        overflow="hidden"
        p={3}
        position="relative"
        transition="transform 0.4s ease"
        _hover={{
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
          cursor: "pointer",
          transform: "scale(1.2)",
          zIndex: 10,
          maxHeight: "unset",
        }}
        maxHeight="110px"
      >
        <Text
          className="taskname"
          fontWeight="500"
          fontSize="14px"
          overflow="hidden"
          height="25px"
          textOverflow="ellipsis"
          align="left"
          transition="font-size 0.2s ease"
        >
          {card.task_name}
        </Text>

        <Text
          className="taskname"
          align="left"
          minWidth="177px"
          fontSize="12px"
          fontWeight="400"
          overflow="hidden"
          height="35px"
          textOverflow="ellipsis"
          marginBottom="20px"
        >
          {card.description}
        </Text>

        <Flex
          justifyContent="flex-end"
          alignItems="flex-end"
          position="absolute"
          bottom={3}
          right={3}
        >
          <Flex alignItems="flex-end" gap="7px">
            <Box>
              <Text fontSize="12px">
                {card.priority == "1" ? (
                  <ChevronUpIcon color="red" />
                ) : (
                  <ChevronDownIcon
                    color={card.priority == "2" ? "blue" : "green"}
                  />
                )}
                {card.priority == "1"
                  ? "High"
                  : card.priority == "2"
                  ? "Medium"
                  : "Low"}
              </Text>
            </Box>
            <Box marginTop="10px">
              <Button
                fontSize="10px"
                fontWeight="400"
                borderRadius="58px"
                height="16px"
                width="30px"
                minWidth="0"
                px={2}
                ml={1}
              >
                {card.story_points}
              </Button>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </motion.div>
  );
}

export default Column;
