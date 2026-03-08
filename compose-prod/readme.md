# production deploy

These are the deployment files for a production environemnt managed via the 
 [compose-prod](https://github.com/robalb/compose-prod) system.

To deploy on a pre-configured system:

```
Make deploy
```

To set up a system:

- Configure a Server, by following the guide in the [compose-prod](https://github.com/robalb/compose-prod) project.
- Configure the `my_project/docker-compose.yml` file, and add all the additional files you might need.
- run the deploy command: `Make deploy`

The whole `my_project` folder will be copied into the remote server, and the compose service will 
automatically start or update.
