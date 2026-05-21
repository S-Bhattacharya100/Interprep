# Interprep Server

A Node.js backend server for the Interprep - Real-Time Interview Preparation Platform. This server provides authentication, user management, and role-based access control for the interview preparation application.

## Features

- User authentication with JWT tokens
- Email verification before account activation
- Resend verification email if expired or missed
- Auto-login after email verification
- Forgot password with reset token
- Secure password reset via email link
- Role-based authorization (User/Admin)
- Password hashing with bcrypt
- MongoDB database integration
- Input validation with Joi
- Error handling middleware
- HTTP request logging with Morgan
- CORS support
- Email service with Nodemailer
- Generic email service for extensibility
- Interview problem management (DSA, HR, System Design)
- Problem filtering by difficulty and category
- Pagination support for problems
- Real code execution engine with Docker sandboxing
- Multi-test case evaluation per submission
- Execution timeout protection (5 seconds per test)
- Automatic code cleanup after execution
- Comprehensive error capture (runtime errors, timeouts)
- Multi-language code execution (JavaScript, Java, Python, C++)

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcrypt
- **Email Service**: Nodemailer
- **Logging**: Morgan
- **CORS**: cors middleware
- **Code Execution**: Docker containers with isolated sandboxes
- **Code Runner Service**: Express.js on port 5000

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Docker (for sandboxed code execution)
- npm or yarn

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/interprep
   ACCESS_TOKEN_SECRET=your_access_token_secret_here
   REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=http://localhost:3000
   ```
   
   **Note:** For Gmail, use [App Passwords](https://myaccount.google.com/apppasswords) instead of your regular password (requires 2-Step Verification)

4. Start MongoDB service (if running locally)

## Usage

### Development - Main Server
```bash
npm run dev
```

### Development - Runner Service
In a separate terminal, start the code execution service:
```bash
cd runner
npm install  # First time only
npm start
```
The runner service will start on port 5000.

### Production
```bash
npm start
```

The server will start on port 3000 by default. Ensure the runner service is running separately on port 5000.

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ "name": "string", "email": "string", "password": "string", "role": "user"|"admin" }`
- **Response**: User account created, verification email sent
- **Note**: User account is not verified yet and cannot access protected routes

#### Resend Verification Email
- **POST** `/api/auth/resend-verification`
- **Body**: `{ "email": "string" }`
- **Response**: Verification email resent to the provided email address
- **Use Case**: User didn't receive the verification email or token expired
- **Note**: New verification token generated with 10-minute expiry

#### Verify Email
- **GET** `/api/auth/verify-email?token=verification_token`
- **Description**: Verifies user email and auto-logs them in with tokens
- **Response**: Returns `accessToken`, `refreshToken`, and user data
- **Note**: Token is sent via email and expires in 10 minutes

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "email": "string", "password": "string" }`
- **Requirement**: User must have verified their email first
- **Response**: Returns `accessToken`, `refreshToken`, and user data

#### Refresh Token
- **POST** `/api/auth/refresh`
- **Body**: `{ "refreshToken": "string" }`
- **Response**: Returns new `accessToken`

#### Logout
- **POST** `/api/auth/logout`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**: `{ "refreshToken": "string" }`

#### Forgot Password
- **POST** `/api/auth/forgot-password`
- **Body**: `{ "email": "string" }`
- **Response**: Reset link sent to email
- **Requirement**: User must not be currently logged in
- **Note**: Reset token expires in 10 minutes

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ "token": "string", "newPassword": "string" }`
- **Response**: Password reset successful
- **Note**: Token must be valid and not expired

### Problem Routes (`/api/problem`)

#### Create Problem
- **POST** `/api/problem`
- **Headers**: `Authorization: Bearer <access_token>`
- **Roles**: Admin only
- **Body**: 
  ```json
  {
    "title": "string",
    "description": "string",
    "category": "DSA|HR|System Design",
    "difficulty": "Easy|Medium|Hard",
    "tags": ["string"],
    "constraints": "string",
    "examples": [
      {
        "input": "string",
        "output": "string",
        "explanation": "string"
      }
    ]
  }
  ```
- **Response**: Created problem object with `createdBy` user ID and timestamps

