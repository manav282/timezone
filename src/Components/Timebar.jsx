import React, { useState, useEffect } from 'react';
import '../static/Timebar.css';

const Timebar = (props) => {
    const { idx, zone, timeZones, setTimeZones, sliderValues, setSliderValues, short, dates, setDates } = props;
    const [selectedTime, setSelectedTime] = useState(formatTime(sliderValues[zone]));
    const [sliderValue, setSliderValue] = useState(sliderValues[zone]);
    const [showPrompt, setShowPrompt] = useState(false);
    // const dragId= useRef();

    // const onDrag = (ev) => {
    //     ev.preventDefault();
    //     dragId.current=parseInt(ev.currentTarget.id,10);
    // }

    // const onDragOver = (event) => {
    //     event.preventDefault();
    // }

    // const onDrop = (ev) => {
    //     ev.preventDefault();
    //     let updatedTimeZones = [...timeZones];

    //     //remove and save the dragged item content
    //     const reorderTimeZone = updatedTimeZones.splice(dragId.current, 1)[0];

    //     //switch the position
    //     updatedTimeZones.splice(parseInt(ev.currentTarget.id,10), 0, reorderTimeZone);

    //     //update the actual array
    //     setTimeZones(updatedTimeZones);
    // }

    // Function to format time
    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60) % 24;
        const mins = minutes % 60;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = ((hours % 12) <= 9) ? (hours % 12 ? '0' + hours % 12 : 12) : hours % 12;
        const formattedMinutes = mins < 10 ? '0' + mins : mins;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    }

    // Function to handle slider change
    const handleSliderChange = (event) => {
        const newSliderValue = parseInt(event.target.value, 10);
        const oldValue = sliderValues[zone];
        const difference = newSliderValue - oldValue;

        // Update the value of the changed slider
        setSliderValue(newSliderValue);

        // Update the values of other sliders by the same difference
        const updatedSliderValues = { ...sliderValues };
        Object.keys(updatedSliderValues).forEach((key) => {
            updatedSliderValues[key] += difference;
            if (updatedSliderValues[key] > 1440) {
                updatedSliderValues[key] -= 1440;
                const updatedDates = { ...dates };
                updatedDates[key].setDate(updatedDates[key].getDate() + 1)
                setDates(updatedDates);
            }
            if (updatedSliderValues[key] < 0) {
                updatedSliderValues[key] += 1440;
                const updatedDates = { ...dates };
                updatedDates[key].setDate(updatedDates[key].getDate() - 1)
                setDates(updatedDates);
            }
        });

        // Set the updated values in the parent component
        setSliderValues(updatedSliderValues);
    };

    // Function to handle input change
    const handleInputChange = (event) => {
        setShowPrompt(true);
        const inputText = event.target.value;
        setSelectedTime(inputText);
    };


    //update values of slider and times on key press
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            setShowPrompt(false);
            const inputText = event.target.value;
            const match = inputText.match(/(\d+):(\d+)\s+(AM|PM)/i);
            if (match) {

                //update parent slider
                let hours = parseInt(match[1]);
                const minutes = parseInt(match[2]);
                const ampm = match[3].toUpperCase();

                if (ampm === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (ampm === 'AM' && hours === 12) {
                    hours = 0;
                }
                const totalMinutes = hours * 60 + minutes;
                setSliderValue(totalMinutes);

                //update other sliders with same diff
                const difference = totalMinutes - sliderValues[zone];
                setSelectedTime(inputText);
                const updatedSliderValues = { ...sliderValues };
                Object.keys(updatedSliderValues).forEach((key) => {
                    updatedSliderValues[key] += difference;
                    if (updatedSliderValues[key] > 1440) {
                        updatedSliderValues[key] -= 1440;
                        const updatedDates = { ...dates };
                        updatedDates[zone].setDate(updatedDates[zone].getDate() + 1)
                        setDates(updatedDates);
                    }
                    if (updatedSliderValues[key] < 0) {
                        updatedSliderValues[key] += 1440;
                        const updatedDates = { ...dates };
                        updatedDates[key].setDate(updatedDates[key].getDate() - 1)
                        setDates(updatedDates);
                    }
                });
                setSliderValues(updatedSliderValues);
            }

        }
    };

    //function to delete timezone
    const handleDeleteClick = () => {
        const updatedTimeZones = timeZones.filter((z) => z !== zone);
        setTimeZones(updatedTimeZones);
    };

    //function to display date
    const displayDate = (zone) => {
        let date = dates[zone];
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    //function to show label at bottom of slider
    const renderHourLabels = () => {
        const labels = [];
        for (let hour = 0; hour <= 24; hour += 2) {
            labels.push(
                <div className="hour-label" key={hour}>
                    {formatTime(hour * 60)}
                </div>
            );
        }
        return labels;
    };

    //update the values
    useEffect(() => {
        setSelectedTime(formatTime(sliderValues[zone]));
        setSliderValue(sliderValues[zone]);
        displayDate(zone);
    }, [sliderValues, zone]);

    return (
        <div className="time-bar-container"
            id={idx}
        // draggable={true}
        // onDrag={(event) => onDrag(event)}
        // onDrop={event => onDrop(event)}
        // onDragOver={(event => onDragOver(event))}
        >
            <div className="time-bar">
                <button className="delete-button" onClick={handleDeleteClick}>
                    &#10005;
                </button>
                <div className="city-or-zone">{zone}, {short[zone]}&emsp;{displayDate(zone)}</div>
                <input
                    type="range"
                    min="0"
                    max="1440"
                    step="1"
                    value={sliderValue}
                    onChange={handleSliderChange}
                />
                <div className="hour-labels">{renderHourLabels()}</div>
                <input
                    type="text"
                    placeholder="Enter time (HH:MM AM/PM)"
                    value={selectedTime}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyPress}
                />
                {showPrompt && (
                    <div>
                        Click Enter to update time
                    </div>
                )}
            </div>
        </div>
    );
};

export default Timebar;
