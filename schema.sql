-- =============================================
-- FanConnect Sports Management System
-- Database Schema for MySQL/PostgreSQL
-- =============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS fanconnect_db;
USE fanconnect_db;

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(15),
    date_of_birth DATE,
    profile_image VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- =============================================
-- SPORTS TABLE
-- =============================================
CREATE TABLE sports (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7), -- Hex color code
    max_players_per_team INT DEFAULT 11,
    season_start DATE,
    season_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TEAMS TABLE
-- =============================================
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    sport_id INT NOT NULL,
    short_name VARCHAR(10),
    logo_url VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    founded_year YEAR,
    home_venue VARCHAR(200),
    coach_name VARCHAR(100),
    captain_id INT NULL, -- Will reference players table
    description TEXT,
    website VARCHAR(255),

    -- Statistics
    matches_played INT DEFAULT 0,
    matches_won INT DEFAULT 0,
    matches_drawn INT DEFAULT 0,
    matches_lost INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    points INT DEFAULT 0,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE,
    INDEX idx_sport_id (sport_id),
    INDEX idx_points (points DESC)
);

-- =============================================
-- PLAYERS TABLE
-- =============================================
CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    team_id INT NOT NULL,
    jersey_number INT,
    position VARCHAR(50),
    age INT,
    height DECIMAL(5,2), -- in cm
    weight DECIMAL(5,2), -- in kg
    nationality VARCHAR(50) DEFAULT 'Indian',
    date_of_birth DATE,
    profile_image VARCHAR(255),

    -- Career Statistics
    matches_played INT DEFAULT 0,
    goals_scored INT DEFAULT 0,
    assists INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    minutes_played INT DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 7.0,

    -- Contract Information
    joined_date DATE,
    contract_end_date DATE,
    salary DECIMAL(12,2),

    -- Personal Information
    biography TEXT,
    social_media JSON,

    -- Metadata
    is_active BOOLEAN DEFAULT TRUE,
    is_captain BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_jersey_per_team (team_id, jersey_number),
    INDEX idx_team_id (team_id),
    INDEX idx_position (position),
    INDEX idx_rating (rating DESC)
);

-- =============================================
-- VENUES TABLE
-- =============================================
CREATE TABLE venues (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    capacity INT,
    field_type VARCHAR(50), -- Grass, Artificial, Indoor, etc.
    facilities JSON, -- Parking, Food courts, etc.
    coordinates POINT, -- GPS coordinates
    image_url VARCHAR(255),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_city (city),
    INDEX idx_capacity (capacity DESC)
);

-- =============================================
-- MATCHES TABLE
-- =============================================
CREATE TABLE matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sport_id INT NOT NULL,
    team1_id INT NOT NULL,
    team2_id INT NOT NULL,
    venue_id INT,

    -- Match Details
    match_date DATETIME NOT NULL,
    season VARCHAR(20),
    match_type ENUM('League', 'Cup', 'Friendly', 'Playoff') DEFAULT 'League',
    status ENUM('Scheduled', 'Live', 'Completed', 'Postponed', 'Cancelled') DEFAULT 'Scheduled',

    -- Results (NULL if not completed)
    team1_score INT NULL,
    team2_score INT NULL,
    winner_id INT NULL, -- team_id of winner, NULL for draw
    result_status ENUM('Win', 'Draw', 'Walkover') NULL,

    -- Match Statistics
    attendance INT,
    duration_minutes INT, -- Actual match duration
    referee_name VARCHAR(100),
    weather_conditions VARCHAR(100),

    -- Ticket Information
    ticket_price DECIMAL(8,2) DEFAULT 500.00,
    tickets_available INT,
    tickets_sold INT DEFAULT 0,

    -- Additional Information
    match_notes TEXT,
    highlights_url VARCHAR(255),
    match_report TEXT,

    -- Metadata
    created_by INT, -- user_id who created the match
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (sport_id) REFERENCES sports(id),
    FOREIGN KEY (team1_id) REFERENCES teams(id),
    FOREIGN KEY (team2_id) REFERENCES teams(id),
    FOREIGN KEY (venue_id) REFERENCES venues(id),
    FOREIGN KEY (winner_id) REFERENCES teams(id),
    FOREIGN KEY (created_by) REFERENCES users(id),

    CONSTRAINT chk_different_teams CHECK (team1_id != team2_id),

    INDEX idx_match_date (match_date),
    INDEX idx_sport_status (sport_id, status),
    INDEX idx_teams (team1_id, team2_id),
    INDEX idx_status (status)
);

