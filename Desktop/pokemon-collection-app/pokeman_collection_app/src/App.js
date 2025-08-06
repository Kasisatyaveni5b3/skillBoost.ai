import { Routes, Route, Link } from 'react-router-dom';
import { CollectionProvider } from './context/CollectionContext';
import DiscoverPage from './pages/DiscoverPage';
import CollectionPage from './pages/CollectionPage';
import { AppBar, Toolbar, Button, Container } from '@mui/material';

function App() {
  return (
    <CollectionProvider>
      <AppBar position="static" className="bg-red-600">
        <Toolbar className="flex justify-between">
          <div className="flex space-x-4">
            
            <Button color="inherit" component={Link} to="/">Discover</Button>
            <Button color="inherit" component={Link} to="/collection">My Collection</Button>
          </div>
          
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" className="py-6">
        <Routes>
          <Route path="/" element={<DiscoverPage />} />
          <Route path="/collection" element={<CollectionPage />} />
        </Routes>
      </Container>
    </CollectionProvider>
  );
}

export default App;
