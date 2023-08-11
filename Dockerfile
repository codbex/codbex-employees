# Docker descriptor for codbex-employees
# License - http://www.eclipse.org/legal/epl-v20.html

FROM ghcr.io/codbex/codbex-gaia:0.7.0

COPY codbex-employees target/dirigible/repository/root/registry/public/codbex-employees

ENV DIRIGIBLE_HOME_URL=/services/web/codbex-employees/gen/index.html
