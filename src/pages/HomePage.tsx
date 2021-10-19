
import React from "react"
import PageLayout from "../components/ui/PageLayout";
import intro from '../data/intro.md';
import MarkdownLoader from "../components/ui/MarkdownLoader";
import TableOfContents from "../components/ui/TableOfContents";

const Home: React.FunctionComponent<{}> = () => {
  return (
    <PageLayout>
      <MarkdownLoader markdownFile={intro} className="narrow centered" /> 
    </PageLayout>
  );
}




export default Home;

