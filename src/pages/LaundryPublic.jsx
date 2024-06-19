import { useMemo } from 'react'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { Typography } from '@mui/material'
import HeaderCard, { Card } from "../components/HeaderCard.jsx";

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APPLICATION_ID, import.meta.env.VITE_ALGOLIA_APPLICATION_KEY);

const KEYS = ['road', 'postcode', 'city', 'country']
function Hit({ hit }) {
  const content = useMemo(() => {
    return KEYS.map(key => {
      if (hit?._highlightResult?.geoloc?.components?.[key]) {
        return hit._highlightResult.geoloc.components[key].value
      } else {
        return hit?.geoloc?.components[key]
      }
    }).filter(value => value?.length).join(' ')
  }, [hit])
  return (

      <div dangerouslySetInnerHTML={{__html: content}} />

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