#### Get Problems
- **GET** `/api/problem?difficulty=Easy&category=DSA&page=1&limit=10`
- **Headers**: `Authorization: Bearer <access_token>`
- **Query Parameters**:
  - `difficulty` (optional): Easy | Medium | Hard
  - `category` (optional): DSA | HR | System Design
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response**: Array of problems with count and pagination

### Submission Routes (`/api/submission`)

#### Create Submission
- **POST** `/api/submission`
- **Headers**: `Authorization: Bearer <access_token>`
- **Body**:
  ```json
  {
    "problem": "<problem_id>",
    "code": "string",
    "language": "java|javascript|python|cpp"
  }
  ```
- **Response**: Created submission object with status, output, error, executionTime, and timestamps

> Only authenticated users can submit solutions. The `user` field is automatically set from the JWT token.

## Project Structure

```
interprep/
├── server/                            # Main Node.js API server
│   ├── app.js                         # Main Express app
│   ├── server.js                      # Server startup file
│   ├── package.json                   # Dependencies and scripts
│   ├── .env                           # Environment variables
│   ├── .gitignore                    # Git ignore rules
│   └── src/
│       ├── config/
│       │   └── db.js                  # Database connection
│       ├── constants/
│       │   ├── roles.js               # User roles
│       │   └── statusCodes.js         # HTTP status codes
│       ├── controllers/
│       │   ├── auth.controller.js            # Authentication logic
│       │   ├── problem.controller.js         # Problem management logic
│       │   └── submission.controller.js      # Code submission and evaluation logic
│       ├── dto/
│       │   └── user.dto.js            # Data transfer objects
│       ├── middleware/
│       │   ├── auth.middleware.js     # JWT authentication
│       │   ├── error.middleware.js    # Error handling
│       │   ├── role.middleware.js     # Role authorization
│       │   └── validate.middleware.js # Input validation
│       ├── models/
│       │   ├── user.model.js          # User schema
│       │   ├── problem.model.js       # Problem schema
│       │   └── submission.model.js    # Submission schema
│       ├── routes/
│       │   ├── auth.routes.js          # Auth endpoints
│       │   ├── admin.routes.js         # Admin endpoints
│       │   ├── user.routes.js          # User endpoints
│       │   ├── problem.routes.js       # Problem endpoints
│       │   └── submission.routes.js    # Code submission endpoints
│       ├── services/
│       │   ├── token.service.js       # JWT token generation
│       │   ├── email.service.js       # Email service (verification & password reset)
│       │   └── runner.service.js      # Runner service HTTP client
│       └── utils/
│           ├── token.utils.js         # Utility token generation (verification & reset)
│           ├── apiError.js            # Custom error class
│           ├── asyncHandler.js        # Async error wrapper
│           └── validators/
│               └── auth.validator.js  # Joi validation schemas
└── runner/                            # Code execution service (Docker sandbox)
    ├── index.js                       # Express app for runner service
    ├── execute.js                     # Docker container executor
    ├── package.json                   # Runner service dependencies
    ├── pull-images.sh                 # Linux/Mac: Pull all Docker images
    └── pull-images.bat                # Windows: Pull all Docker images
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `ACCESS_TOKEN_SECRET` | Secret key for JWT access tokens (minimum 32 characters) | Yes |
| `REFRESH_TOKEN_SECRET` | Secret key for JWT refresh tokens (minimum 32 characters) | Yes |
| `EMAIL_USER` | Gmail address for sending verification emails | Yes |
| `EMAIL_PASS` | Gmail app password (not regular password) | Yes |
| `CLIENT_URL` | Frontend URL for verification email links | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Email Configuration

- **Service**: Gmail with OAuth
- **Verification Token**: 32-byte random hex string, expires in 10 minutes
- **Reset Password Token**: 32-byte random hex string, expires in 10 minutes
- **JWT Access Token Expiry**: 15 minutes
- **JWT Refresh Token Expiry**: 7 days
- **Generic Email Function**: Reusable for all email types

### Password Reset Flow

1. User requests password reset via `/forgot-password` endpoint
2. Reset token generated and stored with expiry time
3. Reset link sent to user's email
4. User clicks link and submits new password via `/reset-password` endpoint
5. Token validated - must exist and not be expired
6. Password updated with new bcrypt hash

### Code Submission and Evaluation Flow

1. User submits code via `/api/submission` endpoint with problem ID, code, and **language** (javascript/python/java/cpp)
2. Submission created in database with "Pending" status
3. Code passed to `runner.service.js` which calls runner service via HTTP with language parameter
4. Runner service (`/runner`) receives execution request with language specification
5. Docker executor loads language configuration (image, entry point, build commands)
6. Creates temporary code file with language-specific extension (.js, .py, .java, .cpp)
7. **For each test case in testCases array:**
   - Test input base64 encoded for safe shell passage
   - Language-appropriate Alpine Docker container launched (node:18-alpine, python:3.11-alpine, openjdk:11-jdk-alpine, or gcc:11-alpine)
   - **Compilation** (if needed): Java code compiled with `javac Main.java`, C++ compiled with `g++ -o /app/code /app/code.cpp`
   - **Execution**: Language entry point runs (node /app/code.js, python /app/code.py, java Main, or /app/code)
   - stdout and stderr captured from container execution
   - Execution timeout: 5 seconds per test case
   - Container automatically removed after execution
   - Output compared with expected output
   - If mismatch: return "Wrong Answer" with failedTestCase number and language
   - If error: return "Runtime Error" with failedTestCase number and language
   - If match: continue to next test case
8. **Only return "Accepted" if ALL test cases pass**
9. Temporary code file deleted after completion
10. Results stored in submission document with test details and language info

**Security Improvements:**
- Input base64 encoded to prevent shell injection (safe handling of: ' " \ $ characters)
- All test cases validated (not just first one)
- Language-specific Docker images provide isolation
- Each language runs in its own container namespace

**Execution Engine Details:**
- **Mechanism**: Docker container execution with volume mounting
- **Supported Languages**: JavaScript, Python, Java, C++ (extensible to more)
- **Container Images**: Lightweight Alpine-based images (node:18-alpine, python:3.11-alpine, openjdk:11-jdk-alpine, gcc:11-alpine)
- **Compilation**: Automatic for Java (javac) and C++ (g++)
- **Timeout**: 5 seconds per test case
- **Input Method**: stdin via base64 encoded input (prevents shell injection)
- **Error Handling**: stderr captured from container for runtime error reporting
- **Test Coverage**: ALL test cases validated (only "Accepted" if all pass)
- **Failed Test Tracking**: Reports which test case failed and language used
- **Security**: Code isolated in container, no access to host system
- **Input Sanitization**: Base64 encoding safely handles special characters (', ", \, $)

**Status Descriptions:**
- **Pending**: Submission received, awaiting execution
- **Accepted**: Code passed all test cases
- **Wrong Answer**: Code executed but produced incorrect output
- **Runtime Error**: Code crashed during execution (stderr captured)
- **Time Limit Exceeded**: Code execution exceeded 2-second timeout

## Code Execution Architecture

### Docker Sandbox Implementation

The `runner` service provides secure, isolated code execution using Docker containers:

```
Main Server → Axios HTTP Call → Runner Service (port 5000) → Docker Container
```

**Key Features:**
- Containerized execution for each submission
- Resource isolation and protection
- Automatic container cleanup after execution
- Multi-language support via Docker images
- File volume mounting for code execution
- stdin/stdout capture via Docker

### Architecture

1. **Main Server** (`server/src/services/runner.service.js`)
   - Receives code submission from client
   - Makes HTTP POST request to runner service
   - Timeout: 10 seconds
   - Handles connection failures gracefully

2. **Runner Service** (`runner/index.js`)
   - Express.js server on port 5000
   - Single endpoint: `POST /run`
   - Delegates execution to Docker engine
   - Returns execution results

### Docker Executor (`runner/execute.js`)
   - Supports JavaScript, Python, Java, and C++
   - Uses lightweight Alpine-based Docker images for faster pulls and smaller container sizes
   - Language-specific configuration: image, entry point, build commands
   - Java/C++: Automatic compilation step (javac, g++)
   - JavaScript/Python: Direct execution
   - Creates temporary code file with appropriate extension
   - Mounts code file to container volume
   - **Iterates through ALL test cases** (not just first one)
   - **Base64 encodes test input** for safe stdin passage (prevents shell injection)
   - Captures stdout for output verification
   - Captures stderr for error reporting
   - Timeout: 5 seconds per execution
   - Auto-cleanup of temporary files
   - Reports which test case failed (if any)
   - Includes language in response for audit trail

### Process Flow

1. **Code Submission**
   - User submits code via `/api/submission` endpoint
   - Submission created with metadata (user, problem, code, language)
   - Submission status set to "Pending"

2. **Execution Request**
   - Main server calls runner service: `POST http://localhost:5000/run`
   - Payload includes: code, testCases array, language

