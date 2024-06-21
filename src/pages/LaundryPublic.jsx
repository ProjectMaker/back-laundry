import { useEffect } from 'react'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { Typography, Stack } from '@mui/material'
import HeaderCard, { Card } from "../components/HeaderCard";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APPLICATION_ID, import.meta.env.VITE_ALGOLIA_APPLICATION_KEY);
import Map from '../components/Map'

function Hit({hit }) {
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
        <Stack gap={2} flex={1}>
          <Map />
          <Hits hitComponent={Hit} />
        </Stack>
      </Card>
    </InstantSearch>
  );
}
