/**
 * FanConnect Sports Management System - Main Application
 * This file contains all the application logic and user interface interactions
 */

// ======================== GLOBAL VARIABLES ========================
let db; // Database instance
let currentUser = null; // Current logged in user
let currentSection = 'home'; // Current active section

// ======================== APPLICATION INITIALIZATION ========================

/**
 * Initialize the FanConnect application
 */
function initializeApp() {
    console.log('🚀 Starting FanConnect Application...');

    // Initialize database
    db = new FanConnectDatabase();
    db.initialize();

    // Check if user is already logged in
    currentUser = db.getCurrentUser();

    // Setup UI
    updateAuthUI();
    loadDashboard();
    setupEventListeners();

    // Load initial data
    showSection('home');

    console.log('✅ FanConnect Application started successfully!');
}

/**
 * Setup event listeners for the application
 */
function setupEventListeners() {
    // Navigation clicks
    document.addEventListener('click', handleNavigation);

    // Form submissions
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('booking-form').addEventListener('submit', handleBooking);

    // Update total when tickets change
    document.getElementById('booking-tickets').addEventListener('input', updateBookingTotal);

    // Auto-hide alerts
    setTimeout(() => {
        document.querySelectorAll('.alert').forEach(alert => {
            if (alert.classList.contains('alert-dismissible')) {
                alert.remove();
            }
        });
    }, 5000);
}


/**
 * Handle navigation clicks
 */
function handleNavigation(event) {
    const target = event.target;

    // Handle nav links
    if (target.matches('[onclick*="showSection"]')) {
        event.preventDefault();
        const section = target.getAttribute('onclick').match(/showSection\('(.+?)'\)/)[1];
        showSection(section);
    }
}

// ======================== SECTION MANAGEMENT ========================

/**
 * Show specific section and hide others
 */
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;

        // Update navigation
        updateNavigation(sectionName);

        // Load section-specific data
        loadSectionData(sectionName);
    }
}

/**
 * Update navigation active state
 */
function updateNavigation(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Find and activate corresponding nav link
    const navLink = document.querySelector(`[onclick*="showSection('${activeSection}')"]`);
    if (navLink) {
        navLink.classList.add('active');
    }
}

/**
 * Load data specific to each section
 */
function loadSectionData(section) {
    switch (section) {
        case 'home':
            loadFeaturedMatches();
            break;
        case 'sports':
            loadSportsGrid();
            break;
        case 'teams':
            loadTeamsGrid();
            break;
        case 'matches':
            loadMatchesData();
            break;
        case 'points':
            // Points table loads on sport selection
            break;
        case 'dashboard':
            loadUserDashboard();
            break;
        case 'admin':
            loadAdminPanel();
            break;
    }
}

// ======================== HOME SECTION ========================

/**
 * Load featured matches for home section
 */
