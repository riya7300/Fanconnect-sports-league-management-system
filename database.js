/**
 * FanConnect Sports Management System - Database Module
 * This file contains all database structures, sample data, and database operations
 */

// ======================== DATABASE SCHEMA ========================

/**
 * Database Structure:
 * 1. Users - User accounts and authentication
 * 2. Sports - Available sports categories
 * 3. Teams - Teams in each sport
 * 4. Players - Players in each team
 * 5. Matches - Scheduled and completed matches
 * 6. Bookings - Ticket bookings by users
 */

// Sports data with team names and configurations
const SPORTS_CONFIG = {
    1: {
        id: 1,
        name: "Cricket",
        icon: "fas fa-baseball-ball",
        color: "#10b981",
        teams: [
            "Mumbai Indians", "Chennai Super Kings", "Royal Challengers Bangalore",
            "Delhi Capitals", "Kolkata Knight Riders", "Rajasthan Royals",
            "Punjab Kings", "Sunrisers Hyderabad", "Lucknow Super Giants",
            "Gujarat Titans", "Mumbai Heroes", "Chennai Warriors",
            "Bangalore Challengers", "Delhi Daredevils", "Kolkata Tigers"
        ],
        positions: ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"]
    },
    2: {
        id: 2,
        name: "Football",
        icon: "fas fa-futbol",
        color: "#3b82f6",
        teams: [
            "Mumbai City FC", "Bengaluru FC", "ATK Mohun Bagan",
            "FC Goa", "Hyderabad FC", "Jamshedpur FC",
            "Kerala Blasters", "NorthEast United", "Odisha FC",
            "Punjab FC", "Chennai City FC", "Delhi Dynamos",
            "Pune Warriors", "Kochi Tuskers", "Ahmedabad United"
        ],
        positions: ["Forward", "Midfielder", "Defender", "Goalkeeper"]
    },
    3: {
        id: 3,
        name: "Basketball",
        icon: "fas fa-basketball-ball",
        color: "#f59e0b",
        teams: [
            "Mumbai Ballers", "Delhi Hoopers", "Bengaluru Beasts",
            "Chennai Slammers", "Hyderabad Hawks", "Kolkata Knights",
            "Punjab Panthers", "Goa Giants", "Rajasthan Riders",
            "Gujarat Gladiators", "Lucknow Lakers", "Ahmedabad Aces",
            "Jaipur Jumpers", "Chandigarh Chiefs", "Kochi Kings"
        ],
        positions: ["Point Guard", "Shooting Guard", "Small Forward", "Power Forward", "Center"]
    },
    4: {
        id: 4,
        name: "Volleyball",
        icon: "fas fa-volleyball-ball",
        color: "#ef4444",
        teams: [
            "Mumbai Spikes", "Chennai Smashers", "Bengaluru Blockers",
            "Delhi Diggers", "Kolkata Crushers", "Hyderabad Hitters",
            "Punjab Power", "Goa Guardians", "Rajasthan Rockets",
            "Gujarat Gators", "Kerala Killers", "Tamil Nadu Titans",
            "Karnataka Kings", "Andhra Aces", "Odisha Olympians"
        ],
        positions: ["Setter", "Outside Hitter", "Middle Blocker", "Opposite Hitter", "Libero", "Defensive Specialist"]
    }
};

// Venues for matches
const MATCH_VENUES = [
    "Wankhede Stadium, Mumbai",
    "M. Chinnaswamy Stadium, Bengaluru",
    "Eden Gardens, Kolkata",
    "Feroz Shah Kotla, Delhi",
    "MA Chidambaram Stadium, Chennai",
    "Rajiv Gandhi Stadium, Hyderabad",
    "Sardar Patel Stadium, Ahmedabad",
    "IS Bindra Stadium, Mohali",
    "Sawai Mansingh Stadium, Jaipur",
    "Brabourne Stadium, Mumbai",
    "DY Patil Stadium, Mumbai",
    "Nehru Stadium, Kochi",
    "Barabati Stadium, Cuttack",
    "Green Park Stadium, Kanpur",
    "Holkar Stadium, Indore"
];

