import 'assets/index.assets.css';
import 'assets/global.assets.css';
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "components/blocks/navbar.components.jsx"

class Index extends React.Component 
{
  render()
    {
      return(
        <div className="home p1">

          <Navbar></Navbar>

          <div className="home-body flex column">
           
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

export default Index;
