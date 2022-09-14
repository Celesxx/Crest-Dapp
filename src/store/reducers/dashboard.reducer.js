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
    dailyReward: null,
    pendingReward: null,
    crestBalance: null,
    nftsDatas: null,
    badges: [],
    claimBadges: []

  },

  reducers: 
  {
    dashboard: (state, action) => 
    {

      switch(action.payload.action)
      {
        
        case 'dashboard-pe': 

            for(const [key, value] of Object.entries(action.payload.data))
            {
                if(state[key] !== undefined && key != "badges") state[key] = value
                else if(key == "badges" && state[key].userBadges === undefined || key == "badges" && state[key].userBadges === null ) { state.badges = value.map(badge => Object.assign({}, badge, {userNbrBadge: null, userBadges: []})) }
                else console.log(`value not exist : ${key}`)
            }
            break

        case 'dashboard-pr':
            
            for(const [key, value] of Object.entries(action.payload.data))
            {
                if(state[key] !== undefined) { state[key] = value } 
                else console.log(`value not exist : ${key}`)
            }
            break 

        case 'totalBadges': 
            state.totalBadges = action.payload.totalBadges
            break

        case 'claimBadges': 
            state.claimBadges = action.payload.claimBadges
            break

        default :
            break
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions
export default dashboardSlice.reducer