// Sample player names (Indian and International)
const PLAYER_NAMES = [
    "Virat Kohli", "MS Dhoni", "Rohit Sharma", "KL Rahul", "Hardik Pandya",
    "Jasprit Bumrah", "Ravindra Jadeja", "Rishabh Pant", "Shikhar Dhawan",
    "Bhuvneshwar Kumar", "Yuzvendra Chahal", "Mohammed Shami", "Ajinkya Rahane",
    "Cheteshwar Pujara", "Ravichandran Ashwin", "Umesh Yadav", "Kuldeep Yadav",
    "Dinesh Karthik", "Shreyas Iyer", "Ishan Kishan", "Prithvi Shaw",
    "Devdutt Padikkal", "Ruturaj Gaikwad", "Sanju Samson", "Nitish Rana",
    "Suryakumar Yadav", "Deepak Hooda", "Axar Patel", "Washington Sundar",
    "Shardul Thakur", "Prasidh Krishna", "Arshdeep Singh", "Avesh Khan",
    "Harshal Patel", "Varun Chakravarthy", "Ravi Bishnoi", "Mukesh Kumar",
    "Tilak Varma", "Abhishek Sharma", "Riyan Parag", "Ayush Badoni",
    "Rahul Dravid", "Sourav Ganguly", "VVS Laxman", "Anil Kumble",
    "Kapil Dev", "Sunil Gavaskar", "Mohammad Azharuddin", "Javagal Srinath",
    "Venkatesh Prasad", "Zaheer Khan", "Harbhajan Singh", "Sandeep Lamichhane", "Yuvraj Singh", "Adam Gilchrist",
    "Kane Williamson", "Ross Taylor", "Martin Guptill", "Trent Boult",
    "Tim Southee", "Colin de Grandhomme", "Mitchell Santner", "Lockie Ferguson"
];

// Default system users
const DEFAULT_USERS = [
    {
        id: 1,
        username: "admin",
        password: "admin123",
        email: "admin@fanconnect.com",
        role: "admin",
        createdAt: new Date().toISOString(),
        lastLogin: null
    },
    {
        id: 2,
        username: "user1",
        password: "user123",
        email: "user1@example.com",
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: null
    },
    {
        id: 3,
        username: "manager1",
        password: "manager123",
        email: "manager1@fanconnect.com",
        role: "manager",
        createdAt: new Date().toISOString(),
        lastLogin: null
    }
];

// ======================== DATABASE OPERATIONS ========================

/**
 * Database class to handle all local storage operations
 */
class FanConnectDatabase {
    constructor() {
        this.storageKeys = {
            users: 'fanconnect_users',
            sports: 'fanconnect_sports',
            teams: 'fanconnect_teams',
            players: 'fanconnect_players',
            matches: 'fanconnect_matches',
            bookings: 'fanconnect_bookings',
            currentUser: 'fanconnect_current_user',
            initialized: 'fanconnect_initialized'
        };
    }

    /**
     * Initialize database with sample data
     */
    initialize() {
        if (!this.isInitialized()) {
            console.log('🚀 Initializing FanConnect Database...');

            // Initialize all tables
            this.initializeUsers();
            this.initializeSports();
            this.initializeTeams();
            this.initializePlayers();
            this.initializeMatches();
            this.initializeBookings();

            // Mark as initialized
            localStorage.setItem(this.storageKeys.initialized, 'true');
            console.log('✅ Database initialized successfully!');
        } else {
            console.log('📊 Database already initialized');
        }
    }

    /**
     * Check if database is already initialized
     */
    isInitialized() {
        return localStorage.getItem(this.storageKeys.initialized) === 'true';
    }

    /**
     * Initialize users table
     */
    initializeUsers() {
        localStorage.setItem(this.storageKeys.users, JSON.stringify(DEFAULT_USERS));
        console.log('👥 Users table initialized');
    }

    /**
     * Initialize sports table
     */
    initializeSports() {
        const sports = Object.values(SPORTS_CONFIG).map(sport => ({
            id: sport.id,
            name: sport.name,
            icon: sport.icon,
            color: sport.color,
            totalTeams: sport.teams.length,
            totalPlayers: sport.teams.length * 11,
            createdAt: new Date().toISOString()
        }));

        localStorage.setItem(this.storageKeys.sports, JSON.stringify(sports));
        console.log('🏆 Sports table initialized');
    }

