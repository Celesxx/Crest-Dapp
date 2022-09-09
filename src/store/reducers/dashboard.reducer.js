import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice(
{
  name: 'dashboard',
  initialState: 
  {
    resToken: null,
    resStable: null,
    totalSupply: null,
    totalBurn: null,
    price: null,
    marketCap: null,
    totalBadges: null,
    globalBadges: null,
    badge1: 
    {
        name: null,
        totalSupply: null,
        max: null,
    },
    badge2:
    {
        name: null,
        totalSupply: null,
        max: null,
    },
    badge3:
    {
        name: null,
        totalSupply: null,
        max: null,
    },
  },

  reducers: 
  {
    dashboard: (state, action) => 
    {
      switch(action.payload.action)
      {
        case 'resToken': 
            state.resToken = action.payload.resToken 
            break;

        case 'resStable': 
            state.resStable = action.payload.resStable 
            break;

        case 'totalSupply': 
            state.totalSupply = action.payload.totalSupply 
            break;

        case 'totalBurn': 
            state.totalBurn = action.payload.totalBurn 
            break;

        case 'price': 
            state.price = action.payload.price 
            break;
        
        case 'marketCap': 
            state.marketCap = action.payload.marketCap 
            break;

        case 'globalBadges': 
            state.globalBadges = action.payload.globalBadges
            state.badge1.name = state.globalBadges[0].name
            state.badge1.totalSupply = state.globalBadges[0].totalSupply
            state.badge1.max = state.globalBadges[0].max
            state.badge2.name = state.globalBadges[1].name
            state.badge2.totalSupply = state.globalBadges[1].totalSupply
            state.badge2.max = state.globalBadges[1].max
            state.badge3.name = state.globalBadges[2].name
            state.badge3.totalSupply = state.globalBadges[2].totalSupply
            state.badge3.max = state.globalBadges[2].max 
            break;

        case 'totalBadges': 
            state.totalBadges = action.payload.totalBadges
            
            break;
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions
export default dashboardSlice.reducer