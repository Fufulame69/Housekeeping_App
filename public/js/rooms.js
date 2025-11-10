import supabase from './supabase-client.js';

// Fetch room groups and their rooms from the database
const getRoomsData = async () => {
    try {
        // First, fetch all room groups
        const { data: roomGroups, error: groupsError } = await supabase
            .from('room_groups')
            .select('*')
            .order('name');
        
        if (groupsError) {
            console.error('Error fetching room groups:', groupsError);
            return [];
        }
        
        // For each room group, fetch its rooms
        const groupsWithRooms = await Promise.all(
            roomGroups.map(async (group) => {
                const { data: rooms, error: roomsError } = await supabase
                    .from('rooms')
                    .select('number')
                    .eq('group_id', group.id)
                    .order('number');
                
                if (roomsError) {
                    console.error(`Error fetching rooms for group ${group.name}:`, roomsError);
                    return { ...group, rooms: [] };
                }
                
                return {
                    id: group.id,
                    name: group.name,
                    rooms: rooms.map(room => room.number)
                };
            })
        );
        
        return groupsWithRooms;
    } catch (error) {
        console.error('Error in getRoomsData:', error);
        return [];
    }
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
            <div class="flex flex-col gap-2 pb-2">
                ${group.rooms.map(roomNumber => `
                    <a href="inventory.html?room=${roomNumber}&group=${encodeURIComponent(group.name)}"
                       class="flex items-center gap-4 bg-white px-4 py-3 rounded border border-[#cfdbe7] hover:bg-slate-100 transition-colors">
                        <div class="flex-1">
                            <p class="text-[#0d141b] text-base font-normal leading-normal">Room ${roomNumber}</p>
                        </div>
                        <div class="shrink-0">
                            <div class="text-[#0d141b] flex size-5 items-center justify-center" data-icon="CaretRight" data-size="20px" data-weight="regular">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                                </svg>
                            </div>
                        </div>
                    </a>
                `).join('')}
            </div>
          </details>
    `).join('');
};

const renderRoomList = (roomGroups) => {
    const container = document.getElementById('room-list');
    const allRooms = roomGroups.flatMap(group =>
        group.rooms.map(roomNumber => ({
            number: roomNumber,
            groupName: group.name
        }))
    );
    
    container.innerHTML = allRooms.map(room => `
        <a href="inventory.html?room=${room.number}&group=${encodeURIComponent(room.groupName)}" class="flex items-center gap-4 bg-slate-50 px-4 min-h-14 justify-between">
          <div class="flex-1">
            <p class="text-[#0d141b] text-base font-normal leading-normal truncate">Room ${room.number}</p>
            <p class="text-[#4c739a] text-xs font-normal leading-normal">${room.groupName}</p>
          </div>
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
        const roomText = rooms[i].textContent || rooms[i].innerText;
        if (roomText.toUpperCase().indexOf(filter) > -1) {
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
