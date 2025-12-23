-- =============================================
-- FanConnect Sports Management System
-- Sample Data for Testing and Demonstration
-- =============================================

-- This file contains realistic sample data for the FanConnect system
-- Run this after creating the database schema

USE fanconnect_db;

-- Disable foreign key checks temporarily for bulk inserts
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- INSERT SPORTS DATA
-- =============================================
INSERT INTO sports (id, name, description, icon, color, max_players_per_team, is_active) VALUES
(1, 'Cricket', 'Cricket is a bat-and-ball game played between two teams of eleven players each on a cricket field.', 'fas fa-baseball-ball', '#10b981', 11, TRUE),
(2, 'Football', 'Football is a team sport played between two teams of eleven players with a spherical ball.', 'fas fa-futbol', '#3b82f6', 11, TRUE),
(3, 'Basketball', 'Basketball is a team sport in which two teams of five active players each try to score points.', 'fas fa-basketball-ball', '#f59e0b', 5, TRUE),
(4, 'Volleyball', 'Volleyball is a team sport in which two teams of six players are separated by a net.', 'fas fa-volleyball-ball', '#ef4444', 6, TRUE);

-- =============================================
-- INSERT VENUES DATA
-- =============================================
INSERT INTO venues (id, name, address, city, state, country, capacity, field_type, contact_phone, is_active) VALUES
(1, 'Wankhede Stadium', 'D Road, Churchgate, Mumbai, Maharashtra 400020', 'Mumbai', 'Maharashtra', 'India', 33108, 'Grass', '+91-22-2281-3950', TRUE),
(2, 'M. Chinnaswamy Stadium', 'Queens Road, Bangalore, Karnataka 560001', 'Bengaluru', 'Karnataka', 'India', 40000, 'Grass', '+91-80-2226-8030', TRUE),
(3, 'Eden Gardens', 'Eden Gardens, B.B.D. Bagh, Kolkata, West Bengal 700021', 'Kolkata', 'West Bengal', 'India', 66000, 'Grass', '+91-33-2248-1786', TRUE),
(4, 'Feroz Shah Kotla', 'Bahadur Shah Zafar Marg, New Delhi, Delhi 110002', 'New Delhi', 'Delhi', 'India', 41820, 'Grass', '+91-11-2331-5676', TRUE),
(5, 'MA Chidambaram Stadium', 'Chepauk, Chennai, Tamil Nadu 600005', 'Chennai', 'Tamil Nadu', 'India', 50000, 'Grass', '+91-44-2536-1992', TRUE),
(6, 'Rajiv Gandhi Stadium', 'Uppal, Hyderabad, Telangana 500039', 'Hyderabad', 'Telangana', 'India', 55000, 'Grass', '+91-40-2429-2222', TRUE),
(7, 'Sardar Patel Stadium', 'Ahmedabad, Gujarat 382421', 'Ahmedabad', 'Gujarat', 'India', 132000, 'Grass', '+91-79-2970-0000', TRUE),
(8, 'IS Bindra Stadium', 'Mohali, Punjab 160055', 'Mohali', 'Punjab', 'India', 26950, 'Grass', '+91-172-223-1001', TRUE),
(9, 'Sawai Mansingh Stadium', 'Jaipur, Rajasthan 302004', 'Jaipur', 'Rajasthan', 'India', 30000, 'Grass', '+91-141-251-1234', TRUE),
(10, 'Brabourne Stadium', 'Churchgate, Mumbai, Maharashtra 400020', 'Mumbai', 'Maharashtra', 'India', 20000, 'Grass', '+91-22-2204-2006', TRUE);

-- =============================================
-- INSERT TEAMS DATA
-- =============================================

