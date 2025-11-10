import supabase from './supabase-client.js';

// Fetch inventory data for a specific room from the database
const getInventoryData = async (roomNumber) => {
    try {
        // First, get the room ID from the room number
        const { data: roomData, error: roomError } = await supabase
            .from('rooms')
            .select('id')
            .eq('number', roomNumber)
            .single();
        
        if (roomError) {
            console.error('Error fetching room:', roomError);
            return [];
        }
        
        // Then, get the inventory for this room with product details
        const { data: inventoryData, error: inventoryError } = await supabase
            .from('inventory')
            .select(`
                quantity,
                products (
                    id,
                    name,
                    par,
                    price,
                    image_url,
                    category
                )
            `)
            .eq('room_id', roomData.id);
        
        if (inventoryError) {
            console.error('Error fetching inventory:', inventoryError);
            return [];
        }
        
        // Transform the data to match the expected format
        return inventoryData.map(item => ({
            id: item.products.id,
            name: item.products.name,
            par: item.products.par,
            price: item.products.price,
            current: item.quantity,
            consumed: 0, // Track consumed amount
            imageUrl: item.products.image_url,
            category: item.products.category
        }));
    } catch (error) {
        console.error('Error in getInventoryData:', error);
        return [];
    }
};

const renderInventory = (inventory) => {
    const container = document.getElementById('inventory-list');
    // Set up grid container for 2-column layout
    container.className = 'grid grid-cols-2 gap-3 px-4';
    
    container.innerHTML = inventory.map(item => `
        <div class="flex flex-col gap-2 bg-slate-50 px-3 py-3 rounded border border-[#cfdbe7]">
          <div class="flex items-center gap-3">
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded size-12 flex-shrink-0"
              style='background-image: url("${item.imageUrl}");'
            ></div>
            <div class="flex flex-col justify-center flex-1 min-w-0">
              <p class="text-[#0d141b] text-sm font-medium leading-normal line-clamp-2">${item.name}</p>
              <p class="text-[#4c739a] text-xs font-normal leading-normal">PAR: ${item.par} | Cur: ${item.current}</p>
              <p class="text-[#4c739a] text-xs font-normal leading-normal">$${item.price.toFixed(2)}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <span class="text-xs text-[#4c739a]">Used:</span>
              <button class="consumed-decrement text-sm font-medium leading-normal flex h-5 w-5 items-center justify-center rounded-full bg-[#e7edf3] cursor-pointer" data-item-id="${item.id}">-</button>
              <input
                class="consumed-input text-sm font-medium leading-normal w-6 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                type="number"
                value="0"
                min="0"
                max="${item.current}"
                data-item-id="${item.id}"
                data-current="${item.current}"
              />
              <button class="consumed-increment text-sm font-medium leading-normal flex h-5 w-5 items-center justify-center rounded-full bg-[#e7edf3] cursor-pointer" data-item-id="${item.id}">+</button>
            </div>
            <div class="text-xs text-[#0d141b]">
              Left: <span class="remaining-quantity font-medium" data-item-id="${item.id}">${item.current}</span>
            </div>
          </div>
        </div>
    `).join('');
};

const updateConsumedQuantity = (itemId, delta) => {
    const input = document.querySelector(`.consumed-input[data-item-id='${itemId}']`);
    const currentQuantity = parseInt(input.dataset.current);
    let newValue = parseInt(input.value) + delta;
    
    // Ensure the consumed quantity doesn't exceed current quantity or go below 0
    if (newValue < 0) newValue = 0;
    if (newValue > currentQuantity) newValue = currentQuantity;
    
    input.value = newValue;
    
    // Update remaining quantity display
    const remainingSpan = document.querySelector(`.remaining-quantity[data-item-id='${itemId}']`);
    const remaining = currentQuantity - newValue;
    remainingSpan.textContent = remaining;
};

