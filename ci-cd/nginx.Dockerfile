FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/dockerhub/library/nginx:latest
COPY ./dist-psm-client/dist/psm-client/ /usr/share/nginx/html/
COPY ./psm-client/ci-cd/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./dist-psm-editor/dist /usr/share/nginx/html/edit
RUN chmod 644 /usr/share/nginx/html/config.json
# editor
# RUN sed '/window.gedas.psmBackendUrl/c\window.gedas.psmBackendUrl = \"https:\/\/psm-dev.gedas.test.azure.xxxxxxxx.de\"\; \/\/ modified by ci' /usr/share/nginx/html/edit/index.html
# client
# tmp=$(mktemp)
# jq --arg a "https://psm-dev.gedas.test.azure.xxxxxxxx.de" '.psmBackendUrl = $a' config.json > "$tmp" && mv "$tmp" config.json
# FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/gedas/psm-client:latest
# FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/gedas/psm-client:0.13.0
# FROM dpdhl.css-qhcr-pi.azure.xxxxxxxx.de/gedas/psm-client:0.0.0. <- for testing purposes