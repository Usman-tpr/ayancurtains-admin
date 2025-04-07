import { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    todayUsers: 0,
    totalCurtains: 0,
  });

  const [visitorsData, setVisitorsData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Visitors',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Fetch statistics
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    // Fetch visitors data
    const fetchVisitorsData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stats/visitors');
        setVisitorsData({
          labels: response.data.map(item => item.date),
          datasets: [{
            label: 'Daily Visitors',
            data: response.data.map(item => item.count),
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          }],
        });
      } catch (error) {
        console.error('Error fetching visitors data:', error);
      }
    };

    fetchStats();
    fetchVisitorsData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h5">
                {stats.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Today's Visitors
              </Typography>
              <Typography variant="h5">
                {stats.todayUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Curtains
              </Typography>
              <Typography variant="h5">
                {stats.totalCurtains}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Visitor Statistics
            </Typography>
            <Box sx={{ height: 300 }}>
              <Line
                data={visitorsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Daily Visitors',
                    },
                  },
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 