function loadFeaturedMatches() {
    const upcomingMatches = db.getUpcomingMatches().slice(0, 20);
    const featuredContainer = document.getElementById('featured-matches');

    if (upcomingMatches.length === 0) {
        featuredContainer.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                    <h4 class="text-muted">No upcoming matches</h4>
                </div>
            </div>
        `;
        return;
    }

    // Get one match per sport for featured display
    const featuredMatches = [];
    const sportsShown = new Set();

    upcomingMatches.forEach(match => {
        if (!sportsShown.has(match.sport) && featuredMatches.length < 4) {
            featuredMatches.push(match);
            sportsShown.add(match.sport);
        }
    });

    featuredContainer.innerHTML = featuredMatches.map(match => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card match-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-primary">${match.sport}</span>
                        <small class="text-muted">${formatMatchDate(match.date)}</small>
                    </div>
                    <h5 class="card-title">${match.team1} <span class="text-muted">vs</span> ${match.team2}</h5>
                    <p class="card-text">
                        <i class="fas fa-map-marker-alt text-primary me-1"></i>
                        <small>${match.venue}</small>
                    </p>
                    <p class="card-text">
                        <i class="fas fa-clock text-primary me-1"></i>
                        <small>${formatMatchTime(match.date)}</small>
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">₹${match.ticketPrice}/ticket</small>
                        ${currentUser ? 
                            `<button class="btn btn-primary btn-sm" onclick="openBookingModal(${match.id})">
                                <i class="fas fa-ticket-alt me-1"></i>Book
                            </button>` : 
                            `<button class="btn btn-outline-secondary btn-sm" onclick="showLogin()">
                                Login to Book
                            </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ======================== SPORTS SECTION ========================

/**
 * Load sports grid
 */
function loadSportsGrid() {
    const sports = db.getSports();
    const container = document.getElementById('sports-grid');

    container.innerHTML = sports.map(sport => {
        const teams = db.getTeamsBySport(sport.id);
        const players = teams.reduce((total, team) => total + db.getPlayersByTeam(team.id).length, 0);
        const upcomingMatches = db.getMatchesBySport(sport.id).filter(m => m.status === 'upcoming').length;

        return `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="sport-card" onclick="showSportDetails(${sport.id})">
                    <i class="${SPORTS_CONFIG[sport.id].icon}" style="color: ${sport.color}"></i>
                    <h3>${sport.name}</h3>
                    <div class="mt-3">
                        <p class="mb-1"><strong>${teams.length}</strong> Teams</p>
                        <p class="mb-1"><strong>${players}</strong> Players</p>
                        <p class="mb-0"><strong>${upcomingMatches}</strong> Upcoming Matches</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Show sport details (redirect to teams)
 */
function showSportDetails(sportId) {
    showSection('teams');
    document.getElementById('sport-filter').value = SPORTS_CONFIG[sportId].name;
    filterTeams();
}

// ======================== TEAMS SECTION ========================

/**
 * Load teams grid
 */
function loadTeamsGrid() {
    const teams = db.getTeams();
    const container = document.getElementById('teams-grid');

    container.innerHTML = teams.map(team => {
        const players = db.getPlayersByTeam(team.id);
        const matches = db.getMatches().filter(m => 
            (m.team1Id === team.id || m.team2Id === team.id) && m.status === 'completed'
        );

        return `
            <div class="col-lg-4 col-md-6 mb-4 team-item" data-sport="${team.sport}">
                <div class="card team-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title mb-0">${team.name}</h5>
                            <span class="badge bg-primary">${team.sport}</span>
                        </div>

                        <div class="row text-center mb-3">
                            <div class="col-3">
                                <strong class="text-primary">${team.played}</strong>
                                <small class="d-block text-muted">Played</small>
                            </div>
                            <div class="col-3">
                                <strong class="text-success">${team.won}</strong>
                                <small class="d-block text-muted">Won</small>
                            </div>
                            <div class="col-3">
                                <strong class="text-warning">${team.drawn}</strong>
                                <small class="d-block text-muted">Drawn</small>
                            </div>
                            <div class="col-3">
                                <strong class="text-danger">${team.lost}</strong>
                                <small class="d-block text-muted">Lost</small>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Players: ${players.length}</small><br>
                                <small class="text-muted">Points: <strong class="text-primary">${team.points}</strong></small>
                            </div>
                            <button class="btn btn-outline-primary btn-sm" onclick="showTeamPlayers(${team.id})">
                                <i class="fas fa-users me-1"></i>View Squad
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Filter teams by sport
 */
function filterTeams() {
    const filterValue = document.getElementById('sport-filter').value;
    const teamItems = document.querySelectorAll('.team-item');

    teamItems.forEach(item => {
        if (!filterValue || item.dataset.sport === filterValue) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Show team players modal
 */
function showTeamPlayers(teamId) {
    const team = db.getTeams().find(t => t.id === teamId);
    const players = db.getPlayersByTeam(teamId);

    if (!team || players.length === 0) {
        showAlert('No players found for this team', 'warning');
        return;
    }

    const playersHtml = players.map(player => `
        <div class="col-md-6 mb-3">
            <div class="card">
                <div class="card-body p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${player.name}</h6>
                            <small class="text-muted">${player.position} • Age ${player.age}</small>
                        </div>
                        <div class="text-end">
                            <span class="badge bg-secondary">${player.rating}</span>
                        </div>
                    </div>
                    <div class="row mt-2 text-center">
                        <div class="col-4">
                            <small class="text-muted">Matches</small>
                            <div class="fw-bold text-primary">${player.matchesPlayed}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">Goals</small>
                            <div class="fw-bold text-success">${player.goals}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">Assists</small>
                            <div class="fw-bold text-warning">${player.assists}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    showModal('Team Squad', `
        <h5 class="mb-3">${team.name} (${team.sport})</h5>
        <div class="row">
            ${playersHtml}
        </div>
    `);
}

// ======================== MATCHES SECTION ========================

/**
 * Load matches data
 */
function loadMatchesData() {
    loadUpcomingMatches();
    loadRecentMatches();
}

/**
 * Load upcoming matches
 */
function loadUpcomingMatches() {
    const matches = db.getUpcomingMatches().slice(0, 10);
    const container = document.getElementById('upcoming-matches');

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-calendar-times fa-2x text-muted mb-3"></i>
                <p class="text-muted">No upcoming matches</p>
            </div>
        `;
        return;
    }

    container.innerHTML = matches.map(match => `
        <div class="card match-card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-primary">${match.sport}</span>
                    <small class="text-muted">${formatMatchDate(match.date)}</small>
                </div>
                <h5 class="mb-2">${match.team1} <span class="text-muted">vs</span> ${match.team2}</h5>
                <p class="mb-2">
                    <i class="fas fa-map-marker-alt text-primary me-2"></i>
                    ${match.venue}
                </p>
                <p class="mb-3">
                    <i class="fas fa-clock text-primary me-2"></i>
                    ${formatMatchTime(match.date)}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="text-muted">₹${match.ticketPrice}/ticket</span>
                    ${currentUser ? 
                        `<button class="btn btn-primary btn-sm" onclick="openBookingModal(${match.id})">
                            <i class="fas fa-ticket-alt me-1"></i>Book Tickets
                        </button>` : 
                        `<button class="btn btn-outline-secondary btn-sm" onclick="showLogin()">
                            Login to Book
                        </button>`
                    }
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Load recent matches
 */
function loadRecentMatches() {
    const matches = db.getCompletedMatches().slice(0, 10);
    const container = document.getElementById('recent-matches');

    if (matches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-history fa-2x text-muted mb-3"></i>
                <p class="text-muted">No recent matches</p>
            </div>
        `;
        return;
    }

    container.innerHTML = matches.map(match => `
        <div class="card match-card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-success">${match.sport}</span>
                    <small class="text-muted">${formatMatchDate(match.date)}</small>
                </div>
                <h5 class="mb-2">${match.team1} <span class="text-muted">vs</span> ${match.team2}</h5>
                <p class="mb-2">
                    <i class="fas fa-map-marker-alt text-success me-2"></i>
                    ${match.venue}
                </p>
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <span class="badge ${match.result === 'Draw' ? 'bg-warning' : 'bg-success'}">
                            ${match.result === 'Draw' ? 'Draw' : `Winner: ${match.result}`}
                        </span>
                    </div>
                    <small class="text-muted">
                        <i class="fas fa-users me-1"></i>
                        ${match.attendance ? match.attendance.toLocaleString() : 'N/A'} attendance
                    </small>
                </div>
            </div>
        </div>
    `).join('');
}

// ======================== POINTS TABLE SECTION ========================

/**
 * Show points table for selected sport
 */
function showPointsTable() {
    const sportName = document.getElementById('points-sport-filter').value;
    const container = document.getElementById('points-table-container');

    if (!sportName) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-chart-bar fa-3x text-muted mb-3"></i>
                <p class="text-muted">Select a sport to view points table</p>
            </div>
        `;
        return;
    }

    const sport = db.getSports().find(s => s.name === sportName);
    const teams = db.getTeamsBySport(sport.id);
    const matches = db.getMatches().filter(m => m.sport === sportName && m.status === 'completed');

    // Calculate current points and statistics
    const standings = teams.map(team => {
        let played = 0, won = 0, drawn = 0, lost = 0, goalsFor = 0, goalsAgainst = 0;

        matches.forEach(match => {
            if (match.team1Id === team.id || match.team2Id === team.id) {
                played++;

                if (match.result === team.name) {
                    won++;
                } else if (match.result === 'Draw') {
                    drawn++;
                } else {
                    lost++;
                }
            }
        });

        const points = (won * 3) + (drawn * 1);
        const goalDifference = goalsFor - goalsAgainst;

        return {
            ...team,
            played,
            won,
            drawn,
            lost,
            goalsFor,
            goalsAgainst,
            goalDifference,
            points
        };
    });

    // Sort by points (descending), then by goal difference, then by goals for
    standings.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });

    container.innerHTML = `
        <div class="points-table">
            <table class="table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Team</th>
                        <th>P</th>
                        <th>W</th>
                        <th>D</th>
                        <th>L</th>
                        <th>GD</th>
                        <th>Pts</th>
                    </tr>
                </thead>
                <tbody>
                    ${standings.map((team, index) => `
                        <tr class="${index < 3 ? 'table-success' : ''}">
                            <td><strong>${index + 1}</strong></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <strong>${team.name}</strong>
                                </div>
                            </td>
                            <td>${team.played}</td>
                            <td class="text-success">${team.won}</td>
                            <td class="text-warning">${team.drawn}</td>
                            <td class="text-danger">${team.lost}</td>
                            <td class="${team.goalDifference >= 0 ? 'text-success' : 'text-danger'}">${team.goalDifference >= 0 ? '+' : ''}${team.goalDifference}</td>
                            <td><strong class="text-primary">${team.points}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        <div class="mt-3">
            <small class="text-muted">
                <strong>P</strong> = Played, <strong>W</strong> = Won, <strong>D</strong> = Drawn, 
                <strong>L</strong> = Lost, <strong>GD</strong> = Goal Difference, <strong>Pts</strong> = Points
            </small>
        </div>
    `;

    // Trigger points table update event
    DatabaseTriggers.onPointsTableUpdate(sportName, standings);
}

// Continue in next part...

// ======================== USER DASHBOARD ========================

/**
 * Load user dashboard
 */
function loadUserDashboard() {
    if (!currentUser) {
        document.getElementById('dashboard').innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-user-lock fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">Please login to view dashboard</h4>
                <button class="btn btn-primary mt-3" onclick="showLogin()">Login</button>
            </div>
        `;
        return;
    }

    loadUserBookings();
    loadUserProfile();
}

/**
 * Load user bookings
 */
function loadUserBookings() {
    const bookings = db.getUserBookings(currentUser.id);
    const matches = db.getMatches();
    const container = document.getElementById('user-bookings');

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-ticket-alt fa-2x text-muted mb-3"></i>
                <p class="text-muted">No bookings found</p>
                <button class="btn btn-primary" onclick="showSection('matches')">Book Tickets</button>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map(booking => {
        const match = matches.find(m => m.id === booking.matchId);
        if (!match) return '';

        const isUpcoming = new Date(match.date) > new Date();

        return `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge ${isUpcoming ? 'bg-primary' : 'bg-secondary'}">${match.sport}</span>
                        <span class="badge ${isUpcoming ? 'bg-success' : 'bg-secondary'}">
                            ${isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                    </div>
                    <h6 class="mb-2">${match.team1} vs ${match.team2}</h6>
                    <p class="mb-2">
                        <i class="fas fa-calendar text-primary me-2"></i>
                        ${formatMatchDate(match.date)} at ${formatMatchTime(match.date)}
                    </p>
                    <p class="mb-2">
                        <i class="fas fa-map-marker-alt text-primary me-2"></i>
                        ${match.venue}
                    </p>
                    <div class="row">
                        <div class="col-md-6">
                            <small class="text-muted">Tickets: <strong>${booking.tickets}</strong></small>
                        </div>
                        <div class="col-md-6 text-end">
                            <small class="text-muted">Total: <strong class="text-success">₹${booking.totalAmount}</strong></small>
                        </div>
                    </div>
                    <small class="text-muted">Booked on: ${formatDate(booking.bookingDate)}</small>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Load user profile
 */
function loadUserProfile() {
    const bookings = db.getUserBookings(currentUser.id);
    const totalSpent = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    const container = document.getElementById('user-profile');

    container.innerHTML = `
        <div class="text-center mb-4">
            <div class="avatar-circle mb-3">
                <i class="fas fa-user fa-2x"></i>
            </div>
            <h5>${currentUser.username}</h5>
            <p class="text-muted">${currentUser.email}</p>
            <span class="badge bg-${currentUser.role === 'admin' ? 'danger' : 'primary'} fs-6">
                ${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </span>
        </div>

        <div class="stats-grid">
            <div class="stat-item">
                <i class="fas fa-ticket-alt text-primary"></i>
                <div>
                    <strong>${bookings.length}</strong>
                    <small>Total Bookings</small>
                </div>
            </div>
            <div class="stat-item">
                <i class="fas fa-rupee-sign text-success"></i>
                <div>
                    <strong>₹${totalSpent}</strong>
                    <small>Total Spent</small>
                </div>
            </div>
            <div class="stat-item">
                <i class="fas fa-calendar text-info"></i>
                <div>
                    <strong>${formatDate(currentUser.createdAt)}</strong>
                    <small>Member Since</small>
                </div>
            </div>
        </div>

        <div class="d-grid gap-2 mt-4">
            <button class="btn btn-outline-primary" onclick="showSection('matches')">
                <i class="fas fa-ticket-alt me-2"></i>Book More Tickets
            </button>
            ${currentUser.role === 'admin' ? 
                `<button class="btn btn-outline-warning" onclick="showSection('admin')">
                    <i class="fas fa-cog me-2"></i>Admin Panel
                </button>` : ''
            }
            <button class="btn btn-outline-danger" onclick="logout()">
                <i class="fas fa-sign-out-alt me-2"></i>Logout
            </button>
        </div>
    `;
}

// ======================== ADMIN PANEL ========================

/**
 * Load admin panel
 */
function loadAdminPanel() {
    if (!currentUser || currentUser.role !== 'admin') {
        document.getElementById('admin').innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-lock fa-3x text-muted mb-3"></i>
                <h4 class="text-muted">Access Denied</h4>
                <p class="text-muted">Administrator privileges required</p>
            </div>
        `;
        return;
    }

    loadAdminTeams();
    loadAdminPlayers();
    loadAdminMatches();
    loadAdminBookings();
    populateAdminDropdowns();
}

/**
 * Load admin teams management
 */
function loadAdminTeams() {
    const teams = db.getTeams();
    const container = document.getElementById('admin-teams-list');

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-users me-2"></i>All Teams (${teams.length})</h5>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Team Name</th>
                                <th>Sport</th>
                                <th>Players</th>
                                <th>Stats</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${teams.map(team => {
                                const players = db.getPlayersByTeam(team.id);
                                return `
                                    <tr>
                                        <td><span class="badge bg-secondary">${team.id}</span></td>
                                        <td><strong>${team.name}</strong></td>
                                        <td><span class="badge bg-primary">${team.sport}</span></td>
                                        <td>${players.length}/11</td>
                                        <td>
                                            <small>P:${team.played} W:${team.won} D:${team.drawn} L:${team.lost}</small><br>
                                            <small class="text-primary">Points: ${team.points}</small>
                                        </td>
                                        <td>
                                            <button class="btn btn-info btn-sm me-1" onclick="showTeamPlayers(${team.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            <button class="btn btn-danger btn-sm" onclick="deleteTeam(${team.id})">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

/**
 * Load admin players management
 */
function loadAdminPlayers() {
    const players = db.getPlayers();
    const container = document.getElementById('admin-players-list');

    // Group players by team for better display
    const teams = db.getTeams();
    const playersGrouped = teams.map(team => ({
        team,
        players: players.filter(p => p.teamId === team.id)
    }));

    container.innerHTML = `
        <div class="row">
            ${playersGrouped.slice(0, 6).map(group => `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h6 class="mb-0">${group.team.name}</h6>
                            <span class="badge bg-primary">${group.players.length}/11</span>
                        </div>
                        <div class="card-body">
                            ${group.players.slice(0, 5).map(player => `
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <strong>${player.name}</strong><br>
                                        <small class="text-muted">${player.position}</small>
                                    </div>
                                    <div class="text-end">
                                        <span class="badge bg-secondary">${player.rating}</span>
                                    </div>
                                </div>
                            `).join('')}
                            ${group.players.length > 5 ? `
                                <small class="text-muted">... and ${group.players.length - 5} more players</small>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="text-center mt-3">
            <p class="text-muted">Total Players: <strong>${players.length}</strong></p>
        </div>
    `;
}

/**
 * Load admin matches management
 */
function loadAdminMatches() {
    const upcomingMatches = db.getUpcomingMatches().slice(0, 10);
    const container = document.getElementById('admin-matches-list');

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-calendar me-2"></i>Upcoming Matches (${upcomingMatches.length})</h5>
            </div>
            <div class="card-body">
                ${upcomingMatches.length === 0 ? 
                    '<p class="text-muted text-center">No upcoming matches</p>' :
                    `<div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Sport</th>
                                    <th>Match</th>
                                    <th>Date & Time</th>
                                    <th>Venue</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${upcomingMatches.map(match => `
                                    <tr>
                                        <td><span class="badge bg-secondary">${match.id}</span></td>
                                        <td><span class="badge bg-primary">${match.sport}</span></td>
                                        <td><strong>${match.team1} vs ${match.team2}</strong></td>
                                        <td>
                                            ${formatMatchDate(match.date)}<br>
                                            <small class="text-muted">${formatMatchTime(match.date)}</small>
                                        </td>
                                        <td><small>${match.venue}</small></td>
                                        <td>
                                            <button class="btn btn-warning btn-sm me-1" onclick="editMatch(${match.id})">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-success btn-sm" onclick="markMatchCompleted(${match.id})">
                                                <i class="fas fa-check"></i>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>`
                }
            </div>
        </div>
    `;
}

/**
 * Load admin bookings
 */
function loadAdminBookings() {
    const bookings = db.getBookings();
    const users = db.getUsers();
    const matches = db.getMatches();
    const container = document.getElementById('admin-bookings-list');

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h5><i class="fas fa-ticket-alt me-2"></i>All Bookings (${bookings.length})</h5>
            </div>
            <div class="card-body">
                ${bookings.length === 0 ? 
                    '<p class="text-muted text-center">No bookings found</p>' :
                    `<div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Booking ID</th>
                                    <th>User</th>
                                    <th>Match</th>
                                    <th>Tickets</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${bookings.map(booking => {
                                    const user = users.find(u => u.id === booking.userId);
                                    const match = matches.find(m => m.id === booking.matchId);
                                    return `
                                        <tr>
                                            <td><span class="badge bg-secondary">${booking.id}</span></td>
                                            <td>${user ? user.username : 'Unknown'}</td>
                                            <td>
                                                ${match ? `<strong>${match.team1} vs ${match.team2}</strong><br>
                                                <small class="text-muted">${match.sport}</small>` : 'Unknown Match'}
                                            </td>
                                            <td><span class="badge bg-info">${booking.tickets}</span></td>
                                            <td><strong class="text-success">₹${booking.totalAmount}</strong></td>
                                            <td><small>${formatDate(booking.bookingDate)}</small></td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>`
                }
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-md-4">
                <div class="card bg-primary text-white">
                    <div class="card-body text-center">
                        <h4>${bookings.length}</h4>
                        <p class="mb-0">Total Bookings</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-success text-white">
                    <div class="card-body text-center">
                        <h4>₹${bookings.reduce((sum, b) => sum + b.totalAmount, 0)}</h4>
                        <p class="mb-0">Total Revenue</p>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card bg-info text-white">
                    <div class="card-body text-center">
                        <h4>${bookings.reduce((sum, b) => sum + b.tickets, 0)}</h4>
                        <p class="mb-0">Total Tickets</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Populate admin form dropdowns
 */
function populateAdminDropdowns() {
    const teams = db.getTeams();

    // Player team dropdown
    const playerTeamSelect = document.getElementById('player-team');
    if (playerTeamSelect) {
        playerTeamSelect.innerHTML = '<option value="">Select Team</option>' +
            teams.map(team => `<option value="${team.id}">${team.name} (${team.sport})</option>`).join('');
    }
}

// ======================== ADMIN ACTIONS ========================

/**
 * Add new team
 */
function addTeam(event) {
    event.preventDefault();

    const name = document.getElementById('team-name').value;
    const sport = document.getElementById('team-sport').value;

    if (!name || !sport) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    const sportConfig = Object.values(SPORTS_CONFIG).find(s => s.name === sport);
    const newTeam = db.addTeam({
        name,
        sport,
        sportId: sportConfig.id
    });

    DatabaseTriggers.onTeamAdded(newTeam);

    // Reset form and reload
    event.target.reset();
    loadAdminTeams();
    loadTeamsGrid();
    showAlert(`Team "${name}" added successfully!`, 'success');
}

/**
 * Add new player
 */
function addPlayer(event) {
    event.preventDefault();

    const name = document.getElementById('player-name').value;
    const teamId = parseInt(document.getElementById('player-team').value);
    const position = document.getElementById('player-position').value;

    if (!name || !teamId || !position) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    const team = db.getTeams().find(t => t.id === teamId);
    const existingPlayers = db.getPlayersByTeam(teamId);

    if (existingPlayers.length >= 11) {
        showAlert('Team already has maximum players (11)', 'warning');
        return;
    }

    const newPlayer = db.addPlayer({
        name,
        teamId,
        teamName: team.name,
        sport: team.sport,
        position,
        age: 18 + Math.floor(Math.random() * 15),
        nationality: 'Indian'
    });

    DatabaseTriggers.onPlayerAdded(newPlayer);

    // Reset form and reload
    event.target.reset();
    loadAdminPlayers();
    showAlert(`Player "${name}" added successfully!`, 'success');
}

/**
 * Schedule new match
 */
function scheduleMatch(event) {
    event.preventDefault();

    const sport = document.getElementById('match-sport').value;
    const team1Id = parseInt(document.getElementById('match-team1').value);
    const team2Id = parseInt(document.getElementById('match-team2').value);
    const datetime = document.getElementById('match-datetime').value;
    const venue = document.getElementById('match-venue').value;

    if (!sport || !team1Id || !team2Id || !datetime || !venue) {
        showAlert('Please fill all fields', 'warning');
        return;
    }

    if (team1Id === team2Id) {
        showAlert('Please select different teams', 'warning');
        return;
    }

    const teams = db.getTeams();
    const team1 = teams.find(t => t.id === team1Id);
    const team2 = teams.find(t => t.id === team2Id);
    const sportConfig = Object.values(SPORTS_CONFIG).find(s => s.name === sport);

    const newMatch = db.addMatch({
        sport,
        sportId: sportConfig.id,
        team1: team1.name,
        team1Id,
        team2: team2.name,
        team2Id,
        date: new Date(datetime).toISOString(),
        venue
    });

    DatabaseTriggers.onMatchScheduled(newMatch);

    // Reset form and reload
    event.target.reset();
    loadAdminMatches();
    loadMatchesData();
    loadFeaturedMatches();
    showAlert(`Match scheduled: ${team1.name} vs ${team2.name}`, 'success');
}

/**
 * Load match teams based on selected sport
 */
function loadMatchTeams() {
    const sport = document.getElementById('match-sport').value;
    const team1Select = document.getElementById('match-team1');
    const team2Select = document.getElementById('match-team2');

    if (!sport) {
        team1Select.innerHTML = '<option value="">Team 1</option>';
        team2Select.innerHTML = '<option value="">Team 2</option>';
        return;
    }

    const sportConfig = Object.values(SPORTS_CONFIG).find(s => s.name === sport);
    const teams = db.getTeamsBySport(sportConfig.id);

    const options = teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('');

    team1Select.innerHTML = '<option value="">Team 1</option>' + options;
    team2Select.innerHTML = '<option value="">Team 2</option>' + options;
}

/**
 * Delete team
 */
function deleteTeam(teamId) {
    if (!confirm('Are you sure you want to delete this team? This will also delete all associated players.')) {
        return;
    }

    db.deleteTeam(teamId);
    loadAdminTeams();
    loadTeamsGrid();
    showAlert('Team deleted successfully', 'success');
}

/**
 * Mark match as completed (simplified)
 */
function markMatchCompleted(matchId) {
    const matches = db.getMatches();
    const match = matches.find(m => m.id === matchId);

    if (!match) return;

    // Simple random result for demo
    const outcomes = [match.team1, match.team2, 'Draw'];
    const result = outcomes[Math.floor(Math.random() * outcomes.length)];

    match.result = result;
    match.status = 'completed';
    match.attendance = 15000 + Math.floor(Math.random() * 35000);

    db.setMatches(matches);
    DatabaseTriggers.onMatchCompleted(match);

    loadAdminMatches();
    loadMatchesData();
    showAlert(`Match completed: ${match.team1} vs ${match.team2}, Result: ${result}`, 'success');
}

// ======================== AUTHENTICATION ========================

/**
 * Show login modal
 */
function showLogin() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

/**
 * Show register modal
 */
function showRegister() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const user = db.authenticateUser(username, password);

    if (user) {
        currentUser = user;
        DatabaseTriggers.onUserLogin(user);

        updateAuthUI();
        bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        showAlert(`Welcome back, ${user.username}!`, 'success');

        // Refresh current section
        loadSectionData(currentSection);
    } else {
        showAlert('Invalid username or password', 'danger');
    }
}

/**
 * Handle register form submission
 */
function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    // Check if username already exists
    const existingUsers = db.getUsers();
    if (existingUsers.find(u => u.username === username)) {
        showAlert('Username already exists', 'danger');
        return;
    }

    const newUser = db.addUser({
        username,
        email,
        password,
        role: 'user'
    });

    DatabaseTriggers.onUserRegister(newUser);

    bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
    showAlert('Registration successful! Please login.', 'success');

    // Reset form
    event.target.reset();
}

/**
 * Logout current user
 */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        db.logout();
        currentUser = null;

        updateAuthUI();
        showSection('home');
        showAlert('Logged out successfully', 'info');
    }
}

/**
 * Update authentication UI
 */
function updateAuthUI() {
    const authNav = document.getElementById('auth-nav');

    if (currentUser) {
        authNav.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i>${currentUser.username}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="#" onclick="showSection('dashboard')">
                        <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                    </a></li>
                    ${currentUser.role === 'admin' ? 
                        `<li><a class="dropdown-item" href="#" onclick="showSection('admin')">
                            <i class="fas fa-cog me-2"></i>Admin Panel
                        </a></li>` : ''
                    }
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            </li>
        `;
    } else {
        authNav.innerHTML = `
            <li class="nav-item">
                <button class="btn btn-outline-light me-2" onclick="showLogin()">Login</button>
            </li>
            <li class="nav-item">
                <button class="btn btn-warning" onclick="showRegister()">Register</button>
            </li>
        `;
    }
}

// ======================== TICKET BOOKING ========================

/**
 * Open booking modal for a match
 */
function openBookingModal(matchId) {
    if (!currentUser) {
        showAlert('Please login to book tickets', 'warning');
        showLogin();
        return;
    }

    const match = db.getMatches().find(m => m.id === matchId);
    if (!match) {
        showAlert('Match not found', 'danger');
        return;
    }

    document.getElementById('booking-match-info').value = `${match.team1} vs ${match.team2} - ${match.sport}`;
    document.getElementById('booking-form').dataset.matchId = matchId;
    document.getElementById('booking-tickets').value = 1;
    updateBookingTotal();

    const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
    modal.show();
}

/**
 * Update booking total amount
 */
function updateBookingTotal() {
    const tickets = parseInt(document.getElementById('booking-tickets').value) || 1;
    const pricePerTicket = 500;
    const total = tickets * pricePerTicket;

    document.getElementById('booking-total').value = total;
}

/**
 * Handle booking form submission
 */
function handleBooking(event) {
    event.preventDefault();

    const matchId = parseInt(event.target.dataset.matchId);
    const tickets = parseInt(document.getElementById('booking-tickets').value);
    const totalAmount = tickets * 500;

    const booking = db.addBooking({
        matchId,
        userId: currentUser.id,
        tickets,
        totalAmount
    });

    DatabaseTriggers.onTicketBooked(booking);

    bootstrap.Modal.getInstance(document.getElementById('bookingModal')).hide();
    showAlert(`Successfully booked ${tickets} ticket(s)!`, 'success');

    // Refresh user dashboard if it's the current section
    if (currentSection === 'dashboard') {
        loadUserDashboard();
    }
}

// ======================== UTILITY FUNCTIONS ========================

/**
 * Show alert message
 */
function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.createElement('div');
    alertContainer.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertContainer.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    alertContainer.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)} me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alertContainer);

    // Auto remove after duration
    setTimeout(() => {
        if (alertContainer.parentNode) {
            alertContainer.remove();
        }
    }, duration);
}

/**
 * Get appropriate icon for alert type
 */
function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-circle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

/**
 * Show custom modal
 */
function showModal(title, content) {
    // Create modal HTML
    const modalHtml = `
        <div class="modal fade" id="customModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing custom modal
    const existingModal = document.getElementById('customModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add new modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('customModal'));
    modal.show();

    // Remove modal from DOM when hidden
    document.getElementById('customModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format match date
 */
function formatMatchDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Format match time
 */
function formatMatchTime(dateString) {
    return new Date(dateString).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Load dashboard with statistics
 */
function loadDashboard() {
    // This function can be called to refresh dashboard statistics
    const stats = db.getStatistics();
    console.log('📊 Database Statistics:', stats);
}

// ======================== ADDITIONAL STYLES ========================
const additionalCSS = `
<style>
.avatar-circle {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    color: white;
}

.stats-grid {
    display: grid;
    gap: 1rem;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: #f8fafc;
    border-radius: 10px;
}

.stat-item i {
    font-size: 1.5rem;
}

.stat-item div strong {
    display: block;
    font-size: 1.1rem;
}

.stat-item div small {
    color: #6b7280;
    font-size: 0.875rem;
}
</style>
`;

// Inject additional CSS
document.head.insertAdjacentHTML('beforeend', additionalCSS);

// ======================== END OF APPLICATION ========================
console.log('📱 FanConnect Application loaded successfully!');
