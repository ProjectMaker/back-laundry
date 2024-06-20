import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { Typography } from '@mui/material'
import HeaderCard, { Card } from "../components/HeaderCard.jsx";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APPLICATION_ID, import.meta.env.VITE_ALGOLIA_APPLICATION_KEY);

function Hit({ hit }) {
  return (

      <div dangerouslySetInnerHTML={{__html: hit._highlightResult?.address?.value || hit.address}} />

  );
}

export default function App() {
  return (
    <InstantSearch searchClient={searchClient} indexName="laundry">
      <HeaderCard>
        <Typography variant={'h6'}>Fichiers Laverie</Typography>
        <SearchBox />
      </HeaderCard>
      <Card>
        <Hits hitComponent={Hit} />
      </Card>
    </InstantSearch>
  );
}