3. **Docker Execution Setup**
   - Temporary code file created: `temp-{timestamp}.js`
   - Docker volume mount: local file → `/app/code.js` in container
   - Command: `docker run --rm -i -v "/path/to/code.js:/app/code.js" node:18 sh -c "printf 'input' | node /app/code.js"`

4. **Test Case Execution** (iterate through ALL test cases)
   - For each test case:
     - Input base64 encoded to prevent shell injection
     - Language-specific Alpine Docker container started
     - **Build step** (if needed): Java compiles `javac Main.java`, C++ compiles `g++ -o /app/code /app/code.cpp`
     - **Execution step**: Language-specific entry point runs (`node`, `python`, `java`, or compiled binary)
     - Encoded input decoded via `echo ... | base64 -d | ...` and piped to process stdin
     - Process captures stdout output
     - stderr captured for error messages
     - Container timeout: 5 seconds
     - Container automatically removed after execution
   - If ANY test case fails: return error with failedTestCase number
   - If ALL test cases pass: return Accepted status with results and language

5. **Result Processing**
   - Output compared with expected output (trimmed whitespace)
   - Status determined: Accepted/Wrong Answer/Runtime Error
   - Temporary file deleted
   - Results persisted to database
   - Response sent back to main server

### Error Handling

- **Runtime Errors**: stderr captured and stored in submission document
- **Timeout**: Docker container killed after 5 seconds
- **Docker Unavailable**: Service returns error with detailed message
- **File System Errors**: Graceful cleanup with try-catch blocks

