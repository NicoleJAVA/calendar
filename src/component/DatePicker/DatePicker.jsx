import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import 'moment/locale/zh-cn';
import "./DatePicker.scss";
import { DAY, MONTH, WEEK } from "../../helper/DateHelper";

export const DatePicker = () => {
    const [currentDate, setCurrentDate] = useState(moment());
    const [days, setDays] = useState([]);
    const [locale, setLocale] = useState("zh-cn");
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);

    const renderCalendar = useCallback(() => {
        const daysArray = [];
        const monthStart = currentDate.clone().startOf(MONTH).startOf(WEEK);
        const monthEnd = currentDate.clone().endOf(MONTH).endOf(WEEK);

        for (let day = monthStart; day.isBefore(monthEnd, DAY) || day.isSame(monthEnd, DAY); day.add(1, DAY)) {
            daysArray.push(day.clone());
        }
        setDays(daysArray);
    }, [currentDate]);

    useEffect(() => {
        moment.locale(locale);
        renderCalendar();
    }, [locale, renderCalendar]);

    const onClickDate = (day) => {
        if (!day || !isCurrentMonth(day)) return;

        const selectedDate = day.clone();

        if (!selectedStartDate) {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(null);
        } else if (selectedDate.isBefore(selectedStartDate, DAY)) {
            setSelectedStartDate(selectedDate);
            setSelectedEndDate(null);
        } else {
            setSelectedEndDate(selectedDate);
        }
    };

    const isCurrentMonth = (day) => {
        return currentDate.isSame(day, MONTH);
    };

    const isSelected = (day) => {
        return selectedStartDate && selectedEndDate
            ? day.isBetween(selectedStartDate, selectedEndDate, DAY, '[]')
            : selectedStartDate && day.isSame(selectedStartDate, DAY);
    };

    const isToday = (day) => {
        return day.isSame(moment(), DAY);
    };

    return (
        <div className="datepicker">
            <div className="header">
                <button
                    className="nav-button"
                >
                    &lt;
                </button>
                <span>{currentDate.format("YYYY 年 M 月")}</span>
                <button
                    className="nav-button"
                >
                    &gt;
                </button>
            </div>
            <div className="days-container">
                {days.map((day, index) => {
                    const classNames = [
                        'day',
                        !isCurrentMonth(day) ? 'non-current-month' : '',
                        isSelected(day) ? 'selected' : '',
                        isToday(day) ? 'today' : ''
                    ].join(' ');

                    return (
                        <div
                            key={index}
                            className={classNames}
                            onClick={() => onClickDate(day)}
                        >
                            {day.date()}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
