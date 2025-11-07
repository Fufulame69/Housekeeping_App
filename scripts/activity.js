import supabase from './supabase-client.js';

// Placeholder data - replace with your actual data fetching logic
const getActivityData = async () => {
    return {
        recentSubmissions: [
            { room: 201, user: 'Alex', time: '10:30 AM' },
            { room: 305, user: 'Maria', time: '11:15 AM' },
            { room: 102, user: 'David', time: '12:45 PM' },
        ],
        topConsumedProducts: [
            { name: 'Bottled Water', units: 15 },
            { name: 'Soda', units: 12 },
            { name: 'Chips', units: 8 },
        ],
        abnormalConsumptionRooms: [
            { room: 402, units: 10 },
            { room: 501, units: 8 },
        ],
    };
};

const renderRecentSubmissions = (submissions) => {
    const container = document.getElementById('recent-submissions');
    container.innerHTML = submissions.map(submission => `
        <div class="flex flex-col items-center gap-1 pt-3">
            <div class="text-[#0d141b]" data-icon="TextHThree" data-size="24px" data-weight="regular">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path
                  d="M152,56V176a8,8,0,0,1-16,0V124H48v52a8,8,0,0,1-16,0V56a8,8,0,0,1,16,0v52h88V56a8,8,0,0,1,16,0Zm73.52,90.63,21-30A8,8,0,0,0,240,104H192a8,8,0,0,0,0,16h32.63l-19.18,27.41A8,8,0,0,0,212,160a20,20,0,1,1-14.29,34,8,8,0,1,0-11.42,11.19A36,36,0,0,0,248,180,36.07,36.07,0,0,0,225.52,146.63Z"
                ></path>
              </svg>
            </div>
            <div class="w-[1.5px] bg-[#cfdbe7] h-2 grow"></div>
        </div>
        <div class="flex flex-1 flex-col py-3">
            <p class="text-[#0d141b] text-base font-medium leading-normal">Room ${submission.room} - Service by ${submission.user}</p>
            <p class="text-[#4c739a] text-base font-normal leading-normal">${submission.time}</p>
        </div>
    `).join('');
};

const renderTopConsumedProducts = (products) => {
    const container = document.getElementById('top-consumed-products');
    container.innerHTML = products.map(product => `
        <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
          <div class="bg-center bg-no-repeat aspect-square bg-cover rounded size-14"></div>
          <div class="flex flex-col justify-center">
            <p class="text-[#0d141b] text-base font-medium leading-normal line-clamp-1">${product.name}</p>
            <p class="text-[#4c739a] text-sm font-normal leading-normal line-clamp-2">${product.units} units</p>
          </div>
        </div>
    `).join('');
};

const renderAbnormalConsumptionRooms = (rooms) => {
    const container = document.getElementById('abnormal-consumption-rooms');
    container.innerHTML = rooms.map(room => `
        <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
          <div class="text-[#0d141b] flex items-center justify-center rounded bg-[#e7edf3] shrink-0 size-12" data-icon="Bed" data-size="24px" data-weight="regular">
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
              <path d="M208,72H24V48A8,8,0,0,0,8,48V208a8,8,0,0,0,16,0V176H232v32a8,8,0,0,0,16,0V112A40,40,0,0,0,208,72ZM24,88H96v72H24Zm88,72V88h96a24,24,0,0,1,24,24v48Z"></path>
            </svg>
          </div>
          <div class="flex flex-col justify-center">
            <p class="text-[#0d141b] text-base font-medium leading-normal line-clamp-1">Room ${room.room}</p>
            <p class="text-[#4c739a] text-sm font-normal leading-normal line-clamp-2">${room.units} units</p>
          </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', async () => {
    const activityData = await getActivityData();
    renderRecentSubmissions(activityData.recentSubmissions);
    renderTopConsumedProducts(activityData.topConsumedProducts);
    renderAbnormalConsumptionRooms(activityData.abnormalConsumptionRooms);
});
