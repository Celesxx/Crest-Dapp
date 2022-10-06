import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/blocks/loadingData.assets.css';
import React from "react";
import { connect } from 'react-redux'

const MapStateToProps = (state) => {
  return { 
    loading: state.dashboard.loading,
  }; 
};

class LoadingData extends React.Component 
{

    constructor(props) 
    {
        super(props);

        this.state = 
        {
            loadingDiv: [],
            loading: this.props.loading
        };
    }


    componentDidUpdate(prevProps, prevState, snapshot) 
    {
        for(const [key, value] of Object.entries(this.state))
        {
            if (prevProps[key] !== this.props[key] && this.state[key] != undefined)
            {   
                this.state[key] = this.props[key]
                if(key == "loading")
                {
                    this.state.loadingDiv.push( <div key={this.props[key]} className="loading-bar"></div> )
                }
                this.forceUpdate();
            }
        }
    }


    render()
    {
        return(
            <div className="loading-bar-core flex column center">
                <h1 className="loading-bar-title">Loading</h1>
                <div className="loading-bar-base border-gradient-bluePink flex row">
                    {this.state.loadingDiv}
                </div>
            </div>
        )
    }
}

export default connect(MapStateToProps)(LoadingData);
