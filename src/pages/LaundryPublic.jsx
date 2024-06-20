import { useEffect, useState, useRef } from 'react'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';
import { Typography, Stack } from '@mui/material'
import HeaderCard, { Card } from "../components/HeaderCard";
import {APIProvider, Map, AdvancedMarker, Pin, useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer} from '@googlemaps/markerclusterer';
import landries from '../algolia.json'

const searchClient = algoliasearch(import.meta.env.VITE_ALGOLIA_APPLICATION_ID, import.meta.env.VITE_ALGOLIA_APPLICATION_KEY);

const ProxyMap = () => {
  const map = useMap()
  const [markers, setMarkers] = useState([])
  const clusterer = useRef()

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({map});
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker, key) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers(prev => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const newMarkers = {...prev};
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return landries.map(({address, geometry}, i) => (
      <AdvancedMarker
        key={i}
        position={geometry}
        title={address}
        ref={marker => setMarkerRef(marker, i)}
      >
        <Pin background={'#A5D6A7'} glyphColor={'#3B82F6'} borderColor={'#3B82F6'} />
      </AdvancedMarker>
    ))
}

function MyMap () {
  return (
    <Stack sx={{width: 600, height: 400}}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAP_KEY} onLoad={() => console.log('Maps API has loaded.')}>
        <Map
          mapId={'LAUNDRIES'}
          zoomControl
          scaleControl
          mapTypeControl={false}
          streetViewControl={false}
          rotateControl={false}
        >
          <ProxyMap />
        </Map>
      </APIProvider>
    </Stack>
  )
}

function Hit({hit }) {
  return (

      <div dangerouslySetInnerHTML={{__html: hit._highlightResult?.address?.value || hit.address}} />

  );
}

export default function App() {
  useEffect(() => {
    //initMap({markers: landries.map(({geometry, address}) => ({position: geometry, address}))})
  }, []);
  return (
    <InstantSearch searchClient={searchClient} indexName="laundry">
      <HeaderCard>
        <Typography variant={'h6'}>Fichiers Laverie</Typography>
        <SearchBox />
      </HeaderCard>
      <Card>
        <Stack gap={2} flex={1}>
          <MyMap />
          <Hits hitComponent={Hit} />
        </Stack>
      </Card>
    </InstantSearch>
  );
}
