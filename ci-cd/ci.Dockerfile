# Stage 1: Build
FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/dockerhub/zenika/alpine-chrome:with-node as build
# use root to avoid permission problems
USER root
ARG NPM_AUTH
ARG PSM_CLIENT_VERSION='0.0.0'
RUN mkdir /source
WORKDIR /source
COPY . .
RUN npm config set registry https://lcm.xxxxxxxx.de/artifactory/api/npm/public_npmjs_org
RUN npm config set _auth ${NPM_AUTH}
RUN npm config set always-auth true
RUN npm config set email jens.windscheidt@xxxxxxxx.de
RUN npm install
RUN npm run build
RUN npm run test:ci
RUN tar -zcvf psm-client.${PSM_CLIENT_VERSION}.tar.gz ./dist/psm-client

# Stage 2: OWASP Dependency Check
FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/dockerhub/owasp/dependency-check-action:latest as dependency-check
ENV SRCDIR=/source
RUN mkdir $SRCDIR
COPY --from=build /source $SRCDIR
ARG ARTIFACTORY_TOKEN
RUN /usr/share/dependency-check/bin/dependency-check.sh \
--scan $SRCDIR \
--out /home/dependencycheck/src \
-n \
--disableNodeAudit \
--enableArtifactory \
--artifactoryUrl https://lcm.xxxxxxxx.de/artifactory \
--artifactoryApiToken $ARTIFACTORY_TOKEN \
--disableOssIndex

# Stage 3: SonarQube Analysis
FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/dockerhub/sonarsource/sonar-scanner-cli as sonar
ARG SONAR_TOKEN
ARG SOURCE_BRANCH
ARG PSM_CLIENT_VERSION
COPY --from=build /source /usr/src
COPY --from=dependency-check /home/dependencycheck/src/dependency-check-report.html /tmp/
RUN sonar-scanner -Dsonar.host.url='https://lcm.xxxxxxxx.de/sonar/' \
-Dsonar.projectName='GeDaS PSM Client' \
-Dsonar.projectKey='de.xxxxxxxx.gedas.psm-client' \
-Dsonar.projectVersion=$PSM_CLIENT_VERSION \
-Dsonar.login=$SONAR_TOKEN \
-Dsonar.branch.name=$SOURCE_BRANCH  \
-Dsonar.dependencyCheck.htmlReportPath='/tmp/dependency-check-report.html' \
-Dsonar.javascript.lcov.reportPaths='/usr/src/coverage/psm-client/lcov.info' \
-Dsonar.test.inclusions='**/*.spec.ts' \
-Dsonar.sources='/usr/src/src' \
-Dsonar.tests='/usr/src/src' \
-Dsonar.testExecutionReportPaths='/usr/src/coverage/psm-client/test-execution-report.xml'

# Stage 3: Upload compressed tar to Artifactory
FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/dockerhub/alpine/curl:3.14 as results
ARG ARTIFACTORY_TOKEN
ARG PSM_CLIENT_VERSION='0.0.0'
ARG SOURCE_BRANCH='default'
COPY --from=build /source/psm-client.${PSM_CLIENT_VERSION}.tar.gz /opt/
# Copy surefire reports from buildstage
COPY --from=sonar /usr/src/coverage/psm-client/test-execution-report.xml /opt/
# Only upload to artifactory when branch is dev/release, add SNAPSHOT suffix if branch == dev
RUN if [ "$SOURCE_BRANCH" = "refs/heads/release" ] ;\
then \
    curl -H "X-JFrog-Art-Api:${ARTIFACTORY_TOKEN}" \
    -T "/opt/psm-client.${PSM_CLIENT_VERSION}.tar.gz" "https://lcm.xxxxxxxx.de/artifactory/ITR-3687_GEDAS_release_reports/psm-frontend/psm-client.${PSM_CLIENT_VERSION}.tar.gz"; fi
RUN if [ "$SOURCE_BRANCH" = "refs/heads/dev" ] ;\
then \
    curl -H "X-JFrog-Art-Api:${ARTIFACTORY_TOKEN}" \
    -T "/opt/psm-client.${PSM_CLIENT_VERSION}.tar.gz" "https://lcm.xxxxxxxx.de/artifactory/ITR-3687_GEDAS_release_reports/psm-frontend/psm-client.${PSM_CLIENT_VERSION}-SNAPSHOT.tar.gz"; fi
