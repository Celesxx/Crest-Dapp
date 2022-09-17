import { createSlice, isPlainObject } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice(
{
  name: 'dashboard',
  initialState: 
  {
    startLoading: false,
    loading: 0,
    loadingMax: 14,
    loadingOver: false,
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
    claimBadges: [],
    totalReward: {0: null, 1: null, 2: null},
    tokenUser: 
    {
      balance: null,
      allowanceLm: false,
    },
    stableUser: 
    {
      balance: null,
      allowanceLm: false,
    },
    allowanceDispatchManager: {},
  },

  reducers: 
  {
    dashboard: (state, action) => 
    {

      switch(action.payload.action)
      {
        
        // case 'dashboard-pe': 

        //     for(const [key, value] of Object.entries(action.payload.data))
        //     {
        //         if(state[key] !== undefined && key != "badges") state[key] = value
        //         else if(key == "badges" && state[key].userBadges === undefined || key == "badges" && state[key].userBadges === null ) { state.badges = value.map(badge => Object.assign({}, badge, {userNbrBadge: null, userBadges: []})) }
        //         else console.log(`value not exist : ${key}`)
        //     }
        //     break

        case 'saveData':
            
          for(const [key, value] of Object.entries(action.payload.data))
          {
              if(state[key] !== undefined)
              { 
                if(typeof(value) === "object" && !Array.isArray(value))
                {
                  for(const [key1, value1] of Object.entries(value)) 
                  { 
                    if(state[key][key1] !== undefined) { state[key][key1] = value1 } 
                  }
                }
                else state[key] = value 
              } 
              else console.log(`value not exist : ${key}`)
          }
          break 

        case 'loading':
            state.loading += 1
            if(state.loading == state.loadingMax) { state.loadingOver = true }
            break;

        case 'startLoading': 
            state.startLoading = true
            break

        // case 'claimBadges': 
        //     state.claimBadges = action.payload.claimBadges
        //     break

        // case 'swap': 
        //   for(const [key, value] of Object.entries(action.payload.data))
        //   {
        //       if(state[key] !== undefined)
        //       { 
        //         if(typeof(value) === "object")
        //         {
        //           for(const [key1, value1] of Object.entries(value)) { if(state[key][key1] !== undefined) { state[key][key1] = value1 } }
        //         }
        //         else state[key] = value 
        //       } 
        //       else console.log(`value not exist : ${key}`)
        //   }
        //   break

        default :
            break
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions
export default dashboardSlice.reducer