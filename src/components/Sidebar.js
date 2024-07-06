import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';
import APIKEY from '../Key/APIKEY';

// Import your images
import { IoHome } from "react-icons/io5";
import { IoGameController } from "react-icons/io5";
import { FaCarAlt } from "react-icons/fa";
import { MdSportsBaseball } from "react-icons/md";
import { PiTelevisionSimpleBold } from "react-icons/pi";
import { MdBiotech } from "react-icons/md";
import { FaMusic } from "react-icons/fa";
import { FaBloggerB } from "react-icons/fa6";
import { FaNewspaper } from "react-icons/fa6";


const Sidebar = () => {
  const navigate = useNavigate();
  const [famousChannels, setFamousChannels] = useState([]);
  const [loading , setLoading] = useState(true)

  const categories = [
    { name: 'Home', icon: <IoHome /> , id: '0' },
    { name: 'Game', icon: <IoGameController />, id: '20' },
    { name: 'Automobiles', icon: <FaCarAlt />, id: '2' },
    { name: 'Entertainment', icon: <PiTelevisionSimpleBold/>, id: '24' },
    { name: 'Sports', icon: <MdSportsBaseball/>, id: '17' },
    { name: 'Tech', icon: <MdBiotech/>, id: '28' },
    { name: 'Songs', icon: <FaMusic/>, id: '10' },
    { name: 'Blogs', icon: <FaBloggerB/>, id: '1' },
    { name: 'News', icon: <FaNewspaper/>, id: '25' }
  ];

  useEffect(() => {
    const fetchChannels = async () => {
      const channelIds = [
        'UC_x5XG1OV2P6uZZ5FSM9Ttw',
        'UCVHFbqXqoYvEWM1Ddxl0QDg',
        'UC29ju8bIPH5as8OGnQzwJyA',
        'UC4R8DWoMoI7CAwX8_LjQHig',
        'UC0v-tlzsn0QZwJnkiaUSJVQ',
        'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
        'UC5rjz7_P-3KxjTbFvEB1ufQ',
        'UCUtZTNrZ8CUt_dbK0r1cF2g',
        'UCrFjDah5kdnBmWj8tNS2pBA',
        'UCiDJtJKMICpb9B1qf7qjEOA',
        'UCZRdNleCgW-BGUJf-bbjzQg',
        'UCGMfRSOhC8SqZ0nnjfDR1Rg',
        'UCxgAuX3XZROujMmGphN_scA'
      ];

      try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
          params: {
            part: 'snippet',
            id: channelIds.join(','),
            key: APIKEY
          }
        });
        setFamousChannels(response.data.items);
      } catch (error) {
        console.error('Error fetching channels:', error);
      }finally{
          setLoading(false)
      }
    };

    fetchChannels();
  }, []);

  return (
    <div className='flex h-full'>
      <div className='w-60 h-full overflow-hidden'>
        <div className='bg-slate-100 pl-5 pt-2 drop-shadow-xl'>
          {categories.map((category) => (
            <div
              key={category.id}
              className='flex gap-2 cursor-pointer pt-6  hover:text-white   hover:bg-red-700 rounded-l-lg'
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <div className='text-2xl  text-red-700 hover:text-white ' >{category.icon} </div>
              <p className='font-semibold text-1xl mt-1 overflow-hidden overflow-ellipsis whitespace-nowrap'>{category.name}</p>
            </div>
          ))}
        </div>

        <div className='bg-slate-100 pl-5 pt-9 drop-shadow-xl h-full'>
          <div className='w-full bg-red-600 h-px'></div>
          {loading ? (<div>
          {[...Array(8)].map((index)=>(
               <div key={index} className='flex pt-3 items-center'>
                    <div className='w-9 h-9 bg-slate-400 rounded-full animate-pulse '></div>
                    <div className='ml-2 bg-slate-400 w-24 h-4 rounded-full'></div> 
               </div>
          ))}
          </div>):(<div></div>)}
          {famousChannels.map((channel) => (
            <div key={channel.id} onClick={() => navigate(`/channel/${channel.id}`)} className='pt-3 pl-1'>
              <div className='flex gap-2 cursor-pointer hover:bg-red-700 rounded-l-lg'>
                <img alt={channel.snippet.title} src={channel.snippet.thumbnails.default.url} className='w-9 h-9 rounded-full' />
                <p className='font-semibold mt-1 overflow-hidden overflow-ellipsis whitespace-nowrap'>{channel.snippet.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Outlet />
    </div>
  );
};

export default Sidebar;
