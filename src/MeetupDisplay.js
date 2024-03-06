import React, { useState, useEffect } from 'react';
import { BsGeoAlt } from "react-icons/bs";
import 'bootstrap/dist/css/bootstrap.min.css';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()} - ${date.toLocaleString('default', { weekday: 'long' })}`;
};

const MeetupDisplay = () => {
  const [groupedMeetups, setGroupedMeetups] = useState({});
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

useEffect(() => {
  const currentDate = new Date();

  fetch('/meetup.json')
    .then(response => response.json())
    .then(data => {
      const allItems = data.flatMap(group => 
        group.items.map(item => ({
          ...item,
          groupTitle: group.group_title,
          groupLink: group.group_link,
          formattedDate: formatDate(item.time),
          rawDate: new Date(item.time)
        }))
      ).filter(item => item.rawDate >= currentDate); // Filter out past events

      const groupedByDate = allItems.reduce((acc, item) => {
        const dateKey = item.formattedDate;
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(item);
        return acc;
      }, {});

      const sortedGroupedByDate = Object.entries(groupedByDate)
        .sort((a, b) => new Date(a[1][0].rawDate) - new Date(b[1][0].rawDate))
        .reduce((acc, [formattedDate, items]) => {
          acc[formattedDate] = items.sort((a, b) => a.rawDate - b.rawDate);
          return acc;
        }, {});

      setGroupedMeetups(sortedGroupedByDate);
    })
    .catch(error => console.error('Error loading meetups:', error));
}, []);


  const toggleDescription = (date, idx) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [date]: { ...prev[date], [idx]: !prev[date]?.[idx] }
    }));
  };

  return (
    <div className="container my-4">
      {Object.entries(groupedMeetups).map(([formattedDate, items]) => (
        <div key={formattedDate} className="mb-3">
          <h2 className="mb-2">{formattedDate}</h2>
          <div className="row">
           {items.map((item, idx) => (
  <div key={idx} className="col-sm-6 d-flex align-items-stretch">
    <div className="card mb-2" style={{ minWidth: '100%' }}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="badge bg-dark text-white" style={{ width:'80px' }}>
            {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div style={{ width: 'calc(100% - 80px)' }}>
            <a style={{ color: '#333' }} href={item.event_link} target="_blank" rel="noopener noreferrer">
              <h4>{item.title}</h4>
            </a>
          </div>
        </div>
        <p style={{ marginLeft: '80px' }} className="card-text"><BsGeoAlt /> {item.location}</p>
        <p className="card-text" style={{ cursor: 'pointer', marginLeft: '80px' }} onClick={() => toggleDescription(item.formattedDate, idx)}>
          Description {expandedDescriptions[item.formattedDate]?.[idx] ? '(less)' : '(more)'}
        </p>
        {expandedDescriptions[item.formattedDate]?.[idx] && <p style={{ marginLeft: '80px' }} className="card-text">{item.description}</p>}
        <div className="text-muted small">
          <p style={{ marginLeft: '80px' }}><a href={item.groupLink} target="_blank" rel="noopener noreferrer">{item.groupTitle}</a></p>
        </div>
      </div>
    </div>
  </div>
))}

          </div>
        </div>
      ))}
    </div>
  );
};



export default MeetupDisplay;

