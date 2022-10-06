import 'assets/css/animation/keyframes.assets.css'
import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/profile.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import LoadingData from "components/blocks/loading-data.block.jsx"
import NavbarMobile from "components/blocks/mobile/navbar.mobile.jsx"
import Dashboard from 'components/blocks/dashboard-pr.block.jsx'
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
    return { 
        address: state.login.address,
        startLoading: state.dashboard.startLoading,
        loadingOver: state.dashboard.loadingOver,
    }; 
};


class DashboardGlobal extends React.Component 
{

    constructor(props) 
    {
        super(props);
        this.state = 
        {
            address: this.props.address,
            startLoading: this.props.startLoading,
            loadingOver: this.props.loadingOver,
            width: window.innerWidth,
            isMobile: false

        };
        this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this)
    }
  
    UNSAFE_componentWillMount() 
    { 
      window.addEventListener('resize', this.handleWindowSizeChange);
      this.state.width = document.documentElement.clientWidth
      if(this.state.width <= 1500) this.state.isMobile = true
      else this.state.isMobile = false
      this.forceUpdate()
    }
    componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
    handleWindowSizeChange(event) 
    { 
      this.state.width = document.documentElement.clientWidth
      if(this.state.width <= 1500) this.state.isMobile = true
      else this.state.isMobile = false
      this.forceUpdate()
    }

    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key])
            {   
                this.state[key] = this.props[key] 
                this.forceUpdate();
            }
        }
    }

    render()
    {
        
        return(
            <div className="home p1">

                { this.state.isMobile != true ? <Navbar></Navbar> : <NavbarMobile currentPage="dashboard"></NavbarMobile> }
                { this.state.isMobile != true && <Leftbar></Leftbar> }
                { this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null && <LoadingData /> }
                { this.state.isMobile != true && <Dashboard /> }

            </div>
        );
       
    }
}

export default connect(MapStateToProps)(DashboardGlobal);
