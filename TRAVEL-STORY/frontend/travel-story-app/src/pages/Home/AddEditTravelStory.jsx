import React, { useState } from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md";

const AddEditTravelStory = ({
    storyInfo,
    type,
    onClose,
    getAllTravelStories,
    isGuest = false,
    onGuestSubmit = null
}) => {
    const [title, setTitle] = useState(storyInfo?.title || '');
    const [story, setStory] = useState(storyInfo?.story || '');
    const [visitedDate, setVisitedDate] = useState(storyInfo?.visitedDate || '');
    const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || '');
    const [imageUrl, setImageUrl] = useState(storyInfo?.imageUrl || '');

    const handleAddOrUpdateClick = async () => {
        // Validate form inputs
        if (!title || !story || !visitedDate || !visitedLocation) {
            // Show validation error
            return;
        }

        // If guest user, handle submission differently
        if (isGuest && onGuestSubmit) {
            const storyData = {
                title: title,
                story: story,
                visitedDate: visitedDate,
                visitedLocation: visitedLocation,
                imageUrl: imageUrl || 'https://picsum.photos/200/300', // Default image
                public: true // Guest stories are always public in this implementation
            };
            
            const result = onGuestSubmit(storyData);
            
            if (result && result.success) {
                onClose();
            }
            
            return;
        }

        // Regular submission logic for non-guest users
        // Your existing API call code would go here
        onClose();
        getAllTravelStories();
    };

    return (
        <div>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>
                <div>
                    <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                        {type === "add" ? <button className='btn-small' onClick={handleAddOrUpdateClick}>
                            <MdAdd className="text-lg"/>{isGuest ? "ADD TEMPORARY STORY" : "ADD STORY"}
                        </button> : <>
                            <button className='btn-small' onClick={handleAddOrUpdateClick}>
                                <MdUpdate className='text-lg'/> UPDATE STORY
                            </button>
                            {/* <button className='btn-small btn-delete' onClick={onClose}>
                                <MdDeleteOutline className="text-lg"/>DELETE
                            </button> */}
                        </>}
                        <button className='' onClick={onClose}>
                            <MdClose className="text-xl text-slate-400"/>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Guest mode notification */}
            {isGuest && (
                <div className="mt-3 p-2 bg-amber-50 border-l-4 border-amber-400 text-amber-700 text-sm">
                    <p>You're in guest mode. Your story will only be saved temporarily in this browser session.</p>
                </div>
            )}
            
            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>TITLE</label>
                    <input 
                        type='text'
                        className='text-2xl text-slate-950 outline-none'
                        placeholder='A Day at the Great Wall'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                
                {/* Add the rest of your form fields */}
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>STORY</label>
                    <textarea 
                        className='text-slate-950 outline-none p-2 border rounded'
                        placeholder='Share your travel experience...'
                        rows={5}
                        value={story}
                        onChange={(e) => setStory(e.target.value)}
                    />
                </div>
                
                <div className='flex gap-4 pt-4'>
                    <div className='flex-1 flex flex-col gap-2'>
                        <label className='input-label'>VISITED DATE</label>
                        <input 
                            type='date'
                            className='p-2 border rounded outline-none'
                            value={visitedDate}
                            onChange={(e) => setVisitedDate(e.target.value)}
                        />
                    </div>
                    
                    <div className='flex-1 flex flex-col gap-2'>
                        <label className='input-label'>LOCATION</label>
                        <input 
                            type='text'
                            className='p-2 border rounded outline-none'
                            placeholder='Paris, France'
                            value={visitedLocation}
                            onChange={(e) => setVisitedLocation(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>IMAGE URL (OPTIONAL)</label>
                    <input 
                        type='text'
                        className='p-2 border rounded outline-none'
                        placeholder='https://example.com/image.jpg'
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default AddEditTravelStory;