-- Cricket Teams
INSERT INTO teams (id, name, sport_id, short_name, primary_color, secondary_color, founded_year, home_venue, description, is_active) VALUES
(1, 'Mumbai Indians', 1, 'MI', '#004BA0', '#D4AF37', 2008, 'Wankhede Stadium', 'Most successful IPL franchise with multiple championships.', TRUE),
(2, 'Chennai Super Kings', 1, 'CSK', '#FFFF3C', '#004BA0', 2008, 'MA Chidambaram Stadium', 'Known for their consistent performance and experienced players.', TRUE),
(3, 'Royal Challengers Bangalore', 1, 'RCB', '#EC1C24', '#FFD700', 2008, 'M. Chinnaswamy Stadium', 'Popular franchise known for aggressive batting style.', TRUE),
(4, 'Delhi Capitals', 1, 'DC', '#17479E', '#EF9A00', 2008, 'Feroz Shah Kotla', 'Young and dynamic team with promising talent.', TRUE),
(5, 'Kolkata Knight Riders', 1, 'KKR', '#2E0249', '#B3A123', 2008, 'Eden Gardens', 'Two-time IPL champions with strong fan following.', TRUE),
(6, 'Rajasthan Royals', 1, 'RR', '#254AA5', '#E91C7A', 2008, 'Sawai Mansingh Stadium', 'Inaugural IPL champions known for nurturing young talent.', TRUE),
(7, 'Punjab Kings', 1, 'PBKS', '#DD1F2D', '#B3A123', 2008, 'IS Bindra Stadium', 'Competitive team with strong batting lineup.', TRUE),
(8, 'Sunrisers Hyderabad', 1, 'SRH', '#FF822A', '#000000', 2013, 'Rajiv Gandhi Stadium', '2016 IPL champions with strong bowling attack.', TRUE),
(9, 'Lucknow Super Giants', 1, 'LSG', '#1C84C6', '#E4002B', 2022, 'Various', 'New franchise with ambitious goals.', TRUE),
(10, 'Gujarat Titans', 1, 'GT', '#1B2951', '#FFD700', 2022, 'Sardar Patel Stadium', '2022 IPL champions in their debut season.', TRUE),
(11, 'Mumbai Heroes', 1, 'MH', '#E74C3C', '#F39C12', 2020, 'Brabourne Stadium', 'Emerging cricket franchise.', TRUE),
(12, 'Chennai Warriors', 1, 'CW', '#27AE60', '#E67E22', 2020, 'Various', 'Strong regional team.', TRUE),
(13, 'Bangalore Challengers', 1, 'BC', '#8E44AD', '#F1C40F', 2021, 'Various', 'New cricket franchise.', TRUE),
(14, 'Delhi Daredevils Legacy', 1, 'DDL', '#3498DB', '#E74C3C', 2019, 'Various', 'Cricket legacy team.', TRUE),
(15, 'Kolkata Tigers', 1, 'KT', '#FF6B35', '#004225', 2021, 'Various', 'Ambitious cricket team.', TRUE);

