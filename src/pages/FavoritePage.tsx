import { Link } from "react-router-dom";
import PageLayout from "../components/PageLayout";
import { encodeParams, getFave } from "../components/utils";

const FavoritePage: React.FunctionComponent = ({}) => {

  const favorites = localStorage.getItem("favorites");
  if (! favorites || favorites === "") {
    return <PageLayout><div> No favorites yet </div></PageLayout>
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
  return (<PageLayout><ul> {links} </ul> </PageLayout>)
}

export default FavoritePage;