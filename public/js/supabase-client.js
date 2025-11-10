// Use the global Supabase object from the CDN
const { createClient } = window.supabase;

const supabaseUrl = 'https://zoltdsjklswtconebbkt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvbHRkc2prbHN3dGNvbmViYmt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzI4OTAsImV4cCI6MjA3ODEwODg5MH0.JHAkCcdMtunE49X0nL-n-gt4e0TESiTOlldK2xC7veo'

const supabase = createClient(supabaseUrl, supabaseKey)

// Custom authentication functions
export const customAuth = {
    // Check if user is logged in
    async getUser() {
        const userStr = localStorage.getItem('user');
        console.log('CustomAuth.getUser - Raw user from localStorage:', userStr);
        if (!userStr) {
            console.log('CustomAuth.getUser - No user found in localStorage');
            return null;
        }
        try {
            const user = JSON.parse(userStr);
            console.log('CustomAuth.getUser - Parsed user:', user);
            return user;
        } catch (error) {
            console.error('CustomAuth.getUser - Error parsing user:', error);
            return null;
        }
    },
    
    // Login with username and password
    async signInWithPassword({ username, password }) {
        try {
            console.log('Attempting to query Supabase for user:', username);
            const { data, error } = await supabase
                .from('users')
                .select('uuid_id, username')
                .eq('username', username)
                .eq('password', password)
                .single();
            
            console.log('Supabase response:', { data, error });
            
            if (error) {
                console.error('Supabase error:', error);
                // Fallback to local authentication if Supabase fails
                return this.fallbackAuth(username, password);
            }
            
            if (data) {
                console.log('User found:', data);
                // Store user in localStorage using UUID
                const userData = { id: data.uuid_id, username: data.username };
                localStorage.setItem('user', JSON.stringify(userData));
                console.log('Stored user data:', userData);
                return { data: { user: userData }, error: null };
            }
            
            return { data: null, error: { message: 'Invalid username or password' } };
        } catch (err) {
            console.error('Exception during login:', err);
            // Fallback to local authentication if exception occurs
            return this.fallbackAuth(username, password);
        }
    },
    
    // Fallback authentication for local development
    fallbackAuth(username, password) {
        console.log('Using fallback authentication');
        
        // Hardcoded users from schema.sql with UUIDs (matching the database)
        const users = [
            { id: '00000000-0000-0000-0000-000000000001', username: 'admin', password: 'admin123' },
            { id: '00000000-0000-0000-0000-000000000002', username: 'manager', password: 'manager123' },
            { id: '00000000-0000-0000-0000-000000000003', username: 'staff', password: 'staff123' }
        ];
        
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            console.log('Fallback authentication successful for:', username);
            // Store user in localStorage
            const userData = { id: user.id, username: user.username };
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('Stored user data (fallback):', userData);
            return { data: { user: userData }, error: null };
        }
        
        return { data: null, error: { message: 'Invalid username or password' } };
    },
    
    // Logout
    async signOut() {
        localStorage.removeItem('user');
        return { error: null };
    }
};

export default supabase;