-- =============================================
-- MATCH_EVENTS TABLE (Goals, Cards, Substitutions)
-- =============================================
CREATE TABLE match_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    match_id INT NOT NULL,
    player_id INT NOT NULL,
    team_id INT NOT NULL,

    event_type ENUM('Goal', 'Assist', 'Yellow Card', 'Red Card', 'Substitution In', 'Substitution Out') NOT NULL,
    event_time INT, -- Minute of the event
    event_description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id),
    FOREIGN KEY (team_id) REFERENCES teams(id),

    INDEX idx_match_id (match_id),
    INDEX idx_player_id (player_id),
    INDEX idx_event_type (event_type)
);

-- =============================================
-- BOOKINGS TABLE
-- =============================================
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    match_id INT NOT NULL,

    -- Booking Details
    number_of_tickets INT NOT NULL CHECK (number_of_tickets > 0),
    ticket_price DECIMAL(8,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_reference VARCHAR(20) UNIQUE,

    -- Seat Information
    seat_section VARCHAR(20),
    seat_numbers JSON, -- Array of seat numbers

    -- Payment Information  
    payment_status ENUM('Pending', 'Paid', 'Failed', 'Cancelled', 'Refunded') DEFAULT 'Pending',
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_date TIMESTAMP NULL,

    location VARCHAR(20),
    

    -- Booking Status
    booking_status ENUM('Confirmed', 'Cancelled', 'Used') DEFAULT 'Confirmed',
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,

    -- Additional Information
    special_requests TEXT,
    qr_code VARCHAR(500), -- QR code for ticket verification

    -- Metadata
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id),

    INDEX idx_user_id (user_id),
    INDEX idx_match_id (match_id),
    INDEX idx_booking_date (booking_date),
    INDEX idx_payment_status (payment_status),
    INDEX idx_booking_reference (booking_reference)
);


-- =============================================
-- SEASONS TABLE
-- =============================================
CREATE TABLE seasons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sport_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    prize_money DECIMAL(15,2),
    sponsor VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sport_id) REFERENCES sports(id),
    INDEX idx_sport_year (sport_id, year),
    INDEX idx_current (is_current)
);

-- =============================================
-- LEAGUE_STANDINGS TABLE
-- =============================================
CREATE TABLE league_standings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    season_id INT NOT NULL,
    team_id INT NOT NULL,

    -- Standings Statistics
    position INT,
    matches_played INT DEFAULT 0,
    wins INT DEFAULT 0,
    draws INT DEFAULT 0,
    losses INT DEFAULT 0,
    goals_for INT DEFAULT 0,
    goals_against INT DEFAULT 0,
    goal_difference INT GENERATED ALWAYS AS (goals_for - goals_against) STORED,
    points INT DEFAULT 0,

    -- Form (last 5 matches)
    recent_form VARCHAR(5), -- e.g., "WWDLL"

    -- Additional Statistics
    home_wins INT DEFAULT 0,
    home_draws INT DEFAULT 0,
    home_losses INT DEFAULT 0,
    away_wins INT DEFAULT 0,
    away_draws INT DEFAULT 0,
    away_losses INT DEFAULT 0,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (season_id) REFERENCES seasons(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,

    UNIQUE KEY unique_team_season (season_id, team_id),
    INDEX idx_position (season_id, position),
    INDEX idx_points (season_id, points DESC)
);

-- =============================================
-- NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('Info', 'Success', 'Warning', 'Error') DEFAULT 'Info',
    category ENUM('Match', 'Booking', 'Team', 'General') DEFAULT 'General',

    -- Notification Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP NULL,

    -- Related Entities
    related_match_id INT NULL,
    related_team_id INT NULL,
    related_booking_id INT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_match_id) REFERENCES matches(id) ON DELETE SET NULL,
    FOREIGN KEY (related_team_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,

    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created_at (created_at DESC)
);

-- =============================================
-- AUDIT_LOGS TABLE
-- =============================================
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    table_name VARCHAR(100) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_table_record (table_name, record_id),
    INDEX idx_user_action (user_id, action),
    INDEX idx_created_at (created_at DESC)
);

-- =============================================
-- DATABASE VIEWS
-- =============================================

-- View for current season standings
CREATE VIEW current_standings AS
SELECT 
    ls.*,
    t.name as team_name,
    t.short_name,
    t.logo_url,
    s.name as season_name,
    sp.name as sport_name
