import { Box, Typography, Grid } from '@mui/material';
import { useCollection } from '../context/CollectionContext';
import PokemonCard from '../components/PokemonCard';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default function CollectionPage() {
  const { collection, reorderCollection } = useCollection();

  const onDragEnd = (result) => {
    if (!result.destination) return;
    reorderCollection(result.source.index, result.destination.index);
  };

  return (
    <Box p={2}>
      <Typography variant="h4" mb={2}>My Collection</Typography>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="collection" direction="vertical">
          {(provided) => (
            <Grid container spacing={2} {...provided.droppableProps} ref={provided.innerRef}>
              {collection.map((pokemon, index) => (
                <Draggable key={pokemon.id} draggableId={pokemon.id.toString()} index={index}>
                  {(provided) => (
                    <Grid item xs={12} sm={6} md={4}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <PokemonCard pokemon={pokemon} />
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
