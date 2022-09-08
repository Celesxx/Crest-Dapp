import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice(
{
  name: 'loginMetamask',
  initialState: {
    address: "",
    provider: "",
  },

  reducers: 
  {
    login: (state, action) => 
    {
      switch(action.payload.action)
      {
          case 'address': 
              state.address = action.payload.address 
              break;

          case 'provider':
              state.provider = action.payload.provider
              break;
      }
    },
  },
})

export const { login, disconnect } = loginSlice.actions

export default loginSlice.reducer