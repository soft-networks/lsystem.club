import React from "react";
import { NavLink } from "react-router-dom";

const PageLayout : React.FunctionComponent = ({children}) => {
  return (
    <main className=" stack black-border no-gap full-bleed">
      <div className="header-surface horizontal-stack large padded border-bottom">
          <NavLink activeClassName="active" className="header-link" exact to="/">
            Guide
          </NavLink>
          <NavLink activeClassName="active" className="header-link" to="/edit">
            Editor
          </NavLink>
          <NavLink activeClassName="active" className="header-link" to="/favorites">
            Favorites
          </NavLink>
      </div>
      <div style={{ flex: 1}}> 
        {children} 
      </div>
    </main>
  );
}

export default PageLayout;