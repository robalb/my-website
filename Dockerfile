# Production web Dockerfile. This is a multi-step docker image

########## FIRST STEP: FRONTEND BUILD #######
FROM node:16 as frontendbuild

WORKDIR /frontend

#first, we copy the package.json and install the dependencies
COPY astro-website/package*.json ./
RUN npm ci

#then we copy the codebase and build it. If there are no changes to the
#package json, the installation proces will be cached in a layer
COPY astro-website/ .
RUN npm run build

########## FINAL STEP: PRODUCTION IMAGE #######
FROM nginx

#copy the frondend files generated in the previous step
COPY --from=frontendbuild /frontend/dist /usr/share/nginx/html

#remove base nginx configuration files
RUN rm /etc/nginx/conf.d/default.conf
#copy our nginx configuration files
COPY nginx.conf /etc/nginx/conf.d/nginx.conf
