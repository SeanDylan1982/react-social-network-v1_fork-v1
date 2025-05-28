import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://sean:8itHQcZXFkcq1DL1@cluster0.kgknw8j.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const users = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: '$2a$10$XgXB8p6vE1MMM.kW0qwzOejkm4JI.cCfvU8WTF1E8uVcBBJJXV1kK', // "password123"
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Software developer | Coffee enthusiast | React & Node.js',
    isVerified: true
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: '$2a$10$XgXB8p6vE1MMM.kW0qwzOejkm4JI.cCfvU8WTF1E8uVcBBJJXV1kK',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Digital artist & UX designer | Love creating beautiful interfaces',
    isVerified: true
  },
  {
    username: 'tech_sarah',
    email: 'sarah@example.com',
    password: '$2a$10$XgXB8p6vE1MMM.kW0qwzOejkm4JI.cCfvU8WTF1E8uVcBBJJXV1kK',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Tech blogger | AI enthusiast | Python developer',
    isVerified: false
  }
];

const posts = [
  {
    text: 'Just shipped a major feature at work! 🚀\n\nProud of our team for pulling together and delivering this amazing update. #coding #teamwork',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
    visibility: 'public'
  },
  {
    text: 'Check out my latest UI design! 🎨\n\nBeen experimenting with glassmorphism and I\'m loving the results. What do you think? #design #ui',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
    visibility: 'public'
  },
  {
    text: 'Learning TypeScript has been a game changer!\n\nType safety is not just about catching bugs, it\'s about better developer experience. #typescript #webdev',
    visibility: 'public'
  },
  {
    text: 'Beautiful morning walk today! 🌅\n\nStarting the day right with some fresh air and exercise. #wellness #morning',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&h=600&fit=crop',
    visibility: 'public'
  },
  {
    text: 'Excited to announce I\'m speaking at TechConf 2025! 🎤\n\nWill be talking about the future of web development and AI integration. Can\'t wait to meet everyone! #conference #technology',
    visibility: 'public'
  }
];

const comments = [
  {
    content: 'This is amazing! 🎉 Can\'t wait to see it in action!',
  },
  {
    content: 'The UI looks super clean, love the attention to detail! 👏',
  },
  {
    content: 'TypeScript is the way to go! Have you tried the new features in TS 5.0?',
  },
  {
    content: 'Great work! The team must be proud. 🚀',
  },
  {
    content: 'Could you share more details about the tech stack you used?',
  },
  {
    content: 'Love the design! What tools did you use for the prototyping?',
  },
  {
    content: 'This view is breathtaking! Where is this?',
  },
  {
    content: 'Congratulations on the speaking gig! 🎉',
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users created:', createdUsers.length);

    // Create posts with random users
    const createdPosts = await Promise.all(
      posts.map(async post => {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const newPost = await Post.create({
          ...post,
          user: randomUser._id,
          username: randomUser.username,
          avatar: randomUser.avatar,
          isVerified: randomUser.isVerified,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) // Random date within last week
        });

        // Add post reference to user
        await User.findByIdAndUpdate(randomUser._id, {
          $push: { posts: newPost._id }
        });

        return newPost;
      })
    );
    console.log('Posts created:', createdPosts.length);

    // Create comments with random users and posts
    const createdComments = await Promise.all(
      comments.map(async comment => {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const randomPost = createdPosts[Math.floor(Math.random() * createdPosts.length)];
        
        const newComment = await Comment.create({
          ...comment,
          postID: randomPost._id,
          userID: randomUser._id,
          username: randomUser.username,
          avatar: randomUser.avatar,
          createdAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)) // Random date within last day
        });

        // Add comment reference to post
        await Post.findByIdAndUpdate(randomPost._id, {
          $push: { comments: newComment._id }
        });

        return newComment;
      })
    );
    console.log('Comments created:', createdComments.length);

    // Add some random likes to posts
    await Promise.all(
      createdPosts.map(async post => {
        const numLikes = Math.floor(Math.random() * createdUsers.length);
        const likers = [...createdUsers]
          .sort(() => Math.random() - 0.5)
          .slice(0, numLikes)
          .map(user => user._id);
        
        await Post.findByIdAndUpdate(post._id, {
          $set: { likes: likers }
        });
      })
    );
    console.log('Likes added to posts');

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();