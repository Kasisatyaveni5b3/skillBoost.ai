import { useState } from 'react';
import { AppBar, Toolbar, Tabs, Tab, Container } from '@mui/material';
import DiscoverPage from './pages/DiscoverPage';
import CollectionPage from './pages/CollectionPage';

function App() {
  const [tab, setTab] = useState(0);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Tabs
            value={tab}
            onChange={(e, newVal) => setTab(newVal)}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Discover Pokemon" />
            <Tab label="My Collection" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        {tab === 0 ? <DiscoverPage /> : <CollectionPage />}
      </Container>
    </>
  );
}

export default App;