    /**
     * Initialize teams table
     */
    initializeTeams() {
        const teams = [];
        let teamId = 1;

        Object.values(SPORTS_CONFIG).forEach(sport => {
            sport.teams.forEach((teamName, index) => {
                teams.push({
                    id: teamId++,
                    name: teamName,
                    sport: sport.name,
                    sportId: sport.id,
                    played: Math.floor(Math.random() * 12),
                    won: Math.floor(Math.random() * 8),
                    lost: Math.floor(Math.random() * 6),
                    drawn: Math.floor(Math.random() * 3),
                    goalsFor: Math.floor(Math.random() * 25),
                    goalsAgainst: Math.floor(Math.random() * 20),
                    points: 0, // Will be calculated
                    founded: 2020 + Math.floor(Math.random() * 4),
                    createdAt: new Date().toISOString()
                });
            });
        });

        // Calculate points
        teams.forEach(team => {
            team.points = (team.won * 3) + (team.drawn * 1);
        });

        localStorage.setItem(this.storageKeys.teams, JSON.stringify(teams));
        console.log('🏃‍♂️ Teams table initialized');
    }

    /**
     * Initialize players table
     */
    initializePlayers() {
        const players = [];
        const teams = this.getTeams();
        let playerId = 1;

        teams.forEach(team => {
            const sport = SPORTS_CONFIG[team.sportId];
            const positions = sport.positions;

            // Create 11 players per team
            for (let i = 0; i < 11; i++) {
                const randomName = PLAYER_NAMES[Math.floor(Math.random() * PLAYER_NAMES.length)];
                const randomPosition = positions[Math.floor(Math.random() * positions.length)];

                players.push({
                    id: playerId++,
                    name: `${randomName} ${String.fromCharCode(65 + i)}`, // Add suffix A, B, C etc.
                    teamId: team.id,
                    teamName: team.name,
                    sport: team.sport,
                    position: randomPosition,
                    age: 18 + Math.floor(Math.random() * 15),
                    nationality: Math.random() > 0.7 ? 'International' : 'Indian',
                    matchesPlayed: Math.floor(Math.random() * 25),
                    goals: Math.floor(Math.random() * 20),
                    assists: Math.floor(Math.random() * 15),
                    yellowCards: Math.floor(Math.random() * 5),
                    redCards: Math.floor(Math.random() * 2),
                    rating: (7.0 + Math.random() * 3).toFixed(1),
                    joinedDate: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
                    createdAt: new Date().toISOString()
                });
            }
        });

        localStorage.setItem(this.storageKeys.players, JSON.stringify(players));
        console.log('⚽ Players table initialized');
    }

    /**
     * Initialize matches table
     */
    initializeMatches() {
        const matches = [];
        const teams = this.getTeams();
        let matchId = 1;

        // Generate past matches (completed)
        for (let i = 0; i < 30; i++) {
            const sport = SPORTS_CONFIG[Math.floor(Math.random() * 4) + 1];
            const sportTeams = teams.filter(t => t.sportId === sport.id);
            const team1 = sportTeams[Math.floor(Math.random() * sportTeams.length)];
            let team2 = sportTeams[Math.floor(Math.random() * sportTeams.length)];

            // Ensure different teams
            while (team2.id === team1.id) {
                team2 = sportTeams[Math.floor(Math.random() * sportTeams.length)];
            }

            const pastDate = new Date();
            pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 60) - 1);

            // Generate realistic result
            const outcomes = [team1.name, team2.name, 'Draw'];
            const weights = [0.4, 0.4, 0.2]; // 40% team1, 40% team2, 20% draw
            const result = this.weightedRandom(outcomes, weights);

