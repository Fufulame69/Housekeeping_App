document.addEventListener('DOMContentLoaded', () => {
    // Get replenishment data from localStorage
    const replenishmentData = JSON.parse(localStorage.getItem('replenishmentReceipt'));
    
    if (!replenishmentData) {
        alert('No replenishment data found. Please complete an inventory submission first.');
        window.location.href = 'rooms.html';
        return;
    }
    
    // Update receipt header information
    const roomInfo = replenishmentData.groupName
        ? `Room: ${replenishmentData.roomNumber} - ${replenishmentData.groupName}`
        : `Room: ${replenishmentData.roomNumber}`;
    document.getElementById('room-info').textContent = roomInfo;
    document.getElementById('receipt-date').textContent = `Date: ${replenishmentData.date}`;
    
    // Render replenishment items
    const itemsContainer = document.getElementById('replenishment-items');
    itemsContainer.innerHTML = replenishmentData.items.map(item => {
        const statusClass = item.needed > 0 ? 'text-red-600' : 'text-green-600';
        const statusText = item.needed > 0 ? 'Needs Restocking' : 'Sufficient';
        
        return `
            <div class="flex justify-between items-center py-3 border-b border-[#e7edf3]">
                <div class="flex-1">
                    <p class="text-sm font-medium text-[#0d141b]">${item.name}</p>
                    <div class="text-xs text-[#4c739a] space-y-1">
                        <p>PAR Level: ${item.par}</p>
                        <p>Current: ${item.current - item.consumed}</p>
                        <p>Consumed: ${item.consumed}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-sm font-semibold ${statusClass}">${statusText}</p>
                    ${item.needed > 0 ? `<p class="text-xs text-[#4c739a]">Add ${item.needed} units</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    // Back button functionality
    const handleBackNavigation = () => {
        // Clear receipt data from localStorage
        localStorage.removeItem('guestReceipt');
        localStorage.removeItem('replenishmentReceipt');
        const lastPage = localStorage.getItem('lastPage') || 'rooms.html';
        window.location.href = lastPage;
    };
    
    // Handle top back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleBackNavigation();
        });
    }
    
    // Handle bottom back button
    const backToRoomsButton = document.getElementById('back-to-rooms');
    if (backToRoomsButton) {
        backToRoomsButton.addEventListener('click', handleBackNavigation);
    }
});