-- Football Teams  
INSERT INTO teams (id, name, sport_id, short_name, primary_color, secondary_color, founded_year, home_venue, description, is_active) VALUES
(16, 'Mumbai City FC', 2, 'MCFC', '#87CEEB', '#FFD700', 2014, 'Various', 'ISL champions with strong attacking play.', TRUE),
(17, 'Bengaluru FC', 2, 'BFC', '#FF0000', '#0000FF', 2013, 'Various', 'Former I-League champions.', TRUE),
(18, 'ATK Mohun Bagan', 2, 'ATKMB', '#008000', '#8B0000', 1889, 'Various', 'Historic club with rich legacy.', TRUE),
(19, 'FC Goa', 2, 'FCG', '#FF8C00', '#000080', 2014, 'Various', 'Known for attractive football.', TRUE),
(20, 'Hyderabad FC', 2, 'HFC', '#FFD700', '#000000', 2019, 'Various', 'ISL champions 2021-22.', TRUE),
(21, 'Jamshedpur FC', 2, 'JFC', '#E74C3C', '#F39C12', 2017, 'Various', 'Strong defensive team.', TRUE),
(22, 'Kerala Blasters', 2, 'KBFC', '#FFD700', '#0000FF', 2014, 'Various', 'Massive fan following.', TRUE),
(23, 'NorthEast United', 2, 'NEUFC', '#FF0000', '#FFFFFF', 2014, 'Various', 'Represents Northeast India.', TRUE),
(24, 'Odisha FC', 2, 'OFC', '#8B008B', '#FFD700', 2019, 'Various', 'Growing football club.', TRUE),
(25, 'Punjab FC', 2, 'PFC', '#FF1493', '#000000', 2020, 'Various', 'New addition to ISL.', TRUE),
(26, 'Chennai City FC', 2, 'CCFC', '#00CED1', '#FF6347', 2016, 'Various', 'South Indian representation.', TRUE),
(27, 'Delhi Dynamos', 2, 'DD', '#DC143C', '#FFD700', 2014, 'Various', 'Capital city team.', TRUE),
(28, 'Pune Warriors FC', 2, 'PWFC', '#4B0082', '#FF8C00', 2018, 'Various', 'Maharashtra football.', TRUE),
(29, 'Kochi Tuskers FC', 2, 'KTFC', '#228B22', '#FFD700', 2019, 'Various', 'Kerala football club.', TRUE),
(30, 'Ahmedabad United', 2, 'AU', '#FF4500', '#0000FF', 2020, 'Various', 'Gujarat football.', TRUE);

-- Basketball Teams
INSERT INTO teams (id, name, sport_id, short_name, primary_color, secondary_color, founded_year, home_venue, description, is_active) VALUES
(31, 'Mumbai Ballers', 3, 'MB', '#FF6B35', '#004225', 2018, 'Various', 'Premier basketball franchise.', TRUE),
(32, 'Delhi Hoopers', 3, 'DH', '#1E90FF', '#FFD700', 2018, 'Various', 'Capital city basketball.', TRUE),
(33, 'Bengaluru Beasts', 3, 'BB', '#8B0000', '#FFD700', 2019, 'Various', 'South Indian basketball.', TRUE),
(34, 'Chennai Slammers', 3, 'CS', '#32CD32', '#FF4500', 2019, 'Various', 'Tamil Nadu basketball.', TRUE),
(35, 'Hyderabad Hawks', 3, 'HH', '#FF1493', '#000000', 2020, 'Various', 'Telangana basketball.', TRUE),
(36, 'Kolkata Knights BB', 3, 'KKBB', '#4B0082', '#FFD700', 2018, 'Various', 'Bengal basketball.', TRUE),
(37, 'Punjab Panthers', 3, 'PP', '#FF8C00', '#000080', 2019, 'Various', 'Punjab basketball.', TRUE),
(38, 'Goa Giants', 3, 'GG', '#FF69B4', '#008000', 2020, 'Various', 'Goa basketball.', TRUE),
(39, 'Rajasthan Riders BB', 3, 'RRBB', '#DC143C', '#FFD700', 2019, 'Various', 'Rajasthan basketball.', TRUE),
(40, 'Gujarat Gladiators', 3, 'GGL', '#9370DB', '#FF6347', 2020, 'Various', 'Gujarat basketball.', TRUE),
(41, 'Lucknow Lakers', 3, 'LL', '#FF4500', '#0000FF', 2021, 'Various', 'UP basketball.', TRUE),
(42, 'Ahmedabad Aces', 3, 'AA', '#228B22', '#FF1493', 2021, 'Various', 'Gujarat basketball ace.', TRUE),
(43, 'Jaipur Jumpers', 3, 'JJ', '#FF8C00', '#4B0082', 2020, 'Various', 'Rajasthan jumpers.', TRUE),
(44, 'Chandigarh Chiefs', 3, 'CC', '#00CED1', '#FF0000', 2021, 'Various', 'Punjab basketball chiefs.', TRUE),
(45, 'Kochi Kings BB', 3, 'KKBB2', '#8FBC8F', '#8B0000', 2021, 'Various', 'Kerala basketball kings.', TRUE);

