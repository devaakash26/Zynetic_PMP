import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'price', headerName: 'Price', width: 110, type: 'number' },
];

const rows = [
  { id: 1, name: 'Test Product 1', price: 35.99 },
  { id: 2, name: 'Test Product 2', price: 42.99 },
  { id: 3, name: 'Test Product 3', price: 18.50 },
];

const TestDataGrid = () => {
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Test DataGrid Component
      </Typography>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />
    </Box>
  );
};

export default TestDataGrid; 