FROM league_standings ls
JOIN teams t ON ls.team_id = t.id
JOIN seasons s ON ls.season_id = s.id
JOIN sports sp ON s.sport_id = sp.id
WHERE s.is_current = TRUE
ORDER BY ls.points DESC, ls.goal_difference DESC, ls.goals_for DESC;

-- View for upcoming matches
CREATE VIEW upcoming_matches AS
SELECT 
    m.*,
    t1.name as team1_name,
    t1.short_name as team1_short,
    t1.logo_url as team1_logo,
    t2.name as team2_name,
    t2.short_name as team2_short,
    t2.logo_url as team2_logo,
    v.name as venue_name,
    v.city as venue_city,
    sp.name as sport_name,
    sp.icon as sport_icon
FROM matches m
JOIN teams t1 ON m.team1_id = t1.id
JOIN teams t2 ON m.team2_id = t2.id
LEFT JOIN venues v ON m.venue_id = v.id
JOIN sports sp ON m.sport_id = sp.id
WHERE m.match_date > NOW() AND m.status = 'Scheduled'
ORDER BY m.match_date ASC;

-- View for team statistics
CREATE VIEW team_statistics AS
SELECT 
    t.*,
    COUNT(DISTINCT p.id) as total_players,
    AVG(p.age) as average_age,
    AVG(p.rating) as average_rating,
    SUM(p.goals_scored) as total_goals_by_players,
    sp.name as sport_name
FROM teams t
LEFT JOIN players p ON t.id = p.team_id AND p.is_active = TRUE
JOIN sports sp ON t.sport_id = sp.id
WHERE t.is_active = TRUE
GROUP BY t.id
ORDER BY t.points DESC;

-- View for user booking history
CREATE VIEW user_booking_history AS
SELECT 
    b.*,
    u.username,
    u.email,
    m.match_date,
    t1.name as team1_name,
    t2.name as team2_name,
    v.name as venue_name,
    sp.name as sport_name
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN matches m ON b.match_id = m.id
JOIN teams t1 ON m.team1_id = t1.id
JOIN teams t2 ON m.team2_id = t2.id
LEFT JOIN venues v ON m.venue_id = v.id
JOIN sports sp ON m.sport_id = sp.id
ORDER BY b.booking_date DESC;

-- =============================================
-- STORED PROCEDURES
-- =============================================

-- Procedure to update team statistics after a match
DELIMITER //
CREATE PROCEDURE UpdateTeamStatistics(IN match_id INT)
BEGIN
    DECLARE team1_id, team2_id, team1_score, team2_score INT;

    -- Get match details
    SELECT m.team1_id, m.team2_id, m.team1_score, m.team2_score
    INTO team1_id, team2_id, team1_score, team2_score
    FROM matches m WHERE m.id = match_id;

    -- Update team1 statistics
    UPDATE teams SET 
        matches_played = matches_played + 1,
        goals_for = goals_for + team1_score,
        goals_against = goals_against + team2_score,
        matches_won = CASE WHEN team1_score > team2_score THEN matches_won + 1 ELSE matches_won END,
        matches_drawn = CASE WHEN team1_score = team2_score THEN matches_drawn + 1 ELSE matches_drawn END,
        matches_lost = CASE WHEN team1_score < team2_score THEN matches_lost + 1 ELSE matches_lost END,
        points = CASE 
            WHEN team1_score > team2_score THEN points + 3
            WHEN team1_score = team2_score THEN points + 1
            ELSE points
        END
    WHERE id = team1_id;

    -- Update team2 statistics
    UPDATE teams SET 
        matches_played = matches_played + 1,
        goals_for = goals_for + team2_score,
        goals_against = goals_against + team1_score,
        matches_won = CASE WHEN team2_score > team1_score THEN matches_won + 1 ELSE matches_won END,
        matches_drawn = CASE WHEN team2_score = team1_score THEN matches_drawn + 1 ELSE matches_drawn END,
        matches_lost = CASE WHEN team2_score < team1_score THEN matches_lost + 1 ELSE matches_lost END,
        points = CASE 
            WHEN team2_score > team1_score THEN points + 3
            WHEN team2_score = team1_score THEN points + 1
            ELSE points
        END
    WHERE id = team2_id;
END //
DELIMITER ;

-- =============================================
-- DATABASE TRIGGERS
-- =============================================

