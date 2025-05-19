const mongoose = require('mongoose');
const User = require('./models/user'); // Adjust path if necessary
const Group = require('./models/groups'); // Adjust path if necessary
const Post = require('./models/post'); // Adjust path if necessary

// Replace with your actual MongoDB connection string
const dbURI = 'mongodb+srv://Saleh:saleh123@cluster0.fhxmmxa.mongodb.net/buzznest?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected for seeding...'))
    .catch(err => console.error('MongoDB connection error:', err));

const seedDB = async () => {
    try {
        // Optional: Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Group.deleteMany({});
        await Post.deleteMany({});
        console.log('Existing data cleared.');

        // Create sample users
        console.log('Creating sample users...');
        const usersData = [
            { username: 'gamergal1', password: 'password1', image: 'user1.jpg', firstName: 'Gamer', lastName: 'Gal', email: 'gamergal1@example.com' },
            { username: 'rpgking', password: 'password2', image: 'user2.jpg', firstName: 'RPG', lastName: 'King', email: 'rpgking@example.com' },
            { username: 'stratmaster', password: 'password3', image: 'user3.jpg', firstName: 'Strat', lastName: 'Master', email: 'stratmaster@example.com' },
            { username: 'codplayer', password: 'password4', image: 'user4.jpg', firstName: 'COD', lastName: 'Player', email: 'codplayer@example.com' },
            { username: 'indie_fan', password: 'password5', image: 'user5.jpg', firstName: 'Indie', lastName: 'Fan', email: 'indiefan@example.com' },
            { username: 'mmo_addict', password: 'password6', image: 'user6.jpg', firstName: 'MMO', lastName: 'Addict', email: 'mmoaddict@example.com' },
            { username: 'puzzle_pro', password: 'password7', image: 'user7.jpg', firstName: 'Puzzle', lastName: 'Pro', email: 'puzzlepro@example.com' },
            { username: 'racing_ace', password: 'password8', image: 'user8.jpg', firstName: 'Racing', lastName: 'Ace', email: 'racingace@example.com' },
            { username: 'sports_gamer', password: 'password9', image: 'user9.jpg', firstName: 'Sports', lastName: 'Gamer', email: 'sportsgamer@example.com' },
            { username: 'vr_explorer', password: 'password10', image: 'user10.jpg', firstName: 'VR', lastName: 'Explorer', email: 'vrexplorer@example.com' },
        ];
        const users = await User.create(usersData);
        console.log(`${users.length} users created.`);

        // Create sample groups, linking them to users
        console.log('Creating sample groups...');
        const groupsData = [
            { groupName: 'Fortnite Legends', groupImage: 'group1.jpg', game: 'Fortnite', user: users[0]._id },
            { groupName: 'D&D Adventurers Guild', groupImage: 'group2.jpg', game: 'Dungeons & Dragons', user: users[1]._id },
            { groupName: 'Civ VI Strategy Hub', groupImage: 'group3.jpg', game: 'Civilization VI', user: users[2]._id },
            { groupName: 'Call of Duty Crew', groupImage: 'group4.jpg', game: 'Call of Duty', user: users[3]._id },
            { groupName: 'Indie Gem Hunters', groupImage: 'group5.jpg', game: 'Various Indie Games', user: users[4]._id },
            { groupName: 'WoW Raid Group', groupImage: 'group6.jpg', game: 'World of Warcraft', user: users[5]._id },
            { groupName: 'Puzzle Game Lovers', groupImage: 'group7.jpg', game: 'Various Puzzle Games', user: users[6]._id },
            { groupName: 'Forza Horizon Racers', groupImage: 'group8.jpg', game: 'Forza Horizon 5', user: users[7]._id },
            { groupName: 'FIFA Fanatics', groupImage: 'group9.jpg', game: 'FIFA', user: users[8]._id },
            { groupName: 'VR World Explorers', groupImage: 'group10.jpg', game: 'Various VR Games', user: users[9]._id },
            { groupName: 'Fortnite Build Masters', groupImage: 'group11.jpg', game: 'Fortnite', user: users[1]._id },
            { groupName: 'D&D DM Tips', groupImage: 'group12.jpg', game: 'Dungeons & Dragons', user: users[0]._id },
            { groupName: 'Civ VI Multiplayer', groupImage: 'group13.jpg', game: 'Civilization VI', user: users[3]._id },
        ];
        const groups = await Group.create(groupsData);
        console.log(`${groups.length} groups created.`);

        // Create sample posts, linking them to users and groups
        console.log('Creating sample posts...');
        const postsData = [
            { group: groups[0]._id, user: users[0]._id, postTitle: 'New Fortnite Season!', postText: 'Loving the new map and weapons! Anyone want to squad up?', postImage: 'post1.jpg' },
            { group: groups[0]._id, user: users[2]._id, postTitle: 'Looking for squad mates', postText: 'Add me if you want to play duos tonight! Mic preferred.', postImage: 'post2.jpg' },
            { group: groups[0]._id, user: users[5]._id, postTitle: 'Best landing spots this season?', postText: 'What are your go-to spots for loot and early game fights?', postImage: 'post3.jpg' },
            { group: groups[0]._id, user: users[7]._id, postTitle: 'Rate my build!', postText: 'Just built this massive fort, what do you think?', postImage: 'post4.jpg' },

            { group: groups[1]._id, user: users[1]._id, postTitle: 'Campaign Idea Brainstorm', postText: 'Thinking of running a high-fantasy campaign with a focus on political intrigue, any cool ideas for plot hooks?', postImage: 'post5.jpg' },
            { group: groups[1]._id, user: users[0]._id, postTitle: 'Character Build Help', postText: 'Need help building a sneaky rogue character, focusing on stealth and deception. Any class/subclass tips?', postImage: 'post6.jpg' },
            { group: groups[1]._id, user: users[4]._id, postTitle: 'Favorite D&D moments?', postText: 'Share your most memorable moments from a D&D session!', postImage: 'post7.jpg' },
            { group: groups[1]._id, user: users[8]._id, postTitle: 'Looking for online group', postText: 'Anyone running an online D&D campaign looking for a new player?', postImage: 'post8.jpg' },

            { group: groups[2]._id, user: users[2]._id, postTitle: 'Best Civ for beginners?', postText: 'Just started playing Civ VI, which civilization is good to learn the ropes with?', postImage: 'post9.jpg' },
            { group: groups[2]._id, user: users[3]._id, postTitle: 'Science Victory Tips', postText: 'Struggling with Science Victory on higher difficulties. Any essential strategies?', postImage: 'post10.jpg' },
            { group: groups[2]._id, user: users[6]._id, postTitle: 'Share your best starts!', postText: 'Show off your amazing starting locations or early game strategies!', postImage: 'post11.jpg' },

            { group: groups[3]._id, user: users[3]._id, postTitle: 'COD Warzone Loadout', postText: 'What\'s your go-to loadout for Warzone right now?', postImage: 'post12.jpg' },
            { group: groups[3]._id, user: users[9]._id, postTitle: 'Looking for teammates (Ranked)', postText: 'Need a solid team for ranked play. Add me!', postImage: 'post13.jpg' },

            { group: groups[4]._id, user: users[4]._id, postTitle: 'Hidden Indie Gems', postText: 'What are some amazing indie games that more people should know about?', postImage: 'post14.jpg' },
            { group: groups[4]._id, user: users[0]._id, postTitle: 'Just finished Hollow Knight', postText: 'Wow, what an incredible game! Highly recommend.', postImage: 'post15.jpg' },

            { group: groups[5]._id, user: users[5]._id, postTitle: 'Mythic+ Dungeon Push', postText: 'Running Mythic+ tonight, looking for a tank and healer.', postImage: 'post16.jpg' },
            { group: groups[5]._id, user: users[1]._id, postTitle: 'Best Class for Solo Play?', postText: 'Coming back to WoW, what\'s a good class for mostly solo content?', postImage: 'post17.jpg' },

            { group: groups[6]._id, user: users[6]._id, postTitle: 'Daily Puzzle Challenge', postText: 'Share your score on today\'s daily puzzle!', postImage: 'post18.jpg' },
            { group: groups[6]._id, user: users[2]._id, postTitle: 'Relaxing Puzzle Games', postText: 'What are some good puzzle games to chill out with?', postImage: 'post19.jpg' },

            { group: groups[7]._id, user: users[7]._id, postTitle: 'Weekly Photo Challenge!', postText: 'Share your best in-game photos from this week!', postImage: 'post20.jpg' },
            { group: groups[7]._id, user: users[8]._id, postTitle: 'Drift Tune Help', postText: 'Anyone good at drift tuning? Need help with a specific car.', postImage: 'post21.jpg' },

            { group: groups[8]._id, user: users[8]._id, postTitle: 'Ultimate Team Pack Opening', postText: 'Just pulled an amazing player! Share your best pack pulls!', postImage: 'post22.jpg' },
            { group: groups[8]._id, user: users[9]._id, postTitle: 'FIFA 25 Wishlist', postText: 'What do you hope to see in the next FIFA game?', postImage: 'post23.jpg' },

            { group: groups[9]._id, user: users[9]._id, postTitle: 'Coolest VR Experiences', postText: 'What are some must-try VR games or experiences?', postImage: 'post24.jpg' },
            { group: groups[9]._id, user: users[0]._id, postTitle: 'VR Fitness Games', postText: 'Looking for fun VR games to get a workout in!', postImage: 'post25.jpg' },

             // More posts for existing groups
            { group: groups[0]._id, user: users[1]._id, postTitle: 'Fortnite Creative Maps', postText: 'Any recommendations for fun creative maps to play?', postImage: 'post26.jpg' },
            { group: groups[1]._id, user: users[3]._id, postTitle: 'Monster Manual Discussion', postText: 'What\'s your favorite monster from the Monster Manual and why?', postImage: 'post27.jpg' },
            { group: groups[2]._id, user: users[4]._id, postTitle: 'Cultural Victory Guide', postText: 'Tips and tricks for achieving a Cultural Victory in Civ VI?', postImage: 'post28.jpg' },
            { group: groups[3]._id, user: users[5]._id, postTitle: 'Best COD Moments', postText: 'Share your most epic plays or funny fails!', postImage: 'post29.jpg' },
            { group: groups[4]._id, user: users[6]._id, postTitle: 'Underrated Indie Soundtracks', postText: 'What indie games have amazing music?', postImage: 'post30.jpg' },
            { group: groups[5]._id, user: users[7]._id, postTitle: 'WoW Lore Questions', postText: 'Any burning questions about WoW lore?', postImage: 'post31.jpg' },
            { group: groups[6]._id, user: users[8]._id, postTitle: 'New Puzzle Game Release', postText: 'Just found a cool new puzzle game, check it out!', postImage: 'post32.jpg' },
            { group: groups[7]._id, user: users[9]._id, postTitle: 'Forza Photo Mode Tips', postText: 'How do you take such amazing photos in Forza?', postImage: 'post33.jpg' },
            { group: groups[8]._id, user: users[0]._id, postTitle: 'FIFA Career Mode Ideas', postText: 'Starting a new career mode, any interesting teams or challenges?', postImage: 'post34.jpg' },
            { group: groups[9]._id, user: users[1]._id, postTitle: 'Upcoming VR Games', postText: 'What VR games are you looking forward to?', postImage: 'post35.jpg' },
        ];
        const posts = await Post.create(postsData);
        console.log(`${posts.length} posts created.`);


        console.log('Seeding complete!');

    } catch (error) {
        console.error('Error during seeding:', error);
    } finally {
        // Disconnect after seeding (or if an error occurs)
        // Mongoose Connection.prototype.close() no longer accepts a callback
        mongoose.connection.close();
        console.log('MongoDB connection closed.');
    }
};

// Run the seeding function
seedDB();
