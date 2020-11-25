import React from 'react';
import './eventList.css';

import EventItem from './EventItem/eventsitem';

const eventList = (props) => {
    const events = props.events.map(event => {
        return (
                <EventItem
                    key={event._id}
                    eventId={event._id}
                    title={event.title}
                    price={event.price}
                    date={event.date}
                    userId={props.authuserId}
                    creatorId={event.creator._id}
                    onDetail={props.onViewDetail}
                />
        );
    });

    return (
        <ul className="event__list">
            {events}
        </ul>
    );
};

export default eventList;