-- Trigger to update team captain reference when a player is marked as captain
DELIMITER //
CREATE TRIGGER update_team_captain
AFTER UPDATE ON players
FOR EACH ROW
BEGIN
    -- If player is newly marked as captain
    IF NEW.is_captain = TRUE AND OLD.is_captain = FALSE THEN
        -- Remove captain status from other players in the same team
        UPDATE players SET is_captain = FALSE 
        WHERE team_id = NEW.team_id AND id != NEW.id;

        -- Update team's captain_id
        UPDATE teams SET captain_id = NEW.id WHERE id = NEW.team_id;
    END IF;

    -- If player is no longer captain
    IF NEW.is_captain = FALSE AND OLD.is_captain = TRUE THEN
        UPDATE teams SET captain_id = NULL WHERE id = NEW.team_id;
    END IF;
END //
DELIMITER ;

-- Trigger to generate booking reference
DELIMITER //
CREATE TRIGGER generate_booking_reference
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    SET NEW.booking_reference = CONCAT('FC', YEAR(NOW()), LPAD(NEW.match_id, 4, '0'), LPAD(NEW.user_id, 4, '0'));
END //
DELIMITER ;

-- Trigger to update match ticket counts
DELIMITER //
CREATE TRIGGER update_ticket_count
AFTER INSERT ON bookings
FOR EACH ROW
BEGIN
    UPDATE matches 
    SET tickets_sold = tickets_sold + NEW.number_of_tickets
    WHERE id = NEW.match_id;
END //
DELIMITER ;

-- Trigger to create audit log
DELIMITER //
CREATE TRIGGER audit_users_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO audit_logs (user_id, table_name, record_id, action, new_values)
    VALUES (NEW.id, 'users', NEW.id, 'INSERT', JSON_OBJECT(
        'username', NEW.username,
        'email', NEW.email,
        'role', NEW.role
    ));
END //
DELIMITER ;

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Additional composite indexes for common queries
CREATE INDEX idx_matches_date_status ON matches(match_date, status);
CREATE INDEX idx_bookings_user_status ON bookings(user_id, booking_status);
CREATE INDEX idx_players_team_active ON players(team_id, is_active);
CREATE INDEX idx_teams_sport_active ON teams(sport_id, is_active);

-- Full-text search indexes
ALTER TABLE teams ADD FULLTEXT(name, description);
ALTER TABLE players ADD FULLTEXT(name, biography);
ALTER TABLE venues ADD FULLTEXT(name, address);

-- =============================================
-- SAMPLE DATA INSERTION
-- =============================================

-- Insert Sports
INSERT INTO sports (name, description, icon, color, max_players_per_team) VALUES
('Cricket', 'Cricket is a bat-and-ball game played between two teams of eleven players each.', 'fas fa-baseball-ball', '#10b981', 11),
('Football', 'Football is a team sport played between two teams of eleven players with a spherical ball.', 'fas fa-futbol', '#3b82f6', 11),
('Basketball', 'Basketball is a team sport in which two teams of five players each try to score goals.', 'fas fa-basketball-ball', '#f59e0b', 5),
('Volleyball', 'Volleyball is a team sport in which two teams of six members are separated by a net.', 'fas fa-volleyball-ball', '#ef4444', 6);

-- Insert Venues
INSERT INTO venues (name, address, city, state, capacity) VALUES
('Wankhede Stadium', 'D Road, Churchgate, Mumbai', 'Mumbai', 'Maharashtra', 33108),
('M. Chinnaswamy Stadium', 'Queens Road, Bangalore', 'Bengaluru', 'Karnataka', 40000),
('Eden Gardens', 'Eden Gardens, Kolkata', 'Kolkata', 'West Bengal', 66000),
('Feroz Shah Kotla', 'Bahadur Shah Zafar Marg, Delhi', 'New Delhi', 'Delhi', 41820),
('MA Chidambaram Stadium', 'Chepauk, Chennai', 'Chennai', 'Tamil Nadu', 50000);

-- Insert default admin user
INSERT INTO users (username, email, password, role, first_name, last_name) VALUES
('admin', 'admin@fanconnect.com', 'admin123', 'admin', 'System', 'Administrator'),
('manager1', 'manager@fanconnect.com', 'manager123', 'manager', 'Sports', 'Manager'),
('user1', 'user1@example.com', 'user123', 'user', 'Regular', 'User');

-- Note: This is a basic schema. In production, you would:
-- 1. Use proper password hashing (bcrypt, etc.)
-- 2. Add more detailed constraints and validations
-- 3. Implement proper foreign key relationships
-- 4. Add more comprehensive indexes
-- 5. Set up database users with appropriate permissions
-- 6. Configure backup and replication strategies
