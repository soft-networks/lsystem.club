
import { Table } from "p5";
import React from "react"
import PageLayout from "../components/ui/PageLayout";
import TableOfContents from "../components/ui/TableOfContents";
import intro from '../data/intro';
import Examples from "./ExamplesPage";


const Home: React.FunctionComponent<{}> = () => {
  return (
    <PageLayout>
      <div className="centered narrow markdown">
        {intro}
        <Examples/>
      </div>
    </PageLayout>
  );
}




export default Home;

