# Docker descriptor for codbex-employees
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:latest

COPY codbex-employees-app target/dirigible/repository/root/registry/public/codbex-employees-app

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-employees-app/gen/index.html
