import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import APIKEY from '../Key/APIKEY';
import {  useNavigate } from 'react-router-dom';


const Search = () => {
      const navigate = useNavigate();
      const [loading, setLoading] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    if (query) {
      // Fetch search results from YouTube API (or any other API)
      const fetchSearchResults = async () => {
        setLoading(true);

        try {
          const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
              part: 'snippet',
              q: query,
              type: 'video',
              maxResults: 20,
              key: APIKEY, // Replace with your YouTube API key
            },
          });
          setSearchResults(response.data.items);
        } catch (error) {
          console.error('Error fetching search results:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchSearchResults();
    }
  }, [query]);
  return (
    <div className='bg-slate-100 ml-2 rounded-lg w-full'>
      <div className='flex flex-wrap justify-center gap-x-6'>
      {loading ? 
      (<div className='flex flex-wrap justify-center gap-x-6'>
            {[...Array(10)].map((_, index) => (
              <div key={index}   className='mt-4 ml-5 hover:bg-slate-200 rounded-lg w-72 h-auto rounded-t-lg flex justify-center'>
                <div className='w-72 cursor-pointer'>
                  <div className='w-72 bg-slate-400 animate-pulse h-36 rounded-t-lg'></div>
                  <div className='flex mt-1'>
                    <div className='rounded-full bg-slate-400 w-10 h-10 ml-1 animate-pulse'></div>
                    <div>
                      <div className='w-56 h-5 bg-slate-400 animate-pulse mb-1 rounded-full'></div>
                      <div className='w-40 h-5 bg-slate-400 animate-pulse rounded-full'></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : 
      (
        <div className='flex flex-wrap justify-center gap-x-6'> 
        {searchResults.map((result) => (
          <div
          onClick={() => navigate(`/video/${result.id.videoId}`)} 
            key={result.id.videoId}
            className='mt-4 ml-5 hover:bg-slate-200 rounded-lg w-72 h-auto rounded-t-lg flex justify-center'
          >
            <div className='w-72 cursor-pointer'>
              <div>
                <img src={result.snippet.thumbnails.medium.url} alt='' className='w-72 h-36 rounded-t-lg' />
              </div>
              <div className='flex mt-1'>
                <img alt='' src={result.snippet.thumbnails.default.url} className='rounded-full w-10 h-10 ml-1' />
                <h1 className='font-semibold text-ellipsis line-clamp-2 ml-5'>
                  {result.snippet.title}
                </h1>
              </div>
              <div className='ml-16'>
                <h2 className='text-slate-500 text-sm'>{result.snippet.channelTitle}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>)}
        
      </div>
    </div>
  )
}

export default Search