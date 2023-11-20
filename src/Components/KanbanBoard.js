import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KanbanBoard.css';
import Card from './Card'

const initialTickets = [];

const KanbanBoard = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [groupingOption, setGroupingOption] = useState("By Status");
  const [sortingOption, setSortingOption] = useState("Priority");
  const [displayOptionsVisible, setDisplayOptionsVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);

  const fetchTickets = async () => {
    try {
      const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
      console.log('API response:', response.data);
      setTickets(response.data.tickets || initialTickets);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error(error);
      setTickets(initialTickets);
      setUsers([]);
    }
  };

  const values = {
    "By User": 'userId',
    "By Status": 'status',
    "By Priority": 'priority',
    "Priority": 'priority',
    "Title": 'title',
    0: 'No priority',
    1: 'Low',
    2: 'Medium',
    3: 'High',
    4: 'Urgent'


  }
  const getUserDisplayName = (userId) => {
    const user = users.find((user) => user.id === userId);

    return user ? user.name : userId;
  };
  const getPriorityLabel = (priority) => {
    return values[priority];
  };
  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleSortingChange = (event) => {
    setSortingOption(event.target.value);
  };

  const handleDisplayOptionsToggle = () => {
    setDisplayOptionsVisible(!displayOptionsVisible);
  };

  const handleDisplayTickets = () => {
    fetchTickets();
    setDisplayOptionsVisible(false);
  };

  useEffect(() => {

    if (tickets.length === 0) {
      fetchTickets();

    }

    const map = new Map();
    tickets.forEach((ticket) => {
      const groupKey = values[groupingOption] === "priority"
        ? getPriorityLabel(ticket[values[groupingOption]])
        : values[groupingOption] === "userId"
          ? getUserDisplayName(ticket[values[groupingOption]])
          : ticket[values[groupingOption]];
      if (!map.has(groupKey)) {
        map.set(groupKey, []);
      }

      map.get(groupKey).push(ticket);
      for (let key of map.keys()) {
        map.get(key).sort((a, b) => {

          const valueA = a[values[sortingOption]];
          const valueB = b[values[sortingOption]];
          if (sortingOption === "Priority") {
            return valueB - valueA;
          } else if (sortingOption === "Title") {
            return valueA.localeCompare(valueB);
          } else {
            return 0;
          }


        });
      }



    });



    setData({ map });

    console.log("users", users);
  }, [groupingOption, sortingOption, tickets])

  return (
    <div className="kanban-board">
      <div className="upper-div">
        <button className="display-button" onClick={handleDisplayOptionsToggle}>
          <span><img class="image2" src="https://cdn-icons-png.flaticon.com/512/6488/6488674.png"></img></span>Display<span><img class="image1" src="https://static.thenounproject.com/png/3012911-200.png"></img></span>
        </button>
        {displayOptionsVisible && (
          <div className="dropdown-menu">
            <div className="dropdown-element">
              <label>Grouping</label>
              <select value={groupingOption} onChange={handleGroupingChange}>
                <option value="By Status">Status</option>
                <option value="By User">User</option>
                <option value="By Priority">Priority</option>
              </select>
            </div>

            <div className="dropdown-element">
              <label>Ordering</label>
              <select value={sortingOption} onChange={handleSortingChange}>
                <option value="Priority">Priority</option>
                <option value="Title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="lower-div">
        <div className="tickets">
          {data && Array.from(data.map.keys()).map((key) => {
            const cardCount = data.map.get(key).length;
            return (
              <div className="ticket-group">
                <div className="ticket-title">
                  <div>
                    <span class="material-symbols-sharp">
                      fiber_manual_record
                    </span>
                    <h3 >{values[key] || key}</h3>
                    <p className='card-count'>{cardCount}</p>
                  </div>
                  <div>
                    <span class="material-symbols-sharp">
                      more_horiz
                    </span>
                    <span class="material-symbols-sharp">
                      add
                    </span>
                  </div>
                </div>
                <div className="ticket-group-cards">
                  {data.map.get(key).map((ticket) => {
                    return <Card
                      id={ticket.id}
                      title={ticket.title}
                      key={ticket.id}
                      tag={ticket.tag}
                      priorityLabel={getPriorityLabel(ticket.priority)}
                      groupingOption={groupingOption}
                    />
                  })}
                </div>

              </div>
            )
          })}
        </div>
      </div>
      {/* {displayOptionsVisible && (
        <button className="apply-button" onClick={handleDisplayTickets}>
          Apply
        </button>
      )} */}
    </div>
  );
};

export default KanbanBoard;