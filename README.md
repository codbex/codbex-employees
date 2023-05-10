# codbex-employees
Employees Management Application

### Model

![model](images/employees-model.png)

### Application

#### Launchpad

![launchpad](images/employees-launchpad.png)

#### Management

![management](images/employees-management.png)

### Infrastructure

#### Build

	docker build -t codbex-employees:1.0.0 .

#### Run

	docker run --name codbex-employees -d -p 8080:8080 codbex-employees:1.0.0

#### Clean

	docker rm codbex-employees
