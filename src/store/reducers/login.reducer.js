import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice(
{
  name: 'loginMetamask',
  initialState: {
    value: "",
  },
  reducers: 
  {
    login: (state, action) => 
    { 
      console.log("test1")
      console.log("state : ", state.value)
      console.log("action : ", action.payload.address)
      state.value = action.payload.address
      console.log("state after : ", state.value)
    },
    
  },
})

export const { login, disconnect } = loginSlice.actions

export default loginSlice.reducer