-- Volleyball Teams
INSERT INTO teams (id, name, sport_id, short_name, primary_color, secondary_color, founded_year, home_venue, description, is_active) VALUES
(46, 'Mumbai Spikes', 4, 'MS', '#FF6347', '#000080', 2017, 'Various', 'Premier volleyball team.', TRUE),
(47, 'Chennai Smashers', 4, 'CSS', '#32CD32', '#FF4500', 2017, 'Various', 'Tamil Nadu volleyball.', TRUE),
(48, 'Bengaluru Blockers', 4, 'BB2', '#8B008B', '#FFD700', 2018, 'Various', 'Karnataka volleyball.', TRUE),
(49, 'Delhi Diggers', 4, 'DD2', '#FF1493', '#000000', 2018, 'Various', 'Capital volleyball.', TRUE),
(50, 'Kolkata Crushers', 4, 'KC', '#FF8C00', '#0000FF', 2017, 'Various', 'Bengal volleyball.', TRUE),
(51, 'Hyderabad Hitters', 4, 'HH2', '#DC143C', '#FFD700', 2019, 'Various', 'Telangana volleyball.', TRUE),
(52, 'Punjab Power', 4, 'PP2', '#228B22', '#FF69B4', 2018, 'Various', 'Punjab volleyball power.', TRUE),
(53, 'Goa Guardians', 4, 'GG2', '#4B0082', '#FF6347', 2019, 'Various', 'Goa volleyball guardians.', TRUE),
(54, 'Rajasthan Rockets', 4, 'RR2', '#FF4500', '#008000', 2018, 'Various', 'Rajasthan volleyball.', TRUE),
(55, 'Gujarat Gators', 4, 'GGT', '#9370DB', '#FFD700', 2019, 'Various', 'Gujarat volleyball.', TRUE),
(56, 'Kerala Killers', 4, 'KK', '#FF1493', '#000080', 2020, 'Various', 'Kerala volleyball.', TRUE),
(57, 'Tamil Nadu Titans', 4, 'TNT', '#32CD32', '#8B0000', 2020, 'Various', 'Tamil volleyball titans.', TRUE),
(58, 'Karnataka Kings VB', 4, 'KKVB', '#FF8C00', '#4B0082', 2019, 'Various', 'Karnataka volleyball.', TRUE),
(59, 'Andhra Aces VB', 4, 'AAVB', '#DC143C', '#FFD700', 2020, 'Various', 'Andhra volleyball.', TRUE),
(60, 'Odisha Olympians', 4, 'OO', '#228B22', '#FF4500', 2021, 'Various', 'Odisha volleyball.', TRUE);

-- =============================================
-- INSERT PLAYERS DATA (Sample for first few teams)
-- =============================================

-- Mumbai Indians Players (Cricket)
INSERT INTO players (name, team_id, jersey_number, position, age, nationality, matches_played, goals_scored, assists, rating) VALUES
('Rohit Sharma', 1, 45, 'Batsman', 36, 'Indian', 120, 85, 45, 8.9),
('Jasprit Bumrah', 1, 93, 'Bowler', 29, 'Indian', 95, 150, 20, 9.2),
('Suryakumar Yadav', 1, 63, 'Batsman', 33, 'Indian', 78, 65, 35, 8.5),
('Hardik Pandya', 1, 33, 'All-rounder', 30, 'Indian', 89, 55, 40, 8.7),
('Ishan Kishan', 1, 32, 'Wicket-keeper', 25, 'Indian', 45, 35, 25, 8.1),
('Tilak Varma', 1, 9, 'Batsman', 21, 'Indian', 25, 20, 15, 7.8),
('Tim David', 1, 21, 'Batsman', 27, 'Australian', 30, 25, 10, 8.0),
('Kieron Pollard', 1, 55, 'All-rounder', 36, 'West Indian', 156, 75, 55, 8.6),
('Trent Boult', 1, 18, 'Bowler', 34, 'New Zealand', 45, 60, 8, 8.8),
('Krunal Pandya', 1, 24, 'All-rounder', 32, 'Indian', 67, 25, 35, 7.9),
('Rahul Chahar', 1, 28, 'Bowler', 24, 'Indian', 42, 50, 12, 7.7);

