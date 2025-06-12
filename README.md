# User Task Manager (Full-Stack Application)

A modern full-stack web application for managing users and their associated tasks. Users can be created, viewed, edited, and deleted. Each user can have multiple tasks, which can also be created, viewed, edited, deleted, and marked as completed.

## Features

- **User Management:**
  - Create new users.
  - View a list of all existing users.
  - Select a user to view their tasks.
  - Edit existing user names.
  - Delete users (which cascades and deletes all their associated tasks).
- **Task Management:**
  - Create new tasks for a selected user.
  - View all tasks belonging to a selected user.
  - Edit task titles.
  - Mark tasks as completed/incomplete with a visual strikethrough.
  - Delete individual tasks.
- **Intuitive UI:** Clean, modern, and responsive user interface designed with Bootstrap 5 and custom CSS.
- **RESTful API:** A well-structured backend API providing all necessary CRUD operations.

## 🚀 Technologies Used

This application is built with a powerful combination of modern web technologies:

**Backend:**

- **Node.js:** JavaScript runtime.
- **Express.js:** Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript:** Superset of JavaScript that adds static types.
- **TypeORM:** ORM (Object Relational Mapper) for TypeScript and JavaScript.
- **SQLite:** Lightweight, file-based relational database.
- **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

**Frontend:**

- **React.js:** JavaScript library for building user interfaces.
- **TypeScript:** For type-safe React components.
- **Axios:** Promise-based HTTP client for making API requests.
- **Bootstrap 5:** Popular CSS framework for responsive and modern design.
- **Custom CSS:** Tailored styling for a unique look and feel.
- **Google Fonts:** For improved typography (`Poppins` and `Inter`).

## Setup and Installation

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- **Node.js:** Ensure you have Node.js (LTS version recommended) installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm (Node Package Manager):** Comes bundled with Node.js.

### 1. Clone the Repository

```bash
git clone <repository-url>
cd user-task-manager-app
```