            matches.push({
                id: matchId++,
                sport: sport.name,
                sportId: sport.id,
                team1: team1.name,
                team1Id: team1.id,
                team2: team2.name,
                team2Id: team2.id,
                date: pastDate.toISOString(),
                venue: MATCH_VENUES[Math.floor(Math.random() * MATCH_VENUES.length)],
                result: result,
                status: 'completed',
                attendance: 15000 + Math.floor(Math.random() * 35000),
                ticketPrice: 500,
                createdAt: new Date().toISOString()
            });
        }

        // Generate upcoming matches
        for (let i = 0; i < 50; i++) {
            const sport = SPORTS_CONFIG[Math.floor(Math.random() * 4) + 1];
            const sportTeams = teams.filter(t => t.sportId === sport.id);
            const team1 = sportTeams[Math.floor(Math.random() * sportTeams.length)];
            let team2 = sportTeams[Math.floor(Math.random() * sportTeams.length)];

            // Ensure different teams
            while (team2.id === team1.id) {
                team2 = sportTeams[Math.floor(Math.random() * sportTeams.length)];
            }

            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 90) + 1);
            futureDate.setHours(Math.floor(Math.random() * 6) + 15); // 3 PM to 9 PM
            futureDate.setMinutes(Math.random() > 0.5 ? 0 : 30);

            matches.push({
                id: matchId++,
                sport: sport.name,
                sportId: sport.id,
                team1: team1.name,
                team1Id: team1.id,
                team2: team2.name,
                team2Id: team2.id,
                date: futureDate.toISOString(),
                venue: MATCH_VENUES[Math.floor(Math.random() * MATCH_VENUES.length)],
                result: null,
                status: 'upcoming',
                attendance: null,
                ticketPrice: 500,
                createdAt: new Date().toISOString()
            });
        }

        localStorage.setItem(this.storageKeys.matches, JSON.stringify(matches));
        console.log('📅 Matches table initialized');
    }

    /**
     * Initialize bookings table
     */
    initializeBookings() {
        localStorage.setItem(this.storageKeys.bookings, JSON.stringify([]));
        console.log('🎫 Bookings table initialized');
    }

    /**
     * Weighted random selection
     */
    weightedRandom(items, weights) {
        const cumulativeWeights = [];
        for (let i = 0; i < weights.length; i++) {
            cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
        }

        const random = Math.random() * cumulativeWeights[cumulativeWeights.length - 1];

        for (let i = 0; i < cumulativeWeights.length; i++) {
            if (random < cumulativeWeights[i]) {
                return items[i];
            }
        }
    }

    // ======================== GETTER METHODS ========================

    getUsers() {
        return JSON.parse(localStorage.getItem(this.storageKeys.users) || '[]');
    }

    getSports() {
        return JSON.parse(localStorage.getItem(this.storageKeys.sports) || '[]');
    }

    getTeams() {
        return JSON.parse(localStorage.getItem(this.storageKeys.teams) || '[]');
    }

    getPlayers() {
        return JSON.parse(localStorage.getItem(this.storageKeys.players) || '[]');
    }

    getMatches() {
        return JSON.parse(localStorage.getItem(this.storageKeys.matches) || '[]');
    }

    getBookings() {
        return JSON.parse(localStorage.getItem(this.storageKeys.bookings) || '[]');
    }

    getCurrentUser() {
        const userData = localStorage.getItem(this.storageKeys.currentUser);
        return userData ? JSON.parse(userData) : null;
    }

    // ======================== SETTER METHODS ========================

    setUsers(users) {
        localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
    }

    setTeams(teams) {
        localStorage.setItem(this.storageKeys.teams, JSON.stringify(teams));
    }

    setPlayers(players) {
        localStorage.setItem(this.storageKeys.players, JSON.stringify(players));
    }

    setMatches(matches) {
        localStorage.setItem(this.storageKeys.matches, JSON.stringify(matches));
    }

    setBookings(bookings) {
        localStorage.setItem(this.storageKeys.bookings, JSON.stringify(bookings));
    }

    setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.storageKeys.currentUser, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.storageKeys.currentUser);
        }
    }

    // ======================== QUERY METHODS ========================

    getTeamsBySport(sportId) {
        return this.getTeams().filter(team => team.sportId === parseInt(sportId));
    }

    getPlayersByTeam(teamId) {
        return this.getPlayers().filter(player => player.teamId === parseInt(teamId));
    }

    getMatchesBySport(sportId) {
        return this.getMatches().filter(match => match.sportId === parseInt(sportId));
    }

    getUpcomingMatches() {
        return this.getMatches()
            .filter(match => match.status === 'upcoming')
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    getCompletedMatches() {
        return this.getMatches()
            .filter(match => match.status === 'completed')
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getUserBookings(userId) {
        return this.getBookings().filter(booking => booking.userId === parseInt(userId));
    }

    // ======================== CRUD OPERATIONS ========================

    addUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            ...userData,
            createdAt: new Date().toISOString()
        };
        users.push(newUser);
        this.setUsers(users);
        return newUser;
    }

    addTeam(teamData) {
        const teams = this.getTeams();
        const newTeam = {
            id: Math.max(...teams.map(t => t.id), 0) + 1,
            ...teamData,
            played: 0,
            won: 0,
            lost: 0,
            drawn: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
            founded: new Date().getFullYear(),
            createdAt: new Date().toISOString()
        };
        teams.push(newTeam);
        this.setTeams(teams);
        return newTeam;
    }

    addPlayer(playerData) {
        const players = this.getPlayers();
        const newPlayer = {
            id: Math.max(...players.map(p => p.id), 0) + 1,
            ...playerData,
            matchesPlayed: 0,
            goals: 0,
            assists: 0,
            yellowCards: 0,
            redCards: 0,
            rating: '7.0',
            joinedDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        players.push(newPlayer);
        this.setPlayers(players);
        return newPlayer;
    }

    addMatch(matchData) {
        const matches = this.getMatches();
        const newMatch = {
            id: Math.max(...matches.map(m => m.id), 0) + 1,
            ...matchData,
            result: null,
            status: 'upcoming',
            attendance: null,
            ticketPrice: 500,
            createdAt: new Date().toISOString()
        };
        matches.push(newMatch);
        this.setMatches(matches);
        return newMatch;
    }

    addBooking(bookingData) {
        const bookings = this.getBookings();
        const newBooking = {
            id: Math.max(...bookings.map(b => b.id), 0) + 1,
            ...bookingData,
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        bookings.push(newBooking);
        this.setBookings(bookings);
        return newBooking;
    }

    deleteTeam(teamId) {
        const teams = this.getTeams().filter(team => team.id !== parseInt(teamId));
        this.setTeams(teams);

        // Also delete players from this team
        const players = this.getPlayers().filter(player => player.teamId !== parseInt(teamId));
        this.setPlayers(players);
    }

    deletePlayer(playerId) {
        const players = this.getPlayers().filter(player => player.id !== parseInt(playerId));
        this.setPlayers(players);
    }

    // ======================== AUTHENTICATION ========================

    authenticateUser(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.setUsers(users);
            this.setCurrentUser(user);
            return user;
        }

        return null;
    }

    logout() {
        this.setCurrentUser(null);
    }

    // ======================== UTILITIES ========================

    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('🗑️ All data cleared');
    }

    exportData() {
        const data = {};
        Object.entries(this.storageKeys).forEach(([key, storageKey]) => {
            const item = localStorage.getItem(storageKey);
            data[key] = item ? JSON.parse(item) : null;
        });
        return data;
    }

    importData(data) {
        Object.entries(data).forEach(([key, value]) => {
            if (this.storageKeys[key] && value !== null) {
                localStorage.setItem(this.storageKeys[key], JSON.stringify(value));
            }
        });
        console.log('📁 Data imported successfully');
    }

    getStatistics() {
        return {
            users: this.getUsers().length,
            sports: this.getSports().length,
            teams: this.getTeams().length,
            players: this.getPlayers().length,
            matches: this.getMatches().length,
            upcomingMatches: this.getUpcomingMatches().length,
            completedMatches: this.getCompletedMatches().length,
            bookings: this.getBookings().length
        };
    }
}

