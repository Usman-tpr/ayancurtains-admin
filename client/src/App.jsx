import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import CurtainList from './components/CurtainList';
import CurtainForm from './components/CurtainForm';
import Layout from './components/Layout';
import TeamMembers from './components/TeamMembers';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/curtains" element={<CurtainList />} />
            <Route path="/curtains/new" element={<CurtainForm />} />
            <Route path="/curtains/edit/:id" element={<CurtainForm />} />
            <Route path="/team" element={<TeamMembers />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App; 