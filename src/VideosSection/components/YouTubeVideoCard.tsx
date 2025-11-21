import { useState } from 'react';
import { Video } from '../types/video';

interface YouTubeVideoCardProps {
  video: Video;
}

export const YouTubeVideoCard = ({ video }: YouTubeVideoCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const thumbnailUrl = `https://img.youtube.com/vi/${video.youTubeId}/hqdefault.jpg`;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youTubeId}?autoplay=1&loop=1&playlist=${video.youTubeId}&mute=1&controls=1`;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="bg-black text-white rounded-xl overflow-hidden shadow-lg hover:shadow-yellow/20 transition-all duration-300 w-full border border-gray-800 hover:border-yellow group">
        <div 
          onClick={openModal} 
          className="block cursor-pointer"
        >
          <div className="relative pb-[56.25%]"> 
            <img 
              src={thumbnailUrl} 
              alt={video.title}
              loading="lazy"
              className="absolute top-0 left-0 w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
              <div className="bg-yellow rounded-full p-3 transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <svg viewBox="0 0 24 24" className="h-5 w-5">
                  <path d="M8 5v14l11-7z" fill="black"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3">
          <h3 className="text-sm font-medium mb-2 text-white group-hover:text-yellow transition-colors duration-300 line-clamp-2">
            {video.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="bg-yellow text-black text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
              {video.category}
            </span>
          </div>
        </div>
      </div>

      {/* Modal to show the video */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={closeModal}
              className="absolute -top-10 right-0 text-white hover:text-yellow transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative pb-[56.25%]"> {/* 16:9 aspect ratio */}
              <iframe
                src={youtubeEmbedUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default YouTubeVideoCard