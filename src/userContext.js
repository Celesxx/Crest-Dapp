import React, { Component } from 'react'

const UserContext = React.createContext()

class UserProvider extends Component {
  state = { address: "", provider: {} }

  setAddress = (address) => { this.setState((prevState) => ({ address })) }
  setProvider = (provider) => { this.setState((prevState) => ({ provider })) }

  render() 
  {
    const { children } = this.props
    const { address } = this.state
    const { setAddress } = this
    const { provider } = this.state
    const { setProvider } = this

    return (
      <UserContext.Provider value={{ address, setAddress, provider, setProvider, }} >
            {children}
      </UserContext.Provider>
    )
  }
}
export default UserContext
const UserConsumer = UserContext.Consumer
export { UserProvider, UserConsumer }