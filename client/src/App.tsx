import React from 'react';
import { Container, Typography } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { Etusivu } from './components/Etusivu';

const App: React.FC = (): React.ReactElement => {

  return (
    <Container maxWidth="md">

      <Typography variant="h3" align="center">Postimerkkihaku</Typography>

      <Routes>
        <Route path="/" element={ <Etusivu />} />
      </Routes>


    </Container>
  );
}

export default App;