// ======================== DATABASE TRIGGERS ========================

/**
 * Database triggers simulation
 * These functions simulate database triggers that would normally run on the server
 */
class DatabaseTriggers {
    static onUserRegister(user) {
        console.log(`🎉 New user registered: ${user.username}`);
        // Could send welcome email, create user profile, etc.
    }

    static onUserLogin(user) {
        console.log(`👋 User logged in: ${user.username}`);
        // Could log activity, update last seen, etc.
    }

    static onTeamAdded(team) {
        console.log(`🏆 New team added: ${team.name} (${team.sport})`);
        // Could notify sport administrators, update league standings, etc.
    }

    static onPlayerAdded(player) {
        console.log(`⚽ New player added: ${player.name} to ${player.teamName}`);
        // Could validate player eligibility, send contract, etc.
    }

    static onMatchScheduled(match) {
        console.log(`📅 Match scheduled: ${match.team1} vs ${match.team2} on ${new Date(match.date).toLocaleDateString()}`);
        // Could send notifications, book venue, assign referees, etc.
    }

    static onMatchCompleted(match) {
        console.log(`✅ Match completed: ${match.team1} vs ${match.team2}, Result: ${match.result}`);
        // Could update team statistics, player ratings, league table, etc.
    }

    static onTicketBooked(booking) {
        console.log(`🎫 Ticket booked: ${booking.tickets} tickets for match ${booking.matchId}`);
        // Could send confirmation email, generate QR codes, update availability, etc.
    }

    static onPointsTableUpdate(sport, teams) {
        console.log(`📊 Points table updated for ${sport}`);
        // Could send notifications to fans, update rankings, etc.
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FanConnectDatabase, DatabaseTriggers, SPORTS_CONFIG, MATCH_VENUES, PLAYER_NAMES };
}