import React, { useState, createContext, useEffect } from 'react';
import Sliders from './Sliders';
import '../static/Menubar.css';
import ReactSwitch from "react-switch";
import moment from 'moment-timezone';
import { CgArrowsExchangeV } from "react-icons/cg";
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FiCalendar } from 'react-icons/fi';

export const ThemeContext = createContext(null);

function Menubar() {
    const [timeZones, setTimeZones] = useState([]); //store added timezones
    const [cityInput, setCityInput] = useState(''); //store current city or zone entered in text box
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("dark");
    const [sliderValues, setSliderValues] = useState({}); //stores slider values
    const [dates, setDates] = useState({});     //stores dates of timezones
    const [short, setShort] = useState({});       //stores short abbreviations of timezones

    const [abb, setAbb] = useState([]);
    const [arr, setArr] = useState([]);

    // const [selectedDate, setSelectedDate] = useState(null);
    // const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    // const [calendarPosition, setCalendarPosition] = useState({ top: 0, left: 0 });

    //function to display add entered city or zone
    const addSliderContainer = async () => {
        setLoading(true);
        if (cityInput === "UTC") {
            setTimeZones([...timeZones, cityInput]);
            var d1 = new Date();
            var d2 = new Date(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes());
            let hours = d2.getHours();
            let minutes = d2.getMinutes();

            setLoading(false);
            setSliderValues({ ...sliderValues, [cityInput]: hours * 60 + minutes });
            setDates({ ...dates, [cityInput]: d2 });
            setShort({ ...short, [cityInput]: cityInput });
            setCityInput('');
            return;
        }

        //checking if it is timezone if -1 it is city not timezone
        let isZone = abb.findIndex(zoneAbbreviation => zoneAbbreviation === cityInput);
        if (isZone !== -1) {
            setTimeZones([...timeZones, cityInput]);
            let date = new Date().toLocaleString("en-US", { timeZone: arr[isZone] });
            let predate = new Date(date);
            let hours = predate.getHours();
            let minutes = predate.getMinutes();

            setLoading(false);
            setSliderValues({ ...sliderValues, [cityInput]: hours * 60 + minutes });
            setDates({ ...dates, [cityInput]: predate });
            setShort({ ...short, [cityInput]: cityInput });
            setCityInput('');
        }
        else {
            setTimeZones([...timeZones, cityInput]);
            //fetching coordinates of city
            let data1 = await fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&appid=9cadadf28eb0f281d191c628c5aa2d8a").then((response) => {
                if (!response.ok) {
                    alert("No city found.");
                    return;
                }
                else {
                    return response.json();
                }

            });
            let lat = data1.city.coord.lat;
            let lon = data1.city.coord.lon;
            //fetching timezone,current date and time of city
            let data2 = await fetch("https://api.timezonedb.com/v2.1/get-time-zone?key=ZKRAU8U4BQQT&format=json&by=position&lat=" + lat + "&lng=" + lon).then((response) => {
                if (!response.ok) {
                    alert("No city found.");
                    return;
                }
                else {
                    return response.json();
                }
            });
            let date = new Date(data2.formatted);
            let hours = date.getHours();
            let minutes = date.getMinutes();
            setLoading(false);
            setSliderValues({ ...sliderValues, [cityInput]: hours * 60 + minutes });
            setDates({ ...dates, [cityInput]: date });
            setShort({ ...short, [cityInput]: data2.abbreviation });
            setCityInput('');
        }

    };

    const toggleTheme = () => {
        setTheme((curr) => (curr === "light" ? "dark" : "light"));
    };

    const handleCityInputChange = (event) => {
        setCityInput(event.target.value);
    };

    // const toggleCalendar = () => {
    //     const inputBox = document.querySelector('.date-picker-input');
    //     if (inputBox) {
    //         const rect = inputBox.getBoundingClientRect();
    //         setCalendarPosition({
    //             top: rect.bottom + window.scrollY,
    //             left: rect.left + window.scrollX,
    //         });
    //     }
    //     setIsCalendarOpen(!isCalendarOpen);
    // };

    // const handleDateChange = (date) => {
    //     setSelectedDate(date);
    // };

    const reverseOrder = () => {
        const reversedList = [...timeZones].reverse();
        setTimeZones(reversedList);
    };

    useEffect(() => {
        let aryIanaTimeZones = Intl.supportedValuesOf('timeZone');
        const newArr = [...arr, ...aryIanaTimeZones];
        const newAbb = newArr.map(x => moment.tz(x).zoneAbbr());
        setArr(newArr);
        setAbb(newAbb);
    }, []);

    return (
        <>
            <h1 id="heading">Welcome to Manav's timezone converter</h1>
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div id={theme} className='main'>
                    <nav className="navbar">
                        <div className='zone'>
                            <input
                                type="text"
                                id="city-input"
                                placeholder="Enter city or timezone"
                                value={cityInput}
                                onChange={handleCityInputChange}
                            />
                            <button id="add-zone-button" onClick={addSliderContainer}>
                                Add Zone
                            </button>
                        </div>
                        <div className='theme'>
                            {/* <input
                                type="text"
                                value={selectedDate ? selectedDate.toDateString() : ''}
                                readOnly
                                onClick={toggleCalendar}
                            />
                            <FiCalendar className="calendar-icon" onClick={toggleCalendar} />
                            {isCalendarOpen && (
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    style={{calendarPosition}}
                                    inline
                                />
                            )} */}
                            <CgArrowsExchangeV size={36} style={{ "cursor": "pointer", "marginRight": "20px" }} onClick={reverseOrder}></CgArrowsExchangeV>
                            <label> {theme === "light" ? "Light Mode" : "Dark Mode"}</label>
                            <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
                        </div>
                    </nav>
                    <div className="time-bars-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Sliders timeZones={timeZones} setTimeZones={setTimeZones} sliderValues={sliderValues} setSliderValues={setSliderValues} short={short} dates={dates} setDates={setDates} />
                        )}
                    </div>
                </div>
            </ThemeContext.Provider>
        </>
    );
}

export default Menubar;