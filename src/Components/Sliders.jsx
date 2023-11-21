import React,{useEffect} from 'react';
import Timebar from './Timebar';

function Sliders(props) {
    const { timeZones, setTimeZones, sliderValues, setSliderValues, short, dates, setDates } = props;

    useEffect(() => {
    }, [timeZones]); 

    return (
        <>
            {
                timeZones.map((zone, index) => (
                    <Timebar key={index} idx={index} zone={zone} timeZones={timeZones} setTimeZones={setTimeZones} sliderValues={sliderValues} setSliderValues={setSliderValues} short={short} dates={dates} setDates={setDates}/>
                ))
            }

        </>
    );
};

export default Sliders;