const generateReceipts = (consumedItems, roomNumber) => {
    // Calculate total for guest receipt
    let guestTotal = 0;
    const guestReceiptItems = consumedItems.map(item => {
        const itemTotal = item.consumed * item.price;
        guestTotal += itemTotal;
        return {
            name: item.name,
            quantity: item.consumed,
            price: item.price,
            total: itemTotal
        };
    });

    // Calculate replenishment quantities
    const replenishmentItems = consumedItems.map(item => ({
        name: item.name,
        par: item.par,
        current: item.current,
        consumed: item.consumed,
        needed: item.par - (item.current - item.consumed)
    }));

    // Store receipt data in localStorage for display pages
    localStorage.setItem('guestReceipt', JSON.stringify({
        roomNumber,
        items: guestReceiptItems,
        total: guestTotal,
        date: new Date().toLocaleString()
    }));

    localStorage.setItem('replenishmentReceipt', JSON.stringify({
        roomNumber,
        items: replenishmentItems,
        date: new Date().toLocaleString()
    }));
    
    // Store the referring page so we can navigate back correctly
    localStorage.setItem('lastPage', 'inventory.html');
};

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomNumber = urlParams.get('room');
    const groupName = urlParams.get('group');
    
    if (roomNumber) {
        document.getElementById('room-number-header').textContent = `Room ${roomNumber}`;
        if (groupName) {
            document.getElementById('room-number-header').textContent += ` - ${decodeURIComponent(groupName)}`;
        }
    }

    const inventoryData = await getInventoryData(roomNumber);
    renderInventory(inventoryData);

    // Add event listeners for consumed quantity controls
    document.querySelectorAll('.consumed-increment').forEach(button => {
        button.addEventListener('click', () => {
            updateConsumedQuantity(button.dataset.itemId, 1);
        });
    });

    document.querySelectorAll('.consumed-decrement').forEach(button => {
        button.addEventListener('click', () => {
            updateConsumedQuantity(button.dataset.itemId, -1);
        });
    });

    // Add input change listeners for consumed inputs
    document.querySelectorAll('.consumed-input').forEach(input => {
        input.addEventListener('input', () => {
            const itemId = input.dataset.itemId;
            const currentQuantity = parseInt(input.dataset.current);
            let newValue = parseInt(input.value) || 0;
            
            // Validate the input
            if (newValue < 0) newValue = 0;
            if (newValue > currentQuantity) newValue = currentQuantity;
            
            input.value = newValue;
            
            // Update remaining quantity display
            const remainingSpan = document.querySelector(`.remaining-quantity[data-item-id='${itemId}']`);
            const remaining = currentQuantity - newValue;
            remainingSpan.textContent = remaining;
        });
    });

    document.getElementById('submit-button').addEventListener('click', async () => {
        try {
            // Get the room ID
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('id')
                .eq('number', roomNumber)
                .single();
            
            if (roomError) {
                console.error('Error fetching room:', roomError);
                alert('Error submitting inventory');
                return;
            }
            
            // Get the current user
            const userStr = localStorage.getItem('user');
            console.log('Raw user string from localStorage:', userStr);
            
            if (!userStr) {
                console.error('No user found in localStorage');
                alert('Please log in to submit inventory');
                return;
            }
            
            let user;
            try {
                user = JSON.parse(userStr);
                console.log('Parsed user from localStorage:', user);
            } catch (error) {
                console.error('Error parsing user from localStorage:', error);
                alert('Invalid user session. Please log in again.');
                return;
            }
            
            if (!user) {
                console.error('Parsed user is null or undefined');
                alert('Please log in to submit inventory');
                return;
            }
            
            if (!user.id) {
                console.error('User object exists but no ID found:', user);
                alert('Invalid user session. Please log in again.');
                return;
            }
            
            // User ID should be a UUID string
            if (typeof user.id !== 'string' || !user.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                console.error('Invalid user ID format:', user.id, 'Type:', typeof user.id);
                alert('Invalid user session. Please log in again.');
                return;
            }
            
            // Collect consumed items data
            const consumedItems = [];
            document.querySelectorAll('.consumed-input').forEach(input => {
                const consumed = parseInt(input.value) || 0;
                if (consumed > 0) {
                    const itemId = input.dataset.itemId;
                    const inventoryItem = inventoryData.find(item => item.id == itemId);
                    if (inventoryItem) {
                        consumedItems.push({
                            ...inventoryItem,
                            consumed: consumed
                        });
                    }
                }
            });

            if (consumedItems.length === 0) {
                alert('No items were consumed. Please mark consumed items before submitting.');
                return;
            }
            
            // Create a new submission
            const { data: submission, error: submissionError } = await supabase
                .from('submissions')
                .insert({
                    room_id: roomData.id,
                    user_id: user.id
                })
                .select()
                .single();
            
            if (submissionError) {
                console.error('Error creating submission:', submissionError);
                alert('Error submitting inventory');
                return;
            }
            
            // Update inventory and create submission items
            const inventoryUpdates = [];
            consumedItems.forEach(item => {
                const newQuantity = item.current - item.consumed;
                
                inventoryUpdates.push(
                    // Update the inventory quantity
                    supabase
                        .from('inventory')
                        .update({ quantity: newQuantity })
                        .eq('room_id', roomData.id)
                        .eq('product_id', item.id),
                 
                    // Create a submission item
                    supabase
                        .from('submission_items')
                        .insert({
                            submission_id: submission.id,
                            product_id: item.id,
                            consumed_quantity: item.consumed
                        })
                );
            });
            
            // Execute all updates
            await Promise.all(inventoryUpdates);
            
            // Generate receipts
            generateReceipts(consumedItems, roomNumber);
            
            console.log('Inventory submitted successfully:', { roomNumber, submissionId: submission.id });
            
            // Show success message and redirect to receipt page
            alert('Inventory submitted successfully!');
            
            // Redirect to guest receipt page to view the generated receipts
            window.location.href = 'guest-receipt.html';
            
        } catch (error) {
            console.error('Error submitting inventory:', error);
            alert('Error submitting inventory');
        }
    });
});