### Security Benefits

- **Isolation**: Code runs in isolated container, not on host system
- **Resource Limits**: Docker enforces memory and CPU constraints
- **File System**: Only mounted code file is accessible
- **Network**: Container networking can be restricted
- **Privileges**: Code runs as non-root user in container
- **Cleanup**: Containers and files automatically removed after execution

## Data Models

### User Schema
- **name**: String (required)
- **email**: String (required, unique)
- **password**: String (required, hashed with bcrypt)
- **role**: String (enum: "user", "admin", default: "user")
- **isVerified**: Boolean (default: false)
- **verificationToken**: String (32-byte hex token)
- **verificationTokenExpiry**: Date
- **resetPasswordToken**: String (32-byte hex token)
- **resetPasswordExpiry**: Date
- **refreshToken**: String (JWT token)

### Problem Schema
- **title**: String (required, trimmed)
- **description**: String (required)
- **category**: String (enum: "DSA", "HR", "System Design", required)
- **difficulty**: String (enum: "Easy", "Medium", "Hard", required)
- **tags**: Array of Strings
- **constraints**: String
- **examples**: Array of objects for problem examples
  - **input**: String
  - **output**: String
  - **explanation**: String
- **testCases**: Array of objects for automated evaluation
  - **input**: String
  - **output**: String
- **createdBy**: ObjectId (reference to User, required)
- **timestamps**: Auto-generated createdAt and updatedAt

### Submission Schema
- **user**: ObjectId (reference to User, required)
- **problem**: ObjectId (reference to Problem, required)
- **code**: String (required) - Source code submitted by user
- **language**: String (enum: "java", "javascript", "python", "cpp", required)
- **status**: String (enum: "Pending", "Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded", default: "Pending")
- **output**: String - Actual program output from execution (for wrong answers)
- **error**: String - Error message if execution failed (runtime errors)
- **executionTime**: Number - Execution time in milliseconds
- **timestamps**: Auto-generated createdAt and updatedAt

