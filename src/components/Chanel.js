import React, { useState, useEffect } from 'react';
import axios from 'axios';
import image from '../Image/thumbnail2.png';
import APIKEY from '../Key/APIKEY';
import { useParams } from 'react-router-dom';


const Chanel = () => {
    const {id} = useParams()
    const [channelData, setChannelData] = useState(null);
    const [videos, setVideos] = useState([]);
    const [subscribed, setSubscribed] = useState(false);

    

    useEffect(() => {
        const fetchChannelDetails = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    params: {
                        part: 'snippet, statistics',
                        id: id,
                        key: APIKEY, 
                    },
                });
                setChannelData(response.data.items[0]);
            } catch (error) {
                console.error('Error fetching channel details:', error);
            }
        };

        const fetchVideos = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        channelId: id,
                        maxResults: 20, // Adjust as needed
                        key: APIKEY, // Replace with your YouTube Data API key
                    },
                });
                setVideos(response.data.items);
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchChannelDetails();
        fetchVideos();
    }, [id]);

    const handleButtonClick = () => {
        setSubscribed(!subscribed);
    };

    if (!channelData) {
        return <div></div>; // Placeholder for loading state
    }

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
            <div>
                <img src={image} alt='' className='w-full h-60 object-cover rounded-t-lg' />
                <div className='mt-2 ml-3 flex'>
                    <img src={channelData.snippet.thumbnails.default.url} alt='' className='w-40 h-40 rounded-full' />
                    <div className='ml-3 items-center'>
                        <h3 className='text-2xl font-semibold mt-6'>{channelData.snippet.title}</h3>
                        <p className='text-slate-700 font-medium text-ellipsis line-clamp-1'>
                            {channelData.snippet.description}
                        </p>
                        <div className='flex items-center mt-2'>
                            <span className='text-sm text-gray-600'>
                                {abbreviateNumber(channelData.statistics.subscriberCount)} subscribers
                            </span>
                            <button
                                className='w-32 h-8 ml-5 font-semibold rounded-full bg-slate-300 hover:bg-slate-500'
                                onClick={handleButtonClick}
                            >
                                {subscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className='w-full bg-slate-400 h-px mt-5 rounded-full drop-shadow-2xl'></div>

                <div>
                    <div className='flex flex-wrap justify-center gap-x-6'>
                        {videos.map((video) => (
                            <div key={video.id.videoId} className='mt-4 ml-5 hover:bg-slate-200 rounded-lg w-72 h-auto rounded-t-lg flex justify-center'>
                                <div className='w-72 cursor-pointer'>
                                    <div>
                                        <img
                                            src={video.snippet.thumbnails.default.url}
                                            alt={video.snippet.title}
                                            className='w-72 h-36 rounded-t-lg'
                                        />
                                    </div>
                                    <div className='flex mt-1'>
                                        <img alt='' src={channelData.snippet.thumbnails.default.url} className='rounded-full w-10 h-10 ml-1' />
                                        <h1 className='font-semibold text-ellipsis line-clamp-2 ml-5'>
                                            {video.snippet.title}
                                        </h1>
                                    </div>
                                    <div className='ml-16'>
                                        <h2 className='text-slate-500 text-sm'>{video.snippet.channelTitle}</h2>                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chanel;
