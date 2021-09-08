import { Link } from "react-router-dom";
import { encodeParams, getFave } from "../components/utils";

const FavoritePage = () => {

  const favorites = localStorage.getItem("favorites");
  if (! favorites || favorites === "") {
    return <div> No favorites yet </div>
  }

  const faveList = JSON.parse(favorites);
  let links = Object.keys(faveList).map( (key) => {
    const fave = getFave(faveList[key]);
    if (fave) {
      return <li> <Link to={`/edit${encodeParams(fave.code, fave.gfx)}`} > {fave.code} </Link> </li>
    } else {
      return <li> Fave corrupted, sorry </li>
    }
  })
  return <ul> {links} </ul> 
}

export default FavoritePage;