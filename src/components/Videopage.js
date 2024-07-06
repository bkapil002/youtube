import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../style/VideoPage.css';
import {  useNavigate } from 'react-router-dom';
import Shado from '../components/shado'
import APIKEY from '../Key/APIKEY';

const Videopage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [videoDetails, setVideoDetails] = useState(null);
    const [channelDetails, setChannelDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [relatedVideos, setRelatedVideos] = useState([]);
    const [subscribed, setSubscribed] = useState(true);
    const [thumbsUpClicked, setThumbsUpClicked] = useState(false);
    const [thumbsDownClicked, setThumbsDownClicked] = useState(false);

    useEffect(() => {
        const fetchVideoDetails = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
                    params: {
                        part: 'snippet,statistics',
                        id: id,
                        key: APIKEY,
                    },
                });
                setVideoDetails(response.data.items[0]);

                const channelResponse = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
                    params: {
                        part: 'snippet',
                        id: response.data.items[0].snippet.channelId,
                        key: APIKEY,
                    },
                });
                setChannelDetails(channelResponse.data.items[0]);
            } catch (error) {
                console.error('Error fetching video details:', error);
            }
        };

        const fetchRelatedVideos = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                    params: {
                        part: 'snippet',
                        relatedTovideoId: id,
                        type: 'video',
                        maxResults: 20,
                        key: APIKEY,
                    },
                });
                setRelatedVideos(response.data.items);
            } catch (error) {
                console.error('Error fetching related videos:', error);
            }
        };

        const fetchComments = async () => {
            try {
                const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
                    params: {
                        part: 'snippet',
                        videoId: id,
                        maxResults: 20,
                        key: APIKEY,
                    },
                });
                setComments(response.data.items);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        if (id) {
            fetchVideoDetails();
            fetchRelatedVideos();
            fetchComments();
        }
    }, [id]);

    const handleButtonClick = () => {
        setSubscribed(!subscribed);
    };

    const handleThumbsUpClick = () => {
        setThumbsUpClicked(true);
        setThumbsDownClicked(false);
    };

    const handleThumbsDownClick = () => {
        setThumbsDownClicked(true);
        setThumbsUpClicked(false);
    };

    if (!videoDetails || !channelDetails) {
        return <div className='w-full'><Shado/></div>; 
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
            <div className='mt-2 flex'>
                <div className='w-3/5 overflow-hidden'>
                    <div>
                        <iframe
                            src={`https://www.youtube.com/embed/${id}`}
                            className='w-full rounded-lg'
                            height='370'
                            frameBorder='0'
                            allowFullScreen
                        ></iframe>
                        <h1 className='font-bold text-ellipsis line-clamp-1 text-2xl'>{videoDetails.snippet.title}</h1>
                        <div className='mt-3 flex justify-between items-center'>
                            <div onClick={() => navigate(`/channel/${channelDetails.id}`)}  className='flex'>
                                <img
                                    alt={channelDetails.snippet.title}
                                    src={channelDetails.snippet.thumbnails.default.url}
                                    className='rounded-full ml-2 w-12 h-12 cursor-pointer'
                                />
                                <div className='ml-3'>
                                    <h1 className='font-semibold hover:underline underline-offset-1 cursor-pointer'>
                                        {videoDetails.snippet.channelTitle}
                                    </h1>
                                    <h1 className='font-medium text-slate-500 text-sm'>
                                        {abbreviateNumber(videoDetails.statistics.viewCount)} views
                                    </h1>
                                </div>
                            </div>
                            <div className='flex'>
                                <button
                                    className='w-32 h-8 mr-2 font-semibold rounded-full bg-slate-300 hover:bg-slate-500'
                                    onClick={handleButtonClick}
                                >
                                    {subscribed ? 'Subscribe' : 'Subscribed'}
                                </button>
                                <div className='button-l-ul'>
                                    <div className='like-dislike'>
                                        <i
                                            className={`fa-solid fa-thumbs-up ${thumbsUpClicked ? 'thumbs-up-clicked' : ''}`}
                                            onClick={handleThumbsUpClick}
                                        ></i>
                                        <div className='center-line'></div>
                                        <i
                                            className={`fa-solid fa-thumbs-down ${thumbsDownClicked ? 'thumbs-up-clicked' : ''}`}
                                            onClick={handleThumbsDownClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>





                        {/* comments */}
                        <div className='mt-6'>
                            <h1 className='font-semibold ml-2 text-2xl'>Comments</h1>
                            <div className='w-full bg-slate-500 h-px mt-2 rounded-full drop-shadow-2xl'></div>
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className='mt-4 ml-2 flex'>
                                        <img
                                            src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl}
                                            alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
                                            className='h-10 w-10 rounded-full'
                                        />
                                        <div className='ml-3'>
                                            <h1 className='font-semibold'>
                                                {comment.snippet.topLevelComment.snippet.authorDisplayName}
                                            </h1>
                                            <p className='font-medium text-ellipsis line-clamp-2'>
                                                {comment.snippet.topLevelComment.snippet.textDisplay}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='ml-2'>No comments found.</p>
                            )}
                        </div>
                    </div>
                </div>







                {/* related videos */}
                <div className='w-2/5'>
                    <div className='ml-4 gap-y-2'>
                        {relatedVideos.map((relatedVideo) => (
                            <div
                            onClick={() => navigate(`/video/${relatedVideo.id.videoId}`)}
                                key={relatedVideo.id}
                                className='flex mb-4 hover:bg-slate-200 rounded-lg cursor-pointer'
                                
                            >
                                <img
                                    src={relatedVideo.snippet.thumbnails.medium.url}
                                    alt={relatedVideo.snippet.title}
                                    className='h-24 w-40 rounded-lg'
                                />
                                <div className='ml-2'>
                                    <h1 className='text-ellipsis line-clamp-2 font-semibold'>
                                        {relatedVideo.snippet.title}
                                    </h1>
                                    <h1 className='text-sm text-slate-500 font-medium'>
                                        {relatedVideo.snippet.channelTitle}
                                    </h1>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Videopage;
