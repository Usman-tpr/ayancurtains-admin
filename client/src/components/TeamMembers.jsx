import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const TeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    description: '',
    order: 0,
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get('/api/about');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleOpen = (member = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name || '',
        position: member.position || '',
        description: member.description || '',
        order: member.order || 0,
        image: null,
      });
      setImagePreview(member.image);
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        position: '',
        description: '',
        order: 0,
        image: null,
      });
      setImagePreview(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      description: '',
      order: 0,
      image: null,
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image && !editingMember) {
      alert('Please upload an image');
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      if (editingMember) {
        await axios.put(`/api/about/${editingMember._id}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('/api/about', formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      fetchTeamMembers();
      handleClose();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await axios.delete(`/api/about/${id}`);
        fetchTeamMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

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
          Team Members
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          fullWidth={isMobile}
        >
          Add Team Member
        </Button>
      </Box>

      <Grid container spacing={2}>
        {teamMembers.map((member) => (
          <Grid item xs={12} sm={6} md={4} key={member._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={`https://admin.ayancurtains.com/${member.image}`}
                alt={member.name || 'Team Member'}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                {member.name && (
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                )}
                {member.position && (
                  <Typography color="textSecondary" gutterBottom>
                    {member.position}
                  </Typography>
                )}
                {member.description && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {member.description}
                  </Typography>
                )}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    onClick={() => handleOpen(member)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDelete(member._id)}
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

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          {editingMember ? 'Edit Team Member' : 'Add Team Member'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              margin="normal"
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              margin="normal"
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={4}
              size={isMobile ? "small" : "medium"}
            />
            <TextField
              fullWidth
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleInputChange}
              margin="normal"
              size={isMobile ? "small" : "medium"}
            />
            <Box sx={{ mt: 2 }}>
              <input
                accept="image/*"
                type="file"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-upload"
                required={!editingMember}
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  fullWidth
                  size={isMobile ? "small" : "medium"}
                >
                  {editingMember ? 'Change Image' : 'Upload Image *'}
                </Button>
              </label>
              {imagePreview && (
                <Box sx={{ mt: 1 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: { xs: 1, sm: 2 } }}>
            <Button 
              onClick={handleClose}
              size={isMobile ? "small" : "medium"}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              size={isMobile ? "small" : "medium"}
            >
              {editingMember ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default TeamMembers; 
