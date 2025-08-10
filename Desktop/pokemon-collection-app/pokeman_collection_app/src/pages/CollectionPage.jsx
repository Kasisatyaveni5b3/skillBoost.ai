import React from "react";
import { useCollection } from "../context/CollectionContext";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CollectionPage() {
  const { collection, reorderCollection, removeFromCollection } = useCollection();

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const updated = Array.from(collection);
    const [removed] = updated.splice(source.index, 1);
    updated.splice(destination.index, 0, removed);

    reorderCollection(updated);
  };

  return (
    <Box padding={2}>
      <Typography variant="h5" gutterBottom>
        My Pokémon Collection
      </Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="collection-droppable" direction="horizontal">
          {(provided) => (
            <Grid
              container
              spacing={2}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {collection.map((pokemon, index) => (
                <Draggable
                  key={pokemon.name}
                  draggableId={pokemon.name}
                  index={index}
                >
                  {(provided) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Card sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                        <Avatar
                          src={pokemon.image}
                          alt={pokemon.name}
                          sx={{ width: 56, height: 56, marginRight: 2 }}
                        />
                        <CardContent sx={{ flex: 1 }}>
                          <Typography variant="h6">{pokemon.name}</Typography>
                          <Typography variant="body2">
                            Types: {pokemon.types?.join(", ")}
                          </Typography>
                          <Typography variant="body2">
                            HP: {pokemon.stats?.hp} | Attack: {pokemon.stats?.attack} | Defense: {pokemon.stats?.defense}
                          </Typography>
                        </CardContent>
                        <IconButton onClick={() => removeFromCollection(pokemon.name)}>
                          <DeleteIcon />
                        </IconButton>
                      </Card>
                    </Grid>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  );
}