-- Chennai Super Kings Players (Cricket)
INSERT INTO players (name, team_id, jersey_number, position, age, nationality, matches_played, goals_scored, assists, rating) VALUES
('MS Dhoni', 2, 7, 'Wicket-keeper', 42, 'Indian', 150, 45, 85, 9.5),
('Ravindra Jadeja', 2, 8, 'All-rounder', 34, 'Indian', 125, 65, 95, 9.1),
('Ruturaj Gaikwad', 2, 31, 'Batsman', 26, 'Indian', 55, 45, 25, 8.3),
('Devon Conway', 2, 88, 'Batsman', 32, 'New Zealand', 35, 30, 15, 8.2),
('Deepak Chahar', 2, 90, 'Bowler', 31, 'Indian', 65, 75, 20, 8.4),
('Moeen Ali', 2, 18, 'All-rounder', 36, 'English', 78, 35, 45, 8.0),
('Ambati Rayudu', 2, 3, 'Batsman', 37, 'Indian', 98, 55, 35, 8.1),
('Dwayne Bravo', 2, 47, 'All-rounder', 39, 'West Indian', 145, 55, 65, 8.5),
('Shardul Thakur', 2, 54, 'Bowler', 32, 'Indian', 67, 65, 18, 7.8),
('Mitchell Santner', 2, 64, 'All-rounder', 31, 'New Zealand', 45, 25, 35, 7.9),
('Tushar Deshpande', 2, 13, 'Bowler', 28, 'Indian', 22, 25, 8, 7.5);

-- Sample players for Football teams (Mumbai City FC)
INSERT INTO players (name, team_id, jersey_number, position, age, nationality, matches_played, goals_scored, assists, rating) VALUES
('Igor Angulo', 16, 9, 'Forward', 38, 'Spanish', 45, 35, 15, 8.8),
('Ahmed Jahouh', 16, 5, 'Midfielder', 35, 'Moroccan', 67, 8, 25, 8.5),
('Lallianzuala Chhangte', 16, 7, 'Forward', 26, 'Indian', 78, 22, 18, 8.2),
('Phurba Lachenpa', 16, 1, 'Goalkeeper', 32, 'Indian', 89, 0, 5, 8.0),
('Rahul Bheke', 16, 2, 'Defender', 32, 'Indian', 156, 12, 8, 7.8),
('Cassio Gabriel', 16, 30, 'Midfielder', 28, 'Brazilian', 45, 15, 22, 8.1),
('Bipin Singh', 16, 29, 'Midfielder', 27, 'Indian', 67, 8, 15, 7.7),
('Fall Boumous', 16, 10, 'Midfielder', 29, 'French', 55, 18, 20, 8.3),
('Mehtab Singh', 16, 4, 'Defender', 24, 'Indian', 34, 2, 3, 7.6),
('Vikram Partap Singh', 16, 11, 'Forward', 23, 'Indian', 28, 8, 5, 7.5),
('Rowllin Borges', 16, 14, 'Midfielder', 30, 'Indian', 87, 5, 12, 7.8);

