import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  CardMedia,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CurtainList = () => {
  const [curtains, setCurtains] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchCurtains();
  }, []);

  const fetchCurtains = async () => {
    try {
      const response = await axios.get('/api/curtains');
      setCurtains(response.data);
    } catch (error) {
      console.error('Error fetching curtains:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this curtain?')) {
      try {
        await axios.delete(`/api/curtains/${id}`);
        fetchCurtains();
      } catch (error) {
        console.error('Error deleting curtain:', error);
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return `₹${price.toLocaleString()}`;
  };

  if (isMobile) {
    return (
      <Box sx={{ p: { xs: 1, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Curtains
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/curtains/new')}
            fullWidth={isMobile}
          >
            Add Curtain
          </Button>
        </Box>

        <Grid container spacing={2}>
          {curtains.map((curtain) => (
            <Grid item xs={12} key={curtain._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={curtain.image}
                  alt={curtain.title || 'Curtain Image'}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {curtain.title || 'Untitled'}
                  </Typography>
                  {curtain.category && (
                    <Typography color="textSecondary" gutterBottom>
                      Category: {curtain.category}
                    </Typography>
                  )}
                  {curtain.price && (
                    <Typography variant="body1" color="primary" gutterBottom>
                      Price: {formatPrice(curtain.price)}
                    </Typography>
                  )}
                  {curtain.description && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {curtain.description}
                    </Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton 
                      onClick={() => navigate(`/curtains/edit/${curtain._id}`)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(curtain._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 3 } }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Curtains
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/curtains/new')}
        >
          Add Curtain
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {curtains.map((curtain) => (
              <TableRow key={curtain._id}>
                <TableCell>
                  <img
                    src={curtain.image}
                    alt={curtain.title || 'Curtain Image'}
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{curtain.title || 'Untitled'}</TableCell>
                <TableCell>{curtain.category || 'N/A'}</TableCell>
                <TableCell>{formatPrice(curtain.price)}</TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      maxWidth: '300px',
                    }}
                  >
                    {curtain.description || 'No description'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/curtains/edit/${curtain._id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(curtain._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CurtainList; 