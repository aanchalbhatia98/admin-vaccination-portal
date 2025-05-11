**Overview:**
The Vaccination Portal is a full-stack web application designed to allow administrators to manage student vaccination data, upcoming vaccination drives, and generate reports. The system includes authentication, data management (students and drives), and metrics visualization.

**Tech Stack:**

* **Frontend:** React.js (with React Router)
* **Backend:** Node.js with Express.js
* **Database:** MySQL
* **Other Libraries:** mysql2, multer (for file uploads), CSV parser

---

## **1. Features:**

### **1.1 Authentication:**

* Basic login functionality for admin users (local state for demo purposes).

### **1.2 Dashboard:**

* Displays total student count and vaccine-wise vaccination stats.
* Lists upcoming drives scheduled in the next 30 days.

### **1.3 Student Management:**

* Add/edit students (id is auto-incremented).
* Filter/search students by name and class.
* Bulk upload students via CSV file.
* Mark students as vaccinated for a particular drive.

### **1.4 Drive Management:**

* Create and manage drives
* Prevent overlaps and enforce that drives are scheduled at least 15 days in advance
* Edit drives before their scheduled date; disable editing for past drives.

### **1.5 Reports:**

* Placeholder for future reporting module.

---

## **2. Frontend Components:**

### **2.1 App.js:**

* Main entry point.
* Uses React Router for navigation.
* Conditional rendering based on login status.
* Includes Navbar with links to Dashboard, Student Management, Drives, and Reports.

### **2.2 Dashboard:**

* Fetches and displays summary stats (`/metrics/summary`) and upcoming drives (`/drives/upcoming`).

### **2.3 StudentManagement.js:**

* Controlled form for adding/editing student.
* Handles CSV file upload and parsing.
* Fetches and filters students via query params.
* Sends vaccination POST request to mark students.

### **2.4 LoginPage.js:**

* Simple login interface to simulate admin login.

## **3. Backend (Node.js + Express):**

### **3.1 Routes:**

* **/students \[GET, POST, PUT]**

  * GET: Supports query filters (e.g., name, class).
  * POST: Adds a student (ignores id in request body).
  * PUT: Updates a student (requires id).
* **/students/bulk-upload \[POST]**

  * Accepts CSV upload and inserts multiple students.
* **/students/vaccinate \[POST]**

  * Marks a student as vaccinated for a drive.
* **/metrics/summary \[GET]**

  * Returns aggregate data: total students, vaccine-wise stats.
* **/drives/upcoming \[GET]**

  * Returns drives within the next 30 days.

### **3.2 Middleware:**

* `multer` used for handling CSV file uploads.
* `body-parser` used for JSON request parsing.

---

## **4. Database Schema:**
![image](https://github.com/user-attachments/assets/5e57300d-e25f-4974-a746-9790606927e9)