-- =============================================
-- INSERT SEASONS DATA
-- =============================================
INSERT INTO seasons (sport_id, name, year, start_date, end_date, is_current, description) VALUES
(1, 'IPL 2024', 2024, '2024-03-15', '2024-05-30', TRUE, 'Indian Premier League 2024 Season'),
(2, 'ISL 2023-24', 2024, '2023-11-15', '2024-03-15', TRUE, 'Indian Super League 2023-24 Season'),
(3, 'Basketball League 2024', 2024, '2024-01-15', '2024-06-30', TRUE, 'Indian Basketball League 2024'),
(4, 'Volleyball Championship 2024', 2024, '2024-02-01', '2024-07-31', TRUE, 'Indian Volleyball Championship 2024');

-- =============================================
-- INSERT SAMPLE MATCHES DATA
-- =============================================

-- Cricket Matches (Past)
INSERT INTO matches (sport_id, team1_id, team2_id, venue_id, match_date, status, team1_score, team2_score, winner_id, attendance, ticket_price) VALUES
(1, 1, 2, 1, '2024-09-15 19:30:00', 'Completed', 180, 175, 1, 32000, 500.00),
(1, 3, 4, 2, '2024-09-18 19:30:00', 'Completed', 165, 170, 4, 38000, 600.00),
(1, 5, 6, 3, '2024-09-20 19:30:00', 'Completed', 145, 148, 6, 45000, 550.00),
(1, 7, 8, 8, '2024-09-22 19:30:00', 'Completed', 155, 160, 8, 25000, 450.00),
(1, 9, 10, 7, '2024-09-25 19:30:00', 'Completed', 195, 190, 9, 65000, 700.00);

-- Cricket Matches (Upcoming)
INSERT INTO matches (sport_id, team1_id, team2_id, venue_id, match_date, status, ticket_price, tickets_available) VALUES
(1, 1, 3, 1, '2024-11-15 19:30:00', 'Scheduled', 500.00, 25000),
(1, 2, 4, 5, '2024-11-18 19:30:00', 'Scheduled', 600.00, 30000),
(1, 5, 7, 3, '2024-11-20 19:30:00', 'Scheduled', 550.00, 35000),
(1, 6, 8, 9, '2024-11-22 19:30:00', 'Scheduled', 450.00, 20000),
(1, 9, 11, 7, '2024-11-25 19:30:00', 'Scheduled', 700.00, 40000),
(1, 10, 12, 2, '2024-11-28 19:30:00', 'Scheduled', 500.00, 28000),
(1, 13, 14, 4, '2024-12-01 19:30:00', 'Scheduled', 450.00, 22000),
(1, 15, 1, 1, '2024-12-04 19:30:00', 'Scheduled', 650.00, 30000),
(1, 2, 3, 5, '2024-12-07 19:30:00', 'Scheduled', 600.00, 32000),
(1, 4, 5, 2, '2024-12-10 19:30:00', 'Scheduled', 550.00, 28000);

-- Football Matches (Upcoming)
INSERT INTO matches (sport_id, team1_id, team2_id, venue_id, match_date, status, ticket_price, tickets_available) VALUES
(2, 16, 17, 1, '2024-11-16 20:00:00', 'Scheduled', 400.00, 20000),
(2, 18, 19, 3, '2024-11-19 20:00:00', 'Scheduled', 450.00, 25000),
(2, 20, 21, 6, '2024-11-21 20:00:00', 'Scheduled', 400.00, 22000),
(2, 22, 23, 4, '2024-11-24 20:00:00', 'Scheduled', 350.00, 18000),
(2, 24, 25, 2, '2024-11-26 20:00:00', 'Scheduled', 400.00, 20000),
(2, 26, 27, 5, '2024-11-29 20:00:00', 'Scheduled', 500.00, 25000),
(2, 28, 29, 1, '2024-12-02 20:00:00', 'Scheduled', 400.00, 22000),
(2, 30, 16, 7, '2024-12-05 20:00:00', 'Scheduled', 600.00, 30000);

