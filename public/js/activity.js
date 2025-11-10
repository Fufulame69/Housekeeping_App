import supabase from './supabase-client.js';

// Global state for selected date
let selectedDate = new Date().toISOString().split('T')[0]; // Default to today

// Fetch submissions for a specific date
const getSubmissionsForDate = async (date) => {
    try {
        // Fetch submissions with room and user details for the specified date
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select(`
                id,
                created_at,
                rooms (
                    number,
                    room_groups (
                        name
                    )
                ),
                users (
                    username
                ),
                submission_items (
                    product_id,
                    consumed_quantity,
                    products (
                        name,
                        price
                    )
                )
            `)
            .gte('created_at', `${date}T00:00:00.000Z`)
            .lte('created_at', `${date}T23:59:59.999Z`)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching submissions for date:', error);
            return [];
        }
        
        return submissions || [];
    } catch (error) {
        console.error('Error in getSubmissionsForDate:', error);
        return [];
    }
};

// Fetch submissions for a date range (for week view)
const getSubmissionsForDateRange = async (startDate, endDate) => {
    try {
        const { data: submissions, error } = await supabase
            .from('submissions')
            .select(`
                id,
                created_at,
                rooms (
                    number,
                    room_groups (
                        name
                    )
                ),
                users (
                    username
                ),
                submission_items (
                    product_id,
                    consumed_quantity,
                    products (
                        name,
                        price
                    )
                )
            `)
            .gte('created_at', `${startDate}T00:00:00.000Z`)
            .lte('created_at', `${endDate}T23:59:59.999Z`)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching submissions for date range:', error);
            return [];
        }
        
        return submissions || [];
    } catch (error) {
        console.error('Error in getSubmissionsForDateRange:', error);
        return [];
    }
};

