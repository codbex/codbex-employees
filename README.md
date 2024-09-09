# codbex-employees
Employees Management Application

### Model

<img width="842" alt="Screenshot 2024-09-09 at 14 29 02" src="https://github.com/user-attachments/assets/cc612704-e7ff-4e4b-a4f1-b1dc6f51821b">

### Application

#### Launchpad

![launchpad](images/employees-launchpad.png)

#### Management

![management](images/employees-management.png)

![organisation-management](images/employees-management.png)

### Infrastructure

#### Build

	docker build -t codbex-employees:1.0.0 .

#### Run

	docker run --name codbex-employees -d -p 8080:8080 codbex-employees:1.0.0

#### Clean

	docker rm codbex-employees
