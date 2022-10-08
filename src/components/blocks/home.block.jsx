import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/home.assets.css'
import React from "react";
import LoadingData from "components/blocks/loading-data.block.jsx"
import { connect } from 'react-redux'
import { news } from 'assets/data/news.js'

const MapStateToProps = (state) => {
  return { 
    address: state.login.address,
    startLoading: state.dashboard.startLoading,
    loading: state.dashboard.loading,
    loadingMax: state.dashboard.loadingMax,
    loadingOver: state.dashboard.loadingOver,
    language: state.login.language,

  }; 
};

class Home extends React.Component 
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
        language: this.props.language,
      };

      this.handleChange = this.handleChange.bind(this)
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

  handleChange(event)
  {
    let target = event.target
    if(target.name == "item-1") 
    {
      document.getElementById("item-2").checked = false;
      document.getElementById("item-3").checked = false;
      document.getElementById("item-4").checked = false;
      document.getElementById("item-1").checked = true;
    
    }else if(target.name == "item-2") 
    {
      document.getElementById("item-1").checked = false;
      document.getElementById("item-3").checked = false;
      document.getElementById("item-4").checked = false;
      document.getElementById("item-2").checked = true;
    
    }else if(target.name == "item-3")
    {
      document.getElementById("item-1").checked = false;
      document.getElementById("item-2").checked = false;
      document.getElementById("item-4").checked = false;
      document.getElementById("item-3").checked = true;
    
    }else if(target.name == "item-4")
    {
      document.getElementById("item-1").checked = false;
      document.getElementById("item-2").checked = false;
      document.getElementById("item-3").checked = false;
      document.getElementById("item-4").checked = true;
    }
  }


    render()
    {
        return (

            <div className="home-body flex column">
            
                {
                    this.state.startLoading == true && this.state.loadingOver == false && this.state.address !== null &&
                    (
                        <LoadingData />
                    )
                }

                <div className ="home-head-core flex column">
                    <h1 className="home-head-title">News and Update</h1>
                    <p className="home-head-desc">here you will find all the news and updates of the dApp</p>
                </div>


                <div className="home-cards-core flex column center">

                <div className="home-cards-container">
                    {
                    news[this.state.language].map((value, key) => 
                    {
                        if(key == 0) { return( <input className="home-cards-input" key={`input-${key}`} type="radio" name={`item-${key+1}`} id={`item-${key+1}`} onChange={event => {}} onClick={this.handleChange} checked/> ) }
                        else return( <input className="home-cards-input" key={`input-${key}`} type="radio" name={`item-${key+1}`} id={`item-${key+1}`} onChange={event => {}} onClick={this.handleChange}/> )
                    })
                    }
                    <div className="home-cards-content flex row center">

                        {
                        news[this.state.language].map((value, key) => 
                        {
                            return(
                            <label className="home-card flex row" key={`label-${key}`}  htmlFor={`item-${key+1}`} id={`card-${key+1}`}>
                            <div className="home-card-image-core flex center">
                                <img className="home-card-image" src={value.img} alt="" /> 
                            </div>

                            <div className="home-card-description-core flex column">
                                <h1 className="home-card-title">{ value.title }</h1>
                                <p className="home-card-description">{ value.desc }</p>
                            </div>
                            </label>
                        )})
                        }
                        
                    </div>
                </div>

                </div>

            </div>
          

        );
    }
}

export default connect(MapStateToProps)(Home);
