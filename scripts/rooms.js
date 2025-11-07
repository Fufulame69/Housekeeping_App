import supabase from './supabase-client.js';

// Placeholder data - replace with your actual data fetching logic
const getRoomsData = async () => {
    return [
        { id: 1, name: 'Casa 1', rooms: [101, 102, 103, 104, 105] },
        { id: 2, name: 'Casa 2', rooms: [201, 202, 203, 204, 205] },
        { id: 3, name: 'Casa 3', rooms: [301, 302, 303, 304, 305] },
    ];
};

const renderRoomGroups = (roomGroups) => {
    const container = document.getElementById('room-groups');
    container.innerHTML = roomGroups.map(group => `
        <details class="flex flex-col rounded border border-[#cfdbe7] bg-slate-50 px-[15px] py-[7px] group">
            <summary class="flex cursor-pointer items-center justify-between gap-6 py-2">
              <p class="text-[#0d141b] text-sm font-medium leading-normal">${group.name}</p>
              <div class="text-[#0d141b] group-open:rotate-180" data-icon="CaretDown" data-size="20px" data-weight="regular">
                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
                </svg>
              </div>
            </summary>
            <p class="text-[#4c739a] text-sm font-normal leading-normal pb-2">${group.rooms.join(', ')}</p>
          </details>
    `).join('');
};

const renderRoomList = (roomGroups) => {
    const container = document.getElementById('room-list');
    const allRooms = roomGroups.flatMap(group => group.rooms);
    container.innerHTML = allRooms.map(roomNumber => `
        <a href="inventory.html?room=${roomNumber}" class="flex items-center gap-4 bg-slate-50 px-4 min-h-14 justify-between">
          <p class="text-[#0d141b] text-base font-normal leading-normal flex-1 truncate">${roomNumber}</p>
          <div class="shrink-0">
            <div class="text-[#0d141b] flex size-7 items-center justify-center" data-icon="CaretRight" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </a>
    `).join('');
};

const filterRooms = () => {
    const searchInput = document.getElementById('search-input');
    const filter = searchInput.value.toUpperCase();
    const roomList = document.getElementById('room-list');
    const rooms = roomList.getElementsByTagName('a');

    for (let i = 0; i < rooms.length; i++) {
        const p = rooms[i].getElementsByTagName('p')[0];
        const txtValue = p.textContent || p.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            rooms[i].style.display = "";
        } else {
            rooms[i].style.display = "none";
        }
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    const roomsData = await getRoomsData();
    renderRoomGroups(roomsData);
    renderRoomList(roomsData);

    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keyup', filterRooms);
});
