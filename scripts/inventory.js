import supabase from './supabase-client.js';

// Placeholder data - replace with your actual data fetching logic
const getInventoryData = async (roomId) => {
    return [
        { id: 1, name: 'Water', par: 4, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5pZsFLnadzWbRcplCUMrg9vxabg6IUwfOGRZDtEvuy15hnZwpfgKX7KUyMkVFzERJYqu0Xx3hEyFNMw0RWkbHkGf9OcJ_xGZiETCd5w3YJUCvfXqW20SSa9QChKqC5dNlDsl699arlDcNOmaHzpbnuwo90FolwNbWxmNV8a_G_SQIPl9-YDi2j04Uchy6IzhnQ5oK5xxt9Sk4wttw2fUQxg0Heiq-xbuAa7ihO9Hqrlue72PXRqkSsLOICnyhA3xUd457jUVSg1U' },
        { id: 2, name: 'Soda', par: 6, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR6pXr9oMB4jEmb2jiV1c4P-oTbYTohx8Zd17XyXo9mvZai-KEynjpxJsMW9JswBmscYsNI0wTkdpW7sDFNo1O9vuKKKeSD5RmthKnvTmhIGlB7gBv5LFFCSDyF8b-CfE4BiiBKeyKHbd_sk8p5b0qvJb9I0hib6_O5irj-Eh2foAMa9P1Nl0Od8rmZ7pazEVI4wws71nDUh6ntSkftsbdb6HipSx48NbPKhEjoZzukLru1-DBJzqS14gkm3H6MkG7D85bc9Ez6wo' },
        { id: 3, name: 'Juice', par: 3, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARkIJ_G1pWxeN2D5rfodr7WMpirpWGmHyQiJhYyAHBBmgp60aNyPHCqf76z9kxD8Td1Tdg_RcCoF5Z4fZZWOWq8NDBDGp_0giryyKQuWlRp1lv8sSetRf65AdDX9uGPsU3dd86nwUBBfnyXmlswiqgf4PO0mCwLdozAtwiAOV9OJx_6Q_MuGasGRiZgJvZ5gHqteBqUmtDHCQa9w-7Lfvh0ywS7cdY9HGQa3Fb0Nn7RYaEqxyoZ-X1zTpG2U7vhqjzzxWhmDUVxpw' },
        { id: 4, name: 'Beer', par: 8, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClyY_0tFbHZ55VmtoCRh06-vVp_Ddt8QX5nS1O0RIOEtjjgnYFYMzP-swyOSntEmpLR6NjcF7BwSUcSYp0Q1twvRWFzGyznZhA5EXKjTpwvHm6gGxD2VNJK9lxFJIEGhOZ9t02cMRaxXY4Sr-FUbgJZfZT4UHd2_RflQTllB032bvH3AgXcExa-9Dt0kwOA_jKRAVSxmq1rUx7Cd_dlguCi16DJVJogArPX7PRmImYVgACVv0HudGe2qxav_mN41mhRPnQk_1ec9w' },
        { id: 5, name: 'Wine', par: 2, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuJtrAM8CZeuFPRx7Pxb9FAdu9bRWrLF9gRAsbyBgf9aQ5vPitPTlZ8zHmwKPiLXGjTxENtbG4kuM3dOQ7eueQHr5vaBCIPZeQpbJ-ySWa3AIp4P77ZSZhrlXI8bR10ceC6Ai0l9ItnbYrIuifIBZMeePgGXCRqA3A_3ZrndUfBMmdQHY3Z8_Cc27OxDerVyaZn8Q_AXAjgu3CmZy0XrRwQ5F2DZYUq99lZPcaDvica6CD_3sHeHq4Vv65-Ie0EjguD7NVTbuwGdg' },
        { id: 6, name: 'Snacks', par: 5, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALx_PNkS1G1OjjFGVWWVhyfgUAR7QOOY7XCvuC-MAdvVQ0dBG2szmsS8a_nwRKrS6R1I8t3dB5L83StpgQfJ0kBGmrCVfN61efnMsEaMM5e8dd0GCMzwFOqltS6FLhYvpCqBSXIeaYAAiqCCfg31GkWtzBDiqTnXMwHQm3BHptLyw_q8vhRhuAFIq3zOs9Mb4j3ms-GpkOotDrescypWc4-1_RcErHKAbIP5Pg5_LMOfjnmRGgX7t32COGMq72Z4r5FE-oxkzUOuo' },
        { id: 7, name: 'Candy', par: 4, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtjKovSsWtmXHVh1dEMp_C3Qoa9ceY-aRe3Lb4e5wXhs_LfFk4UTgevSpyJud17JBKEWXlIvxo7QH3sSPviV2dI1LwOsNnvMomh-xPlf0GIkoABcMnRWQcqtl9SsnHO2k0Fzpgheq9OhTed2sft1cp8pRe0CURCh1IeKh_74G4ZYjFc9cd42GLiygtvMDb3B3x3bmHMFJeCMa5AGWzvy2WE1o_2kcM_NpssXkcLqIMb4kakLZdMngVcBYxkYUxGE-fjyJKA6QVdpg' },
        { id: 8, name: 'Chips', par: 6, current: 0, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUCe6GNfivUkRBPERBZ7RN3QcMKjid5Hux9jU6ATbW0NiAdUrTlU-9D987PgwabPlaFirIDXw49BBzMmGzj9DDMxo5BLOME_FzPlWYalb0AhXr6Q5Kk0B9flJ0gbDOv-OyN9yDa_tCGyxDjxoWxUYtANfk80rIoc6wWV7bdl5o75dNh9C6Yp1JUv7UJ3JDZgyqCbbpAJ4M1aoRcvbzxVxASdDnmPRzGoE8qrycsPy_9AVgiNxbd9qvcjS-O41a9P61fHVuYBqFHMk' },
    ];
};

const renderInventory = (inventory) => {
    const container = document.getElementById('inventory-list');
    container.innerHTML = inventory.map(item => `
        <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2 justify-between">
          <div class="flex items-center gap-4">
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded size-14"
              style='background-image: url("${item.imageUrl}");'
            ></div>
            <div class="flex flex-col justify-center">
              <p class="text-[#0d141b] text-base font-medium leading-normal line-clamp-1">${item.name}</p>
              <p class="text-[#4c739a] text-sm font-normal leading-normal line-clamp-2">PAR: ${item.par}</p>
            </div>
          </div>
          <div class="shrink-0">
            <div class="flex items-center gap-2 text-[#0d141b]">
              <button class="decrement-button text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#e7edf3] cursor-pointer" data-item-id="${item.id}">-</button>
              <input
                class="quantity-input text-base font-medium leading-normal w-4 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&amp;::-webkit-inner-spin-button]:appearance-none [&amp;::-webkit-outer-spin-button]:appearance-none"
                type="number"
                value="${item.current}"
                data-item-id="${item.id}"
              />
              <button class="increment-button text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-[#e7edf3] cursor-pointer" data-item-id="${item.id}">+</button>
            </div>
          </div>
        </div>
    `).join('');
};

const updateQuantity = (itemId, delta) => {
    const input = document.querySelector(`.quantity-input[data-item-id='${itemId}']`);
    let newValue = parseInt(input.value) + delta;
    if (newValue < 0) newValue = 0;
    input.value = newValue;
};

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    document.getElementById('room-number-header').textContent += roomId;

    const inventoryData = await getInventoryData(roomId);
    renderInventory(inventoryData);

    document.querySelectorAll('.increment-button').forEach(button => {
        button.addEventListener('click', () => {
            updateQuantity(button.dataset.itemId, 1);
        });
    });

    document.querySelectorAll('.decrement-button').forEach(button => {
        button.addEventListener('click', () => {
            updateQuantity(button.dataset.itemId, -1);
        });
    });

    document.getElementById('submit-button').addEventListener('click', async () => {
        const inventoryUpdates = [];
        document.querySelectorAll('.quantity-input').forEach(input => {
            inventoryUpdates.push({
                itemId: input.dataset.itemId,
                quantity: parseInt(input.value)
            });
        });

        // Replace with your actual Supabase update logic
        console.log('Submitting inventory updates:', { roomId, inventoryUpdates });
        alert('Inventory submitted successfully!');
    });
});
