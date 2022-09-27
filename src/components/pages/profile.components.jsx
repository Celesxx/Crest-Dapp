import 'assets/animation/keyframes.assets.css'
import 'assets/index.assets.css';
import 'assets/global.assets.css';
import 'assets/pages/profile.assets.css'
import React from "react";
import Navbar from "components/blocks/navbar.block.jsx"
import Leftbar from "components/blocks/leftbar.block.jsx"
import { connect } from 'react-redux'
import LoadingData from "components/blocks/loading-data.block.jsx"
import Dashboard from 'components/blocks/profile.block.jsx'
import NavbarMobile from "components/blocks/navbarMobile.block.jsx"

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
            width: window.innerWidth,
            startLoading: this.props.startLoading,
            loadingOver: this.props.loadingOver,
        };

    }

    UNSAFE_componentWillMount() { window.addEventListener('resize', this.handleWindowSizeChange); }
    componentWillUnmount() { window.removeEventListener('resize', this.handleWindowSizeChange); }
    handleWindowSizeChange = () => { this.state.width = window.innerWidth };
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
        const isMobile = this.state.width <= 500;
        if(!isMobile)
        {
            return(
            <div className="home p1">

                <Navbar></Navbar>
                <Leftbar></Leftbar>

                {
                    this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null &&
                    ( <LoadingData /> )
                }

                <Dashboard />
            
            </div>

            );
        }
        else
        {
            return(
                <NavbarMobile currentPage="profile"></NavbarMobile>
            )
        }
    }
}

export default connect(MapStateToProps)(DashboardGlobal);
