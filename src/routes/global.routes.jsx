import { BrowserRouter as Router, Route } from "react-router-dom";
import Index from "components/pages/home.components.jsx";
import DashboardProtocol from "components/pages/dashboard-pe.components.jsx";
import DashboardPersonnal from "components/pages/dashboard-pr.components.jsx";

function BaseRoute()
{
    return(
        <Router>
            <Route path="/" exact component={Index} />
            <Route path="/home" exact component={Index} />
            <Route path="/dashboard" exact component={DashboardProtocol} />
            <Route path="/dashboard/personnal" exact component={DashboardPersonnal} />
        </Router>
    );
}

export default BaseRoute;