const renderSubmissions = (submissions, viewType = 'day') => {
    const container = document.getElementById('date-submissions');
    if (!container) return;
    
    if (submissions.length === 0) {
        const message = viewType === 'week' ? 'No submissions this week' : 'No submissions for this date';
        container.innerHTML = `<p class="text-[#4c739a] text-sm px-4 py-2">${message}</p>`;
        return;
    }
    
    container.innerHTML = submissions.map(submission => {
        const roomNumber = submission.rooms?.number || 'Unknown';
        const groupName = submission.rooms?.room_groups?.name || '';
        const userName = submission.users?.username || 'Unknown';
        const date = new Date(submission.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const time = new Date(submission.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        const total = calculateSubmissionTotal(submission);
        
        // Show date only for week view
        const dateDisplay = viewType === 'week' ? `${date} at ` : '';
        
        return `
            <div class="bg-white border border-[#cfdbe7] rounded-lg p-4 mb-3 cursor-pointer hover:bg-slate-50 transition-colors"
                 onclick="viewReceiptDetails(${submission.id})">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="text-[#0d141b] text-base font-medium leading-normal">
                            Room ${roomNumber}${groupName ? ` - ${groupName}` : ''}
                        </p>
                        <p class="text-[#4c739a] text-sm font-normal leading-normal">
                            Service by ${userName} • ${dateDisplay}${time}
                        </p>
                        <p class="text-[#4c739a] text-xs font-normal leading-normal mt-1">
                            ${submission.submission_items?.length || 0} items • Total: $${total.toFixed(2)}
                        </p>
                    </div>
                    <div class="text-[#0d141b] flex items-center justify-center" data-icon="CaretRight" data-size="20px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                        </svg>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

const calculateSubmissionTotal = (submission) => {
    if (!submission.submission_items) return 0;
    
    return submission.submission_items.reduce((total, item) => {
        const price = item.products?.price || 0;
        const quantity = item.consumed_quantity || 0;
        return total + (price * quantity);
    }, 0);
};

// Make viewReceiptDetails globally accessible
window.viewReceiptDetails = async (submissionId) => {
    try {
        // Fetch detailed submission data
        const { data: submission, error } = await supabase
            .from('submissions')
            .select(`
                id,
                created_at,
                rooms (
                    number,
                    room_groups (
                        name
                    )
                ),
                users (
                    username
                ),
                submission_items (
                    product_id,
                    consumed_quantity,
                    products (
                        name,
                        price,
                        par
                    )
                )
            `)
            .eq('id', submissionId)
            .single();
        
        if (error) {
            console.error('Error fetching submission details:', error);
            alert('Error loading receipt details');
            return;
        }
        
        // Calculate receipt data
        const roomNumber = submission.rooms?.number || 'Unknown';
        const groupName = submission.rooms?.room_groups?.name || '';
        const date = new Date(submission.created_at).toLocaleString();
        
        const guestReceiptItems = submission.submission_items.map(item => ({
            name: item.products?.name || 'Unknown',
            quantity: item.consumed_quantity,
            price: item.products?.price || 0,
            total: (item.products?.price || 0) * item.consumed_quantity
        }));
        
        const guestTotal = guestReceiptItems.reduce((sum, item) => sum + item.total, 0);
        
        const replenishmentItems = submission.submission_items.map(item => ({
            name: item.products?.name || 'Unknown',
            par: item.products?.par || 0,
            current: 0, // We don't have current inventory in this query
            consumed: item.consumed_quantity,
            needed: item.products?.par || 0 // Simplified - would need current inventory for accurate calculation
        }));
        
        // Store receipt data in localStorage for display pages
        localStorage.setItem('guestReceipt', JSON.stringify({
            roomNumber,
            groupName,
            items: guestReceiptItems,
            total: guestTotal,
            date
        }));
        
        localStorage.setItem('replenishmentReceipt', JSON.stringify({
            roomNumber,
            groupName,
            items: replenishmentItems,
            date
        }));
        
        // Store the referring page so we can navigate back correctly
        localStorage.setItem('lastPage', 'activity.html');
        
        // Redirect to guest receipt page (which now shows both receipts)
        window.location.href = 'guest-receipt.html';
        
    } catch (error) {
        console.error('Error in viewReceiptDetails:', error);
        alert('Error loading receipt details');
    }
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

// Update the selected date display
const updateDateDisplay = (date, viewType = 'day') => {
    const dateDisplay = document.getElementById('selected-date');
    if (!dateDisplay) return;
    
    const dateObj = new Date(date + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let displayText = '';
    
    if (viewType === 'week') {
        const startOfWeek = new Date(date);
        const endOfWeek = new Date(date);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        
        displayText = `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
        if (dateObj.getTime() === today.getTime()) {
            displayText = 'Today';
        } else if (dateObj.getTime() === yesterday.getTime()) {
            displayText = 'Yesterday';
        } else {
            displayText = dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
    }
    
    dateDisplay.textContent = displayText;
};

// Load submissions for the selected date
const loadSubmissions = async (date, viewType = 'day') => {
    let submissions;
    
    if (viewType === 'week') {
        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 6);
        submissions = await getSubmissionsForDateRange(date, endDate.toISOString().split('T')[0]);
    } else {
        submissions = await getSubmissionsForDate(date);
    }
    
    renderSubmissions(submissions, viewType);
    updateDateDisplay(date, viewType);
};

// Navigate to previous date
const navigatePrevious = async () => {
    // Day view - go back one day
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() - 1);
    selectedDate = currentDate.toISOString().split('T')[0];
    await loadSubmissions(selectedDate, 'day');
};

// Navigate to next date
const navigateNext = async () => {
    // Day view - go forward one day
    const currentDate = new Date(selectedDate + 'T00:00:00');
    currentDate.setDate(currentDate.getDate() + 1);
    selectedDate = currentDate.toISOString().split('T')[0];
    await loadSubmissions(selectedDate, 'day');
};


// Toggle calendar visibility
const toggleCalendar = () => {
    const datePickerContainer = document.getElementById('date-picker-container');
    const calendarBtn = document.getElementById('calendar-btn');
    
    if (datePickerContainer.classList.contains('hidden')) {
        datePickerContainer.classList.remove('hidden');
        calendarBtn.className = 'px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1';
        
        // Set the date picker to the currently selected date
        document.getElementById('date-picker').value = selectedDate;
    } else {
        datePickerContainer.classList.add('hidden');
        calendarBtn.className = 'px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors flex items-center gap-1';
    }
};

// Handle date picker selection
const handleDatePickerChange = async (event) => {
    selectedDate = event.target.value;
    
    // Update button styles to show calendar is active
    document.getElementById('calendar-btn').className = 'px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex items-center gap-1';
    
    // Hide the date picker after selection
    document.getElementById('date-picker-container').classList.add('hidden');
    
    await loadSubmissions(selectedDate, 'day');
};

document.addEventListener('DOMContentLoaded', async () => {
    // Set up event listeners
    document.getElementById('prev-date').addEventListener('click', navigatePrevious);
    document.getElementById('next-date').addEventListener('click', navigateNext);
    document.getElementById('calendar-btn').addEventListener('click', toggleCalendar);
    document.getElementById('date-picker').addEventListener('change', handleDatePickerChange);
    
    // Load today's submissions by default
    selectedDate = new Date().toISOString().split('T')[0];
    await loadSubmissions(selectedDate, 'day');
});
