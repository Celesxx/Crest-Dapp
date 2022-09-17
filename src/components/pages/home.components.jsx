import 'assets/index.assets.css';
import 'assets/global.assets.css';
import React from "react";
import Navbar from "components/blocks/navbar.components.jsx"
import Leftbar from "components/blocks/leftbar.components.jsx"
import LoadingData from "components/blocks/loadingData.components.jsx"
import LoadingAnimation from 'assets/img/crest-loading.mp4'
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    startLoading: state.dashboard.startLoading,
    loading: state.dashboard.loading,
    loadingMax: state.dashboard.loadingMax,
    loadingOver: state.dashboard.loadingOver,
  }; 
};

class Index extends React.Component 
{

  constructor(props) 
  {
      super(props);

      this.state = 
      {
        address: this.props.address,
        startLoading: this.props.startLoading,
        loading: this.props.loading,
        loadingMax: this.props.loadingMax,
        loadingOver: this.props.loadingOver,
        loadingDiv: [],
      };
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

          <Navbar></Navbar>
          <Leftbar></Leftbar>
        
          <div className="home-body flex column">
           
          {
            this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null &&
            (
              <LoadingData />
            )
          }

          </div>

          <div className="home-ellipse flex column center">
            <div className="ellipse l1"></div>
          </div>
          
          <div className="home-ellipse flex column center">
            <div className="ellipse l2"></div>
          </div>

          <div className="home-ellipse flex column center">
            <div className="ellipse l3"></div>
          </div>

        </div>

      );
    }
}

export default connect(MapStateToProps)(Index);
