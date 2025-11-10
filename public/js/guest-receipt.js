document.addEventListener('DOMContentLoaded', () => {
    // Get receipt data from localStorage
    const receiptData = JSON.parse(localStorage.getItem('guestReceipt'));
    const replenishmentData = JSON.parse(localStorage.getItem('replenishmentReceipt'));
    
    if (!receiptData) {
        alert('No receipt data found. Please complete an inventory submission first.');
        window.location.href = 'rooms.html';
        return;
    }
    
    // Update receipt header information
    const roomInfo = receiptData.groupName
        ? `Room: ${receiptData.roomNumber} - ${receiptData.groupName}`
        : `Room: ${receiptData.roomNumber}`;
    document.getElementById('room-info').textContent = roomInfo;
    document.getElementById('receipt-date').textContent = `Date: ${receiptData.date}`;
    
    // Render receipt items
    const itemsContainer = document.getElementById('receipt-items');
    itemsContainer.innerHTML = receiptData.items.map(item => `
        <div class="flex justify-between items-center py-2 border-b border-[#e7edf3]">
            <div class="flex-1">
                <p class="text-sm font-medium text-[#0d141b]">${item.name}</p>
                <p class="text-xs text-[#4c739a]">${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div class="text-right">
                <p class="text-sm font-semibold text-[#0d141b]">$${item.total.toFixed(2)}</p>
            </div>
        </div>
    `).join('');
    
    // Update total
    document.getElementById('total-amount').textContent = `$${receiptData.total.toFixed(2)}`;
    
    // Render replenishment section if data is available
    if (replenishmentData) {
        const replenishmentSection = document.getElementById('replenishment-section');
        replenishmentSection.innerHTML = `
            <div class="bg-white rounded-lg border border-[#cfdbe7] p-6">
                <div class="text-center mb-6">
                    <h3 class="text-xl font-bold text-[#0d141b] mb-2">Room Replenishment List</h3>
                </div>
                
                <div class="mb-6">
                    <h4 class="font-semibold text-[#0d141b] mb-3">Items to Replenish:</h4>
                    <div id="replenishment-items" class="space-y-2">
                        <!-- Replenishment items will be rendered here -->
                    </div>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="font-semibold text-blue-900 mb-2">Instructions:</h4>
                    <ul class="text-sm text-blue-800 space-y-1">
                        <li>• Restock all items to their PAR levels</li>
                        <li>• Check expiration dates before restocking</li>
                        <li>• Report any damaged items to management</li>
                        <li>• Update inventory system after restocking</li>
                    </ul>
                </div>
            </div>
        `;
        
        // Render replenishment items
        const replenishmentItemsContainer = document.getElementById('replenishment-items');
        replenishmentItemsContainer.innerHTML = replenishmentData.items.map(item => {
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
    }
    
    // Handle back button navigation
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', (e) => {
            e.preventDefault();
            const lastPage = localStorage.getItem('lastPage') || 'rooms.html';
            window.location.href = lastPage;
        });
    }
});