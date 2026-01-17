# Contributing to ViewLater

Thank you for considering contributing to ViewLater! This document will help you get started.

## 🎯 Project Philosophy

ViewLater is built with a clear focus:
- **User-friendliness** over feature bloat
- **Clean, minimal UI** over complex designs
- **Practical utility** for real-world use
- **Privacy-first** approach

Keep these principles in mind when contributing!

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button on the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/jonahmichael/viewLater.git
cd ViewLater
```

### 3. Set Up Development Environment

#### Frontend Setup
```bash
cd client
npm install
npm start
```
The app will run at `http://localhost:3000`

#### Backend Setup (Optional)
```bash
# Install dependencies
npm install

# Set up PostgreSQL (see POSTGRESQL_SETUP.md)
# Create .env file with database credentials

# Initialize database
node config/initDatabase.js

# Start server
npm start
```
The server will run at `http://localhost:5000`

### 4. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

Branch naming convention:
- `feature/` - for new features
- `fix/` - for bug fixes
- `docs/` - for documentation updates
- `refactor/` - for code refactoring
- `test/` - for adding tests

## 📁 Project Structure

```
ViewLater/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Auth/        # Authentication components (legacy)
│   │   │   ├── Dashboard/   # Main dashboard
│   │   │   ├── Links/       # Link management components
│   │   │   ├── Sidebar/     # Navigation sidebar
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── context/         # React Context providers
│   │   │   ├── DataContext.js     # localStorage version
│   │   │   └── DataContext.api.js # PostgreSQL version
│   │   ├── api/             # API utilities
│   │   └── lib/             # Utility functions
│   └── package.json
├── config/                   # Backend configuration
│   ├── database.js          # Database connection
│   └── initDatabase.js      # Database initialization
├── controllers/             # Backend controllers
│   ├── linkController.sequelize.js
│   └── sectionController.sequelize.js
├── models/                  # Database models
│   ├── Link.sequelize.js
│   ├── Section.sequelize.js
│   ├── Tag.sequelize.js
│   └── LinkTag.js
├── routes/                  # API routes
│   ├── linkRoutes.js
│   └── sectionRoutes.js
└── server.js               # Express server
```

## 💻 Development Guidelines

### Code Style

#### JavaScript/React
- Use ES6+ features
- Use functional components with hooks
- Follow existing formatting (2 spaces indentation)
- Use meaningful variable names
- Add comments for complex logic

#### Component Structure
```javascript
import React from 'react';
import { useContext } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  // Hooks first
  const [state, setState] = useState(null);
  const context = useContext(MyContext);

  // Helper functions
  const handleAction = () => {
    // ...
  };

  // Render
  return (
    <div className="container">
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

#### CSS/Tailwind
- Use Tailwind CSS utility classes
- Follow the black & white theme
- Maintain responsive design
- Use shadcn/ui components when possible

### Git Commit Messages

Follow conventional commits:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(links): add bulk delete functionality
fix(search): resolve case-sensitive search issue
docs(readme): update installation instructions
refactor(sidebar): simplify section rendering logic
```

## 🧪 Testing Your Changes

### Manual Testing Checklist

Before submitting a PR, test:

#### Frontend
- [ ] App runs without errors
- [ ] All existing features still work
- [ ] New feature works as expected
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Search functionality works
- [ ] Section navigation works
- [ ] Link CRUD operations work

#### Backend (if applicable)
- [ ] Server starts without errors
- [ ] API endpoints respond correctly
- [ ] Database operations work
- [ ] Error handling works properly

### Browser Testing
Test on at least 2 browsers:
- Chrome
- Firefox
- Safari
- Edge

## 📝 Submitting a Pull Request

### 1. Update Your Fork

```bash
git fetch upstream
git checkout main
git merge upstream/main
```

### 2. Rebase Your Branch

```bash
git checkout feature/your-feature
git rebase main
```

### 3. Push Your Changes

```bash
git push origin feature/your-feature
```

### 4. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing Done
- [ ] Manual testing completed
- [ ] Tested on multiple browsers
- [ ] Responsive design verified

## Screenshots (if applicable)
[Add screenshots of UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Commented complex code
- [ ] Documentation updated
- [ ] No new warnings generated
```

## 🎨 UI/UX Guidelines

### Design Principles
- **Minimalism**: Keep it simple and clean
- **Consistency**: Follow existing patterns
- **Accessibility**: Ensure keyboard navigation works
- **Performance**: Avoid heavy animations
- **Theme**: Stick to black & white color scheme

### Component Guidelines
- Use shadcn/ui components for consistency
- Follow existing component patterns
- Ensure mobile responsiveness
- Add hover states for interactivity
- Use Lucide icons for visual elements

## 🐛 Reporting Bugs

### Before Reporting
1. Check if the issue already exists
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template
```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen

**Screenshots**
If applicable, add screenshots

**Environment:**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.0.0]

**Additional context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template
```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution you'd like**
Clear description of what you want to happen

**Describe alternatives you've considered**
Other solutions you've thought about

**Additional context**
Any other relevant information, mockups, etc.
```

## 🤝 Code Review Process

1. **Automated Checks**: PRs will be checked for basic issues
2. **Manual Review**: Maintainers will review the code
3. **Feedback**: You may receive feedback or change requests
4. **Approval**: Once approved, your PR will be merged
5. **Recognition**: Contributors will be acknowledged

## 📚 Resources

### Documentation
- [PostgreSQL Setup](POSTGRESQL_SETUP.md)
- [Backend Deployment](BACKEND_DEPLOYMENT.md)
- [Switching Guide](SWITCHING_GUIDE.md)
- [Database Migration](DATABASE_MIGRATION.md)

### Technologies
- [React Documentation](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Sequelize ORM](https://sequelize.org)
- [PostgreSQL](https://www.postgresql.org/docs/)

## 🏆 Recognition

All contributors will be recognized in the project. Thank you for making ViewLater better!

## ❓ Questions?

If you have questions:
- Open an issue with the `question` label
- Reach out via the contact info in README.md

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to ViewLater! 🎉
