# codbex-employees
Employees Management Application

### Model
<img width="573" alt="Screenshot 2024-12-27 at 10 11 00" src="https://github.com/user-attachments/assets/855ced7c-a54e-4621-b667-155633bc99a0" />

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
