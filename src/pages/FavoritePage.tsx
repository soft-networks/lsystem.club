import { LSPreview } from "../components/LSPreview";
import PageLayout from "../components/PageLayout";
import { codeToProps, getFave } from "../components/utils";

const FavoritePage: React.FunctionComponent = ({}) => {

  const favorites = localStorage.getItem("favorites");
  if (! favorites || favorites === "") {
    return <PageLayout><div> No favorites yet </div></PageLayout>
  }

  const faveList = JSON.parse(favorites);
  let links = Object.keys(faveList).map( (key) => {
    const fave = getFave(faveList[key]);
    if (fave) {
      return <div> <LSPreview code={fave.code} gfxProps={fave.gfx} /></div>
    } else {
      return <div> <li> Fave corrupted, sorry </li></div>
    }
  })
  return (<PageLayout><div className="grid padded"> {links} </div> </PageLayout>)
}

export default FavoritePage;