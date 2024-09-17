# codbex-employees
Employees Management Application

### Model

<img width="856" alt="Screenshot 2024-09-17 at 20 34 47" src="https://github.com/user-attachments/assets/d0a661d9-8672-4881-b4de-d1bafe75ef3c">

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
