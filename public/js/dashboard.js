import supabase from './supabase-client.js';
import { t } from './translations.js';

// Placeholder data - replace with your actual data fetching logic
const getDashboardData = async () => {
    return {
        totalStock: 1250,
        stockByCategory: [
            { name: 'Drinks', percentage: 20 },
            { name: 'Snacks', percentage: 40 },
            { name: 'Amenities', percentage: 100 },
        ],
        lowStockAlerts: [
            { name: 'Sparkling Water', unitsLeft: 10, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmoXkMo5Ner2TrL0ETQBP1E6aIVGoYMEl2bFzo_azt3mDb0dre9nRh8aq8ltOkQllUQ5haNvZUjtOVH3pZ5NAc4A6pHnJueoC4Nbe6k-fdcH5t8oucZfYNCtn-IWvYY6LAnrw8OkYQVqjOizBhSOqNALo-v-pb6Ub4xBT80WNa8HM0ZSO8NHP58myIRzQmgJDF3G-MHHU3ILw4rhAuFWINXklBPKdN-hHqftpgFPv89u9_L21C65pNLwdqd_hQOaBTOJ1pyGBvwkA' },
            { name: 'Chocolate Bar', unitsLeft: 5, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDUH8QH0zr3Z_JzPybRAbrnRJRDeQh8gqFijnZYTKAVEH1CnQItse9iUiJaEhLRUHICURqYJacXIWg_ixpRU5kYScioQ2axhh9fjmfRtJk9-oqCqtzKdhi_8crV19gvL4Ui2nGVYOS2GaFt6L0fV2KNgHr25iHETYsUljenFj32RWH32l4mvE8Jkdk7KhUF8ljnmL5aQCiuOt9_sLunEuiFXhDnUGk4cibD4NNfYj-YscNW4_bPo0TDcmC54q2AyjDuxrxgu0SKQY' },
            { name: 'Shampoo', unitsLeft: 2, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADdt37ik6aEox2iXLxlpzsdFnyjQTEVbJvnGynQ0995XPthRdC3KSywQvjT1IRGhB0wXYCAjpPYXenSz2twZ4xPfBqhHIMZBSzoyURlES7qosEdXb7CqRuheCRTrk2TtETyjYTgrdtKNIZxiXB2ucm3UL1nDJgO8m_FwIjBzUzO-x9IQ1lGJ-m-cCTlYW_G9wUXvBGQip0mTQjluHQatg0UzHxDexJVqk9SPdxVo9C7QoQZL2a_nC-gSQYXc237uQv3IGYQF0Tzxk' },
        ],
        topConsumedItems: [
            { name: 'Sparkling Water', unitsConsumed: 150, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEemuW_zA61GXjbdm5XYcnikUrHj_H7sxA4UjhKul9DpYQy_buRIZgfxy0kv7RnzfDW0PnUvyJIH9LvtQJlenGY1MLvf_rVVBMRo2iRVTrJTKZ47X8wSHJIXN5t_a_zT7c-mCfbfjaZY6fd5Bm2pQhkCbuQLTSpi7CAtTn8P6Ee6DEr9Nkuj8TrdiSUeeCTXUFZWM6LN908ej02jDVqGyPZFDZvHCFaGfMf7NFMmJMxBh6D9mxArv0g964uFrcgWNd-evhe3vDrPs' },
            { name: 'Chocolate Bar', unitsConsumed: 120, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyGm5zonHlrsd-gmFMpj2w7IRL8RtD8VBNekqRJvyR3GVhNatlWEBe1Vs5fBMqynUezxQsiJra2n9n5p_rAbNI40uzW5St2bg4_tYq0_y1yG4DhgZ2lrLfCuj5Rk9n1FF3sOvT9vTt5EehU-NJ31S9xWfa8xvNr1M6lEwebuSveJFEUSHJhclMchUpeT6Ey7ie5pxQcDIfMLtybwZd4LO8Tpc3v_P0ADMGsXb9gXWCRo1g07tqyqUgGqlpIExN_l7CIYJaX9NTz5k' },
            { name: 'Shampoo', unitsConsumed: 80, imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDetg0bTYk7cWxCxsWcW5CC0b4UfRFHdRu0AUhf9DrxpPRGmUlDZJtdGK3jHucUFM4-_wBnxv-2Ex9033IYCt6nUgj4Vo2aP-i1L4GyRDgbLZGu_znIDuUPL8Rn-WU3VPOCUNAF4o0tpBU1BirwCbKkdx0S4HEJ6fWovL2KdpBJ8HD94eIYPY4Rt3Y3ISkHc3WCRt20E_LQF4H3j_U2DeHJYW78Qv1BZl9Ksxv7d4Ti1unHw6Qa6B6ItoNQsL2boWh-JUXkC34VB1w' },
        ],
    };
};

const renderStockByCategory = (stockByCategory) => {
    const container = document.getElementById('stock-by-category');
    container.innerHTML = stockByCategory.map(category => `
        <div class="border-[#4c739a] bg-[#e7edf3] border-t-2 w-full" style="height: ${category.percentage}%;"></div>
        <p class="text-[#4c739a] text-[13px] font-bold leading-normal tracking-[0.015em]">${category.name}</p>
    `).join('');
};

const renderLowStockAlerts = (lowStockAlerts) => {
    const container = document.getElementById('low-stock-alerts');
    container.innerHTML = lowStockAlerts.map(item => `
        <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded size-14"
            style='background-image: url("${item.imageUrl}");'
          ></div>
          <div class="flex flex-col justify-center">
            <p class="text-[#0d141b] text-base font-medium leading-normal line-clamp-1">${item.name}</p>
            <p class="text-[#4c739a] text-sm font-normal leading-normal line-clamp-2">${item.unitsLeft} units left</p>
          </div>
        </div>
    `).join('');
};

const renderTopConsumedItems = (topConsumedItems) => {
    const container = document.getElementById('top-consumed-items');
    container.innerHTML = topConsumedItems.map(item => `
        <div class="flex items-center gap-4 bg-slate-50 px-4 min-h-[72px] py-2">
          <div
            class="bg-center bg-no-repeat aspect-square bg-cover rounded size-14"
            style='background-image: url("${item.imageUrl}");'
          ></div>
          <div class="flex flex-col justify-center">
            <p class="text-[#0d141b] text-base font-medium leading-normal line-clamp-1">${item.name}</p>
            <p class="text-[#4c739a] text-sm font-normal leading-normal line-clamp-2">${item.unitsConsumed} units consumed</p>
          </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', async () => {
    const data = await getDashboardData();

    document.getElementById('total-stock').textContent = data.totalStock.toLocaleString();
    renderStockByCategory(data.stockByCategory);
    renderLowStockAlerts(data.lowStockAlerts);
    renderTopConsumedItems(data.topConsumedItems);
});
