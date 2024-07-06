import React, { useEffect, useState } from 'react';
import APIKEY from '../Key/APIKEY';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageToken, setPageToken] = useState('');

  useEffect(() => {
    setVideos([]);
    setPageToken('');
    fetchVideos('');
  }, [id]);

  const fetchVideos = async (pageToken = '') => {
    setLoading(true);
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet,statistics',
          maxResults: 20,
          chart: 'mostPopular',
          key: APIKEY,
          videoCategoryId: id,
          pageToken: pageToken,
        },
      });
      setVideos(response.data.items);
      setPageToken(response.data.nextPageToken);
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  };

  function abbreviateNumber(number) {
    const SI_SYMBOL = ["", "K", "M", "B", "T"];
    const tier = Math.log10(Math.abs(number)) / 3 | 0;
    if (tier === 0) return number;
    const suffix = SI_SYMBOL[tier];
    const scale = Math.pow(10, tier * 3);
    const scaled = number / scale;
    return scaled.toFixed(1) + suffix;
  }

  return (
    <div className='bg-slate-100 ml-2 rounded-lg w-full'>
      <div className='flex flex-wrap justify-center gap-x-6'>
        {loading ? (
          <div className='flex flex-wrap justify-center gap-x-6'>
            {[...Array(10)].map((_, index) => (
              <div key={index} className='mt-4 ml-5 hover:bg-slate-200 rounded-lg w-72 h-auto rounded-t-lg flex justify-center'>
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
        ) : (
          <div className='flex flex-wrap justify-center gap-x-6'>
            {videos.map((video) => (
              <div onClick={() => navigate(`/video/${video.id}`)} key={video.id} className='mt-4 ml-5 hover:bg-slate-200 rounded-lg w-72 h-auto rounded-t-lg flex justify-center'>
                <div className='w-72 cursor-pointer'>
                  <div>
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className='w-72 h-36 rounded-t-lg'
                    />
                  </div>
                  <div className='flex mt-1'>
                    <img
                      alt={video.snippet.channelTitle}
                      src={video.snippet.thumbnails.default.url}
                      className='rounded-full w-10 h-10 ml-1'
                    />
                    <h1 className='font-semibold text-ellipsis line-clamp-2 ml-5'>{video.snippet.title}</h1>
                  </div>
                  <div className='ml-16'>
                    <h2 className='text-slate-500 text-sm'>{video.snippet.channelTitle}</h2>
                    <p className='text-slate-500 text-xs'>{abbreviateNumber(video.statistics.viewCount)} views</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
