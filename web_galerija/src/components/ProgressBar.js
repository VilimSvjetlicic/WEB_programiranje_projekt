import React, { useEffect } from 'react';
import { ProgressBar as Bar } from 'react-bootstrap'
import useStorage from '../hooks/useStorage';

const ProgressBar = ({ image, setImage, setSubmit, postDesc, collection }) => {
    const { url, progress } = useStorage(image, postDesc, collection);
    
    useEffect(() => {
        if(url){
            setImage(null);
            setSubmit(false);
        }
    }, [url, setImage, setSubmit]);

    return (
        <Bar now={progress} label={`${progress}%`}/>
    )
}

export default ProgressBar;