-- Basketball Matches (Upcoming)
INSERT INTO matches (sport_id, team1_id, team2_id, venue_id, match_date, status, ticket_price, tickets_available) VALUES
(3, 31, 32, 1, '2024-11-17 18:00:00', 'Scheduled', 300.00, 8000),
(3, 33, 34, 2, '2024-11-20 18:00:00', 'Scheduled', 350.00, 10000),
(3, 35, 36, 6, '2024-11-23 18:00:00', 'Scheduled', 300.00, 8500),
(3, 37, 38, 8, '2024-11-25 18:00:00', 'Scheduled', 250.00, 7000),
(3, 39, 40, 9, '2024-11-27 18:00:00', 'Scheduled', 300.00, 8000);

-- Volleyball Matches (Upcoming)
INSERT INTO matches (sport_id, team1_id, team2_id, venue_id, match_date, status, ticket_price, tickets_available) VALUES
(4, 46, 47, 1, '2024-11-18 17:00:00', 'Scheduled', 250.00, 6000),
(4, 48, 49, 2, '2024-11-21 17:00:00', 'Scheduled', 300.00, 7500),
(4, 50, 51, 3, '2024-11-24 17:00:00', 'Scheduled', 250.00, 6500),
(4, 52, 53, 4, '2024-11-26 17:00:00', 'Scheduled', 200.00, 5500),
(4, 54, 55, 9, '2024-11-28 17:00:00', 'Scheduled', 250.00, 6000);

-- =============================================
-- INSERT SAMPLE BOOKINGS DATA
-- =============================================
INSERT INTO bookings (user_id, match_id, number_of_tickets, ticket_price, total_amount, payment_status, booking_status) VALUES
(3, 6, 2, 500.00, 1000.00, 'Paid', 'Confirmed'),
(3, 7, 1, 600.00, 600.00, 'Paid', 'Confirmed'),
(3, 16, 3, 400.00, 1200.00, 'Paid', 'Confirmed');

-- =============================================
-- UPDATE LEAGUE STANDINGS (Sample Data)
-- =============================================
INSERT INTO league_standings (season_id, team_id, position, matches_played, wins, draws, losses, goals_for, goals_against, points) VALUES
-- Cricket (Season 1)
(1, 1, 1, 5, 4, 0, 1, 180, 150, 12),
(1, 2, 2, 5, 3, 1, 1, 170, 160, 10),
(1, 3, 3, 5, 3, 0, 2, 165, 155, 9),
(1, 4, 4, 5, 2, 2, 1, 160, 158, 8),
(1, 5, 5, 5, 2, 1, 2, 155, 165, 7),

-- Football (Season 2)
(2, 16, 1, 4, 3, 1, 0, 8, 3, 10),
(2, 17, 2, 4, 3, 0, 1, 9, 5, 9),
(2, 18, 3, 4, 2, 2, 0, 6, 4, 8),
(2, 19, 4, 4, 2, 1, 1, 7, 6, 7),
(2, 20, 5, 4, 2, 0, 2, 5, 6, 6);

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- VERIFY DATA INSERTION
-- =============================================
SELECT 'Sports' as Table_Name, COUNT(*) as Record_Count FROM sports
UNION ALL
SELECT 'Venues', COUNT(*) FROM venues
UNION ALL  
SELECT 'Teams', COUNT(*) FROM teams
UNION ALL
SELECT 'Players', COUNT(*) FROM players
UNION ALL
SELECT 'Matches', COUNT(*) FROM matches
UNION ALL
SELECT 'Bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'Seasons', COUNT(*) FROM seasons
UNION ALL
SELECT 'League Standings', COUNT(*) FROM league_standings;

-- Show upcoming matches summary
SELECT 
    s.name as Sport,
    COUNT(m.id) as Upcoming_Matches,
    MIN(m.match_date) as Next_Match,
    AVG(m.ticket_price) as Avg_Ticket_Price
FROM matches m
JOIN sports s ON m.sport_id = s.id
WHERE m.status = 'Scheduled' AND m.match_date > NOW()
GROUP BY s.id, s.name
ORDER BY Next_Match;

COMMIT;