**Execution Details:**
- Outputs and errors are captured from actual process execution
- Up to 2 seconds allowed per test case
- Temporary files created during execution are cleaned up automatically
- Results immutable once stored (for audit trail)

**Status Descriptions:**
- **Pending**: Submission received, awaiting execution
- **Accepted**: Code passed all test cases
- **Wrong Answer**: Code executed but produced incorrect output
- **Runtime Error**: Code crashed during execution
- **Time Limit Exceeded**: Code took too long to execute

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
- **joi**: Schema validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
- **nodemailer**: Email service for verification and password reset emails
- **morgan**: HTTP request logging middleware
- **axios**: HTTP client for runner service communication
- **crypto**: Secure token generation (built-in Node.js)
- **fs**: File system operations for temporary code storage (built-in Node.js)
- **child_process**: Shell command execution for Docker (built-in Node.js)

### External Services

- **Docker**: Container runtime for isolated code execution (required)

## Development Dependencies

- **node**: Development server manual-restart

## Error Handling

The server includes comprehensive error handling:
- Custom `ApiError` class for consistent error responses
- Global error handler middleware
- Async error wrapper for route handlers
- Input validation with detailed error messages

## Logging

The server uses **Winston** for comprehensive logging:

### Log Files
- **`logs/error.log`** - Captures all errors with full context
- **`logs/combined.log`** - Captures all log levels (info, error, etc.)

### Log Format
Each log entry includes:
- Timestamp (ISO 8601)
- Log level
- Error message
- HTTP method and URL
- User ID (if authenticated)
- Stack trace (in development) or excluded (in production)
- Status code

### Log Output
- **Console** - Real-time output in development
- **File** - Persistent storage for debugging and monitoring

### Example Log Entry
```json
{
  "level": "error",
  "message": "\"password\" length must be at least 6 characters long",
  "statusCode": 400,
  "timestamp": "2026-04-17T16:29:02.257Z",
  "method": "POST",
  "url": "/api/auth/register",
  "user": null,
  "stack": "Error: ..."
}
```

### Accessing Logs
1. View real-time logs in console during development:
   ```bash
   npm run dev
   ```

2. View log files:
   ```bash
   # View error logs
   cat logs/error.log
   
   # View all logs
   cat logs/combined.log
   ```

3. Use `tail` for live log monitoring:
   ```bash
   tail -f logs/combined.log
   ```

## Code Submission Examples

### Supported Languages

The platform executes code in Docker containers with optimized configurations for each language:

| Language | Docker Image | File Extension | Entry Point | Build Step |
|----------|--------------|----------------|-------------|-----------|
| **JavaScript** | `node:18-alpine` | `.js` | `node /app/code.js` | None |
| **Python** | `python:3.11-alpine` | `.py` | `python /app/code.py` | None |
| **Java** | `openjdk:11-jdk-alpine` | `.java` | `java Main` | `javac Main.java` |
| **C++** | `gcc:11-alpine` | `.cpp` | `/app/code` | `g++ -o /app/code /app/code.cpp` |

No runtime installation needed on the host machine - Docker handles all dependencies. Alpine-based images are lightweight and fast to pull.

### Docker Image Setup

Pull the required Docker images before first use (one-time setup):

**Windows:**
```bash
cd runner
pull-images.bat
```

**Linux/Mac:**
```bash
cd runner
chmod +x pull-images.sh
./pull-images.sh
```

**Manual pull:**
```bash
docker pull node:18-alpine
docker pull python:3.11-alpine
docker pull openjdk:11-jdk-alpine
docker pull gcc:11-alpine
```

Images will be cached locally after first pull - subsequent submissions use cached images for fast execution.

### Sample Submission JSON - JavaScript

```json
{
  "problem": "69f8b3a29d1538167eedcd6c",
  "code": "const readline = require('readline');\n\nconst rl = readline.createInterface({\n  input: process.stdin,\n  output: process.stdout\n});\n\nrl.on('line', (input) => {\n  const [a, b] = input.split(' ').map(Number);\n  console.log(a + b);\n  rl.close();\n});",
  "language": "javascript"
}
```

