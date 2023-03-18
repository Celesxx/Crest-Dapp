import 'assets/css/index.assets.css';
import 'assets/css/global.assets.css';
import 'assets/css/pages/home.assets.css'
import 'assets/css/blocks/mobile/home.assets.css'
import React from "react";
import LoadingData from "components/blocks/loading-data.block.jsx"
import Language from 'assets/data/language.json'
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
        interval: null,
        firstLoad: false,
        isMobile: props.isMobile,
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

  componentDidMount()
  {
    if(this.state.interval == null) this.state.interval = setInterval(() => this.loadRotationCards(), 6000)
  }

  componentWillUnmount()
  {
      clearInterval(this.state.interval)
      this.state.interval = null
  }

  async loadRotationCards()
  {
    for(let i = 1; i <= 4; i++)
    {
      if(document.getElementById(`item-${i}`).checked === true)
      {
        if(i < 4) document.getElementById(`item-${i + 1}`).checked = true
        else document.getElementById(`item-${1}`).checked = true
        break;
      }
    }
  }

  handleChange(event)
  {
    let target = event.target
    if(target.name == "item-1") document.getElementById("item-1").checked = true;
    else if(target.name == "item-2") document.getElementById("item-2").checked = true;
    else if(target.name == "item-3") document.getElementById("item-3").checked = true;
    else if(target.name == "item-4") document.getElementById("item-4").checked = true;
  }


    render()
    {
      return (

        <div className="home-body flex column">
        
          {
              this.state.startLoading == true && this.state.loadingOver == false&&
              (
                  <LoadingData />
              )
          }

          <div className ="home-head-core flex column">
              <h1 className="home-head-title">{Language[this.state.language].home.title}</h1>
              <p className="home-head-desc">{Language[this.state.language].home.description}</p>
          </div>


          <div className="home-cards-core flex column center">

            <div className="home-cards-container">
              {
                news[this.state.language].map((value, key) => 
                {
                    if(key == 0) { return( <input className="home-cards-input" key={`input-${key + 1}`} type="radio" name={`item-input`} id={`item-${key+1}`} onChange={event => {}} onClick={this.handleChange} defaultChecked/> ) }
                    else return( <input className="home-cards-input" key={`input-${key + 1}`} type="radio" name={`item-input`} id={`item-${key+1}`} onChange={event => {}} onClick={this.handleChange} /> )
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
                              {value.url != "" && <a target="_blank" rel="noopener noreferrer" className="home-card-link" href={value.url} >{ Language[this.state.language].home.link }</a> }
                          </div>
                          {
                            !value.visible && 
                            <div className="home-card-locked flex center">
                              <p className="home-card-title">{ Language[this.state.language].home.coming }</p>
                            </div>
                          }
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
