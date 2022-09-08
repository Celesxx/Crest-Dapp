import 'assets/blocks/loading.assets.css';
import 'assets/global.assets.css';

import React from "react";


class Loading extends React.Component 
{

  render()
    {
      return(
          <div className="loading-home flex column center">

            <svg className="loading-svg" width="300" height="300" viewBox="0 0 100 100">
                <polyline class="line-cornered stroke-still" points="100,0 100,0 100, 100" stroke-width="10" fill="none"></polyline>
                <polyline class="line-cornered stroke-still" points="100,0 100,0 0, 100" stroke-width="10" fill="none"></polyline>
                <polyline class="line-cornered stroke-still" points="0,100 0,100 100,100" stroke-width="10" fill="none"></polyline>
                
                <polyline class="line-cornered stroke-animation" points="100,0 100,0 0, 100" stroke-width="10" fill="none"></polyline>
                <polyline class="line-cornered stroke-animation" points="100,0 100,0 100, 100" stroke-width="10" fill="none"></polyline>
                <polyline class="line-cornered stroke-animation" points="0,100 0,100 100,100" stroke-width="10" fill="none"></polyline>
            </svg>

          </div>
      );
    }
}

export default Loading;



