import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice(
{
  name: 'dashboard',
  initialState: {
    price: 0,
  },

  reducers: 
  {
    dashboard: (state, action) => 
    {
      switch(action.payload.action)
      {
          case 'price': 
              state.price = action.payload.price 
              break;
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions
export default dashboardSlice.reducer