**Expected Output:**
```json
{
  "success": true,
  "data": {
    "user": "69f8b29d9d1538167eedcd61",
    "problem": "69f8b3a29d1538167eedcd6c",
    "code": "...",
    "language": "javascript",
    "status": "Accepted",
    "_id": "69fc2dd84202dc00d084c7ba",
    "createdAt": "2026-05-07T06:14:48.933Z",
    "updatedAt": "2026-05-07T06:14:49.093Z"
  }
}
```

### Sample Submission JSON - Python

```json
{
  "problem": "69f8b3a29d1538167eedcd6c",
  "code": "a, b = map(int, input().split())\nprint(a + b)",
  "language": "python"
}
```

### Sample Submission JSON - Java

```json
{
  "problem": "69f8b3a29d1538167eedcd6c",
  "code": "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt();\n    int b = sc.nextInt();\n    System.out.println(a + b);\n  }\n}",
  "language": "java"
}
```

### Sample Submission JSON - C++

```json
{
  "problem": "69f8b3a29d1538167eedcd6c",
  "code": "#include <iostream>\nusing namespace std;\n\nint main() {\n  int a, b;\n  cin >> a >> b;\n  cout << a + b << endl;\n  return 0;\n}",
  "language": "cpp"
}
```

## Security and Sandbox Implementation

✅ **DOCKER SANDBOXING IMPLEMENTED**

The code execution engine now uses **Docker containerization** for secure, isolated execution of untrusted code:

### Security Features Implemented

1. **Container Isolation**
   - Each code submission runs in a separate Docker container
   - User code cannot access the host file system
   - File system access limited to mounted code file only

2. **Resource Constraints**
   - Execution timeout: 5 seconds per test case
   - Docker can be configured with memory and CPU limits
   - Process killed if timeout exceeded

3. **Network Isolation**
   - Docker containers run with restricted networking
   - Code cannot make outbound network requests
   - No access to host machine services

4. **Privilege Isolation**
   - Code runs as non-root user in container
   - Cannot access system-level resources
   - Container dropped capabilities prevent privilege escalation

5. **Automatic Cleanup**
   - Containers removed immediately after execution (`--rm` flag)
   - Temporary files deleted after test completion
   - No residual artifacts on host system

6. **Environment Variables**
   - Only mounted code file available in container
   - Host environment variables not accessible
   - No access to application secrets

### Recommended Production Enhancements

While the current Docker implementation is production-ready, consider these enhancements:

1. **Resource Limits**
   ```bash
   docker run --memory 256m --cpus 1 ...  # Limit memory and CPU
   ```

2. **Network Policy**
   ```bash
   docker run --network none ...  # Disable networking entirely
   ```

3. **Read-Only Root**
   ```bash
   docker run --read-only --tmpfs /tmp ...  # Immutable filesystem
   ```

4. **User Mapping**
   - Configure user namespace remapping for additional isolation
   - Run containers as specific non-root users

5. **Security Scanning**
   - Scan Docker images for vulnerabilities
   - Use signed images with verification
   - Regularly update base images

6. **Audit Logging**
   - Log all code executions with timestamps
   - Track user submissions and results
   - Monitor for suspicious patterns

7. **Rate Limiting**
   - Limit submissions per user per minute
   - Prevent resource exhaustion attacks
   - Monitor runner service health

## Security Features

- Password hashing with bcrypt (10-salt rounds)
- JWT-based authentication with token expiry
- Email verification to confirm user ownership
- Secure password reset with time-limited tokens
- Role-based access control (RBAC)
- Input validation and sanitization with Joi
- CORS configuration
- Secure token storage in database
- Refresh token rotation
- Unverified users cannot access protected routes
- Users must logout to request password reset
- Cryptographically secure token generation (32-byte random hex)
- App password usage for Gmail (not plain password)
- Token expiry checks on all time-sensitive operations
- Only authenticated users can submit code
- Submissions linked to user account for audit trail
- Test case validation for code evaluation
- Problem ownership verification by admin only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

ISC License - see package.json for details

## Author

Swapnamoy Bhattacharya