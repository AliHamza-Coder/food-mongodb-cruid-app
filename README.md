# 🍕 Food Manager - Modern CRUD App

A beautiful, responsive food management application built with **Next.js 15**, **TypeScript**, **MongoDB**, and **Tailwind CSS**. Features a stunning glass morphism UI with gradient backgrounds and smooth animations.

![Food Manager Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![Tailwind](https://img.shields.io/badge/Tailwind-4.0-cyan)

## ✨ Features

### 🎨 **Beautiful Modern UI**
- **Glass Morphism Design** - Semi-transparent cards with backdrop blur
- **Gradient Backgrounds** - Purple to blue gradient theme
- **Smooth Animations** - Hover effects, transforms, and transitions
- **Responsive Design** - Perfect on mobile, tablet, and desktop
- **Toast Notifications** - Beautiful success/error messages

### 🚀 **Full CRUD Operations**
- ➕ **Create** - Add new food items with validation
- 📖 **Read** - View all foods in a beautiful grid layout
- ✏️ **Update** - Edit existing food items inline
- 🗑️ **Delete** - Remove food items with confirmation

### 📱 **Responsive Breakpoints**
- **Mobile** (< 640px) - Single column layout
- **Tablet** (640px+) - 2-column form and grid
- **Desktop** (1024px+) - 3-column grid
- **Large** (1280px+) - 4-column grid

### 🛡️ **Error Handling**
- **Database Connection** - Graceful fallback if MongoDB is not configured
- **Toast Messages** - Clear error messages with instructions
- **No Crashes** - App continues working even with database issues

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**
- **MongoDB Atlas** account (free tier works perfectly)

### 1. Clone Repository
```bash
git clone https://github.com/AliHamza-Coder/food-mongodb-cruid-app.git
cd food-manager
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string_here
MONGODB_DB=your_database_name
```

**Get your MongoDB URI:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account
3. Create a new cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

**Example:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=foodapp
```

**Environment Variables:**
- `MONGODB_URI` - Your MongoDB Atlas connection string (required)
- `MONGODB_DB` - Database name (optional, defaults to "foodapp")

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Usage

### Adding Foods
1. Fill out the form with:
   - 🍔 **Food Name** - Name of your food item
   - 💰 **Price** - Cost in dollars (supports decimals)
   - 🏷️ **Category** - Type of food (e.g., "Fast Food", "Dessert")
   - 📝 **Description** - Brief description

2. Click **🚀 Add Food** button

### Managing Foods
- **✏️ Edit** - Click edit button to modify any food item
- **🗑️ Delete** - Click delete button to remove items
- **📱 Responsive** - Works perfectly on all devices

### Toast Notifications
- ✅ **Success** - Green toasts for successful operations
- ❌ **Error** - Red toasts for failures with helpful messages
- ⚠️ **Warning** - Orange toasts for configuration issues

## 🏗️ Project Structure

```
food-manager/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── foods/
│   │   │       ├── route.ts          # GET, POST endpoints
│   │   │       └── [id]/
│   │   │           └── route.ts      # PUT, DELETE endpoints
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main food manager page
│   ├── components/
│   │   ├── Loader.tsx                # Loading spinner
│   │   └── Toast.tsx                 # Toast notifications
│   ├── lib/
│   │   └── mongodb.ts                # Database connection
│   └── types/
│       └── food.ts                   # TypeScript interfaces
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
└── README.md                         # This file
```

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 15.4.6 |
| **TypeScript** | Type Safety | 5.0+ |
| **MongoDB** | Database | Atlas |
| **Tailwind CSS** | Styling | 4.0 |
| **React** | UI Library | 19.1.0 |

## 🎨 Design System

### Color Palette
- **Primary**: Purple to Blue gradients (`from-purple-600 to-blue-600`)
- **Success**: Green (`from-green-500 to-emerald-600`)
- **Warning**: Orange (`from-yellow-500 to-orange-600`)
- **Error**: Red to Pink (`from-red-500 to-pink-600`)
- **Edit**: Amber to Orange (`from-amber-400 to-orange-500`)

### Typography
- **Headings**: Bold, gradient text
- **Body**: Clean, readable fonts
- **Buttons**: Semibold with emojis

### Animations
- **Hover Effects**: Transform and shadow changes
- **Loading**: Smooth spinning animation
- **Toast**: Slide-in from right
- **Cards**: Lift effect on hover

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add `MONGODB_URI` to environment variables
4. Deploy automatically

### Other Platforms
- **Netlify**: Add build command `npm run build`
- **Railway**: Auto-deploy from GitHub
- **Heroku**: Use Node.js buildpack

## 🔧 Configuration

### MongoDB Setup
1. **Create Cluster**: Free tier on MongoDB Atlas
2. **Network Access**: Add `0.0.0.0/0` for all IPs
3. **Database User**: Create user with read/write permissions
4. **Connection String**: Copy and paste to `.env.local`
5. **Database Name**: Set `MONGODB_DB` in `.env.local` (optional, defaults to "foodapp")

### Database Structure
The app will automatically create:
- **Database**: Name specified in `MONGODB_DB` (default: "foodapp")
- **Collection**: "foods" - stores all food items
- **Documents**: Each food item with fields: name, price, category, description

### Environment Variables
```env
# Required
MONGODB_URI=your_mongodb_connection_string

# Optional
MONGODB_DB=your_database_name          # Defaults to "foodapp"
NODE_ENV=production                    # For production deployment
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Failed to save food" message**
- Check your MongoDB URI in `.env.local`
- Ensure database user has write permissions
- Verify network access allows your IP

**❌ "Database not configured" toast**
- Create `.env.local` file in root directory
- Add `MONGODB_URI=your_connection_string`
- Optionally add `MONGODB_DB=your_database_name` (defaults to "foodapp")
- Restart development server

**❌ Input text not visible**
- Fixed in latest version with proper text colors
- Update to latest code if using older version

**❌ Not responsive on mobile**
- Clear browser cache
- Check viewport meta tag in layout.tsx

### Getting Help
1. Check the browser console for errors
2. Verify MongoDB connection string
3. Ensure all dependencies are installed
4. Restart development server

## 📝 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/foods` | Get all foods |
| `POST` | `/api/foods` | Create new food |
| `PUT` | `/api/foods/[id]` | Update food by ID |
| `DELETE` | `/api/foods/[id]` | Delete food by ID |

### Request/Response Examples

**POST /api/foods**
```json
{
  "name": "Pizza Margherita",
  "price": 12.99,
  "category": "Italian",
  "description": "Classic pizza with tomato, mozzarella, and basil"
}
```

**Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Pizza Margherita",
  "price": 12.99,
  "category": "Italian",
  "description": "Classic pizza with tomato, mozzarella, and basil"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Made with ❤️ using Next.js, TypeScript, and MongoDB**

*Perfect for learning modern web development with beautiful UI design!*