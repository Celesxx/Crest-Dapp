import Index from "components/pages/home.components.jsx";
import { BrowserRouter as Router, Route } from "react-router-dom";

function BaseRoute()
{
    return(
        <Router>
            <Route path="/" exact component={Index} />
        </Router>
    );
}

export default BaseRoute;
